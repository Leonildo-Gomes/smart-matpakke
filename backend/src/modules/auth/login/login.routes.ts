import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CustomError } from '../../../lib/errors/custom.errors';
import { LoginErrorStatusCode, errorResponseSchema, loginResponseSchema, loginSchema } from './login.schema';
import { loginService } from './login.service';

import { z } from 'zod'; // Importar 'z' para usar z.infer

export async function loginRoutes(app: FastifyInstance) {

    const typedApp = app.withTypeProvider<ZodTypeProvider>();
    typedApp.post(
        '/login', {
            schema: {
                summary: 'Autentica um utilizador',
                tags: ['auth'],
                body: loginSchema,
                response: {
                    200: loginResponseSchema,
                    401: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },

        async (request, reply): Promise<z.infer<typeof loginResponseSchema>> => {
            try {
                const user = await loginService(request.body)
                
                const accessToken = await reply.jwtSign({
                    userId: user.userId,
                    name: user.name,
                    email: user.email   
                })
                return reply.status(200).send({ accessToken });
            } catch (error) {
                
                if (error instanceof CustomError || (error instanceof Error && error.name === 'InvalidCredentialsError')) {
                    const statusCode = (error instanceof CustomError) ? error.statusCode : 401;
                    return reply.status(statusCode as LoginErrorStatusCode).send({ message: error.message });
                }
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    )
    

}

