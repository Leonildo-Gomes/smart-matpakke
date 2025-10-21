import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { JwtPayload } from 'jsonwebtoken';
import { CustomError } from '../../lib/errors/custom.errors'; // For error handling
import { errorResponseSchema, LoginErrorStatusCode } from '../auth/login/login.schema'; // Reusing error schema
import { userProfileResponseSchema } from './user.schema';
import { getUserProfile } from './user.service';

export async function userRoutes(app: FastifyInstance) {

    const typedApp = app.withTypeProvider<ZodTypeProvider>();

    typedApp.get(
        '/me', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: "Returns the authenticated user's data",
                tags: ['users'],
                response: {
                    200: userProfileResponseSchema,
                    401: errorResponseSchema, // Reusing error schema
                    404: errorResponseSchema, // For user not found
                    500: errorResponseSchema, // Generic server error
                }
            }
        },
        async (request, reply) => {
            try {
                // @fastify/jwt adds the decoded payload to request.user or request.jwt.payload
                // The default is request.user, but it's better to be explicit.
                // We need to ensure the payload has userId.
                 const decodedUser = request.user as JwtPayload;
                if (!decodedUser|| typeof decodedUser.userId !== 'string') {
                    throw new CustomError('Payload do token inválido ou utilizador não autenticado', 401);
                }

                const user = await getUserProfile(decodedUser.userId);
                return reply.status(200).send(user);
            } catch (error) {
                console.error('Error in GET /users/me:', error);
                if (error instanceof CustomError) {
                    return reply.status(error.statusCode as LoginErrorStatusCode).send({ message: error.message });
                }
                return reply.status(500).send({ message: 'Ocorreu um erro inesperado' });
            }
        }
    );
}