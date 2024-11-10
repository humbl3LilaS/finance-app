import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Categories Deleted");
            await queryClient.invalidateQueries({queryKey: ["categories"]});
        },
        onError: () => {
            toast.error("Failed to Delete Categories");
        }
    });

};