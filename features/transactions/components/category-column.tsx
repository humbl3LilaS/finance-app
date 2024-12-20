import { useOpenCategory } from "@/features/categories/hook/use-open-category";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOpenTransaction } from "../hook/use-open-transaction";

type CategoryColumnProps = {
	id: string;
	categoryId: string | null;
	category: string | null;
};

const CategoryColumn = ({ id, categoryId, category }: CategoryColumnProps) => {
	const { onOpen: onOpenCategory } = useOpenCategory();
	const { onOpen: onOpenTransaction } = useOpenTransaction();

	const onClick = () => {
		if (categoryId) {
			onOpenCategory(categoryId);
		} else {
			onOpenTransaction(id);
		}
	};

	return (
		<div
			onClick={onClick}
			className={cn("flex items-center !cursor-pointer hover:underline", !category && "text-rose-500")}>
			<span>{!category && <TriangleAlert className={"mr-2 size-4 shrink-0"} />}</span>
			<span>{category || "Uncategorized"}</span>
		</div>
	);
};

export default CategoryColumn;
