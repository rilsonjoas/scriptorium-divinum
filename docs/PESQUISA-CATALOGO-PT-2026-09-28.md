# Pesquisa: crescer o catálogo em português (2026-09-28)

Contexto: o teto do catálogo PT é estrutural (ver aviso no ROADMAP, "Teto
do catálogo é menor do que parecia"). Decisão do Rilson em 2026-09-28:
atacar por duas frentes, (1) obras **escritas em português**, que não
dependem de tradução antiga em domínio público, e (2) **traduções por IA de
textos curtos**, no modelo dos Credos Ecumênicos (aviso de IA, original ao
lado, revisão humana).

## Método

- Wikisource PT (API, namespace Autor = 102), Project Gutenberg (busca do
  site) e Internet Archive (`advancedsearch` + `metadata` + `_djvu.txt`).
- Qualidade do OCR medida baixando o `_djvu.txt` inteiro: % de "palavras"
  sem vogal (lixo típico de OCR) e leitura de um trecho do meio do arquivo.
- Status legal pela regra brasileira (art. 41, Lei 9.610/98): autor e, se
  houver, organizador/tradutor mortos há 70+ anos. Selo do Archive
  (`NOT_IN_COPYRIGHT`) não basta sozinho (2 falsos positivos já achados,
  ver ROADMAP).

## Frente 1: obras originais em português

**Wikisource PT e Gutenberg quase não têm nada.** Vieira no Wikisource: 4
sermões, que o acervo já tem. Gutenberg PT: nenhum dos autores abaixo. A
fonte real é o Internet Archive.

### Achado principal: a "Antologia Portuguesa" (Aillaud, 1919–1930s)

Coleção de 24 volumes organizada por **Agostinho de Campos (1870–1944)**,
confirmado em [Wikipédia](https://pt.wikipedia.org/wiki/Agostinho_de_Campos),
[Infopédia](https://www.infopedia.pt/artigos/$agostinho-de-campos) e no
registro de autoridade do Archive ("Campos, Agostinho de, 1870-1944").
Organizador falecido em 1944 → **edição inteira em PD no Brasil desde
1º/01/2015**. Vantagem sobre as edições antigas: **ortografia já
modernizada** e tipografia do séc. XX, então o OCR sai praticamente limpo.

| Obra | Archive | OCR | Status |
|---|---|---|---|
| Bernardes, _Nova Floresta_ (Antologia Portuguesa, vol. I, 2ª ed. 1920) | `novaflorestaesti01bernuoft` | **0,0% lixo**, ortografia moderna | ✅ PD (Bernardes †1710, Campos †1944) |
| Bernardes, _Estímulo Prático, Luz e Calor, Últimos Fins do Homem, Exercícios Espirituais_ (vol. II, 1920) | `novaflorestaesti02bernuoft` | **0,1% lixo**, ortografia moderna | ✅ PD |
| Frei Luís de Sousa, _Vida do Arcebispo_ (D. Frei Bartolomeu dos Mártires), Antologia Portuguesa, 1921 | `obrassou01sousuoft` | **0,1% lixo**, ortografia moderna | ✅ PD (Sousa †1632, Campos †1944) |

### Outras edições do séc. XIX, OCR aproveitável

| Obra | Archive | OCR | Status |
|---|---|---|---|
| Frei Tomé de Jesus, _Trabalhos de Jesus_ (Lisboa, 1865) | `trabalhosdejesus00thom` | **0,0% lixo**, 2,1 MB de texto; ortografia do séc. XIX ("huma", "Deos") | ✅ PD (autor †1582) |
| Vieira, _Sermões selectos_ (Lisboa, Rolland & Semiond, 1872) | `sermesselectos00vieigoog` (vol. 2) | 0,2% lixo, mas com erros de caractere ("cbm", "anilaé") | ✅ PD; **OCR precisa de revisão** |
| Vieira, _O Chrysostomo portuguez_ (sermões compilados, Lisboa, 1878), 5 vols. | `ochrysostomopor00…05vieigoog` | 0,2% lixo, erros pontuais ("Cbristo", "sea" por "seu") | ✅ PD pelo autor; **conferir o compilador** (nome não está na ficha) |
| Amador Arrais, _Diálogos_ (2ª impressão, Lisboa, 1846) | `dialogosrevistos00arrauoft` | 0,6% lixo, grafia de 1604 mantida ("&", "hũ") | ✅ PD (autor †1600); o mais trabalhoso de revisar |

**Não encontrados nesta rodada:** Heitor Pinto (_Imagem da Vida Cristã_),
_Salmos e Hinos_ dos Kalley, _Estímulo de Pastores_ de Bartolomeu dos
Mártires. Vale nova busca com grafias antigas ("Imagem da vida christam",
"Psalmos e hymnos").

### Ordem sugerida

1. Bernardes vol. I e II + _Vida do Arcebispo_ (Antologia Portuguesa):
   texto limpo, risco legal nulo, pouco trabalho. São 3 volumes.
2. _Trabalhos de Jesus_ (1865): texto limpo, clássico da espiritualidade
   portuguesa; decidir se moderniza a ortografia ou mantém a de 1865.
3. Vieira: começar pelos _Sermões selectos_, com revisão do OCR
   (mesma política da _Imitação de Cristo_: ficha + download do
   escaneamento enquanto o texto não é revisado).
4. Arrais: por último.

## Frente 2: traduções por IA de textos curtos

Critério: curto (a revisão humana é o gargalo), alto valor, original em
domínio público com edição confiável. Todas as traduções portuguesas
correntes destes textos (Vida Nova, Cultura Cristã, Paulus etc.) são
protegidas; uma tradução nova a partir do original não depende delas.

| Texto | Original | Fonte do original | Tamanho |
|---|---|---|---|
| Didaquê | grego | Hitchcock & Brown (1884), Gutenberg 42053 (já no lote inglês) | curto |
| _Carta a Diogneto_ | grego | Lightfoot, _The Apostolic Fathers_ (1891; †1889) — **localizar o scan** | curto |
| Cartas de Inácio de Antioquia (7) | grego | idem Lightfoot | curto |
| Breve Catecismo de Westminster | inglês (1647) | Schaff, _Creeds of Christendom_ vol. III (CCEL) | curto |
| Catecismo de Heidelberg | alemão (1563) | idem Schaff vol. III | médio |
| Cânones de Dort | latim (1619) | idem Schaff vol. III | médio |
| Confissão de Fé de Westminster | inglês (1646) | idem Schaff vol. III | médio-longo |
| Atanásio, _A Encarnação do Verbo_ | grego | edição de Robertson (1882) — **localizar o scan** | médio |

Sugestão de ritmo: um texto curto por vez, na fila de revisão; só entra o
próximo quando o anterior tiver revisor e data no bloco de proveniência.
Começar pelo Breve Catecismo e pela Didaquê (curtos e muito procurados).
