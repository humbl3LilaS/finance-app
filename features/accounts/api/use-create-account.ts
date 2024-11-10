import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreatAccount = () => {
    const queryClient = useQueryClient();
    return  useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts.$post({json});
            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Account Created");
            await queryClient.invalidateQueries({queryKey: ["accounts"]});
        },
        onError: () => {
            toast.error("Failed to create Account");
        }
    });
};