# 002 — Gerador de Palavras aceita quantidade fora do limite documentado

**Parte:** 4 — Conteúdo com IA
**Tela:** `/words`
**Severidade:** Média
**Encontrado por:** Grupo 4
**Data:** 26/08/2026
**Situação:** Aberto

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

## Observações

**Falta confirmar** o que o sistema faz depois do envio com valor inválido: recusa, corta para
o limite, ou tenta gerar mesmo assim. Quem for dono da Parte 4 deve completar esse teste e
atualizar este arquivo — o resultado pode aumentar a severidade.
