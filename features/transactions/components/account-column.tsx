import {useOpenAccount} from "@/features/accounts/hook/use-open-account";

type AccountColumnProps = {
    account: string;
    accountId: string;
}

const AccountColumn = (
    {
        account,
        accountId
    }: AccountColumnProps
) => {
    const {onOpen: onOpenAccount} = useOpenAccount();

    const onClick = () => {
        onOpenAccount(accountId);
    }

    return (
        <div
            onClick={onClick}
            className={"flex items-center !cursor-pointer hover:underline"}
        >
            {account}
        </div>
    );
};

export default AccountColumn;