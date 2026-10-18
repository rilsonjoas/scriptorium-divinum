#!/usr/bin/env python3
"""Cruza as citações de um autor na API do Scriptorium com as notas do vault do autor (Obsidian).

Só LÊ. Não altera o banco nem o vault. Serve para a auditoria retroativa das citações
(docs/AUDITORIA-RETROATIVA-CITACOES-LEWIS.md): para cada citação da API, acha a linha mais
parecida no vault e devolve o veredito (✅ ❌ ⚠️ 🔲) que a auditoria do vault registrou ao lado.

Uso:  python3 -I scripts/cruzar-citacoes-com-vault.py <pasta-do-vault> [autor] > cruza.json
Sem dependências além da biblioteca padrão. O casamento é por trechos de 4 palavras
(sem acento e sem pontuação); cobertura >= 0,8 conta como "achada", entre 0,4 e 0,8 como "parcial".
"""
import json, os, re, sys, unicodedata, urllib.parse, urllib.request

API = os.environ.get("SCRIPTORIUM_API", "https://api-scriptorium.narniano.com/api/v1")


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]", " ", s).split()


def trechos(palavras, n=4):
    return {" ".join(palavras[i:i + n]) for i in range(len(palavras) - n + 1)}


def veredito(contexto):
    if not contexto:
        return "sem-nota"
    marcas = [m for m in ("❌", "⚠️", "✅", "🔲") if m in contexto]
    return "".join(marcas) if marcas else "sem-marca"


def main(vault, autor):
    url = f"{API}/quotes?author={urllib.parse.quote(autor)}"
    with urllib.request.urlopen(url, timeout=30) as r:
        api = json.load(r)
    indice = []
    for raiz, pastas, arquivos in os.walk(vault):
        pastas[:] = [d for d in pastas if d not in (".git", ".remember", ".obsidian", "node_modules")]
        for nome in arquivos:
            if not nome.endswith(".md"):
                continue
            caminho = os.path.join(raiz, nome)
            try:
                linhas = open(caminho, encoding="utf-8").read().split("\n")
            except OSError:
                continue
            for i, linha in enumerate(linhas):
                p = norm(linha)
                if len(linha) >= 40 and len(p) >= 5:
                    indice.append((os.path.relpath(caminho, vault), i + 1, trechos(p), " ".join(linhas[i:i + 4])))
    saida = []
    for q in api:
        t = trechos(norm(q["text"]))
        melhor, achado = 0.0, None
        for arq, lin, tr, ctx in indice:
            c = len(t & tr) / len(t) if t else 0
            if c > melhor:
                melhor, achado = c, (arq, lin, ctx)
        classe = "achada" if melhor >= 0.8 else "parcial" if melhor >= 0.4 else "nao-achada"
        saida.append({
            "id": q["id"], "text": q["text"], "source": q.get("source"),
            "cobertura": round(melhor, 2), "classe": classe,
            "arquivo": achado[0] if achado else None, "linha": achado[1] if achado else None,
            "veredito": veredito(achado[2]) if achado and melhor >= 0.4 else "sem-nota",
        })
    json.dump(saida, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "C. S. Lewis")
