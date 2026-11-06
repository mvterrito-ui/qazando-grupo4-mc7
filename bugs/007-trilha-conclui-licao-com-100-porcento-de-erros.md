# 007 — Trilha conclui lição e desbloqueia próxima fase com 100% de erros

**Parte:** 2 — Prática Estruturada  
**Tela:** `/duolingo`  
**Severidade:** Alta  
**Encontrado por:** João Paulo  
**Data:** 15/09/2026  
**Cartão no Jira:** *(a criar)*  

## Descrição

```
CENÁRIO: Tentativa de conclusão de lição errando todas as questões
DADO que estou realizando uma lição na Trilha do Inglês
QUANDO respondo incorretamente a 100% das etapas da lição
ENTÃO a lição deveria ser considerada reprovada, impedindo o desbloqueio
da lição seguinte e orientando o aluno a refazer o conteúdo

PROBLEMA IDENTIFICADO: A aplicação exibe a mensagem "Lição completa: você
ganhou 0 XP", marca a lição como concluída no progresso e desbloqueia
imediatamente a lição subsequente na trilha.
```

## Regra contrariada

A página `/docs` define na seção **Trilha do Inglês**:

> *"Lições desbloqueiam sequencialmente — complete a anterior para avançar"*

A regra pressupõe que "completar" uma lição exige aproveitamento pedagógico mínimo. Permitir o avanço sequencial com 0 acertos e 0 XP invalida a regra de desbloqueio condicional e esvazia o propósito educacional da plataforma.

## Evidência

Ao errar todas as perguntas de uma lição, a tela final de resultado exibe o texto:
`Lição completa: você ganhou 0 XP`.
Ao retornar para a tela `/duolingo`, a lição anterior aparece marcada como concluída e a próxima lição da unidade fica acessível e desbloqueada.

## Por que é severidade Alta

Quebra a principal regra de negócio da Trilha do Inglês. Permite que qualquer usuário avance por todas as 4 unidades e lições sem acertar nenhuma questão, fraudando o sistema de progressão da plataforma.
