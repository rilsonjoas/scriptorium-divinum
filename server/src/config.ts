import { config } from 'dotenv';
import { z } from 'zod';
import { fileURLToPath } from 'node:url';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().default('*'),
  PUBLIC_ORIGIN: z.string().url().default('https://scriptorium.narniano.com'),
  // Diretório das obras em markdown (domínio público) servidas no leitor
  TEXTS_DIR: z.string().default(fileURLToPath(new URL('../texts/', import.meta.url))),
  // Diretório de uploads do admin (capas); montado como volume em produção
  UPLOAD_DIR: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  // Login do admin: limite próprio por IP, bem mais apertado que o global (força bruta)
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().default(5),
  LOGIN_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  // Proxies em que a API confia para ler o IP real do X-Forwarded-For (lista separada por vírgula,
  // IPs ou CIDRs; 'loopback' vale). Padrão: loopback + bridge do Docker, onde vive o Traefik.
  // Sem isto, request.ip é sempre o IP do proxy e todo limite por IP vira um balde único para o
  // mundo inteiro. Um X-Forwarded-For forjado pelo cliente não engana: vale o primeiro IP, da
  // direita para a esquerda, que não é proxy confiável. Vazio desliga.
  TRUSTED_PROXIES: z.string().default('loopback,172.16.0.0/12'),
  // Auth de admin por cookie de sessão
  COOKIE_SECRET: z.string().min(32).default('scriptorium-dev-secret-change-me-please'),
  ADMIN_COOKIE_NAME: z.string().default('sd_session'),
  SESSION_TTL_DAYS: z.coerce.number().default(30),
  // Domínio do cookie entre subdomínios (ex.: narniano.com) — vazio em dev
  COOKIE_DOMAIN: z.string().optional(),
  // Tag de afiliado Amazon usada no CTA centralizado de citações não-públicas
  // (ADR 001 — o comportamento é central na API, não reimplementado por consumidor)
  AMAZON_AFFILIATE_TAG: z.string().default('rilson-20'),
  // Criação do primeiro admin (scripts/create-admin.ts)
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

export const env = envSchema.parse(process.env);
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
