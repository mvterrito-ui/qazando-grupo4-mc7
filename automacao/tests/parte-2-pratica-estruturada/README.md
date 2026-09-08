# Testes automatizados — Parte 2 — Prática Estruturada

**Responsável:** João Paulo

Esta pasta está vazia. É aqui que os seus `.spec.js` vão morar.

## Antes de escrever a primeira linha

1. Leia [`../parte-4-conteudo-com-ia/words.spec.js`](../parte-4-conteudo-com-ia/words.spec.js) —
   é o exemplo comentado linha a linha.
2. Leia [`../../README.md`](../../README.md), seção **Como replicar na sua parte**.
3. Escreva os `.feature` da sua parte primeiro, em `cenarios/parte-2-pratica-estruturada/`.

## Não escreva o seu próprio login

[`../../setup/auth.setup.js`](../../setup/auth.setup.js) já faz login e ativa o premium para
as quatro partes. Seu teste começa logado. Se precisar mudar algo no login, **mexa lá** — não
copie para cá.

## O padrão da sua parte

Quase toda regra da sua parte só se prova **saindo e voltando**. Um teste que olha só a tela
no momento do clique não enxerga nada — o defeito aparece na segunda visita.

Em Playwright, o padrão é sempre este:

```js
// 1. age
await trilha.concluirLicao(1);
// 2. sai e volta de verdade
await page.goto("/duolingo");
// 3. confere que o sistema lembrou
await expect(trilha.licao(2)).toBeEnabled();
```

Anote o **estado inicial de uma conta nova** — 0 XP, só a Lição 1 liberada, 40 cartões na fila.
É a base de comparação de todos os seus testes.
