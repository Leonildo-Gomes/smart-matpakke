import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import * as controller from './recipe.controller';
import { createRecipeSchema, errorResponseSchema, recipeResponseSchema } from "./recipe.schema";
export async function recipeRoutes(fastify: FastifyInstance) {
    const typedApp = fastify.withTypeProvider<ZodTypeProvider>();

    typedApp.post(
        '/recipes', {
            preHandler: [fastify.authenticate],
            schema: {
                summary: 'Create a new recipe',
                tags: ['recipes'],
                body: createRecipeSchema,
                response: {
                    201: recipeResponseSchema,
                    409: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.create
    );

    typedApp.get(
        '/recipes', {
            preHandler: [fastify.authenticate],
            schema: {
                summary: 'Get all recipes',
                tags: ['recipes'],
                response: {
                    200: z.array(recipeResponseSchema),
                    500: errorResponseSchema
                }
            }
        },
        controller.getAll
    );

    typedApp.get(
        '/recipes/:id', {
            preHandler: [fastify.authenticate],
            schema: {
                summary: 'Get a recipe by ID',
                tags: ['recipes'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the recipe to retrieve',
                    }
                },
                response: {
                    200: recipeResponseSchema,
                    404: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.getById
    );

    typedApp.put(
        '/recipes/:id', {
            preHandler: [fastify.authenticate],
            schema: {
                summary: 'Update a recipe by ID',
                tags: ['recipes'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the recipe to update',
                    }
                },
                response: {
                    200: recipeResponseSchema,
                    404: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.update
    );

    typedApp.delete(
        '/recipes/:id', {
            preHandler: [fastify.authenticate],
            schema: {
                summary: 'Delete a recipe by ID',
                tags: ['recipes'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the recipe to delete',
                    }
                },
                response: {
                    200: recipeResponseSchema,
                    404: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.remove
    );
    
}