#!/usr/bin/env python3
"""
Remove um livro específico via API admin — usado pontualmente pra tirar
do catálogo obras sem fonte livre/permissiva confirmada (ex.: "Compêndio
de Teologia", achado 2026-08-16: tradução de 1935 nunca disponível de
graça em nenhuma fonte checada).

Uso:
  API_URL=https://api-scriptorium.narniano.com \
  ADMIN_EMAIL=... ADMIN_PASSWORD=... \
  python3 scripts/remove_book.py <book_id>
"""
import os
import sys
import json
import urllib.request
import http.cookiejar

API_URL = os.environ.get("API_URL", "http://localhost:3001")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
urllib.request.install_opener(opener)


def api_request(path, method="GET", payload=None):
    url = f"{API_URL}{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}, method=method
    )
    with urllib.request.urlopen(req) as res:
        if res.status == 204:
            return True
        body = res.read().decode("utf-8")
        return json.loads(body) if body else True


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 scripts/remove_book.py <book_id>")
        sys.exit(1)
    book_id = sys.argv[1]

    print(f"Login como {ADMIN_EMAIL}...")
    api_request("/api/v1/admin/login", "POST", {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    print("Autenticado.")

    print(f"Removendo livro {book_id}...")
    api_request(f"/api/v1/admin/books/{book_id}", "DELETE")
    print("Removido com sucesso.")


if __name__ == "__main__":
    main()
