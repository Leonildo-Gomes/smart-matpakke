
import { CustomError } from "../../lib/errors/custom.errors";
import prismaClient from "../../prisma";

import { RecipeInput } from "./recipe.schema";



export async function getAllRecipesService() {
    const recipes = await prismaClient.recipe.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            prepTimeMinutes: true,
            createdAt: true,
            updatedAt: true,
            recipeIngredients: {
                select: {
                    id: true,
                    quantity: true,
                    unit: true,
                    notes: true,
                   
                    ingredient: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            },
            recipeNutrients: {
                select: {
                    id: true,
                    value: true,
                    nutrient: {
                        select: {
                            id: true,
                            name: true,
                            unit: true,
                        }
                    }
                }
            }
        },
    });
    return recipes;
}

export async function getRecipeByIdService(recipeId: string) {
    const recipe = await prismaClient.recipe.findUnique({
        where: {
            id: recipeId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            prepTimeMinutes: true,
            createdAt: true,
            updatedAt: true,
            recipeIngredients: {
                select: {
                    id: true,
                    quantity: true,
                    unit: true,
                    notes: true,
                   
                    ingredient: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            },
            recipeNutrients: {
                select: {
                    id: true,
                    value: true,
                    nutrient: {
                        select: {
                            id: true,
                            name: true,
                            unit: true,
                        }
                    }
                }
            }
        },
    });
    if (!recipe) {
        throw new CustomError('Recipe not found', 404);
    }
    return recipe;
} 

export async function createRecipeService(data: RecipeInput) {
    const { title, description, instructions, prepTimeMinutes, ingredients, nutrients } = data;

    const recipe = await prismaClient.recipe.create({
        data: {
            title,
            description,
            instructions,
            prepTimeMinutes,
            recipeIngredients: {
                create: ingredients.map(ingredient  => ({
                    // Dados da tabela de junção (RecipeIngredient)
                    quantity: ingredient.quantity,
                    unit: ingredient.unit,
                    notes: ingredient.notes || null,
                    // Lógica para conectar ou criar o Ingrediente
                    ingredient: {
                        connectOrCreate: {
                            where: { name: ingredient.name },
                            create: { name: ingredient.name },
                        }
                    }
                })),
            },
            ...(nutrients && nutrients.length > 0 && {
                recipeNutrients: {
                    create: nutrients.map(nutrient => ({
                        // Dado da tabela de junção (RecipeNutrient)
                        value: nutrient.value,
                        // Lógica para conectar ou criar o Nutriente
                        nutrient: {
                            connectOrCreate: {
                                where: { name: nutrient.name },
                                // CORRIGIDO: Adicionado 'unit' para a criação
                                create: { 
                                    name: nutrient.name,
                                    unit: nutrient.unit 
                                },
                            }
                        }
                    }))
                }
            }),
        },
        select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            prepTimeMinutes: true,
            recipeIngredients:{
                select: {
                    id: true,
                    quantity: true,
                    unit: true,
                    notes: true,
                    ingredient: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            },
            recipeNutrients: {
                select: {
                    id: true,
                    value: true,
                    nutrient: {
                        select: {
                            id: true,
                            name: true,
                            unit: true,
                        }
                    }
                }
            }
            
        },
    });
    return recipe;
}

export async function updateRecipeService(recipeId: string, data: any) {
    const recipe = await prismaClient.recipe.update({
        where: {
            id: recipeId,
        },
        data: {
            title: data.title,
            description: data.description,
            instructions: data.instructions,
            prepTimeMinutes: data.prepTimeMinutes,
        },
        select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            prepTimeMinutes: true,
        },
    });
    if (!recipe) {
        throw new CustomError('Recipe not found', 404);
    }
    return recipe;      
}

export async function deleteRecipeService(recipeId: string) {
    const recipe = await prismaClient.recipe.delete({
        where: {
            id: recipeId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            prepTimeMinutes: true,
        },
    });
    if (!recipe) {
        throw new CustomError('Recipe not found', 404);
    }
    return recipe;
}