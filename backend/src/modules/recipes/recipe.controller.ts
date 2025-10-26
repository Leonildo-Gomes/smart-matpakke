import { FastifyReply, FastifyRequest } from "fastify";
import { RecipeInput } from "./recipe.schema";
import { createRecipeService, getAllRecipesService, getRecipeByIdService } from "./recipe.service";



export async function getAll(request: FastifyRequest, reply:FastifyReply) {
    try {
        const recipes = await getAllRecipesService();
        return reply.status(200).send(recipes);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
} 

export async function getById(request: FastifyRequest, reply:FastifyReply) {
    try {
        const recipeId = (request.params as Record<string, string>).id as string;
        if (!recipeId) {
            return reply.status(400).send({ message: 'Recipe ID is required' });
        }
        const recipe = await getRecipeByIdService(recipeId);
        return reply.status(200).send(recipe);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}

export async function remove(request: FastifyRequest, reply:FastifyReply) {
    try {
        const recipeId = (request.params as Record<string, string>).id as string;
        if (!recipeId) {
            return reply.status(400).send({ message: 'Recipe ID is required' });
        }
        const recipe = await getRecipeByIdService(recipeId);
        return reply.status(200).send(recipe);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}

export async function update(request: FastifyRequest, reply:FastifyReply) {
    try {
        const recipeId = (request.params as Record<string, string>).id as string;
        if (!recipeId) {
            return reply.status(400).send({ message: 'Recipe ID is required' });
        }
        const recipe = await getRecipeByIdService(recipeId);
        return reply.status(200).send(recipe);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}

export async function create(request: FastifyRequest, reply:FastifyReply) {
    try {
        const user = await createRecipeService(request.body as RecipeInput)
        return reply.status(201).send(user);
    } catch (error) {
        if (error instanceof Error && error.message.includes('email')) {
            return reply.status(409).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}