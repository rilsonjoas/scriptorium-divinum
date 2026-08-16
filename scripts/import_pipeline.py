#!/usr/bin/env python3
import os
import re
import json
import urllib.request
import urllib.parse
import http.cookiejar
import sys
import time

# Configurações do Servidor
API_URL = os.environ.get("API_URL", "http://localhost:3001")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@teste.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "senha-admin-teste")
TEXTS_DIR = os.environ.get("TEXTS_DIR", "server/texts")

# Normalizar caminhos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXTS_DIR_ABS = os.path.join(BASE_DIR, TEXTS_DIR)

# Configurar Cookie Jar para persistir a sessão de admin
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
urllib.request.install_opener(opener)

def api_request(path, method="GET", payload=None):
    url = f"{API_URL}{path}"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "ScriptoriumImportPipeline/1.0"
    }
    
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            res_data = res.read().decode("utf-8")
            if res.status == 204:
                return True
            return json.loads(res_data) if res_data else True
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"Erro HTTP em {method} {url}: {e.code} - {e.reason}\nBody: {body}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Erro de conexão em {method} {url}: {e}", file=sys.stderr)
        return None

def login():
    print(f"Tentando login como {ADMIN_EMAIL}...")
    payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    res = api_request("/api/v1/admin/login", "POST", payload)
    if res:
        print("Autenticação realizada com sucesso!")
        return True
    print("Falha na autenticação.")
    return False

def get_or_create_author(author_name):
    # Buscar lista de autores
    authors = api_request("/api/v1/authors") or []
    slug = slugify(author_name)
    
    for author in authors:
        if author.get("slug") == slug:
            return author.get("id")
            
    # Se não existir, cria o autor com dados mínimos
    print(f"Autor '{author_name}' não encontrado. Criando...")
    payload = {
        "name": author_name,
        "slug": slug,
        "bioSummary": f"Grande teólogo/autor da tradição cristã: {author_name}.",
        "denominationOrTradition": ["Histórica"]
    }
    res = api_request("/api/v1/admin/authors", "POST", payload)
    if res:
        print(f"Autor '{author_name}' criado com ID: {res.get('id')}")
        return res.get("id")
    return None

def slugify(value):
    # Traduz caracteres acentuados para versão normalizada
    import unicodedata
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('utf-8')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)

def fetch_url_with_retry(url, headers, retries=4, delay=10):
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as res:
                return res.read()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait_time = delay * (i + 1)
                print(f"Aviso: Limite de requisições (429) atingido para {url}. Aguardando {wait_time} segundos...", file=sys.stderr)
                time.sleep(wait_time)
            else:
                raise e
    raise Exception(f"Erro: Limite de tentativas excedido para erro 429 ao acessar {url}")

def download_gutenberg(gutenberg_id):
    # Tenta obter o texto por múltiplas URLs conhecidas do Gutenberg
    urls = [
        f"https://www.gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.txt",
        f"https://www.gutenberg.org/files/{gutenberg_id}/{gutenberg_id}-0.txt",
        f"https://www.gutenberg.org/ebooks/{gutenberg_id}.txt.utf-8"
    ]
    
    for url in urls:
        try:
            print(f"Baixando texto de {url}...")
            content = fetch_url_with_retry(url, headers={'User-Agent': 'Mozilla/5.0'})
            # Tentar decodificar com utf-8-sig (para remover BOM) ou utf-8, depois ISO-8859-1
            try:
                return content.decode("utf-8-sig")
            except UnicodeDecodeError:
                try:
                    return content.decode("utf-8")
                except UnicodeDecodeError:
                    return content.decode("latin-1")
        except Exception as e:
            print(f"Aviso: Falha ao baixar de {url}: {e}", file=sys.stderr)
            
    return None

def clean_gutenberg_text(text):
    # Encontra os delimitadores padrões do Gutenberg
    start_match = re.search(r"\*\*\*\s*START OF TH(E|IS) PROJECT GUTENBERG EBOOK.*?\*\*\*", text, re.IGNORECASE)
    end_match = re.search(r"\*\*\*\s*END OF TH(E|IS) PROJECT GUTENBERG EBOOK.*?\*\*\*", text, re.IGNORECASE)
    
    if start_match and end_match:
        content = text[start_match.end():end_match.start()]
    elif start_match:
        content = text[start_match.end():]
    else:
        content = text
        
    return content.strip()

def download_wikisource(page_title):
    # Utiliza a API parse para obter o wikitexto estruturado da página do Wikisource
    url = f"https://pt.wikisource.org/w/api.php?action=parse&page={urllib.parse.quote(page_title)}&format=json&prop=wikitext"
    try:
        print(f"Baixando wikitexto do Wikisource para '{page_title}'...")
        content = fetch_url_with_retry(url, headers={'User-Agent': 'ScriptoriumImportPipeline/1.0'})
        data = json.loads(content.decode("utf-8"))
        wikitext = data.get("parse", {}).get("wikitext", {}).get("*", "")
        # Se o wikitexto for muito pequeno ou contiver transclusões, usamos o extracts
        if wikitext and len(wikitext.strip()) > 500 and "<pages" not in wikitext:
            return wikitext
    except Exception as e:
        print(f"Erro ao baixar wikitexto do Wikisource: {e}", file=sys.stderr)
        
    # Fallback para query/extracts
    url_fallback = f"https://pt.wikisource.org/w/api.php?action=query&prop=extracts&explaintext=1&titles={urllib.parse.quote(page_title)}&format=json"
    try:
        print(f"Tentando fallback (extracts) para '{page_title}'...")
        content = fetch_url_with_retry(url_fallback, headers={'User-Agent': 'ScriptoriumImportPipeline/1.0'})
        data = json.loads(content.decode("utf-8"))
        pages = data.get("query", {}).get("pages", {})
        for pid, pdata in pages.items():
            if "extract" in pdata:
                return pdata["extract"]
    except Exception as e:
        print(f"Erro no fallback do Wikisource: {e}", file=sys.stderr)
        
    return None

def clean_wikisource_text(text):
    # Remove tags HTML comuns no wikitexto e cabeçalhos de predefinições do Wikisource
    text = re.sub(r"\{\{[hH]eader[^}]*\}\}", "", text) # Remove predefinição de cabeçalho
    text = re.sub(r"\{\{[pP]age[^}]*\}\}", "", text) # Remove marcadores de páginas escaneadas
    text = re.sub(r"<[^>]+>", "", text) # Remove tags HTML básicas
    
    # Converter títulos em wikitexto `== Título ==` para markdown `## Título`
    def repl_h2(match):
        return f"## {match.group(1).strip()}"
    def repl_h3(match):
        return f"### {match.group(1).strip()}"
        
    text = re.sub(r"===\s*([^=]+?)\s*===", repl_h3, text)
    text = re.sub(r"==\s*([^=]+?)\s*==", repl_h2, text)
    
    return text.strip()

def parse_table_of_contents(markdown_text):
    toc = []
    order_index = 1
    
    # Procurar por linhas começando com #, ## ou ###
    # Excluir o cabeçalho "# Proveniência"
    lines = markdown_text.split("\n")
    in_provenance = False
    
    for line in lines:
        line = line.strip()
        if line == "# Proveniência":
            in_provenance = True
            continue
        if in_provenance and line == "---":
            in_provenance = False
            continue
        if in_provenance:
            continue
            
        # Detectar cabeçalhos
        match = re.match(r"^(#{1,3})\s+(.+)$", line)
        if match:
            level_str, title = match.groups()
            level = len(level_str)
            # Evitar pegar o título principal do livro como capítulo se for nível 1
            if level == 1 and order_index == 1:
                continue
                
            anchor = slugify(title)
            toc.append({
                "title": title.strip(),
                "anchor": anchor,
                "level": level,
                "orderIndex": order_index
            })
            order_index += 1
            
    return toc

def import_book(book_info):
    title = book_info["title"]
    author_name = book_info["author"]
    source = book_info["source"]
    
    print(f"\n--- Processando: '{title}' ---")
    
    # 1. Obter ou criar autor
    author_id = get_or_create_author(author_name)
    if not author_id:
        print(f"Erro: Não foi possível obter o autor '{author_name}'")
        return False
        
    # 2. Obter o texto bruto
    raw_text = None
    if book_info.get("gutenberg_id"):
        raw_text = download_gutenberg(book_info["gutenberg_id"])
        if raw_text:
            raw_text = clean_gutenberg_text(raw_text)
    elif book_info.get("wikisource_title"):
        raw_text = download_wikisource(book_info["wikisource_title"])
        if raw_text:
            raw_text = clean_wikisource_text(raw_text)
            
    if not raw_text:
        print(f"Erro: Falha ao baixar o texto de '{title}' de sua respectiva fonte ({source})")
        return False
        
    # 3. Montar arquivo markdown com bloco de Proveniência
    slug = slugify(title)
    filename = f"{slug}.md"
    online_read_path = f"/texts/{filename}"
    
    provenance_block = f"""# Proveniência

- **Obra**: {title} ({book_info.get('original_title') or 'Título original não disponível'})
- **Autor**: {author_name}
- **Tradutor**: {book_info.get('translator') or 'Texto original / Desconhecido'}
- **Edição/Fonte**: Obtido de {source}
- **Domínio público porque**: {book_info.get('legal_status')}
- **Obra original em**: {', '.join(book_info.get('original_languages', ['Não especificado']))}
- **Licença do arquivo**: Domínio Público (PD-Brasil)
- **Data de verificação PD**: 2026-08-16

---

# {title}

"""
    full_markdown = provenance_block + raw_text
    
    # Salvar arquivo no disco
    os.makedirs(TEXTS_DIR_ABS, exist_ok=True)
    filepath = os.path.join(TEXTS_DIR_ABS, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(full_markdown)
    print(f"Texto salvo em: {filepath}")
    
    # 4. Parse do Sumário (TOC)
    toc = parse_table_of_contents(full_markdown)
    print(f"Sumário extraído: {len(toc)} seções encontradas.")
    
    # 5. Criar o Livro na API
    # Gerar uma descrição razoável a partir do texto
    description = f"Obra clássica '{title}' escrita por {author_name}. Disponível para leitura online gratuita e download em formatos livres."
    # Tenta extrair o primeiro parágrafo
    paragraphs = [p.strip() for p in raw_text.split("\n\n") if p.strip() and not p.strip().startswith("#") and not p.strip().startswith(">")]
    if paragraphs:
        first_p = paragraphs[0]
        if len(first_p) > 50 and len(first_p) < 400:
            description = first_p
            
    payload = {
        "title": title,
        "slug": slug,
        "originalTitle": book_info.get("original_title") or title,
        "authorId": author_id,
        "publicationYearOriginal": str(book_info.get("publication_year_original") or "Desconhecido"),
        "publicationYearTranslation": book_info.get("publication_year_translation"),
        "translator": book_info.get("translator") or "Desconhecido",
        "language": book_info.get("language") or "Português",
        "description": description,
        "categories": book_info.get("categories") or ["Teologia", "Domínio Público", "Clássicos"],
        "tags": book_info.get("tags") or [slugify(author_name), "espiritualidade", "cristianismo"],
        "onlineReadPath": online_read_path,
        "featured": False,
        "tableOfContents": toc,
        "downloadLinks": [
            {
                "format": "txt",
                "url": f"https://www.gutenberg.org/ebooks/{book_info['gutenberg_id']}.txt.utf-8" if book_info.get("gutenberg_id") else f"https://pt.wikisource.org/wiki/{urllib.parse.quote(book_info['wikisource_title'])}" if book_info.get("wikisource_title") else "",
                "source": source
            }
        ] if book_info.get("gutenberg_id") or book_info.get("wikisource_title") else []
    }
    
    # Verificar se o livro já existe
    existing_books = api_request("/api/v1/books?limit=100") or {}
    existing_items = existing_books.get("items", [])
    existing_id = None
    for eb in existing_items:
        if eb.get("slug") == slug:
            existing_id = eb.get("id")
            break
            
    if existing_id:
        print(f"Livro '{title}' já cadastrado. Atualizando...")
        res = api_request(f"/api/v1/admin/books/{existing_id}", "PATCH", payload)
        if res:
            print(f"Livro '{title}' atualizado com sucesso!")
            return True
    else:
        print(f"Cadastrando livro '{title}'...")
        res = api_request("/api/v1/admin/books", "POST", payload)
        if res:
            print(f"Livro '{title}' cadastrado com sucesso!")
            return True
            
    return False

def main():
    # 1. Carregar catálogo curado
    catalog_path = os.path.join(BASE_DIR, "server/texts/curated_catalog.json")
    if not os.path.exists(catalog_path):
        print(f"Erro: Arquivo do catálogo curado não encontrado em {catalog_path}")
        sys.exit(1)
        
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)
        
    print(f"Carregado catálogo curado com {len(catalog)} livros.")
    
    # 2. Login na API
    if not login():
        print("Erro: Não foi possível autenticar na API admin. Certifique-se de que o servidor está rodando em http://localhost:3001 e que as credenciais em ADMIN_EMAIL/ADMIN_PASSWORD estão corretas.")
        sys.exit(1)
        
    # 3. Importar livros
    success_count = 0
    failure_count = 0
    
    # Importar em pequenos lotes ou apenas os primeiros de forma segura
    for book in catalog:
        try:
            if import_book(book):
                success_count += 1
            else:
                failure_count += 1
            # Delay preventivo entre importações
            time.sleep(5)
        except Exception as e:
            print(f"Erro ao processar livro '{book.get('title')}': {e}", file=sys.stderr)
            failure_count += 1
            
    print(f"\n=== Resumo da Importação ===")
    print(f"Sucesso: {success_count}")
    print(f"Falhas: {failure_count}")

if __name__ == "__main__":
    main()
