import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as controller from './plan.controller';
import { errorResponseSchema, generatePlanSchema, SavePlanSchema, WeeklyPlanResponseSchema } from './plan.schema';

export const planRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const typedApp = fastify.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/generate',{
      schema: {
        summary: 'Generate a plan',
        tags: ['generate'],
        body: generatePlanSchema,
        response: {
          200: SavePlanSchema, // Alterado para um array de PlanOutputSchema,
          500: errorResponseSchema
        }
      },
    },
    controller.generatePlan
  );

  fastify.post(
    '/plans/save',
    {
      //preHandler: [typedApp.authenticate],
      schema: {
        summary: 'Saves a generated weekly plan',
        tags: ['plans'],
        body: SavePlanSchema,
        response: {
          201: WeeklyPlanResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    controller.savePlan
  );
}

