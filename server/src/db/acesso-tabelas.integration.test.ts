import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import postgres from 'postgres';
import { tabelasSemAcesso } from './acesso-tabelas.js';

// O usuário do banco de teste é superusuário e ignora permissões; o teste assume
// um papel comum (SET ROLE) para reproduzir o usuário da API em produção.
describe('tabelasSemAcesso', () => {
  let sql: postgres.Sql;

  beforeAll(async () => {
    sql = postgres(process.env.TEST_DATABASE_URL!, { max: 1 });
    await sql.unsafe('DROP TABLE IF EXISTS teste_acesso_negado, teste_acesso_ok');
    await sql.unsafe('DROP ROLE IF EXISTS teste_acesso_app');
    await sql.unsafe('CREATE ROLE teste_acesso_app NOLOGIN');
    await sql.unsafe('CREATE TABLE teste_acesso_negado (id int)');
    await sql.unsafe('CREATE TABLE teste_acesso_ok (id int)');
    await sql.unsafe('GRANT SELECT, INSERT, UPDATE ON teste_acesso_ok TO teste_acesso_app');
  });
  afterAll(async () => {
    await sql.unsafe('RESET ROLE');
    await sql.unsafe('DROP TABLE IF EXISTS teste_acesso_negado, teste_acesso_ok');
    await sql.unsafe('DROP ROLE IF EXISTS teste_acesso_app');
    await sql.end();
  });

  it('aponta a tabela sem permissão para o usuário da conexão e só ela', async () => {
    await sql.unsafe('SET ROLE teste_acesso_app');
    const sem = await tabelasSemAcesso(sql);
    await sql.unsafe('RESET ROLE');
    expect(sem).toContain('teste_acesso_negado');
    expect(sem).not.toContain('teste_acesso_ok');
  });

  it('superusuário não tem tabela sem acesso', async () => {
    expect(await tabelasSemAcesso(sql)).toEqual([]);
  });
});
