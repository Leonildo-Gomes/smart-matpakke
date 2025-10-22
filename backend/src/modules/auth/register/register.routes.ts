import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import * as controller from './register.controller';
import { errorResponseSchema, registerResponseSchema, registerSchema } from './register.schema';
export async function authRoutes(app: FastifyInstance) {

    const typedApp = app.withTypeProvider<ZodTypeProvider>();
    
    typedApp.post(
        '/register', {
            schema:{
                summary: 'Register a user',
                tags: ['auth'],
                body: registerSchema,
                response: {
                    201: registerResponseSchema,
                    409: errorResponseSchema,
                    500: errorResponseSchema
                }
            }
        },
        controller.create
    ); 
}