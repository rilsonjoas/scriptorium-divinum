# Manual do painel de citações

Para quem cuida do acervo (o autor). A tela fica em `https://scriptorium.narniano.com/admin/citacoes`, no item **Citações** do menu do admin. Desenho e regras: `docs/superpowers/specs/2026-10-18-painel-de-citacoes-design.md`. Visão técnica e API: `docs/GERENCIAR-ACERVO.md`.

> **Não grave nada em produção pela tela antes da F5.** Hoje o seed que restaura o banco troca o `id` de todas as citações, e o histórico de cada citação (que guarda o `id`) ficaria órfão. Até a F5 (id estável no arquivo canônico), use a tela só para **ler**: resumo, filtros, histórico, e abrir os formulários e diálogos para olhar (feche pelo Cancelar). Este manual descreve como a tela funciona para o dia em que a F5 estiver pronta.

## 1. Entrar

1. Abra `https://scriptorium.narniano.com/admin/login` e entre com o e-mail e a senha de administrador.
2. No menu lateral, clique em **Citações**. Sem login, qualquer endereço de `/admin` leva de volta ao login.

**Esqueci a senha.** A senha de uso fica guardada só como código (hash) no banco, e ninguém consegue lê-la. Se você não a tem, redefina rodando no seu terminal (não dentro de uma conversa, para a senha não ficar registrada em lugar nenhum):

```
ssh narniano@debian13-4gb-narniano 'docker exec -e ADMIN_EMAIL=seu@email -e ADMIN_PASSWORD="NOVA_SENHA" scriptorium-api node dist/scripts/create-admin.js'
```

A senha tem 8 caracteres ou mais. O script atualiza o administrador que já existe e não apaga nada.

## 2. Ler o resumo

No alto da tela:

- **Total, Ativas, Ocultas, Rascunhos:** quantas citações há em cada situação, no acervo inteiro (os filtros não mexem nesses números).
- **Sem verificação:** citações ativas sem a data de conferência. As 270 antigas aparecem aqui até alguém conferir cada uma contra a fonte; é uma fila de trabalho, não um defeito.
- **Autores com mais citações ativas:** os cinco maiores, no formato `Autor 145 (54%)`: quantas citações ativas e a fatia do total de ativas. Serve para decidir diversidade (Lewis tem mais da metade).

## 3. Achar uma citação

Em **Situação**, **Autor** e **Buscar** (texto ou obra, a busca espera um instante depois de você parar de digitar), mais a caixa **Só sem verificação**. **Limpar filtros** volta ao começo. A lista mostra 50 por página; **Próxima** e **Anterior** levam o início da lista de volta à tela.

Cada linha tem selos em texto: **Ativa**, **Oculta**, **Rascunho**, **Sem verificação** e **Fixada em N dias** (a citação foi gravada como a do dia em N datas).

## 4. Criar uma citação

**Nova citação** abre o formulário.

1. **Antes de escrever, confira a fonte primária.** A regra está em `docs/PROTOCOLO-VERIFICACAO-DE-CITACOES.md`: nenhuma citação entra sem fonte real conferida (uma citação fabricada já ficou um mês no ar por falta disso). Se não achou a fonte, **não crie**.
2. **Autor:** escreva exatamente como já existe. A lista de autores aparece como sugestão. Se você escrever diferente de um autor que já existe (por exemplo `Lewis` no lugar de `C. S. Lewis`), a tela recusa e mostra a grafia certa. Autor inédito é aceito.
3. **Texto:** até 2000 caracteres, sem HTML (aparece como texto puro). Texto repetido de uma citação já cadastrada é recusado.
4. **Obra ou fonte, Endereço da conferência, Conferida em** (`AAAA-MM-DD`): obrigatórios para criar já como **Ativa**. **Endereço da obra no Scriptorium** só se a obra estiver **publicada**. **Tema** é opcional. Marque **Obra em domínio público** quando for o caso (isso decide se a citação ganha o link de compra).
5. **Situação:** **Rascunho** não aparece no site e aceita campos incompletos; **Ativa** aparece para todos (Narniano, Gerador). Na dúvida, salve como rascunho e ative depois.
6. Se a API devolver um aviso (por exemplo, obra fora da curadoria, a citação fica sem link de compra), ele aparece num aviso rápido no canto.

## 5. Editar

**Editar** na linha. A tela envia só o que você mudou. Se alguém mudou a mesma citação desde que você a abriu, aparece "Esta citação mudou desde que você a abriu": o que você digitou fica, e **Carregar a versão atual** traz a versão nova para você refazer a mudança.

Texto corrigido de uma citação ativa vale também para os dias em que ela já foi a do dia. Mudar só o endereço da conferência ou a data de verificação fica registrado no histórico como "Verificada".

## 6. Ocultar e reativar

**Ocultar** é a forma de retirar uma citação. **Não existe botão de excluir, de propósito**: a linha continua no banco, com o motivo, e o `id` segue válido para sempre.

1. Clique em **Ocultar**. O diálogo mostra o impacto: em quais dias a citação está fixada (esses dias passam a mostrar outra) e o aviso de cache (o Narniano pode continuar mostrando por até 6 horas e o Gerador por até 10 minutos).
2. Escreva o **motivo** (3 a 1000 caracteres; fica no histórico) e confirme.
3. **Reativar** devolve a citação para o site; exige que ela tenha obra preenchida. O dia que foi trocado quando ela foi ocultada **não volta**: a escolha nova vale.

## 7. Citações de C. S. Lewis: atualizar o Gerador

O Gerador C. S. Lewis lê as citações ao vivo (até 10 minutos de atraso), mas guarda também uma **cópia embutida** para quando o Scriptorium estiver fora do ar. Essa cópia só muda quando alguém a regera. Por isso, depois de **criar uma citação ativa, editar texto, obra ou tema, ocultar ou reativar** uma citação de Lewis, a tela mostra o aviso "Depois, atualize a cópia do Gerador C. S. Lewis" (e um aviso rápido de 20 segundos depois de salvar).

**O caminho normal são dois passos:**

1. Disparar o fluxo, no seu terminal (ou esperar o PR do dia, que sai às 06:00 em Brasília):
   ```
   gh workflow run sync-quotes.yml --repo rilsonjoas/GeradorCSLewis
   ```
   O fluxo roda `npm run quotes:sync -- --check`; se a cópia estiver diferente da API, regera o arquivo e abre (ou atualiza) um PR na branch `chore/sync-quotes-snapshot`, com o resumo do que entra, sai e muda. Sem diferença nas citações, não abre nada.
2. Abrir o PR, conferir o diff de `src/data/lewis-quotes.snapshot.json` e mesclar. O esperado é só a sua mudança: o `id` que saiu, o texto que mudou ou a citação nova. O merge dispara o deploy do Gerador. O arquivo no GitHub: `https://github.com/rilsonjoas/GeradorCSLewis/blob/main/src/data/lewis-quotes.snapshot.json`.

**À mão** (se o GitHub Actions estiver fora): `cd gerador-cslewis && git pull`, `npm run quotes:sync`, `git diff src/data/lewis-quotes.snapshot.json`, commit, PR e publicar. Para só conferir se a cópia está em dia, sem gravar: `npm run quotes:sync -- --check`. No `git diff` aparecem também `geradoEm` (muda a cada execução) e `total` (se uma citação entrou ou saiu); só as citações importam.

A tela **não** avisa quando você muda só a data de verificação ou o endereço da conferência, nem quando mexe em rascunho ou oculta: a cópia não guarda esses dados.

**Se ninguém mesclar o PR**, o canário do cluster (de hora em hora) acusa **erro** se a cópia ainda tem uma citação retirada, e **avisa** se falta uma citação nova ou se o texto, a obra, o tema ou o link de compra de alguma está diferente da API.

## 8. Histórico

**Histórico** na linha abre a gaveta com tudo que já aconteceu naquela citação: **Criada**, **Editada**, **Ocultada**, **Reativada**, **Verificada**, com data, motivo e o antes e depois de cada campo. Citação que nunca foi mexida pelo painel não tem eventos.

## 9. O que a tela não faz

- **Excluir.** Só migration, com justificativa (citação fabricada, direitos), citando o registro de verificação. Veja `docs/GERENCIAR-ACERVO.md`.
- **Passar uma ativa para rascunho.** A API aceita; a tela não oferece (decisão do autor ainda aberta). Para tirar uma ativa do ar, oculte.
- **Carga em lote** de muitas citações: migration (`docs/GERENCIAR-ACERVO.md`, seção "Carga em lote").

## 10. Quando algo dá errado

| O que você vê | O que fazer |
|---|---|
| **404 "Página não encontrada"** em `/admin/citacoes` | O navegador está com uma versão antiga do site (service worker). `Ctrl+Shift+R`; se continuar, DevTools, Application, Service Workers, Unregister, e "Clear site data". |
| **"Erro interno do servidor"** | Olhe o log da API: `ssh narniano@debian13-4gb-narniano 'docker logs --since 10m scriptorium-api'`. Se aparecer `permission denied for table ...`, é o dono da tabela no banco (aconteceu com `quote_events` em 29/10/2026); a correção é `ALTER TABLE <tabela> OWNER TO scriptorium_app;` como `postgres`. O `migrate` agora derruba o deploy quando isso acontece. |
| **"Esta citação mudou desde que você a abriu"** | Veja a seção 5: **Carregar a versão atual**. |
| **Autor recusado com a grafia certa na mensagem** | Use a grafia sugerida (seção 4). |
