import {InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;


export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.accounts[":id"]["$delete"]({param: {id}});
            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Account Deleted");
            await queryClient.invalidateQueries({queryKey: ["accounts"]});
            await queryClient.invalidateQueries({queryKey: ["accounts", id]});
            await queryClient.invalidateQueries({queryKey: ["transactions"]});
        },
        onError: () => {
            toast.error("Failed to delete Account");
        }
    });

};