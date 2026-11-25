# 012 — Ranking não exibe o e-mail, e nomes repetidos ficam indistinguíveis

**Parte:** 3 — Pontuação e Comparação
**Tela:** `/ranking`
**Severidade:** Baixa
**Encontrado por:** Marcos Vinicio Territo
**Data:** 25/11/2026
**Cartão no Jira:** *(a criar)*

## Descrição

```
CENÁRIO: Conferir o que o ranking exibe de cada participante
DADO que a documentação promete nome, e-mail e estatísticas de cada participante
QUANDO acesso a tela de Ranking
ENTÃO cada linha deveria exibir o nome e o e-mail

PROBLEMA IDENTIFICADO: a tabela tem as colunas Posição, Nome, Exercícios,
Corretas e Taxa de Acerto. Não há e-mail. Como vários alunos têm o mesmo nome,
não dá para saber quem é quem.
```

## Regra contrariada

> *"Exibe nome, e-mail e estatísticas de cada participante"* — página `/docs`, bloco **Ranking**

## Evidência

Tela `/ranking` em 25/11/2026: colunas `Posição | Nome | Exercícios | Corretas | Taxa de Acerto`.

Nomes que aparecem mais de uma vez na mesma tabela: "Teste Usuario" (mais de 10 vezes),
"Testes da Silva", "Carlos Eduardo Marino Junior" (3 vezes) e "Grupo 4" (2 vezes, uma delas a
conta de teste deste grupo).

Teste automatizado: `automacao/tests/parte-3-pontuacao-e-comparacao/ranking.spec.js`,
cenário *"exibe nome e e-mail de cada participante"*, com `test.fail()`.

## Observações

**Severidade Baixa:** não impede ninguém de usar a tela.

**Atenção antes de pedir a correção:** exibir o e-mail de todos os alunos para todos os
alunos é uma questão de privacidade. A ausência da coluna pode ter sido proposital. Por isso
o `ranking.feature` tem um cenário `@manual` pedindo essa decisão. O defeito reportado aqui é
a divergência entre a `/docs` e a tela, e a consequência prática: com nomes repetidos, a
pessoa não consegue se achar no ranking.
