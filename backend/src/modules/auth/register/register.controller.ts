import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterInput } from "./register.schema";
import { registerService } from "./register.service";


export async function create(request: FastifyRequest<{Body: RegisterInput}>, reply:FastifyReply) {
    try {
        const user = await registerService(request.body)
        return reply.status(201).send(user);
    } catch (error) {
        if (error instanceof Error && error.message.includes('email')) {
            return reply.status(409).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error' });  
    }
}