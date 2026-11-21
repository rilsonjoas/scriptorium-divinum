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


def romano(s):
    total = 0
    for i, c in enumerate(s):
        v = ROMAN_VALUES[c]
        total += -v if i + 1 < len(s) and ROMAN_VALUES[s[i + 1]] > v else v
    return total


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
                out += [f"## Capítulo {m.group(1).upper()}", ""]
        out.append(linha)
    return out, numeros


def invariante(orig, novo):
    """Toda diferença é linha nova em branco, linha nova `## ...` ou a mesma linha com `## `."""
    sm = difflib.SequenceMatcher(None, orig, novo, autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            continue
        if op == "insert":
            if all(l == "" or l.startswith("## ") for l in novo[j1:j2]):
                continue
            return False, f"linha inserida que não é título: {novo[j1:j2][:2]}"
        if op == "replace" and (i2 - i1) == (j2 - j1):
            if all(n == "## " + o for o, n in zip(orig[i1:i2], novo[j1:j2])):
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


def main(argv):
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
