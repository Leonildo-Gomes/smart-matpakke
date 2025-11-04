import { FastifyReply, FastifyRequest } from 'fastify';
import { generatePlanService, saveGeneratedPlanService } from './plan.generation.service';
import { PlanOutput } from './plan.output.schema';
import { generatePlanSchema } from './plan.schema';
export async function generatePlan(request: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await generatePlanService(request.body as generatePlanSchema);
    const response = await reply.status(200).send(result);
    return response;
  } catch (error) {
    console.error('Error generating plan:', error);
    return reply.status(500).send({ message: 'Failed to generate plan' });
  }
}


export async function savePlan(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (request.user as { userId: string }).userId;
    const result = await saveGeneratedPlanService(userId, request.body as PlanOutput);
    return reply.status(200).send(result);;
  } catch (error) {
    console.error('Error generating plan:', error);
    return reply.status(500).send({ message: 'Internal server error while saving the plan.' });
  }
}