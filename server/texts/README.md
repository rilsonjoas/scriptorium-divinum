# Diretório de Textos — Proveniência de Domínio Público

Aqui vivem os arquivos de texto (markdown) das obras servidas pelo leitor
online (`/ler/:id`).

## Regra de ouro

**Só publicar o que estiver comprovadamente em domínio público.** Todo
arquivo `.md` neste diretório DEVE começar com o bloco de proveniência
abaixo preenchido. Arquivo sem proveniência = botão "Ler Online" oculto =
conteúdo não publicado. A regra vale igualmente para download e leitura
online (são juridicamente equivalentes — Lei 9.610/98, arts. 29 e 31).

O nome do arquivo deve casar com o `online_read_path` do livro no banco.
Ex.: `online_read_path = /texts/agostinho-confissoes.md` → arquivo
`agostinho-confissoes.md` aqui.

## Template obrigatório (topo de cada arquivo)

```markdown
# Proveniência

- **Obra**: <título original + tradução usada>
- **Autor**: <nome, datas>
- **Tradutor**: <nome ou "texto original (sem tradução)" — se tradução, é
  derivada; só aceitar tradução em domínio público ou própria>
- **Edição/Fonte**: <edição usada e de onde o texto foi obtido/escaneado>
- **Domínio público porque**: <autor morto há 70+ anos (art. 41) OU outra
  base legal concreta; cite a regra>
- **Obra original em**: <idioma(s)>
- **Licença do arquivo**: <PD-Brasil | CC-PD | outras — descrever>

---

# <Título da Obra>
...conteúdo da obra a partir daqui...
```

## Como adicionar um texto

1. Confira que a obra/edição está em domínio público (autor falecido há
   +70 anos e, se traduzida, tradução antiga em PD ou própria).
2. Coloque o `.md` aqui com o template preenchido no topo.
3. Ajuste `online_read_path` do livro no banco para `/texts/<arquivo>.md`.
4. O botão "Ler Online" e a rota `/ler/:id` passam a funcionar sozinhos
   (`textAvailable` é calculado pela existência do arquivo).

Nunca incluir obra protegida por direito autoral de terceiros (traduções
ou edições modernas, capas, imagens) — nem em texto, nem em download.
