import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";

export const useGetTransactionById = (id?: string) => {
    return useQuery({
        enabled: !!id,
        queryKey: ["transactions", id],
        queryFn: async () => {
            const response = await client.api.transactions[":id"].$get({param: {id}});

            if (!response.ok) {
                throw new Error("Fail to fetch transaction");
            }

            const {data} = await response.json();
            return data;
        }
    });

};