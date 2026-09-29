#!/usr/bin/env python3
"""
Converte o OCR (`_djvu.txt`) de um livro do Internet Archive em markdown
para o leitor do Scriptorium, com o bloco de Proveniência.

Cada edição tem seu jeito de marcar seções e seus cabeçalhos de página,
então a configuração é por obra (dicionário OBRAS abaixo). O que o script
faz em todas:

- corta a matéria antes/depois do texto (folha de rosto, índice final);
- remove cabeçalhos/rodapés de página ("108  ANTOLOGIA", "BERNARDES  109");
- junta as linhas de cada parágrafo e desfaz a hifenização de fim de linha
  ("por-\\nque" -> "porque");
- transforma os títulos de seção em `##` (o leitor divide capítulos por
  `#`/`##`, ver web/src/utils/chapters.ts);
- confere o número de seções contra o índice impresso da própria edição.

Uso:
  python3 scripts/archive_ocr_to_md.py <chave>            # grava server/texts/<arquivo>.md
  python3 scripts/archive_ocr_to_md.py <chave> --check    # só relata
"""
import os
import re
import sys
import urllib.request
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXTS_DIR = os.path.join(BASE_DIR, "server/texts")
CACHE_DIR = os.path.join(BASE_DIR, "scratch", "ocr-cache")

ROMANO = r"[IVXLC]+"
MINUSCULAS = {"de", "do", "da", "dos", "das", "e", "o", "a", "os", "as", "em", "no", "na",
              "nos", "nas", "por", "com", "que", "um", "uma", "ao", "aos", "à", "às", "se"}


def titulo(texto):
    """'NECESSIDADE E APETITE' -> 'Necessidade e Apetite'."""
    palavras = texto.strip().split()
    out = []
    for i, p in enumerate(palavras):
        nucleo = re.sub(r"[^\wÀ-ÿ]", "", p)
        if re.fullmatch(ROMANO, nucleo) and len(nucleo) > 1:
            out.append(p)
        elif i > 0 and nucleo.lower() in MINUSCULAS:
            out.append(p.lower())
        else:
            out.append(p[:1].upper() + p[1:].lower())
    return " ".join(out)


def baixar(identificador):
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache = os.path.join(CACHE_DIR, f"{identificador}.txt")
    if os.path.exists(cache):
        return open(cache, encoding="utf-8").read()
    meta = json.load(urllib.request.urlopen(f"https://archive.org/metadata/{identificador}", timeout=60))
    nome = next(f["name"] for f in meta["files"] if f["name"].endswith("_djvu.txt"))
    texto = urllib.request.urlopen(
        f"https://archive.org/download/{identificador}/{urllib.request.quote(nome)}", timeout=180
    ).read().decode("utf-8", "replace")
    open(cache, "w", encoding="utf-8").write(texto)
    return texto


def limpar(texto, cfg):
    # marcadores tolerantes a espaço: o OCR costuma duplicar ("FIM  DO  PRIMEIRO")
    padrao = lambda m: r"\s+".join(map(re.escape, m.split()))
    m_ini = re.search(padrao(cfg["inicio"]), texto)
    fins = list(re.finditer(padrao(cfg["fim"]), texto)) if cfg.get("fim") else []
    if not m_ini or (cfg.get("fim") and not fins):
        raise SystemExit(f"marcador não encontrado: inicio={bool(m_ini)} fim={bool(fins)}")
    texto = texto[m_ini.start():fins[-1].start() if fins else len(texto)]

    linhas = []
    for linha in texto.split("\n"):
        l = re.sub(r"[ \t]+", " ", linha).strip()
        if any(re.fullmatch(p, l) for p in cfg["cabecalhos"]):
            continue
        linhas.append(l)

    # seções: numeral romano sozinho + título em caixa alta logo abaixo
    blocos = []  # (tipo, texto)
    paragrafo = []

    def fecha():
        if paragrafo:
            p = " ".join(paragrafo)
            p = re.sub(r"(\w)- (\w)", r"\1\2", p)  # hifenização de fim de linha
            blocos.append(("p", p))
            paragrafo.clear()

    i = 0
    while i < len(linhas):
        l = linhas[i]
        if not l:
            fecha()
            i += 1
            continue
        if not cfg.get("sem_secoes") and re.fullmatch(ROMANO, l):
            j = i + 1
            while j < len(linhas) and not linhas[j]:
                j += 1
            if j < len(linhas) and linhas[j].isupper() and len(linhas[j]) < 90:
                fecha()
                blocos.append(("h", f"{l} — {titulo(linhas[j])}"))
                i = j + 1
                continue
        paragrafo.append(l)
        i += 1
    fecha()

    out = []
    for tipo, t in blocos:
        if tipo == "h":
            out.append(f"## {t}")
        elif not cfg.get("sem_secoes") and re.fullmatch(r"\(.{3,80}\)\.?", t):
            out.append(f"_{t}_")  # fonte do trecho: "(Nova Floresta. Armas)."
        else:
            out.append(t)
    return "\n\n".join(out)


def limpar_antologia(texto, cfg):
    """
    Edições da "Antologia Portuguesa" (Aillaud, org. Agostinho de Campos).

    O OCR dos títulos em versalete sai ilegível ("O Dmoào I>e Roikes" por
    "O Dragão de Rodes") e os numerais romanos às vezes somem ou viram "Y".
    O que é confiável: todo trecho TERMINA com a fonte entre parênteses
    ("(Nova Floresta, Armas).") e o índice impresso traz os títulos limpos.
    Então: divide pelos parênteses de fonte, usa os títulos do índice
    (cfg["titulos"], na ordem) e descarta numeral + título do OCR. A
    capitular (letra grande do início do trecho) vem numa linha sozinha e é
    colada de volta na primeira palavra ("Q" + "ualquer" -> "Qualquer").
    """
    corpo = limpar(texto, {**cfg, "sem_secoes": True})
    paragrafos = corpo.split("\n\n")
    fonte = re.compile(cfg["fonte_trecho"])
    trechos, atual = [], []
    for p in paragrafos:
        if fonte.fullmatch(p.strip("_ ")):
            if not any(q.strip() for q in atual) and trechos:
                # duas linhas de fonte seguidas: a segunda é do mesmo trecho
                trechos[-1].append(p)
            else:
                atual.append(p)
                trechos.append(atual)
            atual = []
        else:
            atual.append(p)
    sobra = [p for p in atual if p.strip()]

    nota = re.compile(r"\([0-9lI]\)\s*=.*|\([0-9lI]\)\s+\S.*")
    numeral = re.compile(r"[IVXLCYlíÍ1]{1,8}\.?(\s+\S.*)?")

    def parece_cabecalho(ps):
        # numeral (mesmo mal lido: "XIY", "xxnn") ou título em caixa alta em
        # alguma das 3 primeiras linhas; capitular solta e lixo curto não contam
        for q in (x.strip() for x in ps[:3]):
            if not q or len(q) <= 2:
                continue
            letras = sum(ch.isalpha() for ch in q)
            if numeral.fullmatch(q) or re.fullmatch(r"[ivxlcyn]{2,8}", q, re.I):
                return True
            if letras and sum(ch.isupper() for ch in q) >= 0.6 * letras and len(q) < 90:
                return True
        return False

    # notas de rodapé ("(1) = desprezarem") vêm depois da linha de fonte e
    # pertencem ao trecho anterior; trecho sem cabeçalho (ex.: "* Outra versão
    # da mesma fábula", dentro do XXI) é continuação do anterior
    ajustados = []
    for ps in trechos:
        k = 0
        while k < len(ps) and nota.fullmatch(ps[k].strip()):
            k += 1
        if k and ajustados:
            ajustados[-1].extend(ps[:k])
        ps = ps[k:]
        if ajustados and not parece_cabecalho(ps):
            ajustados[-1].extend(ps)
        else:
            ajustados.append(ps)
    trechos = ajustados

    # a capitular às vezes fica no fim do trecho anterior (depois da fonte)
    for n in range(1, len(trechos)):
        ant = trechos[n - 1]
        while ant and not ant[-1].strip():
            ant.pop()
        if ant and re.fullmatch(r"[A-ZÁÉÍÓÚÂÊÔÃÕÇ][’'`.,]?", ant[-1].strip()):
            trechos[n].insert(0, ant.pop())

    pular = re.compile(cfg.get("pular", r"(?!)"))
    titulos = cfg["titulos"]
    if len(trechos) != len(titulos):
        return None, len(trechos)

    out = []
    num = 0
    for tit, ps in zip(titulos, trechos):
        # remove, do começo do trecho: capitular solta, numeral (mesmo mal
        # lido) e o título em caixa alta do OCR
        capitular = ""
        k = 0
        while k < len(ps):
            q = ps[k].strip()
            if pular.fullmatch(q):
                pass
            elif re.fullmatch(r"[A-ZÁÉÍÓÚÂÊÔÃÕÇ][’'`.,]?", q):
                capitular = q[0]
            elif len(q) <= 2 and k < 3:
                pass
            elif k < 3 and re.fullmatch(r"[IVXLCYlíÍ1xn]{2,8}\.?(\s+\S.{0,80})?", q, re.I):
                pass
            elif q and sum(ch.isupper() for ch in q) >= 0.6 * sum(ch.isalpha() for ch in q) and len(q) < 90:
                pass
            else:
                break
            k += 1
        corpo_trecho = ps[k:]
        if capitular and corpo_trecho and corpo_trecho[0][:1].islower():
            corpo_trecho[0] = capitular + corpo_trecho[0]
        # complemento do título em minúscula logo abaixo dele ("…que correu
        # entre os Religiosos Menores"): subtítulo, em itálico
        if corpo_trecho and corpo_trecho[0][:1].islower() and len(corpo_trecho[0]) < 90:
            corpo_trecho[0] = f"_{corpo_trecho[0]}_"
        # capitular impressa como duas maiúsculas ("EM uma terra" -> "Em uma terra")
        if corpo_trecho:
            corpo_trecho[0] = re.sub(r"^([A-ZÁÉÍÓÚ])([A-ZÁÉÍÓÚ]{1,3})(?= [a-zà-ÿ])",
                                     lambda m: m.group(1) + m.group(2).lower(), corpo_trecho[0])
        # fonte do trecho em itálico
        corpo_trecho = ["_" + q.strip("_ ") + "_" if fonte.fullmatch(q.strip("_ ")) else q for q in corpo_trecho]
        if tit.startswith("~"):
            # "Transcrições breves": trechinhos curtos agrupados numa seção só
            if not any(o.startswith("## ") and "Transcrições breves" in o for o in out):
                num += 1
                out.append(f"## {romano(num)} — Transcrições breves")
            out.append(f"### {tit[1:]}")
        else:
            num += 1
            out.append(f"## {romano(num)} — {tit}")
        out.extend(corpo_trecho)
    if sobra:
        out.extend(sobra)
    return "\n\n".join(limpar_simbolos(x) if not x.startswith("## ") else x for x in out), len(trechos)


def limpar_simbolos(t):
    r"""
    Lixo de OCR recorrente nas edições de 1920: a Antologia usava o "¿" de
    abertura de pergunta (e "¡" de exclamação), que o OCR lê como ^ % & \ .
    O português de hoje não usa esses sinais: removidos quando abrem uma
    frase. "&c." fica.
    """
    t = re.sub(r"(^|(?<=[\s(«—]))[\^%\\]\s?(?=[A-Za-zÀ-ÿ«])", "", t)
    t = re.sub(r"(^|(?<=[\s(«—]))&\s?(?=(?!c\.)[A-Za-zÀ-ÿ]{2,})", "", t)
    t = re.sub(r"(?<=[\w-])\^(?=\s|$)", "", t)       # "avocando-^" no fim
    t = re.sub(r"(?<=[.;,:!?])\^(?=[A-ZÀ-Ý])", " ", t)  # "venenosos.^Quem"
    t = re.sub(r"(?<=[A-Za-zÀ-ÿ])\^(?=[a-zà-ÿ])", "", t)  # "V^os"
    t = re.sub(r"(^|(?<=[\s(«—]))&(?=[A-ZÀ-Ý]\b)", "", t)  # "&E que"
    # "¿Onde" lido como "jOnde": j minúsculo colado em maiúscula não existe em português
    t = re.sub(r"(^|(?<=[\s(«—]))j(?=[A-ZÁÉÍÓÚ][a-zà-ÿ])", "", t)
    t = t.replace("■", "").replace("~", " ")
    t = re.sub(r"\((\d)>", r"(\1)", t)                 # "(3>" -> "(3)"
    t = re.sub(r"(?<=\s)i(\d)\)", r"(\1)", t)          # "i2)" -> "(2)"
    t = re.sub(r"(\w)- -(\w)", r"\1-\2", t)             # "vender- -lha"
    t = re.sub(r"[ \t]{2,}", " ", t)
    return t.strip()

def _norm(x):
    import unicodedata
    x = unicodedata.normalize("NFD", x.lower())
    x = "".join(c for c in x if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", re.sub(r"[^a-z ]", " ", x)).strip()


def _sim(a, b):
    import difflib
    return difflib.SequenceMatcher(None, _norm(a), _norm(b)).ratio()


CABECALHO_PAGINA = re.compile(
    r".{0,6}\b(A\w{0,2}T\w{0,2}O\w{0,3}G\w{0,2}|B\w{1,3}R\w{1,3}ARD\w{1,3}|Y?V?O[Ll]\.?)\b.{0,8}"
)


def _parece_titulo(q):
    letras = sum(ch.isalpha() for ch in q)
    return 3 < len(q) < 90 and letras >= 3 and sum(ch.isupper() for ch in q) >= 0.6 * letras


def localizar_titulos(ps, titulos, limiar=0.42):
    """
    Posição de cada título do índice impresso no OCR, em ordem.

    1. Candidatos: parágrafos em caixa alta (títulos em versalete, mesmo mal
       lidos), sem os cabeçalhos de página ("BERXARDES 17", "VOL. II").
    2. Alinhamento ótimo por programação dinâmica (tipo Needleman–Wunsch):
       casa título e candidato só acima de `limiar` de semelhança, e admite
       lacunas dos dois lados — um título que o OCR estragou não empurra os
       seguintes para o lugar errado.
    3. Títulos sem par: procura só no intervalo entre os vizinhos já
       confirmados, com critério mais brando (inclui linhas curtas como "JOGO").
    Devolve {i_titulo: i_paragrafo}; quem ficar de fora não é chutado.
    """
    cand = []
    for i, p in enumerate(ps):
        q = p.strip()
        if _parece_titulo(q) and not CABECALHO_PAGINA.fullmatch(q):
            if cand and cand[-1][0] >= i - 2 and cand[-1][2]:
                cand[-1] = (cand[-1][0], cand[-1][1] + " " + q, False)  # título em 2 linhas
                continue
            cand.append((i, q, True))
    cand = [(i, q) for i, q, _ in cand]
    n, m = len(titulos), len(cand)
    S = [[_sim(titulos[i], cand[j][1]) for j in range(m)] for i in range(n)]
    D = [[0.0] * (m + 1) for _ in range(n + 1)]
    B = [[None] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        B[i][0] = "t"
    for j in range(1, m + 1):
        B[0][j] = "c"
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            D[i][j], B[i][j] = max(
                (D[i - 1][j - 1] + S[i - 1][j - 1] - limiar, "m"), (D[i][j - 1], "c"), (D[i - 1][j], "t")
            )
    pos = {}
    i, j = n, m
    while i > 0 or j > 0:
        op = B[i][j]
        if op == "m":
            if S[i - 1][j - 1] >= limiar:
                pos[i - 1] = cand[j - 1][0]
            i, j = i - 1, j - 1
        elif op == "c":
            j -= 1
        else:
            i -= 1
    # lacunas: entre os vizinhos confirmados. Primeiro o sinal exato — o
    # numeral da seção sozinho numa linha ("XXYIII" = XXVIII com V lido como
    # Y; o III do vol. II de Bernardes nem tem título impresso) —, depois a
    # semelhança de texto, com limiar alto para não casar com qualquer linha
    for t in range(n):
        if t in pos:
            continue
        ini = max([pos[k] for k in pos if k < t], default=-1) + 1
        fim = min([pos[k] for k in pos if k > t], default=len(ps))
        esperado = romano(t + 1)
        for k in range(ini, fim):
            q = ps[k].strip().rstrip(".")
            if q.translate(str.maketrans({"Y": "V", "l": "I", "í": "I", "Í": "I", "1": "I"})) == esperado:
                pos[t] = k
                break
        if t in pos:
            continue
        melhor = (0.0, None)
        for k in range(ini, fim):
            q = ps[k].strip()
            if 2 < len(q) < 90 and sum(ch.isupper() for ch in q) >= 0.5 * max(1, sum(ch.isalpha() for ch in q)):
                r = _sim(titulos[t], q)
                if r > melhor[0]:
                    melhor = (r, k)
        if melhor[1] is not None and melhor[0] >= 0.45:
            pos[t] = melhor[1]
    return pos


def limpar_por_titulos(texto, cfg):
    """Divide pelos títulos do índice impresso localizados no OCR (ver localizar_titulos)."""
    corpo = limpar(texto, {**cfg, "sem_secoes": True})
    ps = corpo.split("\n\n")
    titulos = cfg["titulos"]
    pos = localizar_titulos(ps, titulos)
    if len(pos) != len(titulos) or sorted(pos.values()) != [pos[i] for i in range(len(titulos))]:
        faltam = [titulos[i] for i in range(len(titulos)) if i not in pos]
        return None, f"{len(pos)} de {len(titulos)} títulos localizados; sem par: {faltam}"
    out = ps[: pos[0]] if cfg.get("manter_antes") else []
    for n, t in enumerate(titulos):
        fim = pos[n + 1] if n + 1 < len(titulos) else len(ps)
        bloco = ps[pos[n]:fim]
        # o parágrafo do título (e uma 2ª linha dele, capitular e numeral) sai
        k = 1
        capitular = ""
        while k < len(bloco) and k < 4:
            q = bloco[k].strip()
            if re.fullmatch(r"[A-ZÁÉÍÓÚÂÊÔÃÕÇ][’'`.,]?", q):
                capitular = q[0]
            elif _parece_titulo(q) or re.fullmatch(r"[IVXLCYlíÍ1xn]{1,8}\.?", q, re.I) or len(q) <= 2:
                pass
            else:
                break
            k += 1
        corpo_bloco = [q for q in bloco[k:] if q.strip() not in cfg.get("remover_paragrafos", ())]
        if corpo_bloco and capitular and corpo_bloco[0][:1].islower():
            corpo_bloco[0] = capitular + corpo_bloco[0]
        if corpo_bloco:
            # versalete da 1ª palavra: "ENCONTRANDO-SE Juliano" -> "Encontrando-se Juliano"
            corpo_bloco[0] = re.sub(
                r"^([A-ZÁÉÍÓÚÂÊÔÃÕÇ])([A-ZÁÉÍÓÚÂÊÔÃÕÇ-]+)(?=[ ,;:.])",
                lambda mm: mm.group(1) + mm.group(2).lower(), corpo_bloco[0],
            )
            for errado, certo in cfg.get("correcoes", {}).items():
                corpo_bloco[0] = corpo_bloco[0].replace(errado, certo)
        out.append(f"## {cfg.get('prefixo_numeral', True) and romano(n + 1) + ' — ' or ''}{t}")
        out.extend(corpo_bloco)
    return "\n\n".join(limpar_simbolos(x) if not x.startswith("## ") else x for x in out), len(titulos)


def romano(n):
    vals = [(40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]
    r = ""
    for v, s in vals:
        while n >= v:
            r += s
            n -= v
    return r


OBRAS = {
    "bernardes-antologia-1": {
        "archive": "novaflorestaesti01bernuoft",
        "arquivo": "bernardes-antologia-nova-floresta.md",
        "inicio": "Transcrições",
        "fim": "FIM DO PRIMEIRO VOLUME",
        "cabecalhos": [r"\S{1,5} ANTOLOGIA", r"BERNARDES \S{1,5}", r"ANTOLOGIA", r"BERNARDES", r"\* \*"],
        "modo": "antologia",
        "pular": r"Transcrições da «Nova Floresta»",
        # o OCR lê "Nova" de muitos jeitos ("Nooa", "Nota", "Nora", "CNova",
        # "ÍNoca"), e às vezes a fonte perde o parêntese; ancora em "Floresta,"
        "fonte_trecho": r".{0,7}Floresta[,.][^\n]{1,80}",
        "titulos": [
            "Desigualdade no casamento", "Pátrias", "Amigo “do meu” e não amigo “meu”",
            "Grande demanda entre frades e formigas", "Velhice", "Eulógio, o “novo rico”",
            "Luxo e enfeite nas mulheres", "História de São Filemon e Santo Ariano",
            "Alfândegas das almas", "Os portugueses, flagelo de mouros", "O dragão de Rodes",
            "A espada da lei", "Necessidade e apetite", "O furto do selo régio",
            "A abadia de São Dionísio", "D. João de Castro e o gibão", "Sixto V",
            "Demônios e ondinas", "Bailes e bailarinos", "O vinho e o chocolate",
            "Mulheres caluniadoras", "Conversão do tribuno Quirino",
            "Exemplos de gratidão nos animais", "Calúnia de imperatriz",
            "Maus juízes e bons empenhos", "Justiça cega", "Inferno e purgatório", "Homicídios",
            "Pão e justiça", "Condenação do duelo", "Os santos não se medem a palmos",
            "A lentidão burocrática e a “preguiça” do Brasil", "Falam os mudos e os infantes",
            "Um confessor esfolado", "Humildade", "Formosura", "As pérolas e os bichos", "Esperança",
        ],
        "secoes_esperadas": 38,
        "proveniencia": {
            "Obra": "_Nova Floresta_ (1706–1728), em seleção: Antologia Portuguesa, _Bernardes_, vol. I, 2ª ed.",
            "Autor": "Padre Manuel Bernardes (1644–1710)",
            "Tradutor": "texto original (sem tradução). Seleção, títulos dos trechos, abreviações e ortografia atualizada de Agostinho de Campos (1870–1944), organizador da Antologia Portuguesa",
            "Edição/Fonte": "Lisboa/Paris: Aillaud & Bertrand, 1920. Escaneamento da Universidade de Toronto no Internet Archive: https://archive.org/details/novaflorestaesti01bernuoft (OCR revisado por script, sem revisão humana linha a linha)",
            "Domínio público porque": "autor falecido em 1710 e organizador falecido em 1944 (art. 41, Lei 9.610/98: 70 anos contados de 1º de janeiro do ano seguinte à morte); edição em PD no Brasil desde 1º/01/2015",
            "Obra original em": "português",
            "Licença do arquivo": "Domínio Público (PD-Brasil)",
            "Data de verificação PD": "2026-09-28",
        },
        "titulo": "Nova Floresta (Antologia)",
    },
    "bernardes-antologia-2": {
        "archive": "novaflorestaesti02bernuoft",
        "arquivo": "bernardes-antologia-estimulo-luz-e-calor.md",
        "inicio": "Transcrições",
        "fim": "SEGUNDO VOLUM",
        "cabecalhos": [r"\S{1,5} ANTOLOGIA", r"BERNARDES \S{1,5}", r"ANTOLOGIA", r"BERNARDES", r"\* \*"],
        "modo": "titulos",
        # capitulares que o OCR perdeu (conferidas no escaneamento)
        "correcoes": {"Ntre Deus": "Entre Deus"},
        # títulos ilegíveis que sobraram no início da seção (o título certo
        # vem do índice): XIII "O mundo passa" e o subtítulo do II
        "remover_paragrafos": ["o inrnviK» pahsa", "(O Gran Lama)"],
        "fonte_trecho": r".{0,7}(Floresta|Est[íi]mulo|Luz\s+e\s+Calor|[ÚU]ltimos\s+Fins|Exerc[íi]cios|Sermões|Pão\s+partido|Armas\s+da\s+Castidade|Tratados?|Paraíso|Os\s+[ÚU]ltimos)[^\n]{0,90}",
        "titulos": ['Juliano Apóstata', 'A soberba e a morte (O Grão-Lama)', 'O alquimista', 'Henrique III empenha o gibão para cear', 'D. Jaime de Bragança e o pobre', 'Eremitas, anacoretas e cenobitas', 'Futilidade e gongorismo', 'A virtude do silêncio', 'Desprezo das ofensas', 'O menino ressuscitado', 'O monge e o passarinho', 'A lição do cadáver', 'O mundo passa', 'Embaixada de D. Manuel ao Papa', 'A prodigiosa menina Teresinha de Jesus', 'O assalto à catedral de Antuérpia', 'Frechas e frecheiros', 'Martírio de S. Tiemo', 'Astrólogos e agoiros', 'Os setenta camelos', 'A vida é morte', 'A divina fiança', 'Piques e despiques', 'Duo in carne una', 'Jogo', 'Portugueses e espanhóis', 'Sentenças e avisos espirituais', 'Pasquins', 'Bibliotecas e Bíblia', 'Os hóspedes exigentes', 'Os três cegos', 'Arte de ter amigos', 'Frei Bartolomeu dos Mártires em Roma', 'Bugiarias monásticas', "Transcrições breves"],
        "secoes_esperadas": 35,
        "proveniencia": {
            "Obra": "Trechos da _Nova Floresta_, do _Estímulo Prático_, de _Luz e Calor_, dos _Últimos Fins do Homem_ e dos _Exercícios Espirituais_, em seleção: Antologia Portuguesa, _Bernardes_, vol. II, 2ª ed.",
            "Autor": "Padre Manuel Bernardes (1644–1710)",
            "Tradutor": "texto original (sem tradução). Seleção, títulos dos trechos, abreviações e ortografia atualizada de Agostinho de Campos (1870–1944), organizador da Antologia Portuguesa",
            "Edição/Fonte": "Lisboa/Paris: Aillaud & Bertrand, 1920. Escaneamento da Universidade de Toronto no Internet Archive: https://archive.org/details/novaflorestaesti02bernuoft (OCR revisado por script, sem revisão humana linha a linha)",
            "Domínio público porque": "autor falecido em 1710 e organizador falecido em 1944 (art. 41, Lei 9.610/98); edição em PD no Brasil desde 1º/01/2015",
            "Obra original em": "português",
            "Licença do arquivo": "Domínio Público (PD-Brasil)",
            "Data de verificação PD": "2026-09-28",
        },
        "titulo": "Estímulo Prático, Luz e Calor e outros escritos (Antologia)",
    },
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in OBRAS:
        print("obras:", ", ".join(OBRAS))
        sys.exit(1)
    chave = sys.argv[1]
    cfg = OBRAS[chave]
    if cfg.get("modo") == "antologia":
        corpo, achados = limpar_antologia(baixar(cfg["archive"]), cfg)
        if corpo is None:
            print(f"{chave}: {achados} trechos pela fonte, índice impresso tem {len(cfg['titulos'])} — DIVERGE")
            sys.exit(1)
    elif cfg.get("modo") == "titulos":
        corpo, info = limpar_por_titulos(baixar(cfg["archive"]), cfg)
        if corpo is None:
            print(f"{chave}: {info} — DIVERGE")
            sys.exit(1)
    else:
        corpo = limpar(baixar(cfg["archive"]), cfg)
    if cfg.get("modo") == "titulos":
        secoes = len(re.findall(r"^## ", corpo, re.M))
    else:
        secoes = len(re.findall(r"^#{2,3} (?!.*— Transcrições breves$)", corpo, re.M))
    ok = secoes == cfg["secoes_esperadas"]
    print(f"{chave}: {secoes} seções (índice impresso: {cfg['secoes_esperadas']}) {'OK' if ok else 'DIVERGE'}, {len(corpo)//1024} KB")
    if "--check" in sys.argv:
        return
    if not ok:
        raise SystemExit("contagem de seções diverge do índice impresso: revisar antes de gravar")
    prov = "\n".join(f"- **{k}**: {v}" for k, v in cfg["proveniencia"].items())
    md = f"# Proveniência\n\n{prov}\n\n---\n\n# {cfg['titulo']}\n\n{corpo}\n"
    with open(os.path.join(TEXTS_DIR, cfg["arquivo"]), "w", encoding="utf-8") as f:
        f.write(md)
    print("gravado:", cfg["arquivo"])


if __name__ == "__main__":
    main()
