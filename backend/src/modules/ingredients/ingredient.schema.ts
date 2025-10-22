 import { z } from 'zod';


 export const ingredientSchema = z.object({
    name: z.string(),

 })

 export type IngredientInput = z.infer<typeof ingredientSchema>;

 export const errorResponseSchema = z.object({
    message: z.string().nonempty(),
  });

  export const ingredientResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
  });
    