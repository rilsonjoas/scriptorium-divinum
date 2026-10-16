# scripts/

Ferramentas de manutenção do acervo. Visão geral e quando usar cada uma: `docs/GERENCIAR-ACERVO.md`.

## Não rode os `.sql` desta pasta

Os arquivos `*.sql` aqui são **históricos**: eram aplicados à mão antes de o `migrate` rodar os
seeds sozinho. 55 deles (de 74) usam `ON CONFLICT ... DO UPDATE` e **diferem** dos seeds atuais; rodar um
deles reescreve campos que o painel de admin gerencia (publicada, título, descrição, atribuição...).

A fonte dos seeds é `server/src/db/seeds/` (só cria obras novas). Mudança em obra existente é
migration (`server/src/db/migrations/`). O resto é pelo painel de admin.
