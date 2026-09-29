#!/usr/bin/env python3
"""
Divide em capítulos os .md importados do Gutenberg pelo import_pipeline.py.

O pipeline grava o texto corrido, sem nenhum heading além do título. O
leitor (web/src/utils/chapters.ts) divide a obra por `#`/`##`; sem eles, a
obra inteira vira um capítulo só e o react-markdown processa tudo de uma
vez (gargalo medido nas Confissões: ~23s de primeira pintura).

Cada obra do Gutenberg marca capítulos de um jeito, então há uma regra por
arquivo. Além dos headings, o script remove o recuo das linhas: em
markdown, linha com 4+ espaços vira bloco de código, e vários textos do
Gutenberg (Hipólito, Crisóstomo) são recuados.

Uso:
  python3 scripts/chapterize_texts.py            # aplica em todos os arquivos com regra
  python3 scripts/chapterize_texts.py --check    # só relata, não grava

Idempotente: arquivo que já tem `##` no corpo é pulado.
"""
import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXTS_DIR = os.path.join(BASE_DIR, "server/texts")

SMALL_WORDS = {
    "a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into",
    "nor", "of", "on", "or", "the", "to", "with", "whether", "is", "be",
}
# numeral romano válido ("ILL", de "GOOD AND ILL FORTUNE", não é)
ROMAN = re.compile(r"^(?=[IVXLC])C{0,3}(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$")


def title_case(text):
    """'THE NATURE AND EXTENT OF SACRED DOCTRINE' -> 'The Nature and Extent of Sacred Doctrine'."""
    words = text.strip().split()
    out = []
    for i, w in enumerate(words):
        core = re.sub(r"[^\w']", "", w)
        if ROMAN.match(core) and len(core) > 1 or core in ("QQ", "Q"):
            out.append(w)
        elif i > 0 and core.lower() in SMALL_WORDS:
            out.append(w.lower())
        else:
            out.append(w[:1].upper() + w[1:].lower())
    return " ".join(out)


def split_header(text):
    """Separa o bloco de Proveniência + título (intocado) do corpo da obra."""
    lines = text.split("\n")
    # o título da obra é o segundo `# ` do arquivo (o primeiro é "# Proveniência")
    h1 = [i for i, l in enumerate(lines) if l.startswith("# ")]
    cut = h1[1] + 1
    return lines[:cut], lines[cut:]


def dedent(lines):
    return [l.strip() for l in lines]


def next_nonblank(lines, i):
    j = i + 1
    while j < len(lines) and not lines[j].strip():
        j += 1
    return j


def take_paragraph(lines, i):
    """Junta as linhas do parágrafo que começa em i. Retorna (texto, índice após o parágrafo)."""
    parts = []
    j = i
    while j < len(lines) and lines[j].strip():
        parts.append(lines[j].strip())
        j += 1
    return " ".join(parts), j


# ---------------------------------------------------------------- Suma

ORDINALS = {w: i + 1 for i, w in enumerate(
    "FIRST SECOND THIRD FOURTH FIFTH SIXTH SEVENTH EIGHTH NINTH TENTH ELEVENTH "
    "TWELFTH THIRTEENTH FOURTEENTH FIFTEENTH SIXTEENTH SEVENTEENTH".split())}
ARTICLE_LINE = re.compile(r"^([A-Z]+) ARTICLE\b(.*)$")
TAG_Q = re.compile(r"Q[.,]*\s*,?\s*(\d+)")
ARTICLES_NOTE = re.compile(r"\s*\((?:In )?[\w-]+ Articles?\)", re.I)
SEPARATOR = re.compile(r"^_{5,}$")


def is_caps_title(line):
    first = line.split()[0] if line.split() else ""
    letters = re.sub(r"[^A-Za-z]", "", first)
    return len(letters) >= 2 and letters.isupper()


def chapterize_summa(body):
    """
    Questões são capítulos (##), artigos são subtítulos (###), tratados são partes (#).

    O texto do Gutenberg é irregular: "QUESTION n" às vezes falta (I q.116,
    II-II q.183), às vezes falta o cabeçalho inteiro (I-II q.1, II-II q.1),
    às vezes aparece no lugar de "FIRST ARTICLE" (I-II q.23); a etiqueta
    "[I, Q. n, Art. m]" tem dezenas de grafias; questões de artigo único não
    têm etiqueta nenhuma. Por isso três sinais combinados: linha "QUESTION n",
    bloco em caixa alta + "(In N Articles)", e a etiqueta do artigo como reserva.
    """
    lines = dedent(body)
    out = []
    last_q = 0
    last_sep = None      # posição em `out` do último separador "____" ou tratado
    pending = None       # cabeçalho de questão sem número, à espera da etiqueta
    i = 0

    def open_question(q, title, at=None):
        nonlocal last_q
        head = f"## Question {q}" + (f" — {title_case(title)}" if title else "")
        if at is None:
            out.append(head)
        else:
            out.insert(at, "")
            out.insert(at + 1, head)
        last_q = q

    while i < len(lines):
        l = lines[i]

        if re.match(r"^TREATISE ON .*\(QQ?\. [\d\-, ]+\)$", l):
            out.append("# " + title_case(l))
            last_sep = len(out)
            i += 1
            continue

        if SEPARATOR.match(l):
            out.append(l)
            last_sep = len(out)
            i += 1
            continue

        m = re.match(r"^QUESTION (\d+)$", l)
        if m:
            j = next_nonblank(lines, i)
            if j < len(lines) and is_caps_title(lines[j]):
                title, after = take_paragraph(lines, j)
                open_question(int(m.group(1)), ARTICLES_NOTE.sub("", title))
                i = after
                continue
            # "QUESTION n" no lugar de "FIRST ARTICLE" (erro do Gutenberg)
            title, after = take_paragraph(lines, j)
            out.append(f"### Article 1 — {title}")
            i = after
            continue

        # cabeçalho sem "QUESTION n": caixa alta + "(In N Articles)"
        if is_caps_title(l) and not ARTICLE_LINE.match(l) and last_sep == len(out) - (1 if out and not out[-1] else 0):
            title, after = take_paragraph(lines, i)
            if ARTICLES_NOTE.search(title):
                pending = len(out)
                out.append("## Question ?")
                out.append(ARTICLES_NOTE.sub("", title))
                i = after
                continue

        m = ARTICLE_LINE.match(l)
        if m and m.group(1) in ORDINALS:
            art = ORDINALS[m.group(1)]
            tq = TAG_Q.search(m.group(2))
            q = int(tq.group(1)) if tq else last_q
            if pending is not None:
                title = out.pop(pending + 1)
                out[pending] = f"## Question {q} — {title_case(title)}"
                last_q = q
                pending = None
            elif art == 1 and last_q < q <= last_q + 3:
                # questão sem cabeçalho nenhum: abre depois do último separador
                open_question(q, "", at=last_sep if last_sep is not None else len(out))
            j = next_nonblank(lines, i)
            title, after = take_paragraph(lines, j)
            out.append(f"### Article {art} — {title}")
            i = after
            continue

        out.append(l)
        i += 1
    return out


# ---------------------------------------------------------------- Lutero, Gálatas

def chapterize_galatians(body):
    lines = dedent(body)
    out = []
    for l in lines:
        if l in ("PREFACE", "FROM LUTHER’S INTRODUCTION, 1538"):
            out.append("## " + title_case(l))
        elif re.match(r"^CHAPTER \d+$", l):
            out.append("## " + title_case(l))
        else:
            m = re.match(r"^VERSES? ([\d\-–, ]+)\.", l)
            if m:
                out.append(f"### Verse {m.group(1).strip()}")
                out.append("")
            out.append(l)
    return out


# ---------------------------------------------------------------- Baxter

def chapterize_baxter(body):
    lines = dedent(body)
    out = []
    i = 0
    while i < len(lines):
        l = lines[i]
        m = re.match(r"^CHAP\. ([IVXL]+)\.$", l)
        if m:
            j = next_nonblank(lines, i)
            title, after = take_paragraph(lines, j)
            if title.startswith("_"):  # entrada do sumário, não o capítulo
                out.append(l)
                i += 1
                continue
            head = f"## Chapter {m.group(1)}"
            if len(title) <= 160:
                out.append(f"{head} — {title.rstrip('.')}")
                i = after
            else:
                out.append(head)
                i += 1
            continue
        if l == "CONTENTS.":
            out.append("## Contents")
        else:
            out.append(l)
        i += 1
    return out


# ---------------------------------------------------------------- Bernardo, Malaquias

MALACHY_SECTIONS = {
    "INTRODUCTION": "Introduction",
    "LETTERS OF ST. BERNARD": "Letters of St. Bernard",
    "SERMONS OF ST. BERNARD ON THE PASSING OF MALACHY": "Sermons of St. Bernard on the Passing of Malachy",
    "ADDITIONAL NOTES": "Additional Notes",
    "APPENDIX.": "Appendix",
    "INDEX": "Index",
}


def chapterize_malachy(body):
    lines = dedent(body)
    out = []
    for l in lines:
        if l in MALACHY_SECTIONS:
            out.append("## " + MALACHY_SECTIONS[l])
        elif re.match(r"^CHAPTER [IVXL]+\.?$", l):
            out.append("## Life of St. Malachy — " + title_case(l.rstrip(".")))
        elif l == "FOOTNOTES:":
            out.append("### Footnotes")
        else:
            out.append(l)
    return out


# ---------------------------------------------------------------- Tomás, On Prayer

def chapterize_on_prayer(body):
    lines = dedent(body)
    out = []
    intro_seen = 0
    in_body = False
    i = 0
    while i < len(lines):
        l = lines[i]
        if l == "INTRODUCTION":
            intro_seen += 1
            # o 1º INTRODUCTION é do sumário; o corpo começa no 2º
            in_body = intro_seen >= 2
            out.append("## Introduction" if in_body else l)
        elif l == "PREFACE" and not in_body:
            out.append("## Preface")
        elif in_body and re.match(r"^QUESTION [LXVIC]+$", l):
            j = next_nonblank(lines, i)
            title, after = take_paragraph(lines, j)
            if title.isupper() and len(title) < 120:
                out.append(f"## {title_case(l)} — {title_case(title)}")
                i = after
                continue
            out.append("## " + title_case(l))
        elif in_body and re.match(r"^[IVXL]+$", l):
            out.append(f"### Article {l}")
        elif in_body and l in ("INDEX", "INDEX OF TEXTS QUOTED OR EXPLAINED"):
            out.append("## " + title_case(l))
        elif l == "FOOTNOTES:":
            out.append("### Footnotes")
        else:
            out.append(l)
        i += 1
    return out


# ---------------------------------------------------------------- Melanchthon, Apologia

def chapterize_apology(body):
    lines = dedent(body)
    # títulos das partes vêm do sumário do próprio arquivo ("Part One: ...")
    toc = [l for l in lines if re.match(r"^Part [\w-]+ ?:", l)]
    titles = [re.sub(r"^(Part [\w-]+) ?: ?", r"\1: ", t) for t in toc]
    out = []
    for l in lines:
        m = re.match(r"^(?:Part|PART) (\d+)$", l)
        if m and 1 <= int(m.group(1)) <= len(titles):
            out.append("## " + titles[int(m.group(1)) - 1])
        elif l == "INTRODUCTION":
            out.append("## Introduction")
        elif re.match(r"^Articles? [IVXL ()and]+: _.*_\.?$", l):
            out.append("### " + l.replace("_", ""))
        else:
            out.append(l)
    return out


# ---------------------------------------------------------------- Hipólito

def chapterize_hippolytus(body):
    lines = dedent(body)
    out = []
    in_notes = False
    for l in lines:
        if l in ("PREFATORY NOTE", "CONTENTS", "INTRODUCTION"):
            out.append("## " + title_case(l))
        elif l in ("I. CHURCH ORDERS", "II. HIPPOLYTUS"):
            out.append("## Introduction, " + title_case(l))
        elif l == "THE APOSTOLIC TRADITION OF HIPPOLYTUS":
            out.append("# The Apostolic Tradition — Translation")
        elif l == "NOTES":
            in_notes = True
            out.append("# Notes")
        elif re.match(r"^PART [IVX]+$", l):
            out.append(("## Notes, " if in_notes else "## ") + title_case(l))
        elif l == "INDEXES":
            out.append("## Indexes")
        else:
            out.append(l)
    return out


# ---------------------------------------------------------------- Crisóstomo

def chapterize_chrysostom(body):
    raw = body
    lines = dedent(body)
    out = []
    in_body = False
    part_count = 0
    i = 0
    while i < len(lines):
        l = lines[i]
        m = re.match(r"^PART ([IVX]+)\.$", l)
        if m:
            part_count += 1
            in_body = part_count > 3  # as 3 primeiras são do sumário
            if in_body:
                j = next_nonblank(lines, i)
                sub = lines[j].rstrip(".") if lines[j].isupper() else ""
                out.append(f"# Part {m.group(1)}" + (f" — {title_case(sub)}" if sub else ""))
                i = j + 1 if sub else i + 1
                continue
        # carta ao papa: único título sem a fonte entre parênteses logo abaixo
        if in_body and l == "To Innocent, Bishop of Rome.[26]":
            out.append("## To Innocent, Bishop of Rome")
            i += 1
            continue
        # fim da obra: índice e depois catálogo da editora (sem capítulos)
        if l == "INDEX." and in_body:
            in_body = False
            out.append("## Index")
            i += 1
            continue
        if l == "NEW BOOKS.":
            out.append("## Publisher's Catalogue (1889)")
            i += 1
            continue
        if l == "ST. JOHN CHRYSOSTOM." and part_count == 3 and not in_body:
            out.append("## Preface — St. John Chrysostom")
            i += 1
            continue
        # homilia: linha centralizada no original seguida da fonte "(_Homilies ..._)"
        if in_body and raw[i].startswith(" ") and l and not l.startswith("("):
            j = next_nonblank(lines, i)
            if j < len(lines) and lines[j].startswith("(") and j - i <= 2:
                title = l
                if out and out[-1] and raw[i - 1].strip():  # título quebrado em duas linhas
                    title = out.pop() + " " + l
                out.append("## " + title.rstrip("."))
                i += 1
                continue
        out.append(l)
        i += 1
    return out


# ---------------------------------------------------------------- Didaquê

DIDACHE_SECTIONS = {
    "Introduction": "## Introduction",
    "USE OF THE HOLY SCRIPTURES IN THE “TEACHING.”¹": "## Use of the Holy Scriptures in the “Teaching”",
    "NOTES": "## Notes",
}


def chapterize_didache(body):
    lines = dedent(body)
    out = []
    greek_done = False
    in_greek = False
    for i, l in enumerate(lines):
        # no texto grego, a edição de 1884 numera as linhas (5, 10, 15...) e
        # hifeniza palavras na quebra; no markdown isso vira "θανά- του ... 5 Ἡ"
        if in_greek and re.match(r"^\d+$", l):
            continue
        if in_greek and out and out[-1].endswith("-") and l and not l.startswith("#"):
            out[-1] = out[-1][:-1] + l
            continue
        if l == "Teaching" and i + 2 < len(lines) and lines[i + 1] == "of the":
            in_greek = False
        if l in DIDACHE_SECTIONS:
            out.append(DIDACHE_SECTIONS[l])
        elif l.startswith("Κεφ. α΄") and not greek_done:
            greek_done = True
            in_greek = True
            out.append("## Greek Text (Διδαχὴ τῶν δώδεκα ἀποστόλων)")
            out.append("")
            out.append(l)
        elif l == "Teaching" and i + 2 < len(lines) and lines[i + 1] == "of the":
            out.append("## Translation")
            out.append("")
            out.append(l)
        else:
            out.append(l)
    return out


# ---------------------------------------------------------------- Lutero, Catecismo Maior

def chapterize_large_catechism(body):
    """Bente & Dau (Gutenberg #1722): 5 partes (#) e 21 seções (##)."""
    lines = dedent(body)
    out = []
    i = 0
    viu_prefacio = False
    while i < len(lines):
        l = lines[i]
        parte = re.fullmatch(r"\[?Part (First|Second|Third|Fourth|Fifth)\.\]?\s*(.*)", l)
        if parte:
            titulo = parte.group(2).strip()
            if not titulo:  # "Part Fourth." + "OF BAPTISM." na linha seguinte
                j = next_nonblank(lines, i)
                titulo, i = lines[j], j
            out.append(f"# Part {parte.group(1)}. {title_case(titulo.rstrip('.'))}")
        elif l == "Preface" and not viu_prefacio:
            viu_prefacio = True
            out.append("## Preface")
        elif re.fullmatch(r"The (First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth) Commandment\.|The Ninth and Tenth Commandments|Conclusion of the Ten Commandments\.|Article (I|II|III)\.|The (First|Second|Third|Fourth|Fifth|Sixth) Petition\.|The Seventh and Last Petition\.", l):
            out.append("## " + l.rstrip("."))
        else:
            out.append(l)
        i += 1
    return out


# ---------------------------------------------------------------- Agostinho, Confissões (Pusey)

def chapterize_confessions(body):
    """Pusey (Gutenberg #3296): 13 livros marcados "BOOK I" ... "BOOK XIII"."""
    out = []
    for l in dedent(body):
        m = re.fullmatch(r"BOOK ([IVX]+)", l)
        out.append(f"## Book {m.group(1)}" if m else l)
    return out


# ---------------------------------------------------------------- Boécio, Consolação (H. R. James)

def keep_line_breaks(lines):
    """Verso: cada linha termina em `\\` (quebra forçada), senão o markdown junta tudo num parágrafo."""
    out = []
    for i, l in enumerate(lines):
        nxt = lines[i + 1] if i + 1 < len(lines) else ""
        out.append(l + "\\" if l and nxt and not l.startswith("#") and not nxt.startswith("#") else l)
    return out


def dedent_keep_verse(body):
    """
    Como dedent(), mas bloco de verso (todas as linhas recuadas, a primeira
    podendo começar com "{n}") mantém as quebras de linha.
    """
    out = []
    for bloco in re.split(r"\n[ \t]*\n", "\n".join(body)):
        linhas = [l for l in bloco.split("\n")]
        cheias = [l for l in linhas if l.strip()]
        verso = len(cheias) > 1 and all(
            l[:1] in (" ", "\t") or (k == 0 and re.match(r"\{\d+\} ", l)) for k, l in enumerate(cheias)
        )
        out += (keep_line_breaks(dedent(cheias)) if verso else dedent(linhas)) + [""]
    return out


CONSOLATION_SECTIONS = {
    "PREFACE.": ("## Preface", "prose"),
    "PROEM.": ("## Proem", "prose"),
    "EPILOGUE.": ("## Epilogue", "prose"),
    "REFERENCES TO QUOTATIONS IN THE TEXT.": ("## References to Quotations in the Text", "verse"),
}


def chapterize_consolation(body):
    """
    H. R. James (1897). Cada livro aparece três vezes: no índice dos versos,
    como abertura (título + SUMMARY) e repetido antes do primeiro trecho.
    Só a abertura vira capítulo; a repetição sai. Cantos e trechos em prosa
    viram subtítulos (### Song I. ..., ### Chapter I, como o SUMMARY chama).
    O verso (cantos, índice, referências) mantém as quebras de linha.
    """
    lines = dedent(body)
    out, verse = [], []
    mode = "prose"  # "prose" | "verse" (canto ou referências) | "index"

    def flush():
        out.extend(keep_line_breaks(verse))
        verse.clear()

    def heading(text, new_mode):
        nonlocal mode
        flush()
        out.append(text)
        mode = new_mode

    i = 0
    while i < len(lines):
        l = lines[i]
        j = next_nonblank(lines, i)
        seguinte = lines[j] if j < len(lines) else ""
        book = re.fullmatch(r"BOOK ([IVX]+)\.", l)
        song = re.fullmatch(r"SONG ([IVX]+)\.(?:\[\w\])?", l)
        if l in CONSOLATION_SECTIONS:
            heading(*CONSOLATION_SECTIONS[l])
        elif l == "INDEX" and seguinte == "OF":
            heading("## Index of Verse Interludes", "index")
            i = next_nonblank(lines, j)  # pula "OF" e "VERSE INTERLUDES."
        elif book and mode != "index" or book and seguinte and lines[next_nonblank(lines, j)].rstrip(".").upper() == "SUMMARY":
            k = next_nonblank(lines, j)
            if k < len(lines) and lines[k].rstrip(".").upper() == "SUMMARY":
                heading(f"## Book {book.group(1)}. {title_case(seguinte.rstrip('.'))}", "prose")
                i = j
            # senão: repetição do "BOOK N." antes do primeiro trecho, sai
        elif song and mode != "index":
            heading(f"### Song {song.group(1)}. {title_case(seguinte.rstrip('.'))}", "verse")
            i = j
        elif re.fullmatch(r"[IVX]+\.", l) and mode != "index":
            heading(f"### Chapter {l.rstrip('.')}", "prose")
        elif mode == "index":
            # tira o nº de página da edição impressa, que não existe no site
            if book:
                verse.append(f"**Book {book.group(1)}. {title_case(seguinte.rstrip('.'))}**")
                i = j
            elif l.startswith("SONG") and l.endswith("PAGE"):
                pass
            else:
                m = re.fullmatch(r"([IVX]+)\.\s+(.+?)\s+\d+", l)
                # "INSATIABLENESS OK AVARICE": erro do índice impresso; o canto no corpo diz "OF"
                titulo = m and m.group(2).rstrip(".").replace(" OK ", " OF ")
                verse.append(f"Song {m.group(1)}. {title_case(titulo)}" if m else l)
        elif mode == "verse":
            verse.append(l)
        else:
            out.append(l)
        i += 1
    flush()
    return out


# ---------------------------------------------------------------- Pascal, Pensamentos (Trotter)

def chapterize_pensees(body):
    """
    Trotter (Gutenberg #18269, reimpressão Dutton de 1958). O arquivo traz
    material que NÃO está em domínio público no Brasil ou tem autoria
    incerta, e que sai daqui (regra de 2026-09-29: sem certeza, esconder):
    - a introdução de T. S. Eliot (1931; Eliot morreu em 1965);
    - as notas finais e o índice, que não estão na edição de Trotter de
      1910 (Harvard Classics) e não têm autor declarado. Os marcadores
      [n] das notas saem junto.
    Fica a tradução de Trotter (1871-1945): nota do editor e 14 seções.
    Os dois diagramas de Pascal (fragmentos 571 e 590) ficam num bloco que
    preserva o desenho; tirar o recuo deles embaralharia o esquema.
    """
    lines = []
    for bloco in re.split(r"\n\s*\n", "\n".join(body)):
        linhas = bloco.split("\n")
        if any(re.match(r"\s*(\d+ )?\{|.*__\|__", l) for l in linhas):
            lines += ["```text", *[l.rstrip() for l in linhas if l.strip()], "```", ""]
        else:
            lines += dedent(linhas) + [""]
    ini = lines.index("NOTE")
    fim = lines.index("NOTES")
    out = ["## Note"]
    i = ini + 1
    while i < fim:
        l = re.sub(r"\[\d+\]", "", lines[i])
        sec = re.fullmatch(r"SECTION ([IVX]+)", l)
        if sec:
            j = next_nonblank(lines, i)
            out.append(f"## Section {sec.group(1)}. {title_case(lines[j])}")
            i = j
        elif l.startswith("It has been seen fit to transfer Fragment 514"):
            # fala das notas finais, que saíram; pula o parágrafo
            _, i = take_paragraph(lines, i)
            continue
        elif re.fullmatch(r"\d+", l):
            out.append(f"**{l}**")  # número do fragmento
        else:
            out.append(l)
        i += 1
    return out


# ---------------------------------------------------------------- Bunyan, Grace Abounding (RTS, 1905)

def split_by_paragraph_number(lines, titulo, limite=45_000, numero=r"(\d+)\.\s"):
    """
    Divide um trecho longo em capítulos nos parágrafos numerados ("12.  ...")
    do próprio autor, com ~`limite` caracteres cada. O título diz a faixa
    (ex.: "Grace Abounding, §§ 1–58"), então não inventa divisão editorial.
    """
    partes, atual, tam = [], [], 0
    for l in lines:
        m = re.match(numero, l)
        if m and tam > limite:
            partes.append(atual)
            atual, tam = [], 0
        atual.append(l)
        tam += len(l) + 1
    if partes and tam < limite / 4:
        partes[-1] += atual  # sobra pequena vai junto do trecho anterior
    else:
        partes.append(atual)
    out, inicio = [], 1
    for parte in partes:
        nums = [int(m.group(1)) for l in parte if (m := re.match(numero, l))]
        primeira = next((l for l in parte if l.strip()), "")
        if (m := re.match(numero, primeira)):
            inicio = int(m.group(1))  # senão, o 1º parágrafo não tem número impresso (Grace Abounding, § 1)
        fim = max(nums) if nums else inicio
        out += [f"## {titulo}, §§ {inicio}–{fim}", ""] + parte
        inicio = fim + 1
    return out


GRACE_SECTIONS = [
    # (começo exato da linha, heading)
    ("PREFATORY NOTE", "## Prefatory Note"),
    ("A PREFACE", "## A Preface"),
    ("GRACE ABOUNDING TO THE CHIEF OF SINNERS", None),  # dividido por parágrafos
    ("_A brief Account of the Author’s Call to the Work of the Ministry_", "## A Brief Account of the Author’s Call to the Work of the Ministry"),
    ("A BRIEF ACCOUNT OF THE AUTHOR’S IMPRISONMENT", "## A Brief Account of the Author’s Imprisonment"),
    ("THE CONCLUSION", "## The Conclusion"),
    ("A RELATION OF MY IMPRISONMENT IN THE MONTH OF NOVEMBER 1660", "## A Relation of My Imprisonment in the Month of November 1660"),
    ("_A Continuation of_ Mr BUNYAN’S LIFE", "## A Continuation of Mr Bunyan’s Life"),
    ("_A brief Character of Mr_ JOHN BUNYAN", "## A Brief Character of Mr John Bunyan"),
    ("POSTSCRIPT", "## Postscript"),
    ("FOOTNOTES", "## Footnotes"),
]


def chapterize_grace_abounding(body):
    """
    RTS, 1905 (Gutenberg). O sumário impresso (com nº de página) sai. A
    parte principal (§§ 1–339, ~170 KB) é dividida nos parágrafos numerados
    de Bunyan, até o "Call to the Work of the Ministry".
    """
    lines = dedent_keep_verse(body)
    # posição de cada seção: a primeira linha que é exatamente o começo
    # (as do sumário têm nº de página no fim e não batem)
    # (procura em sequência: "GRACE ABOUNDING..." também está na folha de rosto)
    pos, ini = [], 0
    for comeco, head in GRACE_SECTIONS:
        i = next(i for i in range(ini, len(lines)) if lines[i] == comeco or (comeco.startswith("_") and lines[i].startswith(comeco)))
        pos.append((i, head))
        ini = i + 1
    out = lines[:pos[0][0]]
    for n, (i, head) in enumerate(pos):
        fim = pos[n + 1][0] if n + 1 < len(pos) else len(lines)
        if head is None:
            # o título ocupa um bloco ("GRACE ABOUNDING... / OR, / A BRIEF
            # RELATION..."); o subtítulo fica em itálico no primeiro trecho
            j = i
            while lines[j]:
                j += 1
            subtitulo = " ".join(lines[i + 2:j])
            partes = split_by_paragraph_number(lines[j:fim], "Grace Abounding")
            out += partes[:2] + [f"_Or, {title_case(subtitulo)}_"] + partes[2:]
        elif head.endswith("Life"):
            # o título longo ("_A Continuation of_ Mr BUNYAN’S LIFE; _beginning
            # where he left off_...") fica como subtítulo, do jeito que está
            out += [head, ""] + lines[i:fim]
        else:
            corpo = lines[i + 1:fim]
            if "CONTENTS" in corpo:  # sumário impresso, com nº de página
                corpo = corpo[:corpo.index("CONTENTS")]
            if head == "## A Preface":  # "OR, BRIEF ACCOUNT OF THE PUBLISHING..." em caixa alta
                k = next_nonblank(corpo, -1)
                subtitulo, fim_sub = take_paragraph(corpo, k)
                corpo = [f"_{title_case(subtitulo)}_"] + corpo[fim_sub:]
            out += [head, ""] + corpo
    return out


# ---------------------------------------------------------------- Bunyan, Pilgrim's Progress (Gutenberg)

def chapterize_pilgrim(body):
    """
    Parte I (Gutenberg #131). O original não tem capítulos; a transcrição
    numera seções {1}–{406}, e a narrativa é dividida nelas (~45 KB cada),
    com a faixa no título. Os versos (Apologia, Conclusão) mantêm as quebras.
    """
    lines = dedent_keep_verse(body)
    apol = lines.index("The Author's Apology for his Book")
    narr = next(i for i in range(apol, len(lines)) if lines[i] == "THE PILGRIM'S PROGRESS")
    concl = next(i for i, l in enumerate(lines) if re.fullmatch(r"\{\d+\} The Conclusion\.", l))
    fim = next((i for i, l in enumerate(lines) if l.startswith("End of") and "Gutenberg" in l), len(lines))
    j = next_nonblank(lines, narr)  # "In the Similitude of a Dream"
    out = lines[:apol]
    out += ["## The Author's Apology for His Book", ""] + lines[apol + 1:narr]
    partes = split_by_paragraph_number(lines[j + 1:concl], "The Pilgrim's Progress", numero=r"\{(\d+)\}")
    out += partes[:2] + [f"_{lines[j]}_", ""] + partes[2:]
    out += ["## The Conclusion", ""] + lines[concl + 1:fim] + lines[fim:]
    return out


RULES = {
    "summa-theologica-part-i-prima-pars.md": chapterize_summa,
    "summa-theologica-part-i-ii-pars-prima-secundae.md": chapterize_summa,
    "summa-theologica-part-ii-ii-secunda-secundae.md": chapterize_summa,
    "summa-theologica-part-iii-tertia-pars.md": chapterize_summa,
    "commentary-on-the-epistle-to-the-galatians.md": chapterize_galatians,
    "the-saints-everlasting-rest.md": chapterize_baxter,
    "st-bernard-of-clairvauxs-life-of-st-malachy-of-armagh.md": chapterize_malachy,
    "on-prayer-and-the-contemplative-life.md": chapterize_on_prayer,
    "the-apology-of-the-augsburg-confession.md": chapterize_apology,
    "the-apostolic-tradition-of-hippolytus.md": chapterize_hippolytus,
    "leaves-from-st-john-chrysostom.md": chapterize_chrysostom,
    "the-teaching-of-the-twelve-apostles-didache.md": chapterize_didache,
    "the-large-catechism.md": chapterize_large_catechism,
    "the-confessions-of-st-augustine.md": chapterize_confessions,
    "the-consolation-of-philosophy.md": chapterize_consolation,
    "thoughts-pensees.md": chapterize_pensees,
    "grace-abounding-to-the-chief-of-sinners.md": chapterize_grace_abounding,
    "the-pilgrims-progress.md": chapterize_pilgrim,
}


def report(name, lines):
    heads = [l for l in lines if re.match(r"^#{1,3} ", l)]
    chapters = [l for l in heads if re.match(r"^#{1,2} ", l)]
    # tamanho do maior capítulo (o que importa pro leitor)
    sizes, cur = [], 0
    for l in lines:
        if re.match(r"^#{1,2} ", l):
            sizes.append(cur)
            cur = 0
        cur += len(l) + 1
    sizes.append(cur)
    unresolved = [h for h in heads if "Question ?" in h]
    print(f"{name}: {len(chapters)} capítulos, {len(heads) - len(chapters)} subtítulos, "
          f"maior capítulo {max(sizes) // 1024} KB"
          + (f", {len(unresolved)} questões sem número!" if unresolved else ""))


def main():
    check = "--check" in sys.argv
    for name, rule in RULES.items():
        path = os.path.join(TEXTS_DIR, name)
        if not os.path.exists(path):
            print(f"{name}: arquivo não encontrado, pulando")
            continue
        text = open(path, encoding="utf-8").read()
        header, body = split_header(text)
        if any(l.startswith("## ") for l in body):
            print(f"{name}: já tem capítulos, pulando")
            continue
        new_body = rule(body)
        report(name, new_body)
        if not check:
            new_text = "\n".join(header + new_body)
            new_text = re.sub(r"\n{4,}", "\n\n\n", new_text)
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_text)


if __name__ == "__main__":
    main()
