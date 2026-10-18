// Teste de tipos (só compila, não roda): garante que os tipos escritos à mão nos
// serviços do app são compatíveis com o contrato gerado da API de produção
// (`contract/*.d.ts`, ver scripts/contract-update.mjs). Roda em `pnpm typecheck`,
// com um tsconfig ESTRITO (contract/tsconfig.json).
//
// A regra é: toda resposta que a API pode dar tem de ser aceita pelo tipo do app
// (`Api` atribuível a `App`). Se a API tornar um campo opcional ou o remover, ou se o
// app passar a ler um campo que a API não declara, o `tsc` falha aqui, no PR, e não
// em produção como "o card sumiu". O app pode ler só um subconjunto da resposta.
import type { CitacaoDoDia } from '../src/services/citacaoDoDia';
import type { PinturaDoDia } from '../src/services/pinturaDoDia';
import type { paths as BibliaNaArte } from './biblianaarte';
import type { paths as Scriptorium } from './scriptorium';

type Resposta200<Operacao> = Operacao extends {
  responses: { 200: { content: { 'application/json': infer R } } };
}
  ? R
  : never;

type Assegura<T extends true> = T;
type Compativel<Api, App> = [Api] extends [App] ? true : false;

export type CitacaoDoDiaCompativel = Assegura<
  Compativel<Resposta200<Scriptorium['/api/v1/quotes/daily']['get']>, CitacaoDoDia>
>;
export type PinturaDoDiaCompativel = Assegura<
  Compativel<Resposta200<BibliaNaArte['/api/v1/artworks/daily']['get']>, PinturaDoDia>
>;
