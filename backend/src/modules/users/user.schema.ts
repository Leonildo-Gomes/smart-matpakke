import { z } from 'zod';
import { Gender } from '../../generated/prisma/client';

const familyMenberSchema = z.object({
    id: z.string().uuid({ message: 'Invalid family member ID' }),
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    dateOfBirth: z.coerce.date().nullable(),
    gender: z.enum(Gender).nullable(),
    photoUrl: z.string().nullable(),
});
export const userProfileResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string(),
    familyMember: familyMenberSchema.nullable(),
    
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