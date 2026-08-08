import { z } from 'zod';

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
});

export const healthResponseSchema = z.object({
  status: z.string(),
});

export const readyResponseSchema = z.object({
  status: z.string(),
  database: z.string(),
});
