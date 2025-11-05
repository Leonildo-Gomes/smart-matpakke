import { z } from 'zod';
import { DayOfWeek } from '../../../generated/prisma/client';


const dailyPlanSchema = z.object({
    dayOfWeek: z.enum(DayOfWeek),
    recipeId: z.string().uuid(),
    familyMemberId: z.string().describe('ID do membro da família para o plano diário.'),
})
export const createWeeklyPlanSchema = z.object({
    startDate: z.coerce.date(),
    dailyPlans: z.array(dailyPlanSchema),
    
});


export const errorResponseSchema = z.object({
    message: z.string(),
});

export const weeklyPlanResponseSchema= z.object({
    id: z.string().uuid(),
    startDate: z.date(),
    familyId: z.string().uuid(),
    dailyPlans: z.array(dailyPlanSchema),
})


export const updateWeeklyPlanSchema = createWeeklyPlanSchema.partial();

export const weeklyPlanParamsSchema = z.object({
  id: z.string().uuid(),
});





export type CreateWeeklyPlanInput = z.infer<typeof createWeeklyPlanSchema>;

export type UpdateWeeklyPlanInput = z.infer<typeof updateWeeklyPlanSchema>;
