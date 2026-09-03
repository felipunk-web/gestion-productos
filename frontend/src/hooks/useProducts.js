import { useQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:3000";
const ENDPOINT = "/products";

export function useProducts() {
    return useQuery({
        queryKey:["products"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}${ENDPOINT}`);
            if(!response.ok){
                throw new Error("Error cargando productos");
            }
            return response.json();
        }
    })
}