import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as controller from './me.controller';
import { errorResponseSchema, meResponseSchema, meSchema } from "./me.schema";


export async function meRoutes(app: FastifyInstance) {

    const typedApp= app.withTypeProvider<ZodTypeProvider>();
    typedApp.put(
        '/me', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: "Updates the authenticated user's data",
                tags: ['users'],
                body: meSchema,
                response: {
                    200: meResponseSchema,
                    401: errorResponseSchema, // Reusing error schema
                    404: errorResponseSchema, // For user not found
                    500: errorResponseSchema, // Generic server error
                }
            }
        },
        controller.update
    );

    typedApp.get(
        '/me', {
            preHandler: [typedApp.authenticate],
            schema: {
                summary: "Returns the authenticated user's data",
                tags: ['users'],
                response: {
                    200: meResponseSchema,
                    401: errorResponseSchema, // Reusing error schema
                    404: errorResponseSchema, // For user not found
                    500: errorResponseSchema, // Generic server error
                }
            }
        },
        controller.get
    );
   
}