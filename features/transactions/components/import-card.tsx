import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import ImportTable from "./import-table";
import { convertAmountToMiliunits } from "@/lib/utils";
import { format, parse } from "date-fns";

type ImportCartProps = {
	data: string[][];
	onCancel: () => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onSubmit: (data: any) => void;
};

const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
const OUTPUT_DATE_FORMAT = "yyyy-MM-dd";
const REQUIRED_OPTIONS = ["amount", "date", "payee"];

export interface SelectedColumnState {
	[key: string]: string | null;
}

const getColumnIndex = <T extends `column_${number}`>(column: T) => {
	return column.split("_")[1];
};

function ImportCart({ data, onCancel, onSubmit }: ImportCartProps) {
	const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>({});

	const [headers, ...body] = data;

	const handleContinue = () => {
		const mappedData = {
			headers: headers.map((_header, idx) => {
				const columnIdx = getColumnIndex(`column_${idx}`);
				return selectedColumns[`column_${columnIdx}`] || null;
			}),
			body: body
				.filter((row) => row.length > 1)
				.map((row) => {
					const transformRow = row.map((cell, idx) => {
						const columnIdx = getColumnIndex(`column_${idx}`);
						return selectedColumns[`column_${columnIdx}`] ? cell : null;
					});

					return transformRow.every((item) => item === null) ? [] : transformRow;
				})
				.filter((row) => row.length > 0),
		};
		const arrayOfData: Array<Record<string, string>> = mappedData.body.map((row) => {
			return row.reduce((acc, cell, index) => {
				const header = mappedData.headers[index];
				if (header != null) {
					return { ...acc, [`${header}`]: cell };
				}
				return acc;
			}, {});
		});

		const formattedData = arrayOfData.map((item) => ({
			...item,
			amount: convertAmountToMiliunits(parseFloat(item.amount)),
			date: format(parse(item.date, DATE_FORMAT, new Date()), OUTPUT_DATE_FORMAT),
		}));

		onSubmit(formattedData);
	};

	const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
		setSelectedColumns((prev) => {
			const selectedColumns = { ...prev };

			for (const key in selectedColumns) {
				if (selectedColumns[key] === value) {
					selectedColumns[key] = null;
				}
			}

			if (value === "skip") {
				value = null;
			}

			const newSelectedColumns = { ...selectedColumns, [`column_${columnIndex}`]: value };

			return newSelectedColumns;
		});
	};

	const progress = Object.values(selectedColumns).filter(Boolean).length;

	return (
		<div className="px-4 md:px-8 lg:px-10">
			<Card className={"w-full max-w-6xl mx-auto border-none drop-shadow-sm"}>
				<CardHeader className={"-mt-28 gap-y-2 lg:flex-row lg:items-center lg:justify-between"}>
					<CardTitle className={"text-xl line-clamp-1"}>Import Transactions</CardTitle>
					<div className={"flex items-center gap-x-4"}>
						<Button onClick={onCancel}>
							<span>Cancel</span>
						</Button>
						<Button
							disabled={progress < REQUIRED_OPTIONS.length}
							onClick={handleContinue}>
							Continue ({progress}/ {REQUIRED_OPTIONS.length})
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ImportTable
						headers={headers}
						body={body}
						selectedColumns={selectedColumns}
						onTableHeadSelectChange={onTableHeadSelectChange}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

export default ImportCart;
