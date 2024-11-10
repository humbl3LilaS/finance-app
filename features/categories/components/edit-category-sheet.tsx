"use client";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {insertCategorySchema} from "@/database/schema";
import {z} from "zod";
import {Loader2} from "lucide-react";
import {useConfirm} from "@/hooks/use-confirm";
import {useOpenCategory} from "@/features/categories/hook/use-open-category";
import {useEditCategory} from "@/features/categories/api/use-edit-category";
import {useDeleteCategory} from "@/features/categories/api/use-delete.category";
import CategoryForm from "@/features/categories/components/category-form";
import {useGetCategoryById} from "@/features/categories/api/use-get-category-by-id";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCategorySchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>

const EditCategorySheet = () => {
    const isOpen = useOpenCategory(state => state.isOpen);
    const onClose = useOpenCategory(state => state.onClose);
    const id = useOpenCategory(state => state.id);

    const [ConfirmDialog, confirm] = useConfirm("Are you sure", "You are about to delete this transaction");

    const {mutate: editCategory, isPending: isEditing} = useEditCategory(id);
    const {mutate: deleteCategory, isPending: isDeleting} = useDeleteCategory(id);
    const {data, isLoading} = useGetCategoryById(id);


    const onSubmit = (values: FormValues) => {
        editCategory(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteCategory(undefined, {
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
                            Edit category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? <Loader2 className={"size-8 mt-8 block mx-auto text-slate-300 animate-spin"}/>
                        : <CategoryForm
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

export default EditCategorySheet;