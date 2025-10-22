import { CustomError } from "../../lib/errors/custom.errors";
import prismaClient from "../../prisma";
import { NutrientInput } from "./nutrient.schema";



export async function getAllNutrientsService() {
    const nutrients = await prismaClient.nutrient.findMany({
        select: {
            id: true,
            name: true,
            unit: true,
        },
    });
    return nutrients;
}

export async function getNutrientByIdService(nutrientId: string) {
    const nutrient = await prismaClient.nutrient.findUnique({
        where: {
            id: nutrientId,
        },
        select: {
            id: true,
            name: true,
            unit: true,
        },
    })
    if (!nutrient) {
        throw new CustomError('Nutrient not found', 404);
    }
    return nutrient;
}

export async function createNutrientService(data: NutrientInput) {
    const nutrient = await prismaClient.nutrient.create({
        data: {
            name: data.name,
            unit: data.unit,
        },
        select: {
            id: true,
            name: true,
            unit: true,
        },
    });
    console.log('Created Nutrient:', nutrient);
    return nutrient;
}

export async function updateNutrientService(nutrientId: string, data: NutrientInput) {
    const nutrient = await prismaClient.nutrient.update({
        where: {
            id: nutrientId,
        },
        data: {
            name: data.name,
            unit: data.unit,
        },
        select: {
            id: true,
            name: true,
            unit: true,
        },
    });
    if (!nutrient) {
        throw new CustomError('Nutrient not found', 404);
    }
    return nutrient;
}

export async function deleteNutrientService(nutrientId: string) {
    const nutrient = await prismaClient.nutrient.delete({
        where: {
            id: nutrientId,
        },
        select: {
            id: true,
            name: true,
            unit: true,
        },
    });
    if (!nutrient) {
        throw new CustomError('Nutrient not found', 404);
    }
    return nutrient;
}