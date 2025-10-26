import { z } from 'zod';
// Importar os Enums para garantir a consistência com o schema.prisma
import { NutrientUnit } from '../../generated/prisma/client';

// --- SCHEMAS DE ENTRADA (INPUT) - SEM ALTERAÇÕES ---

// Schema para os ingredientes na criação de uma receita
const recipeIngredientInputSchema = z.object({
  name: z.string().min(2, { message: "Ingredient name must be at least 2 characters long" }),
  quantity: z.number().positive({ message: "Quantity must be a positive number" }),
  unit: z.string(),
  notes: z.string().optional(),
});

// Schema para os nutrientes na criação de uma receita
const recipeNutrientInputSchema = z.object({
  name: z.string().min(2, { message: "Nutrient name must be at least 2 characters long" }),
  unit: z.enum(NutrientUnit),
  value: z.number().nonnegative({ message: "Nutrient value cannot be negative" }),
});

// Schema para POST /recipes body
export const createRecipeSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  instructions: z.string().min(10, { message: "Instructions must be at least 10 characters long" }),
  prepTimeMinutes: z.number().int().positive({ message: "Preparation time must be a positive integer" }),
  ingredients: z.array(recipeIngredientInputSchema).min(1, { message: "A recipe must have at least one ingredient" }),
  nutrients: z.array(recipeNutrientInputSchema).optional(),
});

// Schema para PUT /recipes/:id body (all fields optional)
export const updateRecipeSchema = createRecipeSchema.partial();

// --- SCHEMAS DE PARÂMETROS E QUERIES - SEM ALTERAÇÕES ---

export const recipeParamsSchema = z.object({
  id: z.string().uuid({ message: "Invalid recipe ID" }),
});

export const filterRecipeQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
  preferenceId: z.string().uuid().optional(),
});


// --- NOVOS SCHEMAS DE RESPOSTA (OUTPUT) ---
// Estes schemas descrevem a estrutura que o serviço realmente retorna.

// Schema para o objeto 'ingredient' aninhado na resposta
const ingredientResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});

// Schema para o objeto 'nutrient' aninhado na resposta
const nutrientResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    unit: z.enum(NutrientUnit),
});

// Schema para cada item na lista 'recipeIngredients' da resposta
const recipeIngredientResponseSchema = z.object({
    id: z.string().uuid(),
    quantity: z.number(),
    unit: z.string(),
    notes: z.string().nullable(),
    ingredient: ingredientResponseSchema, // Objeto aninhado
});

// Schema para cada item na lista 'recipeNutrients' da resposta
const recipeNutrientResponseSchema = z.object({
    id: z.string().uuid(),
    value: z.number(),
    nutrient: nutrientResponseSchema, // Objeto aninhado
});


// --- SCHEMAS DE RESPOSTA PRINCIPAIS (ATUALIZADOS) ---

// Schema base para uma receita (usado em listas)
const baseRecipeResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    instructions: z.string(),
    prepTimeMinutes: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Schema ATUALIZADO para a resposta de uma única receita
export const recipeResponseSchema = baseRecipeResponseSchema.extend({
    // Nomes das propriedades corrigidos para corresponder ao retorno do Prisma
    recipeIngredients: z.array(recipeIngredientResponseSchema),
    recipeNutrients: z.array(recipeNutrientResponseSchema),
});

// Schema para a resposta de uma lista de receitas (paginada)
export const recipesResponseSchema = z.object({
    recipes: z.array(baseRecipeResponseSchema), // Continua usando o base para performance
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
});


 export const errorResponseSchema = z.object({
    message: z.string(),
  });

// --- INFERÊNCIA DE TIPOS (ATUALIZADA) ---

export type RecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type RecipeParams = z.infer<typeof recipeParamsSchema>;
export type FilterRecipeQuery = z.infer<typeof filterRecipeQuerySchema>;
