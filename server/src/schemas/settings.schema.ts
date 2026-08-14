import { z } from 'zod';

export const settingsSchema = z.object({
  siteName: z.string().min(1).max(255),
  siteDescription: z.string().min(1).max(2000),
  contactEmail: z.string().email().max(255),
  featuredBooksCount: z.number().int().min(3).max(12),
  booksPerPage: z.number().int().min(10).max(50),
  maintenanceMode: z.boolean(),
});

export const updateSettingsSchema = settingsSchema.partial();
