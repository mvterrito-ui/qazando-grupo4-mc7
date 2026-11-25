# 009 — Acertos no Quiz não creditam XP

**Parte:** 3 — Pontuação e Comparação
**Tela:** `/quiz`, com efeito em `/duolingo`
**Severidade:** Média
**Encontrado por:** Marcos Vinicio Territo
**Data:** 25/11/2026
**Cartão no Jira:** *(a criar)*

## Descrição

```
CENÁRIO: Ganhar XP ao acertar uma pergunta do quiz
DADO que anotei o meu XP Total na Trilha do Inglês
QUANDO acerto uma pergunta do quiz
ENTÃO o XP Total deveria aumentar

PROBLEMA IDENTIFICADO: o XP Total continua igual. Em 25/11/2026 ele estava em
0, continuou em 0 depois de 1 acerto e continuou em 0 depois de 15 acertos.
```

## Regra contrariada

> *"Ganha XP por cada acerto"* — página `/docs`, bloco **Quiz**

## Evidência

| Momento | XP Total (tela `/duolingo`) | Acertos no quiz |
|---|---|---|
| Antes de responder | 0 | 0 |
| Depois de acertar "dog → cachorro" | 0 | 1 |
| Depois de uma sequência de respostas | 0 | 15 |

A tela do quiz não mostra XP em lugar nenhum, nem durante as perguntas nem no resultado final.
O único XP visível na plataforma é o "XP Total" da Trilha do Inglês.

Teste automatizado: `automacao/tests/parte-3-pontuacao-e-comparacao/pontuacao.spec.js`,
cenário *"acertar uma pergunta credita XP"*, com `test.fail()`.

## Observações

**O que ainda precisa ser confirmado:** se existe outro XP, do quiz, guardado e não exibido.
Se existir, o defeito passa a ser outro, de exibição: a regra promete XP e o usuário não tem
onde vê-lo. De um jeito ou de outro, a pessoa acerta e não vê recompensa nenhuma.
