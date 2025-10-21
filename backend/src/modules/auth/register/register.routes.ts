import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerResponseSchema, registerSchema } from './register.schema';
import { registerService } from './register.service';

export async function authRoutes(app: FastifyInstance) {

    const typedApp = app.withTypeProvider<ZodTypeProvider>();
    
    typedApp.post(
        '/register', {
            schema: {
                summary: 'Register a new user',
                tags: ['auth'],
                body: registerSchema,
                response: {
                    201: registerResponseSchema,
                    500: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' }
                        }
                    },
                    409: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
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
    ); 
}