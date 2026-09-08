# Automação web — Playwright

Automação dos cenários deste repositório. **Playwright com JavaScript**, decidido pelo grupo.

> **Se você vai automatizar a sua parte:** leia [Como replicar na sua parte](#como-replicar-na-sua-parte)
> no fim deste arquivo. Antes disso, abra
> [`tests/parte-4-conteudo-com-ia/words.spec.js`](tests/parte-4-conteudo-com-ia/words.spec.js) —
> é o exemplo comentado linha a linha. Os outros arquivos são resumidos de propósito; esse é o modelo.

---

## Rodar pela primeira vez

Três comandos, uma vez só:

```bash
cd automacao
npm install                    # baixa o Playwright
npx playwright install chromium # baixa o navegador
cp .env.example .env           # e edite com a SUA conta
```

Abra o `.env` e preencha `QA_EMAIL` e `QA_PASSWORD` com a conta que **você** criou em
`/auth`. Não use a conta de outra pessoa: um apaga o progresso do outro e o grupo reporta bug
que não existe.

> As quatro contas de teste publicadas na `/docs` **não funcionam** — é o
> [bug 001](../bugs/001-usuarios-de-teste-nao-logam.md), ainda aberto. Por isso conta própria.

Depois:

```bash
npm test                # roda tudo
npm run test:ui         # modo visual — comece por aqui
npm run test:parte-4    # só a Parte 4
npm run report          # abre o relatório da última execução
```

**Na primeira vez, use `npm run test:ui`.** Ele abre uma janela onde você vê o teste rodando
passo a passo e consegue inspecionar cada seletor. É como você vai descobrir quais seletores
precisam de ajuste.

---

## Como isto está organizado

```
automacao/
  playwright.config.js   configuração: timeouts, evidência, os 3 projetos
  .env                   SUA conta (nunca vai para o git)
  setup/
    auth.setup.js        ⭐ login + premium — roda 1x, serve as 4 partes
  pages/                 seletores de cada tela, um arquivo por tela
  support/
    ia.js                ajudantes para testar conteúdo gerado por IA
  tests/
    parte-1-acesso-e-permissao/     (vazia — Flavia)
    parte-2-pratica-estruturada/    (vazia — João Paulo)
    parte-3-pontuacao-e-comparacao/ (vazia — Denaide)
    parte-4-conteudo-com-ia/        Marcos — o exemplo
```

### O login é compartilhado. Não copie ele.

[`setup/auth.setup.js`](setup/auth.setup.js) faz login e ativa o premium **uma vez**, e salva a
sessão em `.auth/premium.json`. Todo teste começa já logado.

Ele não pertence a parte nenhuma: as quatro precisam de uma conta premium e nenhuma é dona
disso. **Se precisar mudar algo no login, mexa nesse arquivo** — não copie o login para dentro
do seu teste. Se cada pessoa escrever o próprio, o grupo termina com quatro autenticações
diferentes e nenhuma reaproveitável.

### Os quatro projetos do Playwright

| Projeto | O que roda |
|---|---|
| `setup` | o login. Roda primeiro, sempre |
| `chromium` | os testes normais |
| `microfone` | `*-microfone.spec.js`, com microfone **concedido** e áudio falso |
| `microfone-negado` | `*-microfone-negado.spec.js`, com microfone **recusado** |

```bash
npx playwright test --project=microfone-negado
```

**Por que dois projetos de microfone**, e não um só com `clearPermissions()`: a flag
`--use-fake-ui-for-media-stream` concede a permissão no nível do navegador, e
`clearPermissions()` não a desfaz. Um teste de recusa rodando no projeto `microfone` estaria,
na verdade, testando o caminho feliz — e passando por engano. Foi exatamente o que aconteceu
aqui antes de a separação existir.

### Estado da suíte

Última execução completa contra o site, 07/09/2026: **46 verdes, 5 pulados, nenhuma falha.**

Os 5 pulados são deliberados e documentados no próprio arquivo:
- 4 de gravação de voz — o reconhecimento de fala do navegador não funciona com áudio
  sintético em headless. Viraram `@manual` no `treinar-fala.feature`.
- 1 de bloqueio premium — precisa de uma segunda conta (`QA_EMAIL_SEM_PREMIUM` no `.env`).

---

## A regra de ouro (Parte 4, mas leia mesmo assim)

**Não asserte o conteúdo que a IA gerou. Asserte o comportamento em volta dele.**

Se o teste disser *"a história fala de um dragão"*, ele falha amanhã **sem que exista bug** —
a IA escreveu outra história e tinha o direito. Isso é pior que não ter teste: o time para de
confiar no vermelho.

| ❌ Não asserte | ✅ Asserte |
|---|---|
| o texto que a IA escreveu | que veio texto, e não veio vazio |
| se ficou bom | que está no idioma esperado |
| quais palavras vieram | que vieram **exatamente** as 10 pedidas |
| — | que o carregando apareceu e sumiu |
| — | que duas gerações deram resultados diferentes |

[`support/ia.js`](support/ia.js) tem essas verificações prontas — `esperarTextoNaoVazio`,
`afirmarIdiomas`, `afirmarConteudoDiferente`, `esperarCarregamentoSumir`. Use elas em vez de
escrever a sua versão.

Cenários marcados `@manual` nos `.feature` **não são automatizados** — são os que só um olho
humano julga. Isso não é preguiça, é a decisão certa.

---

## Bug conhecido no meio do teste: `test.fail()`

Os testes de limite do `/words` cobrem o [bug 002](../bugs/002-gerador-palavras-aceita-quantidade-invalida.md),
que está aberto. Eles usam:

```js
test.fail(true, 'Bug 002 em aberto: o campo aceita 0');
```

Isso diz ao Playwright *"eu sei que isto falha hoje"*. O teste roda, falha, e o resultado fica
**verde**. No dia em que a Qazando corrigir, ele passa a dar **vermelho** avisando que o
comportamento mudou — e aí você apaga a linha `test.fail()` e reteste o bug.

É como manter no repositório o teste de um bug conhecido sem deixar a pipeline vermelha para
sempre. **Use isso quando achar um bug na sua parte.**

---

## Microfone

Duas telas da Parte 4 dependem de microfone. Em automação não há ninguém falando, então o
navegador recebe um dispositivo falso — já configurado no `playwright.config.js`.

Para injetar áudio de verdade (necessário só se você quiser conferir o texto reconhecido),
acrescente aos `args` do projeto `microfone`:

```js
'--use-file-for-fake-audio-capture=/caminho/absoluto/frase.wav'
```

O arquivo precisa ser **WAV mono 16 bits**. Sem ele, o dispositivo produz silêncio — que já
serve para o cenário *"gravei sem falar nada"*.

---

## Evidência

*"Sem evidência não é bug, é opinião."* Quando um teste falha, o Playwright guarda sozinho:

- **trace** — reproduz a sessão inteira, clique a clique (`npx playwright show-trace`)
- **screenshot** do momento da falha
- **vídeo** da execução

Tudo em `test-results/`. **Anexe o trace no bug do Jira** — é a melhor evidência que existe.

---

## Os seletores desta aplicação: o que aprendemos batendo contra a tela

Os seletores da Parte 4 **já foram conferidos contra o site** em 07/09/2026. Três padrões da
aplicação valem para a sua parte também, e vão te poupar horas:

**1. Os rótulos não são `<label>`.** Textos como "Tema do vocabulário" ou "Quantidade de
palavras" são `<div>` soltas, não ligadas ao campo. `getByLabel()` **não encontra nada**. Use
`getByRole('textbox')` / `getByRole('spinbutton')`.

**2. Os placeholders começam com "Ex:".** O campo de tema tem
`placeholder="Ex: comida, animais, viagens..."` — procurar por `/tema/` no placeholder falha.

**3. O conteúdo mora ao lado de um rótulo, em profundidade variável.** Blocos como "Análise e
Feedback" ou "Tradução PT-BR" têm o texto num irmão — mas uns têm uma `<div>` a mais que
outros. Use `textoDoBlocoDe()` de [`support/ia.js`](support/ia.js), que sobe nível a nível até
achar conteúdo, em vez de fixar `following::p[1]`.

**E cuidado com `isVisible()`**: ele **não espera**. `await loc.isVisible({ timeout: 90000 })`
checa na hora e devolve `false` instantaneamente — o teste reporta falha onde não há. Para
"espere aparecer, mas não falhe se não vier", use `apareceu()` de `support/ia.js`. Para
"falhe se não vier", use `expect(loc).toBeVisible()`.

Se ainda assim um seletor não bater na sua parte:

```bash
npx playwright codegen https://english.qazando.com.br/words
```

Clique nos elementos, veja o seletor que o Playwright sugere, ajuste o `pages/*.page.js` e
apague o aviso. **Só os arquivos de `pages/` precisam mudar** — é para isso que eles existem.

---

## Como replicar na sua parte

1. **Não mexa em `setup/`.** Seu teste já começa logado e com premium.
2. **Escreva os `.feature` primeiro**, em `cenarios/parte-N-.../`. O Gherkin é a especificação
   completa, inclusive do que fica manual.
3. **Crie um `pages/suatela.page.js`** por tela. Só seletores e ações — **nenhum `expect`**.
   Afirmar é trabalho do teste, não da tela.
4. **Crie `tests/parte-N-.../suatela.spec.js`.** Comece pelo cabeçalho apontando qual `.feature`
   ele automatiza.
5. **A automação não copia o Gherkin um-pra-um.** Automatize o que dói se quebrar; o resto fica
   manual e documentado.
6. **Abra PR e peça revisão.** Nada entra sem revisão — revisão de rodízio, ninguém é gargalo.

O que a sua parte tem de diferente:

| Parte | O padrão que você vai repetir |
|---|---|
| 1 — Acesso e Permissão | mesma entrada, mesma saída. Teste rota premium **sem** premium, digitando o endereço direto |
| 2 — Prática Estruturada | quase tudo só se prova **saindo e voltando**. Use um segundo `page.goto()` depois de agir |
| 3 — Pontuação e Comparação | as 3 telas contam a mesma verdade. Leia o número numa tela e **compare** com a outra |
| 4 — Conteúdo com IA | a regra de ouro acima |

---

## Se algo der errado

| Sintoma | Provável causa |
|---|---|
| `Faltam QA_EMAIL e QA_PASSWORD` | o `.env` não existe ou está vazio — `cp .env.example .env` |
| `Não consegui ativar o premium` | código mudou; confira em `/activate-premium`. Se recusou código válido, **é bug** |
| Teste não acha um elemento | seletor desatualizado — conserte o `pages/*.page.js`, não o spec |
| Tudo falha logo no começo | rode `npx playwright test --project=setup` sozinho e veja onde o login para |
| Muito lento | é a IA respondendo. Normal levar de 2 a 30 segundos por geração |
