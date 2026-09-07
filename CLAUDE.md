# Instruções do projeto

Site estático (HTML/CSS/JS puro, sem build) com anotações do curso livre de teologia, publicado no GitHub Pages a partir do branch `main`. Veja `README.md` para a estrutura geral e o passo a passo de publicação.

## Regra permanente: toda aula tem um quiz

Sempre que uma aula for criada ou adicionada (nova página em `aulas/`), gere também o quiz correspondente — não pergunte se deve gerar, apenas gere junto. Isso vale tanto para aulas novas quanto para aulas antigas que ainda não tenham quiz.

Checklist ao adicionar/editar uma aula:

1. Criar `aulas/AAAA-MM-DD-titulo-da-aula-quiz.html`, no mesmo padrão visual das páginas de aula (header, `medallion`, `lecture-header`), com:
   - `<div id="quiz-root"></div>` dentro de uma `<section class="section reveal">`;
   - `<script>window.QUIZ = { questions: [...] };</script>` com as perguntas, **antes** dos scripts;
   - `<script src="../js/site.js"></script>` seguido de `<script src="../js/quiz.js"></script>` no final do `<body>` — **nunca esquecer o `site.js`**, é ele quem ativa a animação `.reveal`; sem ele a página inteira fica invisível.
2. Gerar de **7 a 10 perguntas de múltipla escolha** (4 alternativas cada) com base no conteúdo/resumo da própria aula, cobrindo todas as seções principais. Formato de cada item: `{ q: "...", options: ["a","b","c","d"], correct: <índice 0-based> }`.
3. Adicionar, no fim da seção de conteúdo da página da aula (perto da citação de fechamento), o callout de link para o quiz:
   ```html
   <div class="quiz-callout reveal">
     <div class="quiz-callout-text">
       <h3>Testar o que aprendeu?</h3>
       <p>Quiz com N perguntas sobre esta aula, com nota ao final.</p>
     </div>
     <a class="quiz-callout-btn" href="AAAA-MM-DD-titulo-da-aula-quiz.html">Fazer o quiz &rarr;</a>
   </div>
   ```
4. Adicionar, no card da aula em `index.html` (dentro de `.aula-card`, depois de `.aula-topics`), o link:
   ```html
   <a class="aula-quiz-link" href="aulas/AAAA-MM-DD-titulo-da-aula-quiz.html">Fazer o quiz &rarr;</a>
   ```

O motor do quiz (`js/quiz.js`) e os estilos (`.quiz-*` em `css/style.css`) já existem e são genéricos — não precisam ser recriados, só reaproveitados. Use como referência os quizzes já publicados:
- `aulas/2026-08-13-doutrina-de-deus-quiz.html`
- `aulas/2026-08-20-fundamentos-do-ministerio-quiz.html`

## Fluxo de criação/edição de aula: validar antes de gerar HTML

Ao criar ou revisar o conteúdo de uma aula (texto/resumo trazido pelo usuário), não gerar o HTML da aula até o usuário pedir explicitamente. Antes disso, seguir esta ordem:

1. **Texto, gramática e clareza**: revisar ortografia, acentuação, digitação e concordância; e, em toda aula (não só quando pedido), avaliar se o texto está claro, com leitura fluida e de fácil compreensão. Correções simples que não mudam o sentido (acento, erro de digitação, concordância óbvia) podem ser aplicadas direto, sem pedir confirmação. Reescritas para melhorar clareza/fluidez — e qualquer correção que altere o significado ou o tom — devem ser sugeridas, não aplicadas por conta própria.
2. **Fidelidade teológica**: verificar se o resumo está completo e condizente com o ensinamento bíblico, usando conhecimento teológico além do que está escrito no resumo. Se algo relevante estiver faltando, sugerir a inclusão (com base bíblica) — não inserir automaticamente. Toda citação bíblica usada como texto (não só como referência) deve ser conferida contra o texto ao vivo que o `.verse-ref` do site mostra no tooltip (API bible-api.com, tradução "almeida") — é essa fonte, não a memória do Claude nem uma versão específica como a NVI, que define a redação exata a usar, para nunca haver divergência entre o que está escrito na página e o que aparece no tooltip da mesma citação.
3. **Elementos visuais**: sugerir diagramas, mapas mentais, linhas do tempo, gráficos etc. onde ajudem a clarear o conteúdo da aula, como sugestão de conteúdo/estrutura (ver seção "Trabalho visual" abaixo para o formato do esboço, quando o elemento for visual/gráfico).

Só depois de fechar texto, fidelidade teológica e elementos visuais com o usuário, perguntar se é hora de gerar o HTML da aula (e o quiz correspondente, conforme a regra permanente acima) e publicar no GitHub Pages.

## Regra permanente: toda aula abre com uma Visão geral

Formato padrão dos resumos: conclusão e panorama geral primeiro, desenvolvimento depois — princípio do BLUF (*bottom line up front* / pirâmide invertida), não o caminho inverso de ir construindo até a conclusão no fim. Isso vale por padrão para toda aula nova.

- **Quem escreve a Visão geral sou eu (Claude)**, com base no conteúdo/resumo da aula. Nunca insiro na página sem antes apresentar o conteúdo para validação do usuário — mesmo já tendo a estrutura/CSS prontos, o conteúdo é sempre aprovado antes.
- **Formato do conteúdo é aberto, não só texto.** Uso o que deixar a conclusão e o panorama mais claros para aquela aula específica — parágrafo corrido, lista, diagrama, fluxograma, linha do tempo etc. — reaproveitando os padrões visuais que já existem no site (`.diagram-card`/SVG, `.hierarchy-stack`, `.bridge-flow`, `.wheel`, `.offices-tree`...) quando um deles se encaixar melhor que texto puro. Se o elemento escolhido for visual/gráfico, segue o fluxo normal de esboço (ver "Trabalho visual" abaixo) antes de implementar.
- **Avaliar se o padrão faz sentido para a aula em questão.** Se o conteúdo for essencialmente narrativo/histórico ou argumentativo (o "chegar lá" é parte do ensino), avisar o usuário de que o formato BLUF pode não ser o melhor ali e perguntar como decidir — trocar para o formato (b), manter a Visão geral em BLUF mesmo assim, ou não criar Visão geral nessa aula. Nunca decidir isso sozinho nem aplicar o padrão (a) sem questionar.
- **Marcação e posição**: bloco entre o `.lecture-header` e a primeira `<section>`, usando as classes já definidas em `css/style.css` (`.lecture-overview` + `.lecture-overview-badge` — fundo lapis translúcido com o rótulo em selo, aprovado em 2026-09-07). Exemplo com texto simples (o conteúdo interno muda conforme o formato escolhido para a aula):
  ```html
  <div class="lecture-overview reveal">
    <span class="lecture-overview-badge">Visão geral</span>
    <p>Texto da visão geral — conclusão + panorama do que a aula cobre.</p>
  </div>
  ```
- Aulas novas ganham o bloco por padrão. Aulas antigas ganham quando forem revisitadas/editadas — não é preciso varrer todas de uma vez como no caso do quiz, a menos que o usuário peça.

## Trabalho visual: esboço com opções antes de implementar

Ao criar ou reformular algo visual (componente, seção, página, layout, fluxo de telas), apresentar esboço e esperar aprovação antes de implementar — é o default, não esperar que o usuário peça. Conta como reformular também mudar o tratamento visual do que já existe ("deixa mais chamativo", "moderniza isso"), mesmo sem alterar a estrutura.

O esboço tem três partes obrigatórias: (1) layout em ASCII no terminal, nunca HTML, artifact ou arquivo; (2) estética em palavras — paleta com os hex, tipografia, tratamento (chapado / translúcido / minimalista) e o efeito pretendido; (3) de 2 a 4 opções para o usuário escolher, com uma recomendação e o porquê.

As opções devem ser genuinamente distintas — abordagens diferentes, não variações de cor da mesma ideia — e sobre o que está em aberto: se o usuário já definiu a estética, as opções passam a ser de comportamento, posição ou estados. Nunca devolver como opção uma decisão que ele já tomou. O esboço é proporcional: sobrando pouco em aberto, encolhe para uma confirmação de poucas linhas.

Não dispara em ajuste pontual do que já existe — texto, espaçamento, cor já pedida, correção de bug visual. Aí é implementar direto.

Motivo: o usuário itera várias vezes até fechar. Em ASCII cada rodada custa poucos KB; em código ou HTML cada ajuste reescreve tudo e ainda pode ser descartado. Esboço sem a parte estética não serve — decisão tomada só sobre layout costuma ser rejeitada depois de implementada.

Renderizado (HTML/artifact) apenas quando pedido com essas palavras ("faz em HTML", "quero ver renderizado", "publica"). Se a decisão depender de cor ou tipografia a ponto do ASCII não bastar, dizer isso em uma linha e esperar — nunca produzir por conta própria. Autorizado: fechar o layout em ASCII antes, manter enxuto, sem imagem embutida nem estado interativo não pedido, e verificar por JS em vez de screenshot (o item mais caro do contexto — no máximo um, do resultado final).

## Publicação

Depois de qualquer alteração, sempre `git add -A && git commit && git push` para o `main` quando o usuário pedir para publicar (veja `README.md`).
