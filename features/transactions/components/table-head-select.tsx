import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectedColumnState } from "./import-card";
import { cn } from "@/lib/utils";

const OPTIONS = ["amount", "date", "payee", "notes"];

type TableHeadSelectProps = {
	columnIndex: number;
	selectedColumns: SelectedColumnState;
	onChange: (columnIndex: number, value: string | null) => void;
};

const TableHeadSelect = ({ columnIndex, selectedColumns, onChange }: TableHeadSelectProps) => {
	const currentSelection = selectedColumns[`column_${columnIndex}`];

	return (
		<Select
			value={currentSelection || ""}
			onValueChange={(value) => onChange(columnIndex, value)}>
			<SelectTrigger
				className={cn(
					"focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
					currentSelection && "text-blue-500",
				)}>
				<SelectValue placeholder="Skip" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="skip">Skip</SelectItem>
				{OPTIONS.map((option, index) => {
					const disabled =
						Object.values(selectedColumns).includes(option) && selectedColumns[`column_${columnIndex}`] !== option;

					return (
						<SelectItem
							key={index}
							value={option}
							disabled={disabled}
							className="capitalize">
							{option}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};

export default TableHeadSelect;
