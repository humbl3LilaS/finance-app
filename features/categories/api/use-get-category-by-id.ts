import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";

export const useGetCategoryById = (id?: string) => {
    return useQuery({
        enabled: !!id,
        queryKey: ["category", id],
        queryFn: async () => {
            const response = await client.api.categories[":id"].$get({param: {id}});

            if (!response.ok) {
                throw new Error("Fail to fetch category");
            }

            const {data} = await response.json();
            return data;
        }
    });

};