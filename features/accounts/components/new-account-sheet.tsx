"use client";


import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useNewAccount} from "@/features/accounts/hook/use-new-account";
import AccountForm from "@/features/accounts/components/account-form";
import {insertAccountSchema} from "@/database/schema";
import {z} from "zod";
import {useCreatAccount} from "@/features/accounts/hook/use-create-account";

const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>

const NewAccountSheet = () => {
    const isOpen = useNewAccount(state => state.isOpen);
    const onClose = useNewAccount(state => state.onClose);

    const {mutate, isPending} = useCreatAccount();

    const onSubmit = (values: FormValues) => {
        mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };


    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className={"w-full max-w-[400px] space-y-4 "}>
                <SheetHeader>
                    <SheetTitle>
                        New account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transaction
                    </SheetDescription>
                </SheetHeader>
                <AccountForm
                    onSubmit={onSubmit}
                    disabled={isPending}
                />
            </SheetContent>
        </Sheet>
    );
};

export default NewAccountSheet;