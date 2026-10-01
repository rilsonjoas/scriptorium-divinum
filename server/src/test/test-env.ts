/**
 * Ambiente de teste hermético, compartilhado pelas suítes unitária e de
 * integração.
 *
 * A ideia é que nenhuma variável de comportamento possa entrar do `.env` de
 * quem está rodando. Isso não é preciosismo: o `.env` local deste projeto
 * define as dez variáveis abaixo, e sem este pinning a suíte passava ou
 * falhava dependendo de qual máquina rodou — em duas direções opostas.
 *
 * O teste do sitemap comparava com a origem de produção hardcoded, então
 * passava em CI (sem `.env`, o default de `config.ts` entra) e falhava na
 * máquina de quem desenvolve. O teste de afiliado comparava com a tag default
 * `rilson-20`, então passava em qualquer máquina que não tivesse
 * personalizado a tag e falhava em todas que tivessem.
 *
 * O primeiro escondia regressão real; o segundo gritava sem motivo. Ambos
 * tinham a mesma causa de fundo, e nenhum dos dois derivava do `env`.
 *
 * Fixando aqui, os testes continuam lendo do `env` — só que agora não podem ser
 * movidos pela configuração local de ninguém. E o pinning também vira trava:
 * como a tag de teste é diferente do default, qualquer teste que volte a
 * hardcodar `rilson-20` passa a falhar sozinho, sem precisar de um teste
 * sentinela para caçar o literal.
 */

/** Origem pública fixa. Não é um domínio real — é valor de asserção. */
const PUBLIC_ORIGIN = 'https://scriptorium.test';

/** Tag de afiliado de teste, deliberadamente diferente do default de produção. */
const AFFILIATE_TAG = 'tag-de-teste';

/**
 * 32+ caracteres, exigido por `config.ts` via `z.string().min(32)`. Fixo porque
 * os testes de auth assinam cookie com este valor: variá-lo entre execuções
 * invalidaria sessão entre passos.
 */
const COOKIE_SECRET = 'segredo-de-teste-cookies-suficientemente-longo';

const ADMIN_COOKIE_NAME = 'sd_session_teste';

/**
 * Banco apontado pelas suítes. A suíte unitária não consulta nada — este valor
 * existe só porque `config.ts` exige `DATABASE_URL` como URL válida, e sem ele
 * um desenvolvedor sem `.env` não consegue nem rodar os testes unitários.
 */
const DEFAULT_TEST_DATABASE_URL =
  'postgresql://scriptorium_test:scriptorium_test@localhost:5434/scriptorium_divinum_test';

export function pinTestEnv(opts: { databaseUrl?: string } = {}): void {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = opts.databaseUrl ?? DEFAULT_TEST_DATABASE_URL;
  process.env.CORS_ORIGIN = '*';
  process.env.PUBLIC_ORIGIN = PUBLIC_ORIGIN;
  process.env.AMAZON_AFFILIATE_TAG = AFFILIATE_TAG;
  process.env.COOKIE_SECRET = COOKIE_SECRET;
  process.env.ADMIN_COOKIE_NAME = ADMIN_COOKIE_NAME;
}
