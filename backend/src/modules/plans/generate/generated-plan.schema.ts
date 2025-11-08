import { z } from 'zod';
import { DayOfWeek } from '../../../generated/prisma/client';

// Schema para um Ingrediente de Receita
const RecipeIngredientSchema = z.object({
  name: z.string().describe('Nome do ingrediente (ex: "Arroz", "Frango").'),
  quantity: z.number().positive().describe('Quantidade do ingrediente (ex: 100, 1.5).'),
  //unit: z.enum(['kg', 'g', 'mg', 'ml', 'l', 'tsp', 'tbsp', 'unit']).describe('Unidade de medida do ingrediente (ex: "g", "ml", "unidade").'),
  unit:z.string().describe('Unidade de medida do ingrediente (ex: "g", "ml", "unidade").'),
  notes: z.string().optional().describe('Notas adicionais sobre o ingrediente (ex: "cozido", "picado").'),
});

// Schema para um Nutriente de Receita
const RecipeNutrientSchema = z.object({
  name: z.string().describe('Nome do nutriente (ex: "Calorias", "Proteínas").'),
  value: z.number().positive().describe('Valor do nutriente (ex: 250, 30).'),
  unit: z.string().describe('Unidade de medida do nutriente (ex: "kcal", "g").'),
});

// Schema para uma Receita
const RecipeSchema = z.object({
  title: z.string().describe('Título da receita (ex: "Salada de Frango com Quinoa").'),
  description: z.string().describe('Breve descrição da receita.'),
  instructions: z.string().describe('Instruções detalhadas de preparação da receita.'),
  prepTimeMinutes: z.number().int().positive().describe('Tempo de preparação em minutos.'),
  ingredients: z.array(RecipeIngredientSchema).describe('Lista de ingredientes da receita.'),
  nutrients: z.array(RecipeNutrientSchema).optional().describe('Lista de nutrientes da receita.'),
});

// Schema para um Plano Diário
const DailyPlanSchema = z.object({
  dayOfWeek: z.enum(DayOfWeek).describe('Dia da semana para o plano diário.'),
  recipe: RecipeSchema.describe('A receita principal para este dia.'),
  
});

// Schema para um Plano Semanal
export const GeneratedPlanSchema = z.object({
  planType: z.enum(['DAILY', 'WEEKLY']).default('DAILY').describe('Tipo de plano: DIÁRIO ou SEMANAL.'),
  startDate: z.string(),//.regex(/^\\d{4}-\\d{2}-\\d{2}$/).describe('Data de início do plano semanal no formato YYYY-MM-DD.'),
  dailyPlans: z.array(DailyPlanSchema).min(1).max(7).describe('Lista de planos diários para a semana.'),
});

// Schema para um Plano Diário (se a requisição for apenas para um dia)
export const DailyPlanOutputSchema = z.object({
  //planType: z.literal('DAILY').describe('Tipo de plano: DIÁRIO.'),
  dayOfWeek: z.enum(DayOfWeek).describe('Dia da semana para o plano diário.'),
  recipe: RecipeSchema.describe('A receita principal para este dia.'),
});

// Schema principal que a IA deve retornar
/*export const PlanOutputSchema = z.discriminatedUnion('planType', [
  WeeklyPlanOutputSchema,
  DailyPlanOutputSchema,
]);*/



export type GeneratedPlan = z.infer<typeof GeneratedPlanSchema>;
