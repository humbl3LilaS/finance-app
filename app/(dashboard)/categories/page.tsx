"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Loader2, Plus} from "lucide-react";
import {DataTable} from "@/components/data-table";
import {columns} from "@/app/(dashboard)/categories/column";
import {Skeleton} from "@/components/ui/skeleton";
import {useGetCategories} from "@/features/categories/api/use-get-categories";
import {useBulkDeleteCategories} from "@/features/categories/api/use-bulk-delete-categories";
import {useNewCategory} from "@/features/categories/hook/use-new-category";


const CategoriesPage = () => {

    const openSheet = useNewCategory(state => state.onOpen);
    const {data, isLoading} = useGetCategories();
    const {mutate, isPending} = useBulkDeleteCategories();


    if (isLoading) {
        return <Card className={"w-full max-w-6xl mx-auto border-none drop-shadow-sm"}>
            <CardHeader className={"-mt-28 gap-y-2 lg:flex-row lg:items-center lg:justify-between"}>
                <Skeleton className={"h-8 w-48"}/>
            </CardHeader>
            <CardContent>
                <div className={"h-[350px] w-full flex items-center justify-center"}>
                    <Loader2 size={40} className={"animate-spin text-slate-300"}/>
                </div>
            </CardContent>
        </Card>;
    }

    return (
        <div>
            <Card className={"w-full max-w-6xl mx-auto border-none drop-shadow-sm"}>
                <CardHeader className={"-mt-28 gap-y-2 lg:flex-row lg:items-center lg:justify-between"}>
                    <CardTitle className={"text-xl line-clamp-1"}>
                        Categories Page
                    </CardTitle>
                    <Button
                        onClick={openSheet}
                    >
                        <Plus size={4} className={"mr-2"}/>
                        <span>Add new</span>
                    </Button>
                </CardHeader>
                <CardContent>
                    {data &&
                      <DataTable
                        columns={columns}
                        onDelete={(rows) => {
                            const ids = rows.map((r) => r.original.id);
                            mutate({ids});
                        }}
                        filterKey={"name"}
                        data={data}
                        disabled={isPending}/>}
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoriesPage;