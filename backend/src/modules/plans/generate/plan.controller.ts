import { FastifyReply, FastifyRequest } from 'fastify';
import { generatePlanService, saveGeneratedPlanService } from './plan.generation.service';

import { generatePlanSchema, SavePlanSchema } from './plan.schema';
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
    // 1. Validate the request body
    //console.log('bodu',request.body);
    const parsedBody = SavePlanSchema.safeParse(request.body);
    console
    if (!parsedBody.success) {
      //console.error('Invalid request body:', parsedBody.error.flatten);
      return reply.status(400).send({ message: 'Invalid request body', errors: parsedBody.error.flatten() });
    }
    const { familyMemberId, ...plan } = parsedBody.data;

  
    // 4. Call the service with the correct parameters
    const result = await saveGeneratedPlanService(familyMemberId, plan);
    return reply.status(200).send(result);

  } catch (error) {
    console.error('Error saving plan:', error);
    return reply.status(500).send({ message: 'Internal server error while saving the plan.' });
  }
}