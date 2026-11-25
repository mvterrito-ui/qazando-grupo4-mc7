# 010 — Ranking lista alunos com menos de 5 exercícios

**Parte:** 3 — Pontuação e Comparação
**Tela:** `/ranking`
**Severidade:** Média
**Encontrado por:** Marcos Vinicio Territo
**Data:** 25/11/2026
**Cartão no Jira:** *(a criar)*

## Descrição

```
CENÁRIO: Conferir quem aparece no ranking
DADO que a documentação exige no mínimo 5 exercícios para aparecer no ranking
QUANDO acesso a tela de Ranking
ENTÃO todas as linhas deveriam ter 5 ou mais exercícios

PROBLEMA IDENTIFICADO: o ranking lista 153 competidores, e a maioria tem de 0
a 4 exercícios. Alunos com 1 exercício ocupam posições do topo.
```

## Regra contrariada

> *"Mínimo de 5 exercícios completados para aparecer no ranking"* — página `/docs`, bloco
> **Ranking**

## Evidência

Tela `/ranking` em 25/11/2026, cartão **Total de Competidores: 153**. Exemplos de linhas:

| Posição | Exercícios | Corretas | Taxa |
|---|---|---|---|
| #4 | 3 | 3 | 100.0% |
| #9 | 1 | 1 | 100.0% |
| #43 em diante | 0 | 0 | 0.0% |

Teste automatizado: `automacao/tests/parte-3-pontuacao-e-comparacao/ranking.spec.js`,
cenário *"so aparece quem completou pelo menos 5 exercicios"*, com `test.fail()`. Quando
falha, a mensagem lista as linhas abaixo do mínimo.

## Observações

Combinado com o [bug 011](011-ranking-ordena-por-taxa-e-nao-por-acertos.md), o efeito é
visível: quem respondeu 1 exercício e acertou fica acima de quem respondeu 61 e acertou 58.
A regra dos 5 exercícios existe justamente para impedir que uma taxa de 100% com uma única
resposta lidere o ranking.
