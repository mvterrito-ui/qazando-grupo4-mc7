# 011 — Ranking ordena por taxa de acerto, e não por total de acertos

**Parte:** 3 — Pontuação e Comparação
**Tela:** `/ranking`
**Severidade:** Média
**Encontrado por:** Marcos Vinicio Territo
**Data:** 25/11/2026
**Cartão no Jira:** *(a criar)*

## Descrição

```
CENÁRIO: Conferir a ordem do ranking
DADO que a documentação define a ordem por total de acertos, do maior para o menor
QUANDO acesso a tela de Ranking
ENTÃO cada linha deveria ter tantos acertos quanto a de baixo, ou mais

PROBLEMA IDENTIFICADO: a tela ordena pela taxa de acerto. O próprio subtítulo
da tela diz "Classificação de todos os alunos pela maior taxa de acerto". A
documentação e a tela dizem coisas diferentes.
```

## Regra contrariada

> *"Ordenado por total de acertos, do maior para o menor"* — página `/docs`, bloco **Ranking**

## Evidência

Tela `/ranking` em 25/11/2026:

| Posição | Exercícios | Corretas | Taxa |
|---|---|---|---|
| #9 | 1 | **1** | 100.0% |
| #17 | 42 | **41** | 97.6% |
| #20 | 61 | **58** | 95.1% |

Pela regra da `/docs`, a linha com 58 acertos deveria estar acima das outras duas.

Teste automatizado: `automacao/tests/parte-3-pontuacao-e-comparacao/ranking.spec.js`,
cenário *"e ordenado por total de acertos, do maior para o menor"*, com `test.fail()`.

## Observações

Não dá para afirmar qual dos dois está errado, a documentação ou a tela: o subtítulo mostra
que a ordenação por taxa foi uma escolha. O defeito reportado é a **divergência**. Ou a tela
passa a ordenar por acertos, ou a documentação é corrigida. A ordenação por taxa, sem o
mínimo de 5 exercícios funcionando ([bug 010](010-ranking-lista-quem-tem-menos-de-5-exercicios.md)),
premia quem respondeu menos.
