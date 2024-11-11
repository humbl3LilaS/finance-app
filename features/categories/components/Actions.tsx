"use client";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Edit, MoreHorizontal, Trash} from "lucide-react";
import {useConfirm} from "@/hooks/use-confirm";
import {useOpenCategory} from "@/features/categories/hook/use-open-category";
import {useDeleteCategory} from "@/features/categories/api/use-delete.category";

type ActionsProps = {
    id: string;
}

const Actions = ({id}: ActionsProps) => {

    const onOpen = useOpenCategory(state => state.onOpen);

    const [ConfirmDialog, confirm] = useConfirm("Are you sure", "You are about to delete this category");

    const {mutate: deleteCategory, isPending: isDeleting} = useDeleteCategory(id);

    const deleteHandler = async () => {
        const ok = await confirm();
        if (ok) {
            deleteCategory();
        }
    };

    return (
        <>
            <ConfirmDialog/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className={"size-8 p-0"}>
                        <MoreHorizontal size={4}/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={"end"}>
                    <DropdownMenuItem
                        disabled={false}
                        onClick={() => onOpen(id)}
                    >
                        <Edit size={4} className={"mr-2"}/>
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={isDeleting}
                        onClick={deleteHandler}
                    >
                        <Trash size={4} className={"mr-2"}/>
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default Actions;