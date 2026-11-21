import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { buildApp } from '../app.js';
import { closeDb } from '../db/client.js';
import { env } from '../config.js';

// Login tem limite próprio por IP, e o IP vem do X-Forwarded-For do Traefik (trustProxy).
// Sem trustProxy, todo visitante cairia no mesmo balde (o IP do proxy).
describe('Login — limite de tentativas por IP', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
    await closeDb();
  });

  const tentar = (ip: string) =>
    app.inject({
      method: 'POST',
      url: '/api/v1/admin/login',
      headers: { 'x-forwarded-for': ip },
      payload: { email: 'ninguem@teste.com', password: 'errada' },
    });

  it('bloqueia com 429 depois do limite e não afeta outro IP', async () => {
    for (let i = 0; i < env.LOGIN_RATE_LIMIT_MAX; i++) {
      expect((await tentar('203.0.113.10')).statusCode).toBe(401);
    }
    expect((await tentar('203.0.113.10')).statusCode).toBe(429);
    // outro visitante, mesmo proxy: continua podendo tentar
    expect((await tentar('203.0.113.99')).statusCode).toBe(401);
  });

  it('X-Forwarded-For forjado pelo cliente não zera o limite', async () => {
    const ip = '203.0.113.50';
    for (let i = 0; i < env.LOGIN_RATE_LIMIT_MAX; i++) await tentar(ip);
    // O Traefik acrescenta o IP real à direita; o que o cliente escreve à esquerda não conta
    const res = await tentar(`1.2.3.${Math.floor(Math.random() * 250)}, ${ip}`);
    expect(res.statusCode).toBe(429);
  });
});
