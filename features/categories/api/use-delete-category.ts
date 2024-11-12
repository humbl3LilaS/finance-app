import {InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;


export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({param: {id}});
            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Category Deleted");
            await queryClient.invalidateQueries({queryKey: ["categories"]});
            await queryClient.invalidateQueries({queryKey: ["categories", id]});
            await queryClient.invalidateQueries({queryKey: ["transactions"]});
        },
        onError: () => {
            toast.error("Failed to delete Category");
        }
    });

};