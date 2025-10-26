
import { z } from 'zod';


export const feedbackSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    recipeId: z.string().uuid(),
    userId: z.string().uuid(),
});

export const feedbackResponseSchema = z.object({
    id: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    recipeId: z.string().uuid(),
    userId: z.string().uuid(),
})


export const removeFeedbackSchema = z.object({
    userId: z.string().uuid(),
    feedbackId: z.string().uuid(),
})


export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;
export type RemoveFeedbackInput = z.infer<typeof removeFeedbackSchema>;