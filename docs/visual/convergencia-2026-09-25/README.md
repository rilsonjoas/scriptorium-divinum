# Comparativo visual — convergência com o cluster (2026-09-25)

Registro do antes/depois da fase de convergência visual (F1–F5 do
`ROADMAP.md`, seção "Convergência visual com o cluster"). Cada imagem é
um par lado a lado: **esquerda = antes**, **direita = depois**.

| Arquivo | O que mostra |
|---|---|
| `01-home-claro.jpg` | topo da home em tema claro: logo/título (Cormorant) e rótulos sem caixa alta |
| `02-home-destaques.jpg` | seção "Obras em Destaque": hierarquia do `SectionLabel` e cantos dos cards |
| `03-autor-claro.jpg` | ficha de autor em tema claro |
| `04-home-escuro.jpg` | topo da home em tema escuro |

## O que mudou (resumo)

- **F1 — caixa alta 14 → 4** via `SectionLabel` (rótulos de seção
  deixaram de gritar; sobraram 4 usos de convenção editorial). Gains
colaterais: `text-library-crimson` existia como classe morta, e o tom
  de fundo era ilegível como texto no escuro — resolvido com
  `--library-crimson-foreground`.
- **F2 — raio 0.75rem → 0.375rem** (o shadcn deriva `rounded-*` de uma
  variável, então um número cobriu 148 usos). Os 73 `rounded-full` foram
  mantidos; o gesto visual passa a ser a moldura tracejada do couro.
- **F3 — display → Cormorant Garamond** (canônico do cluster), com
  Playfair preservada em corpo pequeno via `--font-display-sm`.
- **F4 — easing litúrgico e vela** nos movimentos reais.
- **F5 — auditoria de contraste** fechou o modo escuro em 0 violações.

## Por que JPEG e não PNG

As capturas integrais ocupavam ~47 MB (páginas de 5.000 px de altura).
Estes painéis são recortes dos pontos que mudam, em JPEG q90 progressivo:
**424 KB no total**, sem perda visível de legibilidade no texto.

> [!note]
> Estas são **documentação histórica**, não baselines de QA visual. Para
> regressão automática seria preciso um conjunto novo, do design atual, e
> uma suíte Playwright `toHaveScreenshot()` no CI. As capturas
> originais (antes/depois completos, claro+escuro) ficaram fora do repo
> por serem voláteis e pesadas.
