import { FastifyReply, FastifyRequest } from "fastify";
import { CreateWeeklyPlanInput, UpdateWeeklyPlanInput } from "./weekly-plan.schema";
import { createWeeklyPlanService, deleteWeeklyPlanService, getCurrentWeeklyPlanService, getWeeklyPlanService, updateWeeklyPlanService } from "./weekly-plan.service";

export async function create(request: FastifyRequest, reply: FastifyReply) {
   try {
        const { familyId } = request.user as { familyId: string | null };
        if (!familyId) {
            return reply.status(400).send({ message: 'User is not associated with a family.' });
        }
        const weeklyPlan = await createWeeklyPlanService(request.body as CreateWeeklyPlanInput, familyId)
        return reply.status(201).send(weeklyPlan);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
    try {
        const weeklyPlanId = (request.params as { id: string }).id;
        const { familyId } = request.user as { familyId: string | null };

        if (!familyId) {
            return reply.status(400).send({ message: 'User is not associated with a family.' });
        }

        const weeklyPlan = await updateWeeklyPlanService(weeklyPlanId, request.body as UpdateWeeklyPlanInput, familyId);
        return reply.status(200).send(weeklyPlan);
    } catch (error) {
        // Prisma will throw a P2025 error if the record to update is not found.
        // This can be handled more gracefully, but for now, a 500 is a safe default.
        return reply.status(500).send({ message: 'Internal server error' });
    }
}

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    try {
        const weeklyPlanId = (request.params as { id: string }).id;
        const { familyId } = request.user as { familyId: string | null };

        if (!familyId) {
            return reply.status(400).send({ message: 'User is not associated with a family.' });
        }

        await deleteWeeklyPlanService(weeklyPlanId, familyId);
        return reply.status(204).send();
    } catch (error) {
        // Prisma will throw a P2025 error if the record to delete is not found.
        // This can be handled more gracefully, but for now, a 500 is a safe default.
        return reply.status(500).send({ message: 'Internal server error' });
    }
}

export async function getCurrent(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { familyId } = request.user as { familyId: string | null };
        if (!familyId) {
            return reply.status(400).send({ message: 'User is not associated with a family.' });
        }
        const weeklyPlan = await getCurrentWeeklyPlanService(familyId);
        return reply.status(200).send(weeklyPlan);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
    try {
        const weeklyPlanId = (request.params as { id: string }).id;
        const { familyId } = request.user as { familyId: string | null };

        if (!familyId) {
            return reply.status(400).send({ message: 'User is not associated with a family.' });
        }

        const weeklyPlan = await getWeeklyPlanService(weeklyPlanId, familyId);

        if (!weeklyPlan) {
            return reply.status(404).send({ message: 'Weekly plan not found.' });
        }

        return reply.status(200).send(weeklyPlan);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
}