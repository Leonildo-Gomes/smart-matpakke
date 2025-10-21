import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";


// plugins/auth.js
async function authPlugin(fastify: FastifyInstance, options: any) {
  fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify(); // Verifica o token
    } catch (err) {
      reply.code(401).send({ error: 'Token inválido ou ausente' });
    }
  });
}
export default authPlugin;
