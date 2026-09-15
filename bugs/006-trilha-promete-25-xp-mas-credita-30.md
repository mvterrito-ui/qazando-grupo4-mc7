# 006 — Lição da Trilha promete +25 XP mas credita 30 XP

**Parte:** 2 — Prática Estruturada  
**Tela:** `/duolingo`  
**Severidade:** Média  
**Encontrado por:** João Paulo  
**Data:** 15/09/2026  
**Cartão no Jira:** *(a criar)*  

## Descrição

```
CENÁRIO: Crédito de XP após conclusão de lição na Trilha
DADO que a Lição 1 anuncia o ganho de "+25 XP" na interface
QUANDO concluo todas as etapas da Lição 1 com sucesso
ENTÃO o saldo de XP da conta deveria aumentar em exatamente 25 pontos

PROBLEMA IDENTIFICADO: O saldo de XP é incrementado em 30 pontos (+30 XP)
em vez dos 25 XP prometidos no card da lição.
```

## Regra contrariada

A página `/docs` define na seção **Trilha do Inglês**:

> *"Cada lição concluída dá XP"*

E a interface da própria aplicação exibe explicitamente o valor de `+25 XP` no card da lição. Há divergência entre a pontuação prometida ao usuário no front-end e o valor efetivamente computado no saldo da conta.

## Evidência

Card da Lição 1 na rota `/duolingo` exibindo o texto `+25 XP`. Ao finalizar a lição, o saldo total de XP no topo da tela salta de 0 para 30 XP.

## Por que é severidade Média

Não impede a navegação nem trava o sistema, mas gera incoerência matemática e de interface. Em plataformas gamificadas, a previsibilidade da pontuação é fundamental para a confiabilidade do usuário e afeta diretamente as telas de Progresso e Ranking.
