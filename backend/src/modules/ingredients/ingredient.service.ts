// Corrected import path
import { CustomError } from "../../lib/errors/custom.errors";
import prismaClient from "../../prisma";
import { IngredientInput } from "./ingredient.schema";



export async function getAllIngredientsService() {
    const ingredients = await prismaClient.ingredient.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    return ingredients;
}


export async function getIngredientByIdService(ingredientId: string) {
    const ingredient = await prismaClient.ingredient.findUnique({
        where: {
            id: ingredientId,
        },
        select: {
            id: true,
            name: true,
        },
    })
    if (!ingredient) {
        throw new CustomError('Ingredient not found', 404);
    }
    return ingredient;
}

export async function createIngredientService(data: IngredientInput) {
    try {
        const ingredient = await prismaClient.ingredient.create({
            data: {
                name: data.name,
            },
            select: {
                id: true,
                name: true,
            },
        });
        return ingredient;    
    } catch (error) {
        throw  new CustomError('Error creating ingredient', 500); // Re-throw other errors
    }
}


export async function updateIngredientService(ingredientId: string, data: IngredientInput) {
    const ingredient = await prismaClient.ingredient.update({
        where: {
            id: ingredientId,
        },
        data: {
            name: data.name,
        },
        select: {
            id: true,
            name: true,
        },
    });
    if (!ingredient) {
        throw new CustomError('Ingredient not found', 404);
    }
    return ingredient;
}


export async function deleteIngredientService(ingredientId: string) {
    const ingredient = await prismaClient.ingredient.delete({
        where: {
            id: ingredientId,
        },
        select: {
            id: true,
            name: true,
        },
    });
    if (!ingredient) {
        throw new CustomError('Ingredient not found', 404);
    }
    return ingredient;
}