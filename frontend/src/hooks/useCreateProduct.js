import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:3000";
const ENDPOINT = "/products";

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newProduct) => {
            const response = await fetch (`${API_URL}${ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProduct)
            });
            if(!response.ok){
                const body = await response.json().catch(() => ({}));
                throw new Error(body.error?.message || body.error || "Error creating product"); 
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["products"]});
        }
    });
}