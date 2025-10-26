import { FastifyReply, FastifyRequest } from "fastify";
import { FeedbackInput, RemoveFeedbackInput } from "./feedback.schema";
import { createFeedbackService, deleteFeedback, getFeedbacksByRecipe } from "./feedback.service";


export async function create(request: FastifyRequest, reply:FastifyReply) {
    try {
        const user = await createFeedbackService(request.body as FeedbackInput)
        return reply.status(201).send(user);
    } catch (error) {
        if (error instanceof Error && error.message.includes('email')) {
            return reply.status(409).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}


export async function get(request: FastifyRequest, reply:FastifyReply) {
    try {
        const recipeId = (request.params as Record<string, string>).id as string;
        if (!recipeId) {
            return reply.status(400).send({ message: 'Recipe ID is required' });
        }

        const recipes = await getFeedbacksByRecipe(recipeId);
        return reply.status(200).send(recipes);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
}

export async function remove(request: FastifyRequest, reply:FastifyReply) {
    try {
        
       
        const recipe = await deleteFeedback(request.body as RemoveFeedbackInput);
        return reply.status(200).send(recipe);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}