import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { errorResponseSchema } from '../auth/login/login.schema'; // Reusing error schema
import * as controller from './user.controller';
import { updateUserProfileSchema, userProfileResponseSchema } from './user.schema';
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
        controller.getMe
    );

    typedApp.put(
        '/me', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: "Updates the authenticated user's data",
                tags: ['users'],
                body: updateUserProfileSchema,
                response: {
                    200: userProfileResponseSchema,
                    401: errorResponseSchema, // Reusing error schema
                    404: errorResponseSchema, // For user not found
                    500: errorResponseSchema, // Generic server error
                }
            }
        },
        controller.putMe
    );
}