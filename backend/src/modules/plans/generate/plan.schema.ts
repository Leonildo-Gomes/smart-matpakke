import { z } from 'zod';
import { DayOfWeek, NutrientUnit } from '../../../generated/prisma/client';
import { GeneratedPlanSchema } from './generated-plan.schema';

export const generatePlanSchema = z.object({
    familyMemberId: z.string().uuid(),
    planType: z.enum(['DAILY', 'WEEKLY']),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export type generatePlanSchema = z.infer<typeof generatePlanSchema>;

// Schema for the body of the save plan request
export const SavePlanSchema = GeneratedPlanSchema.extend({
  familyMemberId: z.string().uuid(),
});



 export const errorResponseSchema = z.object({
    message: z.string(),
  });


// Novo schema para a resposta do plano guardado
const NutrientResponseSchema = z.object({
  name: z.string(),
  unit: z.nativeEnum(NutrientUnit),
});

const IngredientResponseSchema = z.object({
  name: z.string(),
});

const RecipeIngredientResponseSchema = z.object({
  quantity: z.number(),
  unit: z.string(),
  notes: z.string().nullable(),
  ingredient: IngredientResponseSchema,
});

const RecipeNutrientResponseSchema = z.object({
  value: z.number(),
  nutrient: NutrientResponseSchema,
});

const RecipeResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  prepTimeMinutes: z.number().int(),
  recipeIngredients: z.array(RecipeIngredientResponseSchema),
  recipeNutrients: z.array(RecipeNutrientResponseSchema),
});

const DailyPlanResponseSchema = z.object({
  id: z.string().uuid(),
  dayOfWeek: z.nativeEnum(DayOfWeek),
  recipe: RecipeResponseSchema,
});

export const WeeklyPlanResponseSchema = z.object({
  id: z.string().uuid(),
  startDate: z.string(),
  familyId: z.string().uuid(),
  dailyPlans: z.array(DailyPlanResponseSchema),
});