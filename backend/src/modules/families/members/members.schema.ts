import { z } from 'zod';
import { Gender } from '../../../generated/prisma/client';

export const familyMemberSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(Gender).optional(),
});

export type FamilyMemberInput = z.infer<typeof familyMemberSchema>;

export const updateFamilyMemberSchema = familyMemberSchema.partial();

export const familyMemberParamsSchema = z.object({
  familyId: z.string().uuid(),
  memberId: z.string().uuid(),
});

export const familyMemberResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    dateOfBirth: z.date().nullable(),
    gender: z.enum(Gender).nullable(),
});

export const errorResponseSchema = z.object({
  message: z.string().nonempty(),
});
