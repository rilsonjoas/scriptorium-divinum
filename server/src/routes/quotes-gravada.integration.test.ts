import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { buildApp } from "../app.js";
import { closeDb } from "../db/client.js";
import { listQuotes, pickQuoteBySeed } from "../db/quotes.js";
import { dateKeyInTimeZone, daySeed } from "../lib/date.js";

const MIGRATIONS_DIR = path.join(import.meta.dirname, "../db/migrations");
const FUNCTIONS_SQL = path.join(
  import.meta.dirname,
  "../db/custom-sql/functions.sql",
);

const hoje = () => dateKeyInTimeZone(new Date());
/** 'YYYY-MM-DD' a `n` dias de hoje (n pode ser negativo). */
function dia(n: number): string {
  const [y, m, d] = hoje().split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
const idQuote = (n: number) =>
  `30000000-0000-0000-0000-${String(n).padStart(12, "0")}`;

describe("Citação do dia GRAVADA — a escolha não muda quando o acervo muda", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let admin: postgres.Sql;

  const inserir = (n: number) =>
    admin.unsafe(
      `INSERT INTO quotes (id, author, text, dominio_publico) VALUES ('${idQuote(n)}', 'Autor ${n}', 'Citação ${n}.', true)`,
    );
  const diaDoDia = async (data: string) =>
    (
      await app.inject({
        method: "GET",
        url: `/api/v1/quotes/daily?date=${data}`,
      })
    ).json();
  const linhas = async (data?: string) =>
    (await admin.unsafe(
      data
        ? `SELECT * FROM daily_quotes WHERE date_key = '${data}'`
        : "SELECT * FROM daily_quotes",
    )) as unknown as { date_key: string; quote_id: string }[];

  beforeAll(async () => {
    const url = process.env.DATABASE_URL;
    if (!url)
      throw new Error("DATABASE_URL não definida nos testes de integração");
    admin = postgres(url, { max: 1 });
    await migrate(drizzle(admin), { migrationsFolder: MIGRATIONS_DIR });
    await admin.unsafe(readFileSync(FUNCTIONS_SQL, "utf-8"));
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await admin.unsafe(
      "TRUNCATE authors, books, quotes RESTART IDENTITY CASCADE",
    );
    for (let n = 2; n <= 8; n++) await inserir(n);
  });

  afterAll(async () => {
    if (app) await app.close();
    if (admin) await admin.end({ timeout: 5 });
    await closeDb();
  });

  it("a primeira consulta do dia grava a escolha, e a segunda devolve a mesma", async () => {
    const a = await diaDoDia(dia(1));
    expect(await linhas(dia(1))).toHaveLength(1);
    expect((await linhas(dia(1)))[0]!.quote_id).toBe(a.id);
    expect((await diaDoDia(dia(1))).id).toBe(a.id);
  });

  it("PRINCIPAL: acrescentar uma citação ao acervo não muda um dia já gravado", async () => {
    // acha um dia da janela em que o acervo novo (com a citação extra) daria OUTRA frase;
    // sem isso o teste passaria mesmo sem a gravação
    const antes = await listQuotes();
    const extra = idQuote(1); // ordena antes de todas: desloca o índice de todas as datas
    let alvo: string | undefined;
    for (let n = 1; n <= 20 && !alvo; n++) {
      const velha = pickQuoteBySeed(antes, dia(n))!;
      const nova = pickQuoteBySeed(
        [{ ...antes[0]!, id: extra }, ...antes],
        dia(n),
      )!;
      if (velha.id !== nova.id) alvo = dia(n);
    }
    expect(
      alvo,
      "não achei um dia em que o acervo novo mude a escolha",
    ).toBeDefined();

    const gravado = await diaDoDia(alvo!);
    await inserir(1);
    const depois = await diaDoDia(alvo!);
    expect(depois.id).toBe(gravado.id);
  });

  it("o mesmo acervo novo MUDARIA o dia se ele não estivesse gravado (controle do teste)", async () => {
    const dias = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => dia(n));
    const antes = await Promise.all(dias.map(diaDoDia));
    await admin.unsafe("TRUNCATE daily_quotes"); // simula a ausência da gravação
    await inserir(1);
    const depois = await Promise.all(dias.map(diaDoDia));
    expect(depois.map((q) => q.id)).not.toEqual(antes.map((q) => q.id));
  });

  it("apagar a citação gravada reescolhe só aquele dia", async () => {
    const d1 = await diaDoDia(dia(1));
    const d2 = await diaDoDia(dia(2));
    await admin.unsafe(`DELETE FROM quotes WHERE id = '${d1.id}'`);
    expect(await linhas(dia(1))).toHaveLength(0); // cascade
    const novo = await diaDoDia(dia(1));
    expect(novo.id).not.toBe(d1.id);
    expect((await diaDoDia(dia(2))).id).toBe(d2.id); // o vizinho não foi tocado
  });

  it("consultas SIMULTÂNEAS de um dia novo gravam uma linha só e devolvem a mesma citação", async () => {
    const respostas = await Promise.all(
      Array.from({ length: 12 }, () => diaDoDia(dia(3))),
    );
    expect(new Set(respostas.map((r) => r.id)).size).toBe(1);
    expect(await linhas(dia(3))).toHaveLength(1);
  });

  it("fora da janela de ±30 dias não grava (a tabela não enche com datas arbitrárias)", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/api/v1/quotes/daily?date=${dia(60)}`,
    });
    expect(res.statusCode).toBe(200);
    await app.inject({
      method: "GET",
      url: `/api/v1/quotes/daily?date=${dia(-60)}`,
    });
    await app.inject({
      method: "GET",
      url: "/api/v1/quotes/daily?date=2099-12-31",
    });
    expect(await linhas()).toHaveLength(0);
  });

  it("o limite da janela: dia 30 grava, dia 31 não", async () => {
    await diaDoDia(dia(30));
    await diaDoDia(dia(31));
    const gravados = (await linhas()).map((l) => l.date_key);
    expect(gravados).toContain(dia(30));
    expect(gravados).not.toContain(dia(31));
  });

  it("com filtro de autor não grava (o conjunto filtrado não é o acervo todo)", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/api/v1/quotes/daily?date=${dia(1)}&author=Autor%202`,
    });
    expect(res.statusCode).toBe(200);
    expect(await linhas()).toHaveLength(0);
  });

  it("sem date usa o hoje de São Paulo e grava com essa chave", async () => {
    const r = await app.inject({ method: "GET", url: "/api/v1/quotes/daily" });
    expect(r.json().date).toBe(hoje());
    expect((await linhas(hoje()))[0]!.quote_id).toBe(r.json().id);
  });

  it("acervo vazio: 404, sem gravar nada", async () => {
    await admin.unsafe("TRUNCATE quotes CASCADE");
    const res = await app.inject({
      method: "GET",
      url: `/api/v1/quotes/daily?date=${dia(1)}`,
    });
    expect(res.statusCode).toBe(404);
    expect(await linhas()).toHaveLength(0);
  });

  describe("datas inválidas e extremas (padronização entre os provedores)", () => {
    it.each(["2026-13-45", "2026-02-30", "2026-00-10", "abc", "2026-1-1", ""])(
      "date=%s → 400",
      async (d) => {
        const res = await app.inject({
          method: "GET",
          url: `/api/v1/quotes/daily?date=${d}`,
        });
        expect(res.statusCode).toBe(400);
      },
    );

    it("data anterior a 1970 (semente negativa) devolve citação, não 404", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/api/v1/quotes/daily?date=1900-01-01",
      });
      expect(res.statusCode).toBe(200);
      expect(res.json().date).toBe("1900-01-01");
    });

    it("ano bissexto existe, ano comum não", async () => {
      expect(
        (
          await app.inject({
            method: "GET",
            url: "/api/v1/quotes/daily?date=2028-02-29",
          })
        ).statusCode,
      ).toBe(200);
      expect(
        (
          await app.inject({
            method: "GET",
            url: "/api/v1/quotes/daily?date=2027-02-29",
          })
        ).statusCode,
      ).toBe(400);
    });
  });

  it("o preenchimento SQL da migration 0012 dá a MESMA escolha que a fórmula em JS", async () => {
    const sqlMigration = readFileSync(
      path.join(MIGRATIONS_DIR, "0012_citacao_do_dia_gravada.sql"),
      "utf-8",
    );
    const backfill = sqlMigration.split("--> statement-breakpoint").pop()!;
    expect(backfill).toContain('INSERT INTO "daily_quotes"');
    await admin.unsafe("TRUNCATE daily_quotes");
    await admin.unsafe(backfill);

    const gravados = await linhas();
    expect(gravados).toHaveLength(61); // hoje ±30
    const acervo = await listQuotes();
    for (const g of gravados) {
      expect(daySeed(g.date_key)).toBeTypeOf("number");
      expect(g.quote_id, `dia ${g.date_key}`).toBe(
        pickQuoteBySeed(acervo, g.date_key)!.id,
      );
    }
    expect(gravados.map((g) => g.date_key)).toContain(hoje());
  });
});
