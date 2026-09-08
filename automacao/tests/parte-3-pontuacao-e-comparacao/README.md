# Testes automatizados — Parte 3 — Pontuação e Comparação

**Responsável:** Denaide de Cassia Sónora Souza Costa

Esta pasta está vazia. É aqui que os seus `.spec.js` vão morar.

## Antes de escrever a primeira linha

1. Leia [`../parte-4-conteudo-com-ia/words.spec.js`](../parte-4-conteudo-com-ia/words.spec.js) —
   é o exemplo comentado linha a linha.
2. Leia [`../../README.md`](../../README.md), seção **Como replicar na sua parte**.
3. Escreva os `.feature` da sua parte primeiro, em `cenarios/parte-3-pontuacao-e-comparacao/`.

## Não escreva o seu próprio login

[`../../setup/auth.setup.js`](../../setup/auth.setup.js) já faz login e ativa o premium para
as quatro partes. Seu teste começa logado. Se precisar mudar algo no login, **mexa lá** — não
copie para cá.

## O padrão da sua parte

As suas três telas contam **a mesma verdade três vezes**. O seu trabalho é conferir se elas
concordam entre si — e esse bug só aparece para quem testa as três juntas.

O padrão da sua parte é ler um número numa tela e **comparar** com o da outra:

```js
const acertosNoQuiz = await quiz.totalDeAcertos();
await page.goto("/progress");
expect(await progresso.acertosDePalavras()).toBe(acertosNoQuiz);
```

⚠️ **Massa de dados:** o ranking exige 5 exercícios respondidos para alguém aparecer. Seu teste
precisa criar essa massa antes de testar o ranking — ou você vai testar uma tela vazia e achar
que está tudo certo.
