-- Credos Ecumênicos: revisão humana aprovada pelo Rilson em 2026-09-29.
-- O texto (server/texts/credos-ecumenicos.md) muda no deploy; aqui só o
-- attribution_text da ficha, que o banco guarda.
BEGIN;
UPDATE books
   SET attribution_text = 'Tradução gerada por IA (Claude Opus 5.5, da Anthropic) a partir dos originais em domínio público, conferida com a tradução inglesa de Philip Schaff (The Creeds of Christendom, vol. II, 1877). Revisão humana: aprovada pelo editor do Scriptorium em 29/09/2026. Tradução © 2026 Scriptorium Divinum, CC BY-SA 4.0.',
       updated_at = now()
 WHERE slug = 'credos-ecumenicos';
COMMIT;
