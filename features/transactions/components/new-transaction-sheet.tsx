"use client";


import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {z} from "zod";
import {useNewTransaction} from "@/features/transactions/hook/use-new-transaction";
import {useCreatTransaction} from "@/features/transactions/api/use-create-transaction";
import {insertTransactionSchema} from "@/database/schema";
import {useCreatCategory} from "@/features/categories/api/use-create-category";
import {useGetCategories} from "@/features/categories/api/use-get-categories";
import {useGetAccounts} from "@/features/accounts/api/use-get-accounts";
import {useCreatAccount} from "@/features/accounts/api/use-create-account";
import TransactionForm from "@/features/transactions/components/transaction-form";
import {Loader2} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertTransactionSchema.omit(
    {
        id: true,
    }
);

type FormValues = z.input<typeof formSchema>

const NewTransactionSheet = () => {
    const isOpen = useNewTransaction(state => state.isOpen);
    const onClose = useNewTransaction(state => state.onClose);

    const {data: categories, isLoading: fetchingCategories} = useGetCategories();
    const {data: accounts, isLoading: fetchingAccounts} = useGetAccounts();

    const {mutate: createTransaction, isPending: creatingTransaction} = useCreatTransaction();

    const {mutate: createCategory, isPending: creatingCategory} = useCreatCategory();
    const {mutate: createAccount, isPending: creatingAccount} = useCreatAccount();

    const onCreateCategory = (name: string) => {
        createCategory({name})
    }

    const onCreateAccount = (name: string) => {
        createAccount({name})
    }

    const accountOptions = (
        accounts ?? []
    ).map(account => (
        {
            label: account.name,
            value: account.id
        }
    ))


    const categoryOptions = (
        categories ?? []
    ).map(category => (
        {
            label: category.name,
            value: category.id
        }
    ))

    const onSubmit = (values: FormValues) => {
        createTransaction(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const isPending = creatingTransaction || creatingAccount || creatingCategory;
    const isLoading = fetchingAccounts || fetchingCategories;
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className={"w-full max-w-[400px] space-y-4 "}>
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Add a new Transaction
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading
                    ? <Loader2 size={8} className={"block mx-auto text-slate-300 animate-spin"}/>
                    : <TransactionForm
                        onSubmit={onSubmit}
                        onCreateAccount={onCreateAccount}
                        onCreateCategory={onCreateCategory}
                        accountOptions={accountOptions}
                        categoryOptions={categoryOptions}
                        disabled={isPending}
                    />}
            </SheetContent>
        </Sheet>
    );
};

export default NewTransactionSheet;