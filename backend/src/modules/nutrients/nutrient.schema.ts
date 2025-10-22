
 import { z } from 'zod';
import { NutrientUnit } from '../../generated/prisma/client';

 export const nutrientSchema = z.object({
    name: z.string(),
    unit: z.enum(NutrientUnit),
 })

 export type NutrientInput = z.infer<typeof nutrientSchema>

 export const nutrientResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    unit: z.enum(NutrientUnit),
 });

 export const errorResponseSchema = z.object({
    message: z.string(),
  });