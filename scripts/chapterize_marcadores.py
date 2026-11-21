#!/usr/bin/env python3
"""
Dá estrutura de capítulos (`##`) a obras publicadas que já trazem um marcador de
capítulo no próprio texto, sem alterar uma palavra do original.

Complementa `chapterize_texts.py` (que tem regra por arquivo do Gutenberg). Aqui o
critério é o marcador:

  homilia  `Homilia N ...` no começo da linha, com o texto da homilia seguindo na MESMA
           linha (Crisóstomo). Insere uma linha `## Homilia N` antes, sem tocar na linha.
  capitulo `Capítulo I. - Título` em linha própria (Irineu). Prefixa a linha com `## `.

Segurança (regras do projeto: nunca pipeline sem DRY_RUN sobre textos):
  * o padrão é DRY-RUN: só relata e verifica; `--apply` grava;
  * a verificação de invariância é feita com `difflib`, independente da lógica de
    inserção: toda diferença entre o original e o resultado tem de ser (a) linha nova em
    branco, (b) linha nova `## ...` ou (c) a mesma linha com o prefixo `## `. Qualquer
    outra coisa aborta o arquivo;
  * a numeração dos marcadores tem de ser sequencial (1..N); lacuna ou repetição é
    reportada e o arquivo NÃO é gravado, a menos que se passe `--tolerar-lacunas`;
  * arquivo que já tem `##` no corpo é pulado (idempotente).

Uso:
  python3 scripts/chapterize_marcadores.py            # dry-run em todos os arquivos com regra
  python3 scripts/chapterize_marcadores.py --apply    # grava os que passaram na verificação
  python3 scripts/chapterize_marcadores.py NOME ...   # só os arquivos citados (sem .md)
  python3 scripts/chapterize_marcadores.py --pendentes  # lista o que ainda não tem capítulos
"""
import difflib
import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXTS_DIR = os.path.join(BASE_DIR, "server/texts")

# acima disto a linha do capítulo é um resumo, não um título
LIMITE_TITULO = 110
ROMAN_VALUES = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100}

HOMILIA = re.compile(r"^Homilia (\d+)(?=[\s.,:;]|$)")
# o ponto após o numeral falta em alguns capítulos ("Capítulo VI - ...", "Capítulo XI – ...")
CAPITULO = re.compile(r"^Cap[ií]tulo ([IVXLC]+)(?:\.|\s+[-–—])")
# trecho bíblico logo depois do número, só para enriquecer o título (opcional)
TRECHO = re.compile(r"Cap[ií]tulo ([IVXLC]+)\.\s*Vers[ií]culos?\s+([\d,\-–—\s]+?)(?=\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ\"“(])", re.I)

CRISOSTOMO = [
    "homilias-sobre-colossenses-joao-crisostomo",
    "homilias-sobre-efesios-joao-crisostomo",
    "homilias-sobre-filemom-joao-crisostomo",
    "homilias-sobre-filipenses-joao-crisostomo",
    "homilias-sobre-hebreus-parte-1-joao-crisostomo",
    "homilias-sobre-hebreus-parte-2-joao-crisostomo",
    "homilias-sobre-primeira-tessalonicenses-joao-crisostomo",
    "homilias-sobre-primeira-timoteo-joao-crisostomo",
    "homilias-sobre-segunda-tessalonicenses-joao-crisostomo",
    "homilias-sobre-segunda-timoteo-joao-crisostomo",
    "homilias-sobre-tito-joao-crisostomo",
    "comentario-sobre-galatas-joao-crisostomo",
]
IRINEU = [
    "contra-as-heresias-livro-3-ireneu",
    "contra-as-heresias-livro-4-ireneu",
    "contra-as-heresias-livro-5-ireneu",
]
# homilias que continuam a numeração de outra parte da mesma obra
INICIO = {"homilias-sobre-hebreus-parte-2-joao-crisostomo": 18}
REGRAS = {**{n: "homilia" for n in CRISOSTOMO}, **{n: "capitulo" for n in IRINEU}}

# Obras com marcador próprio, em um ou dois níveis. `livro` vira `# `, `cap` vira `## `.
# O texto traz às vezes o índice no começo (ou no começo de cada livro): vale a ÚLTIMA sequência
# completa que começa em 1; o índice fica como está.
_R = r"([IVXLC]+)"
_N = r"(\d+)"
def _m(palavra, num, fim=r"(?:\b|\.)"):
    return re.compile(rf"^(?:\*\*)?{palavra} {num}{fim}", re.I)
HIER = {
    # tolerar_livros=3: referências de rodapé ("Livro III.", "Livro xix. cap. 1.", "Livro x. 30.")
    "a-cidade-de-deus-agostinho": dict(livro=_m("Livro", _R), cap=_m("Cap[ií]tulo", _N), tolerar_livros=3),
    "as-instituicoes-cenobiticas-joao-cassiano": dict(livro=_m("Livro", _R), cap=_m("Cap[ií]tulo", _R)),
    "regra-pastoral-gregorio-magno": dict(livro=_m("Parte", _R), cap=_m("Cap[ií]tulo", _R)),
    "tratado-a-autolico-teofilo-antioquia": dict(livro=_m("Livro", _R), cap=_m("Cap[ií]tulo", _R)),
    "a-vida-de-moises-gregorio-de-nissa": dict(cap=_m("Cap[ií]tulo", _R)),
    "sobre-o-espirito-santo-basilio-magno": dict(cap=_m("Cap[ií]tulo", _R)),
    "primeira-apologia-justino-martir": dict(cap=_m("Cap[ií]tulo", _R)),
    "sobre-a-virgindade-gregorio-de-nissa": dict(cap=_m("Cap[ií]tulo", _N)),
    "peticao-pelos-cristaos-atenagoras": dict(cap=_m("Cap[ií]tulo", _R)),
    "discurso-aos-gregos-taciano": dict(cap=_m("Cap[ií]tulo", _R)),
    "resposta-aos-judeus-tertuliano": dict(cap=_m("Cap[ií]tulo", _N)),
}
for _n in HIER:
    REGRAS[_n] = "hier"



def romano(s):
    total = 0
    for i, c in enumerate(s):
        v = ROMAN_VALUES[c]
        total += -v if i + 1 < len(s) and ROMAN_VALUES[s[i + 1]] > v else v
    return total


def assunto(linha, max_chars=90):
    """Assunto do capítulo para o sumário: o que vem depois de `Capítulo N.`, sem nota de rodapé,
    cortado numa fronteira de palavra. Só vale para o título inserido; o corpo não muda."""
    t = re.sub(r"^(?:\*\*)?(?:Cap[ií]tulo|Livro|Parte)\s+\w+[.:\s\u2014\u2013\-\u200b]*", "", linha, flags=re.I)
    t = re.sub(r"\[\d+\]", "", t).replace("\u200b", "")
    t = re.sub(r"\s+", " ", t).strip(" .-\u2014\u2013*")
    if len(t) > max_chars:
        corte = t.rfind(" ", 0, max_chars)
        t = t[: corte if corte > 40 else max_chars].rstrip(" ,;:") + "…"
    return t


def _valor(tok):
    return int(tok) if tok.isdigit() else romano(tok.upper())


def _rodadas(marcas):
    """Divide [(linha, n)] em sequências consecutivas (n, n+1, ...)."""
    rod, atual = [], []
    for i, n in marcas:
        if atual and n == atual[-1][1] + 1:
            atual.append((i, n))
        else:
            if atual:
                rod.append(atual)
            atual = [(i, n)]
    if atual:
        rod.append(atual)
    return rod


def _melhor(marcas, avisos, onde, tolerar=0):
    """Cadeia sequencial 1, 2, 3... mais longa (empate: a mais tardia; o resto é índice).

    Marcador solto depois do início da cadeia (por exemplo um `Livro III.` perdido no meio do
    livro V) é ignorado, mas reportado; passa se não exceder `tolerar`."""
    if not marcas:
        return []
    melhor = []
    for k, (_, n) in enumerate(marcas):
        if n != 1:
            continue
        cadeia, esperado = [], 1
        for i, m in marcas[k:]:
            if m == esperado:
                cadeia.append((i, m))
                esperado += 1
        if len(cadeia) >= len(melhor):
            melhor = cadeia
    if not melhor:
        avisos.append(f"{onde}: nenhuma sequência começa em 1")
        return []
    fora = [x for x in marcas if x[0] > melhor[0][0] and x not in melhor]
    if len(fora) > tolerar:
        avisos.append(f"{onde}: {len(fora)} marcador(es) fora da sequência (linhas {[x[0] + 1 for x in fora][:4]}; tolerados: {tolerar})")
    return melhor


def _slug(t):
    import unicodedata
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def aplicar_hier(lines, spec, avisos):
    """Devolve (novas_linhas, qtd_livros, qtd_capitulos)."""
    def achar(rx):
        out = []
        for i, l in enumerate(lines):
            m = rx.match(l)
            if m:
                out.append((i, _valor(m.group(1)), m.group(1)))
        return out

    livros = []
    if spec.get("livro"):
        todos = achar(spec["livro"])
        esc = _melhor([(i, n) for i, n, _ in todos], avisos, "livros", spec.get("tolerar_livros", 0))
        idx = {i for i, _ in esc}
        livros = [(i, n, t) for i, n, t in todos if i in idx]
    caps_todos = achar(spec["cap"])
    # segmentos: cada livro vai até o próximo; sem livros, o arquivo inteiro
    if livros:
        limites = [(livros[k][0], livros[k + 1][0] if k + 1 < len(livros) else len(lines), livros[k]) for k in range(len(livros))]
    else:
        limites = [(0, len(lines), None)]
    escolhidos = {}  # linha -> (tokcap, livro|None)
    for ini, fim, liv in limites:
        seg = [(i, n) for i, n, _ in caps_todos if ini <= i < fim]
        esc = _melhor(seg, avisos, f"capítulos{' do livro ' + liv[2] if liv else ''}", spec.get("tolerar_caps", 0))
        for i, n in esc:
            tok = next(t for j, _, t in caps_todos if j == i)
            escolhidos[i] = (tok, liv)
    livro_por_linha = {i: t for i, _, t in livros}
    out, nl, nc = [], 0, 0
    for i, linha in enumerate(lines):
        if i in livro_por_linha:
            tok = livro_por_linha[i]
            palavra = re.match(r"^(?:\*\*)?(\w+)", linha).group(1).capitalize()
            nl += 1
            if len(linha) <= LIMITE_TITULO and not re.search(r"\[\d+\]", linha):
                out.append("# " + linha)
                continue
            a = assunto(linha)
            out += [f"# {palavra} {tok.upper() if not tok.isdigit() else tok}" + (f". {a}" if a else ""), ""]
        elif i in escolhidos:
            tok, liv = escolhidos[i]
            nc += 1
            limpa = len(linha) <= LIMITE_TITULO and not re.search(r"\[\d+\]", linha)
            nu = _valor(tok)
            tem_titulo = len(re.sub(r"[^\w]", "", re.sub(r"^(?:\*\*)?Cap[ií]tulo\s+\w+", "", linha, flags=re.I))) > 2
            if limpa and (tem_titulo or not liv):
                out.append("## " + linha)
                continue
            ctx = f"Livro {livro_por_linha_tok(livros, liv)}, " if liv else ""
            a = assunto(linha)
            out += [f"## {ctx}Capítulo {tok.upper() if not tok.isdigit() else tok}" + (f". {a}" if a else ""), ""]
        out.append(linha)
    return out, nl, nc


def livro_por_linha_tok(livros, liv):
    return liv[2].upper() if not liv[2].isdigit() else liv[2]


def titulos_unicos(lines):
    vistos, dup = {}, []
    for l in lines:
        m = re.match(r"^(#{1,2})\s+(.*)$", l)
        if m:
            k = _slug(m.group(2)) or "cap"
            if k in vistos:
                dup.append(m.group(2)[:50])
            vistos[k] = 1
    return dup


def tem_capitulos(lines):
    """`##` no corpo (fora da cabeça do arquivo, que traz `#` e `###` do título)."""
    return any(l.startswith("## ") for l in lines)


def aplicar(lines, regra):
    """Devolve (novas_linhas, numeros_encontrados)."""
    out, numeros = [], []
    for linha in lines:
        if regra == "homilia":
            m = HOMILIA.match(linha)
            if m:
                n = int(m.group(1))
                numeros.append(n)
                titulo = f"## Homilia {n}"
                t = TRECHO.search(linha[:240])
                if t:
                    versos = re.sub(r"\s+", " ", t.group(2)).strip(" ,")
                    titulo += f" (cap. {t.group(1).upper()}, v. {versos})"
                out += [titulo, ""]
        else:
            m = CAPITULO.match(linha)
            if m:
                n = romano(m.group(1).upper())
                numeros.append(n)
                if len(linha) <= LIMITE_TITULO:
                    out.append("## " + linha)  # a linha inteira é o título
                    continue
                # resumo longo do capítulo: título curto no sumário, resumo intacto no corpo
                a = assunto(linha)
                out += [f"## Capítulo {m.group(1).upper()}" + (f". {a}" if a else ""), ""]
        out.append(linha)
    return out, numeros


def invariante(orig, novo):
    """Toda diferença é linha nova em branco, linha nova `## ...` ou a mesma linha com `## `."""
    sm = difflib.SequenceMatcher(None, orig, novo, autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            continue
        if op == "insert":
            if all(l == "" or l.startswith("#") for l in novo[j1:j2]):
                continue
            return False, f"linha inserida que não é título: {novo[j1:j2][:2]}"
        if op == "replace" and (i2 - i1) == (j2 - j1):
            if all(n in ("## " + o, "# " + o) for o, n in zip(orig[i1:i2], novo[j1:j2])):
                continue
        return False, f"alteração não permitida ({op}) perto da linha {i1 + 1}"
    return True, ""


def lacunas(numeros, inicio=1):
    if not numeros:
        return ["nenhum marcador encontrado"]
    problemas = []
    if numeros[0] != inicio:
        problemas.append(f"começa em {numeros[0]} (esperado {inicio})")
    for a, b in zip(numeros, numeros[1:]):
        if b != a + 1:
            problemas.append(f"salto {a} -> {b}")
    return problemas


def pendentes():
    """Obras publicadas, com 8.000 palavras ou mais, com no máximo 3 títulos `#`/`##` (só os da cabeça)."""
    import json
    arq = json.load(open(os.path.join(TEXTS_DIR, "MANIFESTO.json"), encoding="utf-8"))["arquivos"]
    out = []
    for nome, info in arq.items():
        if info.get("estado") != "publicada":
            continue
        with open(os.path.join(TEXTS_DIR, nome + ".md"), encoding="utf-8") as f:
            t = f.read()
        # todo arquivo traz `# Título` e `# Proveniência` (o leitor já os abre como capítulos);
        # mais de 3 títulos de nível 1-2 é sinal de que a obra tem estrutura
        if len(re.findall(r"^#{1,2} ", t, re.M)) > 3:
            continue
        if len(t.split()) >= 8000:
            out.append((len(t.split()), nome, "com regra" if nome in REGRAS else "sem regra"))
    for w, n, r in sorted(out, reverse=True):
        print(f"{w:>8}  {n}  [{r}]")
    print(f"\n{len(out)} obras publicadas, >=8.000 palavras, sem estrutura de capítulos")
    return 0


def main(argv):
    if "--pendentes" in argv:
        return pendentes()
    aplicar_ = "--apply" in argv
    tolerar = "--tolerar-lacunas" in argv
    nomes = [a for a in argv if not a.startswith("--")] or list(REGRAS)
    ok = falha = pulados = 0
    for nome in nomes:
        regra = REGRAS.get(nome)
        if not regra:
            print(f"? {nome}: sem regra"); falha += 1; continue
        caminho = os.path.join(TEXTS_DIR, nome + ".md")
        with open(caminho, encoding="utf-8") as f:
            texto = f.read()
        orig = texto.split("\n")
        if tem_capitulos(orig):
            print(f"= {nome}: já tem capítulos, pulando"); pulados += 1; continue
        if regra == "hier":
            avisos = []
            novo, nl, nc = aplicar_hier(orig, HIER[nome], avisos)
            inv, motivo = invariante(orig, novo)
            dup = titulos_unicos(novo)
            if not inv:
                print(f"X {nome}: INVARIÂNCIA FALHOU — {motivo}"); falha += 1; continue
            if nc == 0 or avisos or dup:
                det = "; ".join(avisos[:3] + ([f"títulos repetidos: {dup[:3]}"] if dup else []) + (["nenhum capítulo"] if nc == 0 else []))
                print(f"X {nome}: {det}; ({nl} livros, {nc} capítulos); NÃO gravado"); falha += 1; continue
            print(f"+ {nome}: {nl} livros, {nc} capítulos; invariância ok")
            ok += 1
            if aplicar_:
                with open(caminho, "w", encoding="utf-8") as f:
                    f.write("\n".join(novo))
            continue
        novo, numeros = aplicar(orig, regra)
        inv, motivo = invariante(orig, novo)
        gaps = lacunas(numeros, INICIO.get(nome, 1))
        if not inv:
            print(f"X {nome}: INVARIÂNCIA FALHOU — {motivo}"); falha += 1; continue
        if gaps and not tolerar:
            print(f"X {nome}: numeração irregular ({'; '.join(gaps[:4])}); {len(numeros)} marcadores; NÃO gravado"); falha += 1; continue
        print(f"+ {nome}: {len(numeros)} capítulos; invariância ok" + (f"; AVISO {'; '.join(gaps[:3])}" if gaps else ""))
        ok += 1
        if aplicar_:
            with open(caminho, "w", encoding="utf-8") as f:
                f.write("\n".join(novo))
    modo = "GRAVADO" if aplicar_ else "DRY-RUN (nada gravado)"
    print(f"\n{modo}: {ok} ok, {falha} com problema, {pulados} já estruturados")
    return 1 if falha else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
