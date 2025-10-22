import { FastifyReply, FastifyRequest } from "fastify";
import { NutrientInput } from "./nutrient.schema";
import { createNutrientService, deleteNutrientService, getAllNutrientsService, getNutrientByIdService, updateNutrientService } from "./nutrient.service";


export async function getAll(request: FastifyRequest, reply:FastifyReply) {
    try {
        const ingredients = await getAllNutrientsService();
        return reply.status(200).send(ingredients);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    } 
}

export async function getById(request: FastifyRequest, reply:FastifyReply) {
    try {
        const nutrientId = (request.params as Record<string, string>).id as string;
        if (!nutrientId) {
            return reply.status(400).send({ message: 'Nutrient ID is required' });
        }
        const nutrient = await getNutrientByIdService(nutrientId);
        return reply.status(200).send(nutrient);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}



export async function create(request: FastifyRequest, reply:FastifyReply) {
    try {
        console.log('bodu',request.body);
        const nutrient = await createNutrientService(request.body as NutrientInput)
        console.log('Created Nutrient:', nutrient);
        return reply.status(201).send(nutrient);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}

export async function update(request: FastifyRequest, reply:FastifyReply) {
    try {
        const nutrientId = (request.params as Record<string, string>).id as string;
        if (!nutrientId) {
            return reply.status(400).send({ message: 'Nutrient ID is required' });
        }
        const nutrient = await updateNutrientService(nutrientId, request.body as NutrientInput)
        return reply.status(200).send(nutrient);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}

export async function remove(request: FastifyRequest, reply:FastifyReply) {
    try {
        const nutrientId = (request.params as Record<string, string>).id as string;
        if (!nutrientId) {
            return reply.status(400).send({ message: 'Nutrient ID is required' });
        }
        const nutrient = await deleteNutrientService(nutrientId);
        return reply.status(200).send(nutrient);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}