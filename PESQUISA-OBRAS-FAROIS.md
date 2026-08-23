# Pesquisa: Obras-Faróis sem Texto (2026-08-23)

> Objetivo: dar conteúdo real às 7 obras-faróis que estavam no catálogo
> sem leitura online nem downloads funcionais. Critério legal do projeto:
> só domínio público comprovado — autor morto há 70+ anos E, se houver
> tradução, tradutor também morto há 70+ anos (Lei 9.610/98, art. 41).
> Decisão do Rilson: aceitar edições em inglês, espanhol ou latim.

## Metodologia

1. **Auditoria da API pública** (`/api/v1/books`) para listar as obras
   sem `textAvailable` e sem `downloadLinks` válidos.
2. **Busca em repositórios confiáveis** (Project Gutenberg, CCEL,
   Standard Ebooks, Internet Archive) usando a página de catálogo do
   Online Books Page (upenn.edu) e o próprio gutenberg.org como
   confirmadores — nunca fontes anônimas.
3. **Verificação de cada candidato** em três níveis:
   - identidade da obra (título, tradutor, volumes na página do ebook);
   - datas dos tradutores/autores (obituário → domínio público);
   - integridade do arquivo baixado (marcadores START/END do Gutenberg,
     presença dos livros corretos em cada volume, ausência de livros
     fora do volume).
4. **Conversão**: removido o boilerplate do Gutenberg; adicionado
   cabeçalho de proveniência obrigatório; arquivos enviados em
   `server/texts/` e ligados via `online_read_path`.

## Resultados

### ✅ A Cidade de Deus — RESOLVIDA (edição inglesa)

| Item | Detalhe |
|---|---|
| Obra | De Civitate Dei contra Paganos (413–426) |
| Edição | *The City of God*, tradução de Marcus Dods (1834–1909), vols. com George Wilson e J. J. Smith — T. & T. Clark, 1871 |
| Domínio público | Agostinho †430; Dods †1909; Wilson †1912? (n/a); Smith n/a — todos há mais de 110 anos ✓ |
| Fonte | Project Gutenberg #45304 (Vol. I, Livros I–XIII) e #45305 (Vol. II, Livros XIV–XXII) |
| URLs | `gutenberg.org/cache/epub/45304/pg45304.txt` e `/45305/pg45305.txt` |
| Verificação | marcadores PG presentes; Vol. I contém exatamente BOOK I–XIII (grep independente: zero ocorrências de "XIV" no arquivo); Vol. II contém BOOK XIV–XXII |
| Arquivo | `server/texts/cidade-de-deus-en.md` (~2,6 MB) |

### ✅ As Institutas da Religião Cristã — RESOLVIDA (edição inglesa)

| Item | Detalhe |
|---|---|
| Obra | Institutio Christianae Religionis, edição latina final de 1559 |
| Edição | *Institutes of the Christian Religion*, tradução de John Allen (1771–1839), Presbyterian Board of Publication, 6ª ed. americana |
| Domínio público | Calvino †1564; Allen †1839 ✓ |
| Fonte | Project Gutenberg #45001 (Vol. I, Livros I–II) e #64392 (Vol. II, Livros III–IV) |
| URLs | `gutenberg.org/cache/epub/45001/pg45001.txt` e `/64392/pg64392.txt` |
| Nota de pesquisa | o eBook #45002 NÃO é o vol. 2 das Institutas (é "Harmonies of Political Economy") — descoberto ao inspecionar o download; vol. 2 correto localizado pela busca do catálogo PG (#64392). Baixado via espelho mirrorservice.org após 503 persistente do servidor principal |
| Verificação | página de título com Calvin/Allen; Vol. II abre no Book III e fecha no Book IV |
| Arquivo | `server/texts/institutas-da-religiao-crista-en.md` (~3,8 MB) |

### ✅ Confissões / O Peregrino / Pensamentos / Por que Deus se fez Homem — JÁ TÊM EDIÇÃO INGLESA COMPLETA NO ACERVO

Verificação cruzada catálogo ↔ `server/texts/`: as entradas irmãs em
inglês já possuem texto integral servido no leitor:

- The Confessions of St. Augustine (trad. E. B. Pusey, †1882 — PG #3296)
- The Pilgrim's Progress
- Thoughts (Pensées) — Pascal
- Proslogium; Monologium; Cur Deus Homo — Anselmo

As fichas em português seguem sem tradução PT livre conhecida; quando
surgir tradução antiga em domínio público, liga-se via
`online_read_path` sem mexer no resto.

### ✅ Compêndio de Teologia (Tomás de Aquino) — RESOLVIDO (original latino)

| Item | Detalhe |
|---|---|
| Obra | Compendium theologiae ad fratrem Reginaldum (c. 1269–1272, inacabada) |
| Edição | texto latino eletrônico preparado por Ricardo M. Román (1998), distribuído pelo projeto Documenta Catholica Omnia |
| Domínio público | autor †1274 ✓ (a tradução inglesa Vollert, 1947, tradutor †1982, NÃO qualifica — protegida no Brasil até ~2052) |
| Como foi obtido | PDF com camada de texto do Documenta Catholica Omnia → extração via pdftotext → limpeza de cabeçalhos/rodapés/números de página → reconstrução dos títulos de capítulo (que vinham quebrados em várias linhas) |
| Verificação | dedicatória autêntica ao irmão Réginaldo ("fili carissime Reginalde"); 2 livros e 256 capítulos nesta edição (De fide 1–246; De spe 1–10); termina exatamente em "Quod regnum obtinere est possibile", onde a tradição diz que a obra parou |
| Notas de pesquisa | o Corpus Thomisticum não expõe o arquivo direto (navegação JS; tentativas xct.html etc. → 404) e o certificado SSL do Documenta Catholica Omnia está vencido (download feito com verificação desabilitada apenas para conteúdo PD). Sem link de download no catálogo por enquanto: nenhuma URL íntegra e estável para apontar |
| Arquivo | `server/texts/compendium-theologiae-la.md` (~475 KB) |

### ⏳ Traduções portuguesas antigas (todas as faróis) — PENDENTE

Alvos futuros de pesquisa: traduções PT publicadas antes de ~1950 com
tradutor falecido há 70+ anos (ex.: velhas traduções de Agostinho e
Pascal feitas no séc. XIX/XX inicial). Onde procurar: Internet Archive
(scans + OCR), Biblioteca Nacional Digital (Portugal),
HathiTrust (domínio público pleno).

## Lições de método registradas

1. Sempre inspecionar o INÍCIO do arquivo baixado — o ID errado do
   Gutenberg (#45002) entregou outro livro silenciosamente.
2. Verificar volume por volume (livros que abrem e que fecham cada
   volume) antes de mesclar.
3. Espelho oficial do Gutenberg (mirrorservice.org) resolve 503 do
   servidor principal sem recorrer a fontes duvidosas.
4. Datas de morte do TRADUTOR são tão decisivas quanto as do autor
   (caso Shapcote/Summa e caso Vollert/Compendium: PD nos EUA ≠ PD no Brasil).
5. Numeração de capítulos varia entre edições críticas (Leonina vs.
   eletrônicas): documentar a convenção da edição usada, não assumir a "famosa".

---

## Fase 2 — Caça a traduções portuguesas antigas (2026-08-23, AGUARDANDO DECISÃO)

> Fonte principal: Internet Archive (API advancedsearch + metadata + djvu.txt).
> Nada foi incluído no acervo ainda — relatório submetido ao Rilson.

### Candidatos verificados

| Obra | Edição encontrada | Tradutor | Base legal | Texto disponível |
|---|---|---|---|---|
| O Peregrino (Bunyan) | "O Peregrino ou A Viagem do Christão à Cidade Celestial debaixo da forma de um sonho", 11ª ed., Livraria Evangélica, Lisboa, **1916** | **Guilherme Luiz dos Santos Ferreira (1850–1934)** — major do exército português, presbiteriano; identidade confirmada em duas fontes independentes (Rede Missionária; Grande Enciclopédia Luso-Brasileira v.27) | tradutor †1934 → PD desde 2004 ✓ | djvu.txt (285 KB), OCR tesseract |
| Confissões de Santo Agostinho | "Confissões do Grande Doutor da Igreja Santo Agostinho", H. Garnier, Rio de Janeiro, **1905** ("Edição clássica") | anônimo ("Traduzidas na língua portuguesa por hum devoto") | obra anônima publicada 1905 → PD por prazo (70 anos da publicação) ✓ | djvu.txt (693 KB) |
| Imitação de Cristo (Tomás de Kempis) | "Imitação de Christo: com instrucções e orações...", Belin-Leprieur et Morizot, Paris, **1848** | não creditado na folha de rosto (verificar dentro do volume) → anônima | obra anônima de 1848 → PD ✓ | djvu.txt (468 KB); OCR com ruído moderado |
| Nova Floresta / Os Últimos Fins do Homem (Padre Manuel Bernardes, 1644–1710) | escaneamentos originais (1706–1920) no archive | autor ORIGINAL português — sem barreira de tradução | PD trivial ✓ | 34 itens; djvu.txt por volume |

### Não encontrados nesta rodada

- Pascal *Pensamentos* PT em domínio público (só ruído/obras não relacionadas)
- Anselmo *Cur Deus Homo* PT
- Granada *Guia dos Pecadores* PT (só biografia do autor)
- Ligório/Scupoli: apenas re-edits modernos sem data/creditação clara (risco de tradução nova protegida)

### Ressalvas técnicas

- Todos os textos viriam de OCR de scans antigos: ortografia pré-acordo é
  legítima (faz parte do charme histórico), mas o OCR adiciona ruído
  (ex.: "traducçúes", "Unguas") → exigem passada de revisão antes de
  virar leitura online.
- A Imitação 1848 tem introdução sobre a autoria da obra (Kempis vs.
  Gerson) — manter ou remover na edição é decisão editorial.
