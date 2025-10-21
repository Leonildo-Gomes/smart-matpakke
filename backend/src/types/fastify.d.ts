import 'fastify';
import { JwtPayload as JsonwebtokenJwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    // @fastify/jwt adiciona o payload decodificado a request.user por padrão
    user?: JsonwebtokenJwtPayload & { userId: string; name: string; email: string; };
    // O método jwtVerify também é adicionado a request
    jwtVerify: <T = JsonwebtokenJwtPayload & { userId: string; name: string; email: string; }>(options?: VerifyOptions) => Promise<T>;
  }

  interface FastifyReply {
    jwtSign: <T extends object = JsonwebtokenJwtPayload & { userId: string; name: string; email: string; }>(payload: T, options?: SignOptions) => Promise<string>;
  }

  interface FastifyInstance {
    jwtVerify: <T = JsonwebtokenJwtPayload & { userId: string; name: string; email: string; }>(request: FastifyRequest, options?: VerifyOptions) => Promise<T>;
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
    name: string;
    email: string;
  }
}