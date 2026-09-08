import { z } from "zod";

export const zodProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  price: z.coerce.number().positive("El precio debe ser un número positivo"),
  stock: z.coerce.number().min(0, "El stock debe ser un número no positivo")
});