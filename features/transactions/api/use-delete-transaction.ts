import {InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;


export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.transactions[":id"]["$delete"]({param: {id}});
            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Transaction Deleted");
            await queryClient.invalidateQueries({queryKey: ["transactions"]});
            await queryClient.invalidateQueries({queryKey: ["transactions", id]});
        },
        onError: () => {
            toast.error("Failed to delete Transaction");
        }
    });

};