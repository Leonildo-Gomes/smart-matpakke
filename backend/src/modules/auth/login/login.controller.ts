import { FastifyReply, FastifyRequest } from "fastify";
import { CustomError } from "../../../lib/errors/custom.errors";
import { LoginErrorStatusCode, LoginInput } from "./login.schema";
import { loginService } from "./login.service";



export async function login (request: FastifyRequest<{Body: LoginInput}>, reply:FastifyReply) {
   try {
        const user = await loginService(request.body)
        let accessToken;
        try {
            accessToken = await reply.jwtSign({
                userId: user.userId,
                name: user.name,
                email: user.email
            });
        } catch (jwtError) {
            console.error('Error during jwtSign:', jwtError);
            throw new CustomError('Failed to generate access token', 500);
        }
        
        return reply.status(200).send({ accessToken });
    } catch (error) {
        
        if (error instanceof CustomError || (error instanceof Error && error.name === 'InvalidCredentialsError')) {
            const statusCode = (error instanceof CustomError) ? error.statusCode : 401;
            return reply.status(statusCode as LoginErrorStatusCode).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error' });
    }
}