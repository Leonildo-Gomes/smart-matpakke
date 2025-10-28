import { z } from 'zod';
export const generatePlanSchema = z.object({
    userId: z.string().uuid(),
    planType: z.enum(['DAILY', 'WEEKLY']),
});

export type generatePlanSchema = z.infer<typeof generatePlanSchema>;



 export const errorResponseSchema = z.object({
    message: z.string(),
  });