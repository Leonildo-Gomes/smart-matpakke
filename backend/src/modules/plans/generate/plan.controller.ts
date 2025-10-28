
import { FastifyReply, FastifyRequest } from 'fastify';
import { generatePlanService } from './plan.generation.service';
import { generatePlanSchema } from './plan.schema';





export async function generatePlan(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await generatePlanService(request.body as generatePlanSchema);
      return reply.status(200).send(result);
    } catch (error) {
      console.error('Error generating plan:', error);
      return reply.status(500).send({ message: 'Failed to generate plan' });
    }
  }