# Testes automatizados — Parte 1 — Acesso e Permissão

**Responsável:** Flavia

Esta pasta está vazia. É aqui que os seus `.spec.js` vão morar.

## Antes de escrever a primeira linha

1. Leia [`../parte-4-conteudo-com-ia/words.spec.js`](../parte-4-conteudo-com-ia/words.spec.js) —
   é o exemplo comentado linha a linha.
2. Leia [`../../README.md`](../../README.md), seção **Como replicar na sua parte**.
3. Escreva os `.feature` da sua parte primeiro, em `cenarios/parte-1-acesso-e-permissao/`.

## Não escreva o seu próprio login

[`../../setup/auth.setup.js`](../../setup/auth.setup.js) já faz login e ativa o premium para
as quatro partes. Seu teste começa logado. Se precisar mudar algo no login, **mexa lá** — não
copie para cá.

## O padrão da sua parte

Mesma entrada, mesma saída, sempre. É a parte mais previsível e a mais fácil de automatizar —
sem IA, sem áudio.

O cenário mais importante que é seu: **abrir uma rota premium sem ter premium**, digitando o
endereço direto. Em Playwright isso é um `page.goto()` com uma sessão sem premium, conferindo
que você foi levado para `/activate-premium`.

Para isso você precisa de uma **segunda conta, sem premium ativado**. Preencha
`QA_EMAIL_SEM_PREMIUM` no seu `.env`.

⚠️ **A sua parte destrava as outras três.** Ninguém testa trilha, quiz ou IA sem conta premium
funcionando. Entregue antes.
