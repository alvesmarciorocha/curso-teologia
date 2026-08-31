# Anotações — Curso Livre de Teologia

Site estático com as minhas anotações do curso livre de teologia, publicado no GitHub Pages.

## Estrutura

```
index.html          → página inicial, lista as aulas (cartões)
css/style.css        → estilo visual do site (tema único, usado por todas as páginas)
js/site.js            → pequenas interações (barra de progresso, índice da aula, animações)
js/quiz.js             → motor genérico do quiz de cada aula (correção, nota final)
aulas/                 → uma página HTML por aula, mais uma página "-quiz.html" de quiz para cada uma
  2026-08-13-doutrina-de-deus.html
  2026-08-13-doutrina-de-deus-quiz.html
.nojekyll              → arquivo vazio que diz ao GitHub Pages para publicar os arquivos "como estão", sem tentar processá-los com Jekyll
```

## Como adicionar uma nova aula

1. Duplique um arquivo existente dentro de `aulas/` (ex: copie `2026-08-13-doutrina-de-deus.html`) e renomeie para `AAAA-MM-DD-titulo-da-aula.html`.
2. Edite o `<title>` e o conteúdo do novo arquivo com as anotações da aula.
   - Dica: você pode pedir para o Claude gerar o HTML da nova aula no mesmo estilo do arquivo anterior — é só colar as suas anotações e pedir "gere uma página no mesmo formato das outras aulas".
3. Toda aula tem um quiz — peça ao Claude para gerar `AAAA-MM-DD-titulo-da-aula-quiz.html` junto (isso já está nas instruções do projeto, não precisa nem pedir). São de 7 a 10 perguntas de múltipla escolha com correção e nota ao final, usando o motor genérico em `js/quiz.js`.
4. Abra `index.html` e adicione um novo `<li>` dentro de `<ul class="aula-list">`, copiando o bloco de um cartão existente e ajustando data, módulo, título, o link `href="aulas/seu-novo-arquivo.html"` e o link do quiz.
5. Salve, publique (veja abaixo) e confira o site no ar.

## Como publicar as atualizações no GitHub Pages

Depois de editar os arquivos, no terminal, dentro desta pasta:

```bash
git add -A
git commit -m "Adiciona aula: <título da aula>"
git push
```

Em 1–2 minutos a atualização aparece no site publicado.
