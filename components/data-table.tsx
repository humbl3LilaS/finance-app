"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, PaginationState, Row, RowSelectionState, SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Trash} from "lucide-react";
import {useConfirm} from "@/hooks/use-confirm";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterKey: string;
    onDelete: (rows: Row<TData>[]) => void;
    disabled?: boolean;
}

export function DataTable<TData, TValue>(
    {
        columns,
        data,
        filterKey,
        onDelete,
        disabled,
    }: DataTableProps<TData, TValue>) {

    const [ConfirmDialog, confirm] = useConfirm("Are you Sure?", "You are about to Perform a bulk delete");

    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 5,
        pageIndex: 0
    });

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        state: {
            pagination,
            sorting,
            columnFilters,
            rowSelection,
        }
    });

    return (
        <div>
            <ConfirmDialog/>
            <div className="flex items-center py-4">
                <Input
                    placeholder={`Filter ${filterKey}...`}
                    value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filterKey)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                {
                    table.getFilteredSelectedRowModel().rows.length > 0 &&
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    className={"ml-auto font-normal text-sm"}
                    onClick={async () => {
                        const ok = await confirm();
                        if (ok) {
                            onDelete(table.getFilteredSelectedRowModel().rows);
                            table.resetRowSelection();
                        }
                    }}
                    disabled={disabled}
                  >
                    <Trash size={4} className={"mr-2"}/>
                    <span>Delete {table.getFilteredSelectedRowModel().rows.length}</span>
                  </Button>
                }
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
