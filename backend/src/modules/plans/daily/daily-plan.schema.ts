import { z } from 'zod';
import { DayOfWeek } from '../../../generated/prisma/client';




export const dailyPlanSchema = z.object({
    dayOfWeek: z.enum(DayOfWeek),
    recipeId: z.string().uuid(),
    
});