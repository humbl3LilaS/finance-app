import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({json, param: {id}});
            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Category Updated");
            await queryClient.invalidateQueries({queryKey: ["categories"]});
            await queryClient.invalidateQueries({queryKey: ["categories", id]});
            await queryClient.invalidateQueries({queryKey: ["transactions"]});
        },
        onError: () => {
            toast.error("Failed to update Category");
        }
    });

};