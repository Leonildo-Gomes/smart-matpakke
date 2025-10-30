import { FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { CustomError } from "../../../lib/errors/custom.errors";
import { FeedbackInput, recipeIdFeedbackIdParamSchema, recipeIdParamSchema } from "./feedback.schema"; // Remove RemoveFeedbackInput
import { createFeedbackService, deleteFeedback, getFeedbackById, getFeedbacksByRecipe, updateFeedback } from "./feedback.service"; // Adiciona novas funções de serviço

// Tipagem para request com user autenticado


export async function create(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { recipeId } = request.params as z.infer<typeof recipeIdParamSchema>;
        const decodedUser = request.user as JwtPayload;
        if (!decodedUser|| typeof decodedUser.userId !== 'string') {
             throw new CustomError('Invalid token payload or unauthenticated user', 401);
        } // Obtém userId do token de autenticação

        

        const feedback = await createFeedbackService(recipeId, decodedUser.userId, request.body as FeedbackInput);
        return reply.status(201).send(feedback);
    } catch (error) {
        // Esta verificação de 'email' pode não ser mais relevante aqui, pode ser removida ou ajustada
        if (error instanceof Error ) {
            return reply.status(409).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error' });
    }
}

export async function get(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { recipeId } = request.params as z.infer<typeof recipeIdParamSchema>;
        const feedbacks = await getFeedbacksByRecipe(recipeId);
        return reply.status(200).send(feedbacks);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { recipeId, feedbackId } = request.params as z.infer<typeof recipeIdFeedbackIdParamSchema>;
        const feedback = await getFeedbackById(recipeId, feedbackId);

        if (!feedback) {
            return reply.status(404).send({ message: 'Feedback not found' });
        }
        return reply.status(200).send(feedback);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { recipeId, feedbackId } = request.params as z.infer<typeof recipeIdFeedbackIdParamSchema>;
        const decodedUser = request.user as JwtPayload;
        if (!decodedUser|| typeof decodedUser.userId !== 'string') {
             throw new CustomError('Invalid token payload or unauthenticated user', 401);
        }


        const updatedFeedback = await updateFeedback(recipeId, feedbackId, decodedUser.userId, request.body as Partial<FeedbackInput>);
        return reply.status(200).send(updatedFeedback);
    } catch (error) {
        if (error instanceof Error && error.message.includes('Feedback not found or user not authorized')) {
            return reply.status(403).send({ message: error.message }); // Forbidden
        }
        return reply.status(500).send({ message: 'Internal server error' });
    }
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { recipeId, feedbackId } = request.params as z.infer<typeof recipeIdFeedbackIdParamSchema>;
         const decodedUser = request.user as JwtPayload;
        if (!decodedUser|| typeof decodedUser.userId !== 'string') {
             throw new CustomError('Invalid token payload or unauthenticated user', 401);
        }
        

        await deleteFeedback(recipeId, feedbackId, decodedUser.userId);
        return reply.status(204).send(); // No Content
    } catch (error) {
        if (error instanceof Error && error.message.includes('Feedback not found or user not authorized')) {
            return reply.status(403).send({ message: error.message }); // Forbidden
        }
        return reply.status(500).send({ message: 'Internal server error' });
    }
}