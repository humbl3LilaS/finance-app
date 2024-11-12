import { useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreatAccount } from "@/features/accounts/api/use-create-account";
import Select from "@/components/select";

export const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
	const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null);

	const { data: accounts } = useGetAccounts();
	const { mutate: createAccount, isPending: creatingAccount } = useCreatAccount();

	const onCrateAccount = (name: string) => {
		createAccount({ name });
	};

	const accountOptions = (accounts ?? []).map((account) => ({
		label: account.name,
		value: account.id,
	}));

	const confirm = () =>
		new Promise((resolve) => {
			setPromise({ resolve });
		});

	const selectValue = useRef<string>();

	const handleClose = () => {
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(selectValue.current);
		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(undefined);
		handleClose();
	};

	const ConfirmationDialog = () => (
		<Dialog open={promise != null}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select Account</DialogTitle>
					<DialogDescription>Please select an account to continue</DialogDescription>
				</DialogHeader>
				<Select
					placeholder="Select an account"
					options={accountOptions}
					onChange={(value) => (selectValue.current = value)}
					onCreate={onCrateAccount}
					disabled={creatingAccount}
				/>
				<DialogFooter className={"pt-2"}>
					<Button
						onClick={handleCancel}
						variant={"outline"}>
						Cancel
					</Button>
					<Button onClick={handleConfirm}>Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return [ConfirmationDialog, confirm];
};
