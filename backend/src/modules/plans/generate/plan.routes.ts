import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as controller from './plan.controller';
import { PlanOutputSchema } from './plan.output.schema';
import { errorResponseSchema, generatePlanSchema } from './plan.schema';
export const planRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const typedApp = fastify.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    '/generate',{
      schema: {
        summary: 'Generate a plan',
        tags: ['generate'],
        body: generatePlanSchema,
        response: {
          200: PlanOutputSchema, // Alterado para um array de PlanOutputSchema,
          500: errorResponseSchema
        }
      },
    },
    controller.generatePlan
  );
  
}

