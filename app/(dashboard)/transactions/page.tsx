"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Loader2, Plus} from "lucide-react";
import {DataTable} from "@/components/data-table";
import {columns} from "@/app/(dashboard)/transactions/column";
import {Skeleton} from "@/components/ui/skeleton";
import {useNewTransaction} from "@/features/transactions/hook/use-new-transaction";
import {useGetTransactions} from "@/features/transactions/api/use-get-transactions";
import {useBulkDeleteTransactions} from "@/features/transactions/api/use-bulk-delete-transactions";


const TransactionsPage = () => {

    const openSheet = useNewTransaction(state => state.onOpen);
    const {data, isLoading} = useGetTransactions();
    const {mutate, isPending} = useBulkDeleteTransactions();


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
                        Transaction History
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
                            filterKey={"account"}
                            data={data}
                            disabled={isPending}/>}
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionsPage;