import { z } from 'zod';


export const familySchema = z.object({
    name: z.string(),
    
});

export type FamilyInput = z.infer<typeof familySchema>;

export const familyResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});

 export const errorResponseSchema = z.object({
    message: z.string().nonempty(),
  });