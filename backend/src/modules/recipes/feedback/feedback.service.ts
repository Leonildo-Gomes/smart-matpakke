
import prismaClient from "../../../prisma";
import { FeedbackInput, RemoveFeedbackInput } from "./feedback.schema";



export async function createFeedbackService(data: FeedbackInput) {
    const feedback = await prismaClient.recipeFeedback.create({
        data: {
            rating: data.rating,
            comment: data.comment ?? null,
            recipeId: data.recipeId,
            userId: data.userId,
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

export async function deleteFeedback(data: RemoveFeedbackInput) {
    const feedbacks = await prismaClient.recipeFeedback.deleteMany({
        where: {
            id: data.feedbackId,
            userId: data.userId,
        },    
    });
    return feedbacks;
}