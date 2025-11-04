import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";
import * as controller from './family.controller';
import { errorResponseSchema, familyResponseSchema, familySchema } from "./family.schema";



export async function familyRoutes(app: FastifyInstance) {
    const typedApp = app.withTypeProvider<ZodTypeProvider>(); 

    typedApp.post(
        '/families', {
            schema: {
                summary: 'Create a new family',
                tags: ['families'],
                body: familySchema,
                response: {
                    200: familyResponseSchema,
                    401: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.create
    );

    typedApp.get(
        '/families/:id', {
            schema: {
                summary: 'Get a family by ID',
                tags: ['families'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the family to retrieve',
                    }
                },
                response: {
                    200: familyResponseSchema,
                    401: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.getById
    );

    typedApp.get(
        '/families', {
            schema: {
                summary: 'Get all families',
                tags: ['families'],
                response: {
                    200: z.array(familyResponseSchema),
                    401: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.getAll
    );

    typedApp.delete(
        '/families/:id', {
            schema: {
                summary: 'Delete a family by ID',
                tags: ['families'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the family to delete',
                    }
                },
                response: {
                    200: familyResponseSchema,
                    401: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.remove
    );

    typedApp.put(
        '/families/:id', {
            schema: {
                summary: 'Update a family by ID',
                tags: ['families'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the family to update',
                    }
                },
                body: familySchema,
                response: {
                    200: familyResponseSchema,
                    401: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.update
    );
}