
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
        message: 'Invalid email address',
    }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginInput = z.infer<typeof loginSchema>;


export const loginResponseSchema = z.object({
    accessToken: z.string(),
});


// Novo schema Zod para respostas de erro
export const errorResponseSchema = z.object({
  message: z.string(),
});

export type LoginErrorStatusCode = 401 | 500;