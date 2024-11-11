import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$patch"]({json, param: {id}});
            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Transaction Updated");
            await queryClient.invalidateQueries({queryKey: ["transactions"]});
            await queryClient.invalidateQueries({queryKey: ["transactions", id]});
        },
        onError: () => {
            toast.error("Failed to update Transaction");
        }
    });

};