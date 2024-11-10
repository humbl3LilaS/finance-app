import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({json, param: {id}});
            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Account Updated");
            await queryClient.invalidateQueries({queryKey: ["accounts"]});
            await queryClient.invalidateQueries({queryKey: ["accounts", id]});
        },
        onError: () => {
            toast.error("Failed to update Account");
        }
    });

};