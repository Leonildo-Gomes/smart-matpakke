import { FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../../lib/errors/custom.errors";
import { LoginErrorStatusCode } from "../auth/login/login.schema";
import { UpdateUserProfileInput } from "./user.schema";
import { getUserProfile, updateUserProfile } from "./user.service";


export async function getMe(request: FastifyRequest, reply:FastifyReply) {
    try {
        // @fastify/jwt adds the decoded payload to request.user or request.jwt.payload
        // The default is request.user, but it's better to be explicit.
        // We need to ensure the payload has userId.
        const decodedUser = request.user as JwtPayload;
        
        if (!decodedUser|| typeof decodedUser.userId !== 'string') {
            throw new CustomError('Invalid token payload or unauthenticated user', 401);
        }
        const user = await getUserProfile(decodedUser.userId);
        return reply.status(200).send(user);
    } catch (error) {
        console.error('Error in GET /users/me:', error);
        if (error instanceof CustomError) {
            return reply.status(error.statusCode as LoginErrorStatusCode).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error' });
    }
}



export async function putMe(request: FastifyRequest, reply:FastifyReply) {
    try {
        // @fastify/jwt adds the decoded payload to request.user or request.jwt.payload
        // The default is request.user, but it's better to be explicit.
        // We need to ensure the payload has userId.
        const decodedUser = request.user as JwtPayload;
        
        if (!decodedUser|| typeof decodedUser.userId !== 'string') {
            throw new CustomError('Invalid token payload or unauthenticated user', 401);
        }
        const user = await updateUserProfile(decodedUser.userId, request.body as UpdateUserProfileInput) ;
        return reply.status(200).send(user);
    } catch (error) {
        console.error('Error in GET /users/me:', error);
        if (error instanceof CustomError) {
            return reply.status(error.statusCode as LoginErrorStatusCode).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal server error' });
    }
}