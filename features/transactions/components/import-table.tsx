import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SelectedColumnState } from "./import-card";
import TableHeadSelect from "./table-head-select";

type ImportTableProps = {
	headers: string[];
	body: string[][];
	selectedColumns: SelectedColumnState;
	onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

const ImportTable = ({ headers, body, selectedColumns, onTableHeadSelectChange }: ImportTableProps) => {
	return (
		<div className="rounded-md border overflow-y-scroll">
			<Table>
				<TableHeader className="bg-muted">
					<TableRow>
						{headers.map((_item, idx) => (
							<TableHead key={idx}>
								<TableHeadSelect
									columnIndex={idx}
									selectedColumns={selectedColumns}
									onChange={onTableHeadSelectChange}
								/>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{body
						.filter((row) => row.length > 1)
						.map((row: string[], idx) => (
							<TableRow key={idx}>
								{row.map((cell, idx) => (
									<TableCell key={idx}>{cell}</TableCell>
								))}
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
};

export default ImportTable;
