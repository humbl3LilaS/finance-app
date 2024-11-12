"use client";
import { insertTransactionSchema } from "@/database/schema";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Select from "@/components/select";
import DatePicker from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import AmountInput from "@/components/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";

const formSchema = z.object({
	date: z.coerce.date(),
	accountId: z.string(),
	categoryId: z.string().nullable().optional(),
	payee: z.string().min(2),
	amount: z.string().min(2),
	notes: z.string().nullable().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiSchema = insertTransactionSchema.omit({
	id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type TransactionFormProps = {
	id?: string;
	defaultValues?: Partial<FormValues>;
	onSubmit: (values: ApiFormValues) => void;
	onDelete?: () => void;
	disabled?: boolean;
	categoryOptions: { label: string; value: string }[];
	accountOptions: { label: string; value: string }[];
	onCreateCategory: (name: string) => void;
	onCreateAccount: (name: string) => void;
};

const formDefaultValue: Partial<FormValues> = {
	date: new Date(),
	amount: "",
	notes: "",
	payee: "",
};

const TransactionForm = ({
	id,
	defaultValues,
	onSubmit,
	onDelete,
	disabled,
	accountOptions,
	categoryOptions,
	onCreateAccount,
	onCreateCategory,
}: TransactionFormProps) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues ? defaultValues : formDefaultValue,
		mode: "onBlur",
	});

	const handleSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
		const amount = parseInt(values.amount);
		const amountInMiliunits = convertAmountToMiliunits(amount);
		onSubmit({
			...values,
			amount: amountInMiliunits,
		});
	};

	const handleDelete = () => {
		onDelete?.();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className={"space-y-4 pt-4"}>
				<FormField
					control={form.control}
					name={"date"}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<DatePicker
									value={field.value}
									onChange={field.onChange}
									disabled={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name={"accountId"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Account</FormLabel>
							<FormControl>
								<Select
									options={accountOptions}
									onCreate={onCreateAccount}
									onChange={field.onChange}
									value={field.value}
									placeholder={"Select an account"}
									disabled={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name={"categoryId"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<FormControl>
								<Select
									options={categoryOptions}
									onCreate={onCreateCategory}
									onChange={field.onChange}
									value={field.value}
									placeholder={"Select an account"}
									disabled={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={"payee"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Payee</FormLabel>
							<FormControl>
								<Input
									placeholder={"Payee"}
									disabled={disabled}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name={"amount"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<AmountInput
									{...field}
									placeholder={"0.00"}
									disabled={false}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name={"notes"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									value={field.value ?? ""}
									placeholder={"Optional Notes"}
									disabled={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={disabled || !form.formState.isValid}
					className={"w-full"}>
					{id ? "Save Changes" : "Create Transaction"}
				</Button>
				{!!id && (
					<Button
						onClick={handleDelete}
						type={"button"}
						variant={"outline"}
						className={"w-full"}>
						<Trash
							size={4}
							className={"mr-4"}
						/>
						<span>Delete Transaction</span>
					</Button>
				)}
			</form>
		</Form>
	);
};

export default TransactionForm;
