
import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    email: z.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
        message: 'Invalid email address',
    }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;


export const registerResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
});
export const errorResponseSchema = z.object({
  message: z.string(),
});



