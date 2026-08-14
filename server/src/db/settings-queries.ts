import { eq } from 'drizzle-orm';
import { db } from './client.js';
import { siteSettings } from './schema.js';

export const DEFAULT_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

type SiteSettingsRow = typeof siteSettings.$inferSelect;
type SettingsFields = Omit<SiteSettingsRow, 'id' | 'updatedAt'>;
type SettingsInput = { [K in keyof SettingsFields]?: SettingsFields[K] | undefined };

export interface SiteSettingsPublic {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  featuredBooksCount: number;
  booksPerPage: number;
  maintenanceMode: boolean;
}

function toPublic(row: SiteSettingsRow): SiteSettingsPublic {
  return {
    siteName: row.siteName,
    siteDescription: row.siteDescription,
    contactEmail: row.contactEmail,
    featuredBooksCount: row.featuredBooksCount,
    booksPerPage: row.booksPerPage,
    maintenanceMode: row.maintenanceMode,
  };
}

// Cache curto em memória: a leitura é feita em praticamente todo request público
let cached: SiteSettingsRow | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 10_000;

export async function getSettings(): Promise<SiteSettingsPublic> {
  if (cached && Date.now() - cachedAt < CACHE_TTL_MS) {
    return toPublic(cached);
  }
  let [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, DEFAULT_SETTINGS_ID))
    .limit(1);
  if (!row) {
    await db.insert(siteSettings).values({ id: DEFAULT_SETTINGS_ID });
    [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, DEFAULT_SETTINGS_ID))
      .limit(1);
  }
  cached = row!;
  cachedAt = Date.now();
  return toPublic(cached);
}

export async function updateSettings(data: SettingsInput): Promise<SiteSettingsPublic> {
  const values: Partial<SettingsFields> = {};
  const raw = values as Record<string, unknown>;
  for (const key of Object.keys(data) as Array<keyof SettingsFields>) {
    const value = data[key];
    if (value !== undefined) {
      raw[key] = value;
    }
  }
  const [row] = await db
    .insert(siteSettings)
    .values({ id: DEFAULT_SETTINGS_ID, ...values, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { ...values, updatedAt: new Date() },
    })
    .returning();
  cached = row!;
  cachedAt = Date.now();
  return toPublic(cached);
}
