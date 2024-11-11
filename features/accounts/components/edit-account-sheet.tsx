"use client";


import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import AccountForm from "@/features/accounts/components/account-form";
import {insertAccountSchema} from "@/database/schema";
import {z} from "zod";
import {useOpenAccount} from "@/features/accounts/hook/use-open-account";
import {useGetAccountById} from "@/features/accounts/api/use-get-account-by-id";
import {Loader2} from "lucide-react";
import {useEditAccount} from "@/features/accounts/api/use-edit-account";
import {useDeleteAccount} from "@/features/accounts/api/use-delete-account";
import {useConfirm} from "@/hooks/use-confirm";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>

const EditAccountSheet = () => {
    const isOpen = useOpenAccount(state => state.isOpen);
    const onClose = useOpenAccount(state => state.onClose);
    const id = useOpenAccount(state => state.id);

    const [ConfirmDialog, confirm] = useConfirm("Are you sure", "You are about to delete this account");

    const {mutate: editAccount, isPending: isEditing} = useEditAccount(id);
    const {mutate: deleteAccount, isPending: isDeleting} = useDeleteAccount(id);
    const {data, isLoading} = useGetAccountById(id);


    const onSubmit = (values: FormValues) => {
        editAccount(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteAccount(undefined, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };


    return (
        <>
            <ConfirmDialog/>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className={"w-full max-w-[400px] space-y-4 "}>
                    <SheetHeader>
                        <SheetTitle>
                            Edit account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? <Loader2 className={"size-8 mt-8 block mx-auto text-slate-300 animate-spin"}/>
                        : <AccountForm
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isEditing || isDeleting}
                            defaultValues={data}
                            onDelete={onDelete}
                        />}
                </SheetContent>
            </Sheet>
        </>
    );
};

export default EditAccountSheet;