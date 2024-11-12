"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/(dashboard)/transactions/column";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/features/transactions/hook/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import {useBulkCreateTransactions} from "@/features/transactions/api/use-bulk-create-transactions";
import { useState } from "react";
import UploadButton from "@/features/transactions/components/upload-button";
import ImportCart from "@/features/transactions/components/import-card";
import { transactions } from "@/database/schema";
import { useSelectAccount } from "@/features/transactions/hook/use-select-account";
import { toast } from "sonner";

const enum VARIANTS {
	LIST = "list",
	IMPORT = "import",
}

const INITIAL_IMPORT_RESULTS = {
	data: [],
	errors: [],
	meta: {},
};

export type IInitialCvsState = typeof INITIAL_IMPORT_RESULTS;

const TransactionsPage = () => {
	const [AccountDialog, confirm] = useSelectAccount();

	const openSheet = useNewTransaction((state) => state.onOpen);
	const { mutate: bulkCreateTransaction } = useBulkCreateTransactions();
	const { data, isLoading } = useGetTransactions();
	const { mutate, isPending } = useBulkDeleteTransactions();

	const [importResults, setImportResults] = useState<IInitialCvsState>(INITIAL_IMPORT_RESULTS);
	const [variant, setVariant] = useState(VARIANTS.LIST);

	const onUpload = (result: IInitialCvsState) => {
		console.log("upload result", result);
		setImportResults(result);
		setVariant(VARIANTS.IMPORT);
	};

	const onCancelImport = () => {
		setImportResults(INITIAL_IMPORT_RESULTS);
		setVariant(VARIANTS.LIST);
	};

	const onSubmitInput = async (values: (typeof transactions.$inferInsert)[]) => {
		const accountId = await confirm();

		if (!accountId) {
			toast.error("Please select an account to continue");
		}

		const data = values.map((value) => ({
			...value,
			accountId: accountId as string,
		}));

		bulkCreateTransaction(data, {
			onSuccess: () => {
				toast.success(`Added ${data.length} transactions`);
				onCancelImport();
			},
		});
	};

	if (isLoading) {
		return (
			<Card className={"w-full max-w-6xl mx-auto border-none drop-shadow-sm"}>
				<CardHeader className={"-mt-28 gap-y-2 lg:flex-row lg:items-center lg:justify-between"}>
					<Skeleton className={"h-8 w-48"} />
				</CardHeader>
				<CardContent>
					<div className={"h-[350px] w-full flex items-center justify-center"}>
						<Loader2
							size={40}
							className={"animate-spin text-slate-300"}
						/>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (variant === VARIANTS.IMPORT) {
		return (
			<>
				<AccountDialog />
				<ImportCart
					data={importResults.data}
					onCancel={onCancelImport}
					onSubmit={onSubmitInput}
				/>
			</>
		);
	}

	return (
		<div className="px-4 md:px-8 lg:px-10">
			<Card className={"w-full max-w-6xl mx-auto border-none drop-shadow-sm"}>
				<CardHeader className={"-mt-20 gap-y-2 lg:flex-row lg:items-center lg:justify-between lg:-mt-28"}>
					<CardTitle className={"text-xl line-clamp-1"}>Transaction History</CardTitle>
					<div className={"flex items-center gap-x-4"}>
						<Button onClick={openSheet}>
							<Plus
								size={4}
								className={"mr-2"}
							/>
							<span>Add new</span>
						</Button>
						<UploadButton onUpload={onUpload} />
					</div>
				</CardHeader>
				<CardContent>
					{data && (
						<DataTable
							columns={columns}
							onDelete={(rows) => {
								const ids = rows.map((r) => r.original.id);
								mutate({ ids });
							}}
							filterKey={"payee"}
							data={data}
							disabled={isPending}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default TransactionsPage;
