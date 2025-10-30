
import { CustomError } from "../../../lib/errors/custom.errors";
import prismaClient from "../../../prisma";
import { FeedbackInput } from "./feedback.schema"; // Remove RemoveFeedbackInput, pois não será mais usado diretamente

// Função para criar um novo feedback
export async function createFeedbackService(recipeId: string, userId: string, data: FeedbackInput) {
    const feedback = await prismaClient.recipeFeedback.create({
        data: {
            rating: data.rating,
            comment: data.comment ?? null,
            recipeId: recipeId, // recipeId vem do parâmetro da rota
            userId: userId,     // userId vem do token de autenticação
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            recipeId: true,
            userId: true,
        },
    });
    return feedback;
}

// Função para obter todos os feedbacks de uma receita
export async function getFeedbacksByRecipe(recipeId: string) {
    const feedbacks = await prismaClient.recipeFeedback.findMany({
        where: {
            recipeId: recipeId,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            recipeId: true,
            userId: true,
        },
    });
    return feedbacks;
}

// Função para obter um feedback específico por ID
export async function getFeedbackById(recipeId: string, feedbackId: string) {
    const feedback = await prismaClient.recipeFeedback.findUnique({
        where: {
            id: feedbackId,
            recipeId: recipeId, // Garante que o feedback pertence à receita
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            recipeId: true,
            userId: true,
        },
    });
    return feedback;
}

// Função para atualizar um feedback existente
export async function updateFeedback(recipeId: string, feedbackId: string, userId: string, data: Partial<FeedbackInput>) {
    // Verificar se o feedback existe e pertence ao usuário e à receita
    const existingFeedback = await prismaClient.recipeFeedback.findUnique({
        where: {
            id: feedbackId,
            recipeId: recipeId,
            userId: userId, // Apenas o autor pode atualizar
        },
    });

    if (!existingFeedback) {
        throw new CustomError('Feedback not found or user not authorized to update this feedback.', 403);
    }

    const updatedFeedback = await prismaClient.recipeFeedback.update({
        where: {
            id: feedbackId,
        },
        data: {
            ...(data.rating !== undefined && { rating: data.rating }),
            ...(data.comment !== undefined && { comment: data.comment }),
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            recipeId: true,
            userId: true,
        },
    });
    return updatedFeedback;
}

// Função para deletar um feedback
export async function deleteFeedback(recipeId: string, feedbackId: string, userId: string) {
    // Verificar se o feedback existe e pertence ao usuário e à receita
    const existingFeedback = await prismaClient.recipeFeedback.findUnique({
        where: {
            id: feedbackId,
            recipeId: recipeId,
            userId: userId, // Apenas o autor pode deletar
        },
    });

    if (!existingFeedback) {
        throw new Error('Feedback not found or user not authorized to delete this feedback.');
    }

    const deletedFeedback = await prismaClient.recipeFeedback.delete({
        where: {
            id: feedbackId,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            recipeId: true,
            userId: true,
        },
    });
    return deletedFeedback;
}