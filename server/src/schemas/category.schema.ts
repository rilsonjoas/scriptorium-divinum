import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  bookCount: z.number(),
});

export type Category = z.infer<typeof categorySchema>;
