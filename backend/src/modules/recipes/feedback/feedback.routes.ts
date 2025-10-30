
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import * as controller from './feedback.controller';
import { errorResponseSchema, feedbackResponseSchema, feedbackSchema, recipeIdParamSchema, recipeIdFeedbackIdParamSchema } from './feedback.schema';

export async function feedbackRoutes(fastify: FastifyInstance) {
    const typedApp = fastify.withTypeProvider<ZodTypeProvider>();

    // POST /recipes/:recipeId/feedback
    typedApp.post(
        '/recipes/:recipeId/feedback', {
            preHandler: [fastify.authenticate],
            schema: {
                summary: 'Create a new feedback for a recipe',
                tags: ['feedbacks'],
                params: recipeIdParamSchema, // Valida recipeId do path
                body: feedbackSchema, // recipeId e userId vêm do path/token
                response: {
                    201: feedbackResponseSchema,
                    409: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.create
    );

    // GET /recipes/:recipeId/feedback
    typedApp.get(
        '/recipes/:recipeId/feedback', {
            schema: {
                summary: 'Get all feedbacks for a specific recipe',
                tags: ['feedbacks'],
                params: recipeIdParamSchema, // Valida recipeId do path
                response: {
                    200: z.array(feedbackResponseSchema),
                    500: errorResponseSchema
                }
            }
        },
        controller.get
    );

    // GET /recipes/:recipeId/feedback/:feedbackId
    typedApp.get(
        '/recipes/:recipeId/feedback/:feedbackId', {
            schema: {
                summary: 'Get a specific feedback for a recipe',
                tags: ['feedbacks'],
                params: recipeIdFeedbackIdParamSchema, // Valida recipeId e feedbackId do path
                response: {
                    200: feedbackResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.getById // Assumindo que haverá um controller.getById
    );

    // PUT /recipes/:recipeId/feedback/:feedbackId
    typedApp.put(
        '/recipes/:recipeId/feedback/:feedbackId', {
            preHandler: [fastify.authenticate],
            schema: {
                summary: 'Update a specific feedback for a recipe',
                tags: ['feedbacks'],
                params: recipeIdFeedbackIdParamSchema, // Valida recipeId e feedbackId do path
                body: feedbackSchema.partial(), // recipeId e userId vêm do path/token, body é parcial
                response: {
                    200: feedbackResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.update // Assumindo que haverá um controller.update
    );

    // DELETE /recipes/:recipeId/feedback/:feedbackId
    typedApp.delete(
        '/recipes/:recipeId/feedback/:feedbackId', {
            preHandler: [fastify.authenticate],
            schema: {
                summary: 'Delete a specific feedback for a recipe',
                tags: ['feedbacks'],
                params: recipeIdFeedbackIdParamSchema, // Valida recipeId e feedbackId do path
                response: {
                    204: z.void(), // No Content
                    500: errorResponseSchema
                }
            }
        },
        controller.remove
    );
}