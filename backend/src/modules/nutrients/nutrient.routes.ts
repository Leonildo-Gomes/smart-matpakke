import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import * as controller from './nutrient.controller';
import { errorResponseSchema, nutrientResponseSchema, nutrientSchema } from "./nutrient.schema";


export async function nutrientRoutes(fastify: FastifyInstance) {
    const typedApp = fastify.withTypeProvider<ZodTypeProvider>();

    typedApp.get(
        '/nutrients', {
            schema: {
                summary: 'Get all nutrients',
                tags: ['nutrients'],
                response: {
                    200: z.array(nutrientResponseSchema),
                    500: errorResponseSchema
                }
            }
        },
        controller.getAll
    );

    typedApp.get(
        '/nutrients/:id', {
            schema: {
                summary: 'Get a nutrient by ID',
                tags: ['nutrients'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the nutrient to retrieve',
                    }
                },
                response: {
                    200: nutrientResponseSchema,
                    400: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.getById
    );

    typedApp.post(
        '/nutrients', {
            schema: {
                summary: 'Create a nutrient',
                tags: ['nutrients'],
                body: nutrientSchema,
                response: {
                    201: nutrientResponseSchema,
                    400: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.create
    );

    typedApp.put(
        '/nutrients/:id', {
            schema: {
                summary: 'Update a nutrient by ID',
                tags: ['nutrients'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the nutrient to update',
                    }
                },
                body: nutrientResponseSchema,
                response: {
                    200: nutrientResponseSchema,
                    400: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.update
    );

    typedApp.delete(
        '/nutrients/:id', {
            schema: {
                summary: 'Delete a nutrient by ID',
                tags: ['nutrients'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the nutrient to delete',
                    }
                },
                response: {
                    200: nutrientResponseSchema,
                    400: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.remove
    );
}
               