import NewAccountSheet from "@/features/accounts/components/new-account-sheet";
import EditAccountSheet from "@/features/accounts/components/edit-account-sheet";

const SheetProvider = () => {
    return (
        <>
            <NewAccountSheet/>
            <EditAccountSheet/>
        </>
    );
};

export default SheetProvider;