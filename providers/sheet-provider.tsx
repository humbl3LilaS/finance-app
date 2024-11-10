import NewAccountSheet from "@/features/accounts/components/new-account-sheet";
import EditAccountSheet from "@/features/accounts/components/edit-account-sheet";
import NewCategorySheet from "@/features/categories/components/new-category-sheet";
import EditCategorySheet from "@/features/categories/components/edit-category-sheet";

const SheetProvider = () => {
    return (
        <>
            <NewAccountSheet/>
            <EditAccountSheet/>
            <NewCategorySheet/>
            <EditCategorySheet/>
        </>
    );
};

export default SheetProvider;