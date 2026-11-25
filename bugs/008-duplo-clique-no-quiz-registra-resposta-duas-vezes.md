# 008 — Duplo clique no Quiz registra a resposta duas vezes e as três telas divergem

**Parte:** 3 — Pontuação e Comparação
**Tela:** `/quiz`, com efeito em `/progress` e `/ranking`
**Severidade:** Média
**Encontrado por:** Marcos Vinicio Territo
**Data:** 25/11/2026
**Cartão no Jira:** *(a criar)*

## Descrição

```
CENÁRIO: Responder uma pergunta do quiz com duplo clique
DADO que reiniciei o quiz e estou na pergunta 1 de 30
QUANDO dou um duplo clique numa opção
ENTÃO o quiz deveria registrar uma resposta só
E o Meu Progresso deveria mostrar 1 palavra respondida

PROBLEMA IDENTIFICADO: o quiz avança para a pergunta 2, mas a tela soma 2
respostas. Depois de recarregar, o quiz mostra 1 resposta — o valor salvo do
próprio quiz está certo —, mas o Meu Progresso mostra 2 palavras respondidas e
o Ranking soma as duas. Cada clique é gravado como uma resposta nas
estatísticas.
```

## Regra contrariada

> *"Mostra palavras respondidas, corretas e erradas (vindas do Quiz)"* — página `/docs`,
> bloco **Meu Progresso**

> *"Combina acertos de Quiz + Exercícios no total"* — página `/docs`, bloco **Ranking**

As palavras respondidas no Meu Progresso deveriam ser as respostas do quiz. Com o defeito,
passam a ser os cliques.

## Evidência

Reprodução mínima, em 25/11/2026:

| Momento | Quiz | Meu Progresso |
|---|---|---|
| Logo após o duplo clique | pergunta 2/30, 0 acertos, **2 erros** | — |
| Após recarregar a página | pergunta 2/30, 0 acertos, **1 erro** | **2** palavras respondidas, 2 incorretas |

O efeito acumulado foi como o bug apareceu, numa sequência de respostas rápidas:

| Tela | Respondidas | Acertos |
|---|---|---|
| Quiz, resultado final | 30 | 8 |
| Meu Progresso | 50 | 15 |
| Ranking | 51 (com 1 frase dos Exercícios) | 16 |

Teste automatizado: `automacao/tests/parte-3-pontuacao-e-comparacao/pontuacao.spec.js`,
cenários *"um duplo clique numa opcao registra uma resposta so"* e *"um duplo clique no quiz
nao faz as telas divergirem"*, ambos com `test.fail()` enquanto o bug estiver aberto.

## Observações

**Severidade Média**, e não Alta, seguindo o combinado de escolher a menor: o caminho comum,
um clique por pergunta, funciona. Mas o efeito vai além da conta de quem clicou: o Ranking é
público, e a taxa de acerto exibida para todos os alunos fica errada.

Correção sugerida: desabilitar as opções logo após o primeiro clique, até a pergunta seguinte
aparecer, e gravar no máximo uma resposta por pergunta.
