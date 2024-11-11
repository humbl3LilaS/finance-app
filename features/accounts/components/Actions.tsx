"use client";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Edit, MoreHorizontal, Trash} from "lucide-react";
import {useOpenAccount} from "@/features/accounts/hook/use-open-account";
import {useDeleteAccount} from "@/features/accounts/api/use-delete-account";
import {useConfirm} from "@/hooks/use-confirm";

type ActionsProps = {
    id: string;
}

const Actions = ({id}: ActionsProps) => {

    const onOpen = useOpenAccount(state => state.onOpen);

    const [ConfirmDialog, confirm] = useConfirm("Are you sure", "You are about to delete this account");

    const {mutate: deleteAccount, isPending: isDeleting} = useDeleteAccount(id);

    const deleteHandler = async () => {
        const ok = await confirm();
        if (ok) {
            deleteAccount();
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