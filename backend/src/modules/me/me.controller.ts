 import { FastifyReply, FastifyRequest } from "fastify";
import { MeInput } from "./me.schema";
import { getUserAcountService, updateFamilyMemberService } from "./me.service";


 export async function get(request: FastifyRequest, reply:FastifyReply) {
    try {
        const { userId } = request.user as { userId: string };
        const userAcount = await getUserAcountService(userId);
        return reply.status(200).send(userAcount);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
}  

export async function update(request: FastifyRequest, reply:FastifyReply) {
    try {
        const { userId } = request.user as { userId: string };
        const userAcount = await updateFamilyMemberService(userId, request.body as MeInput);
        return reply.status(200).send(userAcount);
    } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' });
    }
}