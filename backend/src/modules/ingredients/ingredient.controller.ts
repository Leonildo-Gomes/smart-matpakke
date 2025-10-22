import { FastifyReply, FastifyRequest } from "fastify";
import { IngredientInput } from "./ingredient.schema";
import { createIngredientService, deleteIngredientService, getAllIngredientsService, getIngredientByIdService, updateIngredientService } from "./ingredient.service";


export async function getAll(request: FastifyRequest, reply:FastifyReply) {
    try {
        const ingredients = await getAllIngredientsService();
        return reply.status(200).send(ingredients);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
    
}

export async function getById(request: FastifyRequest, reply:FastifyReply) {
    try {
        const ingredientId = (request.params as Record<string, string>).id as string;
        if (!ingredientId) {
            return reply.status(400).send({ message: 'Ingredient ID is required' });
        }
        const ingredient = await getIngredientByIdService(ingredientId);
        return reply.status(200).send(ingredient);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}


export async function create(request: FastifyRequest, reply:FastifyReply) {
    try {
        console.log('bodu',request.body);
        const ingredient = await createIngredientService(request.body as IngredientInput)
        console.log('Created Ingredient:', ingredient); // Add this line
        return reply.status(201).send(ingredient);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}


export async function update(request: FastifyRequest, reply:FastifyReply) {
    try {
        const ingredientId = (request.params as Record<string, string>).id as string;
        if (!ingredientId) {
            return reply.status(400).send({ message: 'Ingredient ID is required' });
        }
        const ingredient = await updateIngredientService(ingredientId, request.body as IngredientInput)
        return reply.status(200).send(ingredient);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}


export async function remove(request: FastifyRequest, reply:FastifyReply) {
    try {
        const ingredientId = (request.params as Record<string, string>).id as string;
        if (!ingredientId) {
            return reply.status(400).send({ message: 'Ingredient ID is required' });
        }
        const ingredient = await deleteIngredientService(ingredientId);
        return reply.status(200).send(ingredient);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}