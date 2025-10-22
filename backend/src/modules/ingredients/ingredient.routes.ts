import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import * as controller from './ingredient.controller';
import { errorResponseSchema, ingredientResponseSchema, ingredientSchema } from "./ingredient.schema";


export async function ingredientRoutes(app: FastifyInstance) {
     const typedApp = app.withTypeProvider<ZodTypeProvider>();

    typedApp.get(
        '/ingredients', {
            schema: {
                summary: 'Get all ingredients',
                tags: ['ingredients'],
                response: {
                    200: z.array(ingredientResponseSchema),
                    500: errorResponseSchema
                }
            }
        },
        controller.getAll
    );

    typedApp.get(
        '/ingredients/:id', {
            schema: {
                summary: 'Get an ingredient by ID',
                tags: ['ingredients'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the ingredient to retrieve',
                    }
                },
                response: {
                    200: ingredientResponseSchema,
                    400: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.getById
    );

    typedApp.put(
        '/ingredients/:id', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Update an ingredient by ID',
                tags: ['ingredients'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the ingredient to update',
                    }
                },
                body: z.object({
                    name: z.string().optional(),
                    description: z.string().optional(),
                    image: z.string().optional(),
                    category: z.string().optional(),
                }),
                response: {
                    200: ingredientResponseSchema,
                    400: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.update    
    );

    typedApp.post(
        '/ingredients', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Create a new ingredient',
                tags: ['ingredients'],
                body:ingredientSchema,
                response: {
                    201: ingredientResponseSchema,
                    409: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.create
    );

    typedApp.delete(
        '/ingredients/:id', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Delete an ingredient by ID',
                tags: ['ingredients'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the ingredient to delete',
                    }
                },
                response: {
                    200: z.object({
                        message: z.string(),
                    }),
                    400: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.remove
    );
}