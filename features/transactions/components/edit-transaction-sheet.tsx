"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/database/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useOpenTransaction } from "@/features/transactions/hook/use-open-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useGetTransactionById } from "@/features/transactions/api/use-get-transaction-by-id";
import TransactionForm from "@/features/transactions/components/transaction-form";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreatCategory } from "@/features/categories/api/use-create-category";
import { useCreatAccount } from "@/features/accounts/api/use-create-account";
import { convertAmountFromMiliunits } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertTransactionSchema.omit({
	id: true,
});

type FormValues = z.input<typeof formSchema>;

const EditTransactionSheet = () => {
	const isOpen = useOpenTransaction((state) => state.isOpen);
	const onClose = useOpenTransaction((state) => state.onClose);
	const id = useOpenTransaction((state) => state.id);

	const [ConfirmDialog, confirm] = useConfirm("Are you sure", "You are about to delete this transaction");

	const { data: categories, isLoading: fetchingCategories } = useGetCategories();
	const { data: accounts, isLoading: fetchingAccounts } = useGetAccounts();

	const { mutate: editTransaction, isPending: isEditing } = useEditTransaction(id);
	const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransaction(id);
	const { data: transaction, isLoading: fetchingTransaction } = useGetTransactionById(id);

	const { mutate: createCategory, isPending: creatingCategory } = useCreatCategory();
	const { mutate: createAccount, isPending: creatingAccount } = useCreatAccount();

	const onCreateCategory = (name: string) => {
		createCategory({ name });
	};

	const onCreateAccount = (name: string) => {
		createAccount({ name });
	};

	const accountOptions = (accounts ?? []).map((account) => ({
		label: account.name,
		value: account.id,
	}));

	const categoryOptions = (categories ?? []).map((category) => ({
		label: category.name,
		value: category.id,
	}));

	const onSubmit = (values: FormValues) => {
		editTransaction(values, {
			onSuccess: () => {
				onClose();
			},
		});
	};

	const onDelete = async () => {
		const ok = await confirm();
		if (ok) {
			deleteTransaction(undefined, {
				onSuccess: () => {
					onClose();
				},
			});
		}
	};

	const defaultValues = transaction
		? {
				accountId: transaction.accountId,
				categoryId: transaction.categoryId,
				amount: convertAmountFromMiliunits(transaction.amount).toString(),
				date: new Date(transaction.date),
				payee: transaction.payee,
				notes: transaction.notes,
		  }
		: undefined;

	const isPending = creatingAccount || creatingCategory || isEditing || isDeleting;
	const isLoading = fetchingAccounts || fetchingCategories || fetchingTransaction;

	return (
		<>
			<ConfirmDialog />
			<Sheet
				open={isOpen}
				onOpenChange={onClose}>
				<SheetContent className={"w-full max-w-[400px] space-y-4 "}>
					<SheetHeader>
						<SheetTitle>Edit Transaction</SheetTitle>
						<SheetDescription>Edit an existing transaction</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<Loader2 className={"size-8 mt-8 block mx-auto text-slate-300 animate-spin"} />
					) : (
						<TransactionForm
							id={id}
							onSubmit={onSubmit}
							disabled={isPending}
							defaultValues={defaultValues}
							onDelete={onDelete}
							accountOptions={accountOptions}
							categoryOptions={categoryOptions}
							onCreateAccount={onCreateAccount}
							onCreateCategory={onCreateCategory}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	);
};

export default EditTransactionSheet;
