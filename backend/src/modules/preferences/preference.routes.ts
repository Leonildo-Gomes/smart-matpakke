import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import * as controller from './preference.controller';
import { errorResponseSchema, preferenceResponseSchema, preferenceSchema } from "./preference.schema";
export async function preferenceRoutes(app: FastifyInstance) {
    const typedApp = app.withTypeProvider<ZodTypeProvider>();

    typedApp.get(
        '/preferences', {
            schema: {
                summary: 'Get all preferences',
                tags: ['preferences'],
                response: {
                    200: z.array(preferenceResponseSchema),
                    500: errorResponseSchema
                }
            }
        },
        controller.getAll
    );

    typedApp.get(
        '/preferences/:id', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Get a preference by ID',
                tags: ['preferences'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the preference to retrieve',
                    }
                },
                response: {
                    200: preferenceResponseSchema,
                    404: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.getById
    );

    typedApp.post(
        '/preferences', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Create a new preference',
                tags: ['preferences'],
                body: preferenceSchema,
                response: {
                    201: preferenceResponseSchema,
                    409: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.create
    );

    typedApp.put(
        '/preferences/:id', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Update a preference',
                tags: ['preferences'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the preference to update',
                    }
                },
                body: preferenceSchema,
                response: {
                    200: preferenceResponseSchema,
                    404: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.update
    );
}