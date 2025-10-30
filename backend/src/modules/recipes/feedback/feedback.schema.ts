
import { z } from 'zod';


export const feedbackSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export const feedbackResponseSchema = z.object({
    id: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    recipeId: z.string().uuid(),
    userId: z.string().uuid(),
})

// Esquemas para parâmetros de rota
export const recipeIdParamSchema = z.object({
    recipeId: z.string().uuid(),
});

export const recipeIdFeedbackIdParamSchema = z.object({
    recipeId: z.string().uuid(),
    feedbackId: z.string().uuid(),
});

export const errorResponseSchema = z.object({
    message: z.string(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;
// removeFeedbackSchema não é mais necessário, pois os IDs virão dos parâmetros da rota
// export type RemoveFeedbackInput = z.infer<typeof removeFeedbackSchema>;