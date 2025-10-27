import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import * as controller from './weekly-plan.controller';
import { createWeeklyPlanSchema, errorResponseSchema, updateWeeklyPlanSchema, weeklyPlanParamsSchema, weeklyPlanResponseSchema } from "./weekly-plan.schema";


export async function weeklyPlanRoutes(fastify: FastifyInstance) {
    const typedApp = fastify.withTypeProvider<ZodTypeProvider>();
    
    typedApp.post(
        '/weekly-plans', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Create a new weekly plan',
                tags: ['weekly-plans'],
                body: createWeeklyPlanSchema,
                response: {
                    201: weeklyPlanResponseSchema,
                    409: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.create
    );

    typedApp.put(
        '/weekly-plans/:id',
        {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Update a weekly plan by ID',
                tags: ['weekly-plans'],
                params: weeklyPlanParamsSchema,
                body: updateWeeklyPlanSchema,
                response: {
                    200: weeklyPlanResponseSchema,
                    500: errorResponseSchema,
                },
            },
        },
        controller.update
    );

    typedApp.delete(
        '/weekly-plans/:id',
        {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Delete a weekly plan by ID',
                tags: ['weekly-plans'],
                params: weeklyPlanParamsSchema,
                response: {
                    204: z.null(),
                    500: errorResponseSchema,
                },
            },
        },
        controller.remove
    );

    typedApp.get(
        '/weekly-plans/:id', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: 'Get a weekly plan by ID',
                tags: ['weekly-plans'],
                params: {
                    id: {
                        type: 'string',
                        description: 'The ID of the recipe to retrieve',
                    }
                },
                response: {
                    200: weeklyPlanResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.getById
    );
}