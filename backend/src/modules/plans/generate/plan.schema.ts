import { z } from 'zod';
export const generatePlanSchema = z.object({
    userId: z.string().uuid(),
    planType: z.enum(['DAILY', 'WEEKLY']),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export type generatePlanSchema = z.infer<typeof generatePlanSchema>;



 export const errorResponseSchema = z.object({
    message: z.string(),
  });