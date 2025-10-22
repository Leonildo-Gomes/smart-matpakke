import { z } from 'zod';
import { Gender } from '../../generated/prisma/client';
export const userProfileResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string(),
    dateOfBirth: z.date().nullable(),
    familyId: z.string().uuid().nullable(),
});

export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;


export const updateUserProfileSchema = z.object({
    name: z.string().optional(),
    dateOfBirth: z.coerce.date().nullable().optional(),
    gender: z.enum(Gender).optional(),
    photoUrl: z.string().optional(),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;

export const errorResponseSchema = z.object({
  message: z.string(),
});