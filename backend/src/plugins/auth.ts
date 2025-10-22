import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from 'fastify-plugin';


// plugins/auth.js
async function authPlugin(fastify: FastifyInstance, options: any) {
  fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
    try {// Log request headers
      await request.jwtVerify(); // Verifica o token
    } catch (err) {
        reply.code(401).send({ message: 'Invalid token' });
    }
  });
}
export default fp(authPlugin);
