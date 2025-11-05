
import { z } from 'zod';
import { Gender } from '../../generated/prisma';

export const meSchema = z.object({
    name: z.string(),
    dateOfBirth: z.date().nullable(),
    gender: z.enum(Gender).nullable(),
    photoUrl: z.string().nullable(),
    
})

 export const errorResponseSchema = z.object({
    message: z.string(),
  });

  export const meResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string(),
    familyMemberId: z.string().uuid().nullable(),
    name: z.string(),
    dateOfBirth: z.date().nullable(),
    gender: z.enum(Gender).nullable(),
    photoUrl: z.string().nullable(),
    familyId: z.string().uuid().nullable(),
  });

export type MeInput = z.infer<typeof meSchema>

