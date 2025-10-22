import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import * as controller from './login.controller';
import { errorResponseSchema, loginResponseSchema, loginSchema } from './login.schema';

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
        controller.login
    );
}

