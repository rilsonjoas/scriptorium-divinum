import type postgres from 'postgres';

/**
 * Tabelas do schema public em que o usuário da conexão não consegue ler e gravar.
 *
 * Aconteceu com `quote_events` (F1): criada à mão como `postgres`, a API recebia
 * "permission denied" só quando alguém abria o Histórico ou ocultava uma citação.
 * Nenhum teste, health ou canário passa por aí, então o migrate confere em todo deploy.
 */
export async function tabelasSemAcesso(sql: postgres.Sql): Promise<string[]> {
  const linhas = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
      AND NOT has_table_privilege(current_user, format('%I.%I', schemaname, tablename), 'SELECT, INSERT, UPDATE')
    ORDER BY tablename`;
  return linhas.map((l) => l.tablename);
}
