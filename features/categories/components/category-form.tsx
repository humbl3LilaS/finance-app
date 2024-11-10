"use client";
import {insertCategorySchema} from "@/database/schema";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";

const formSchema = insertCategorySchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>

type AccountFormProps = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

const formDefaultValue: FormValues = {
    name: "",
};

const CategoryForm = (
    {
        id,
        defaultValues,
        onSubmit,
        onDelete,
        disabled,
    }: AccountFormProps) => {

    const form = useForm<FormValues>(
        {
            resolver: zodResolver(formSchema),
            defaultValues: defaultValues ?? formDefaultValue,
        }
    );

    const handleSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
        onSubmit(values);
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={"space-y-4 pt-4"}
            >
                <FormField
                    control={form.control}
                    name={"name"}
                    render={({field}) =>
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder={"eg. credit, debit"}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>

                    }/>
                <Button
                    type="submit"
                    disabled={disabled}
                    className={"w-full"}
                >
                    {id ? "Save Changes" : "Create Category"}
                </Button>
                {!!id && <Button
                  onClick={handleDelete}
                  type={"button"}
                  variant={"outline"}
                  className={"w-full"}
                >
                  <Trash size={4} className={"mr-4"}/>
                  <span>Delete Category</span>
                </Button>}
            </form>
        </Form>
    );
};

export default CategoryForm;