# 002 — Gerador de Palavras aceita quantidade fora do limite documentado

**Parte:** 4 — Conteúdo com IA
**Tela:** `/words`
**Severidade:** Média
**Encontrado por:** Grupo 4
**Data:** 26/08/2026

## Descrição

```
CENÁRIO: Gerar vocabulário com quantidade inválida
DADO que a documentação define "quantidade de palavras (1 a 100)"
E que o campo declara internamente o mínimo 1 e o máximo 100
QUANDO informo 0, 101 ou -5 no campo de quantidade
ENTÃO a tela deveria impedir o envio e avisar sobre o limite

PROBLEMA IDENTIFICADO: o campo aceita os três valores e o botão "Gerar
Palavras com IA" continua habilitado. Os limites mínimo e máximo estão
declarados no campo, mas não são aplicados na prática.
```

## Regra contrariada

> *"Usuário escolhe o tema e quantidade de palavras (1 a 100)"* — página `/docs`, bloco
> **Gerador de Palavras**

## Evidência

O campo de quantidade é do tipo numérico e declara `min="1"` e `max="100"`. Ainda assim, ao
digitar `0`, `101` ou `-5`, o valor permanece no campo e o botão de gerar continua clicável.

Explicação técnica, para quem for corrigir: os atributos `min` e `max` de um campo numérico só
são aplicados automaticamente pelo navegador quando o envio passa pela validação nativa de
formulário. Como esta tela envia por código, a validação nunca é acionada.

## Confirmado em 07/09/2026 — o que acontece depois do envio

A pendência que estava aberta aqui foi respondida por teste automatizado
(`automacao/tests/parte-4-conteudo-com-ia/words.spec.js`, cenário *"investiga o que acontece ao
ENVIAR quantidade 101"*). O resultado medido:

| Pergunta | Resposta |
|---|---|
| Recusa, corta para 100, ou tenta gerar? | **Nenhuma das três** — devolve **0 palavras** |
| Avisa o usuário? | **Não.** Nenhuma mensagem aparece na tela |
| Quanto tempo leva até isso? | ~47 segundos |

**Ou seja, o problema é maior do que o relato original.** Não é só "o campo aceita valor fora
do limite": é que a tela **falha em silêncio**. A pessoa digita 101, o botão continua
habilitado, ela clica, espera quase um minuto olhando para a tela — e não acontece nada. Sem
erro, sem aviso, sem explicação. Ela não tem como saber se o sistema quebrou, se ainda está
processando, ou se ela fez algo errado.

Reproduzir manualmente: `/words` → tema qualquer → quantidade `101` → *Gerar Palavras com IA*.

## Observações

**Severidade mantida em Média**, seguindo o combinado de escolher a menor na dúvida: só se
chega aqui digitando um valor inválido de propósito, então não bloqueia o uso normal da tela.
Mas registre-se que o *impacto* é pior que o descrito antes — falha silenciosa é o tipo de
comportamento que faz o usuário achar que o produto está quebrado.

**Duas correções são necessárias, não uma:**
1. aplicar o limite de 1 a 100 no campo, impedindo o envio
2. e, mesmo assim, nunca deixar a geração terminar sem dizer nada ao usuário

**Ainda não testado:** o que acontece ao enviar `0` e `-5`. O teste automatizado cobre a
recusa no formulário para os três valores, mas só o envio de `101` foi investigado até o fim.
