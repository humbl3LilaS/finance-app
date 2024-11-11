"use client";


import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {insertCategorySchema} from "@/database/schema";
import {z} from "zod";
import {useNewCategory} from "@/features/categories/hook/use-new-category";
import {useCreatCategory} from "@/features/categories/api/use-create-category";
import CategoryForm from "@/features/categories/components/category-form";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCategorySchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>

const NewCategorySheet = () => {
    const isOpen = useNewCategory(state => state.isOpen);
    const onClose = useNewCategory(state => state.onClose);

    const {mutate, isPending} = useCreatCategory();

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
                        New category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to categorize your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm
                    onSubmit={onSubmit}
                    disabled={isPending}
                />
            </SheetContent>
        </Sheet>
    );
};

export default NewCategorySheet;