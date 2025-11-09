import { z } from 'zod';

export const updateMePreferencesSchema = z.object({
    preferenceIds: z.array(z.string().uuid()),
});

export const errorResponseSchema = z.object({
    message: z.string(),
});
