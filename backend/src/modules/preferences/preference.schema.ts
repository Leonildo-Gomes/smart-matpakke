import { PreferenceType } from '../../generated/prisma/client';

import { z } from 'zod';


export const preferenceSchema = z.object({
  type: z.enum(PreferenceType),
  value: z.string(),
});

export type PreferenceInput = z.infer<typeof preferenceSchema>;

export const errorResponseSchema = z.object({
  message: z.string(),
});

export const preferenceResponseSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(PreferenceType),
  value: z.string(),
});