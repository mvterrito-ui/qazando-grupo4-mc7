# 005 — Microfone negado: a tela não avisa nada

**Parte:** 4 — Conteúdo com IA
**Telas:** `/chatbot` (Falar com Max) e `/pronunciation` (Treinar Fala)
**Severidade:** Média
**Encontrado por:** Marcos Vinicio Territo (automação)
**Data:** 07/09/2026
**Cartão no Jira:** *(a criar)*

## Descrição

```
CENÁRIO: Tentar usar a voz sem ter concedido o microfone
DADO que neguei ao navegador a permissão de usar o microfone
QUANDO clico em "Gravar áudio" no /chatbot
  ou em "Falar Agora e Receber Feedback" no /pronunciation
ENTÃO a tela deveria me avisar que o microfone não está disponível
  e me dizer o que fazer para liberar

PROBLEMA IDENTIFICADO: não acontece absolutamente nada. Nenhuma mensagem,
nenhum aviso, nenhuma mudança de estado na tela. O botão continua ali como se
nunca tivesse sido clicado. A pessoa fica sem saber se o site quebrou, se ainda
está carregando, ou se ela fez algo errado.
```

## Regra contrariada

> *"Suporta entrada por voz (microfone)"* — página `/docs`, bloco **Falar com Max**

> *"Grava a própria voz e o sistema compara"* — página `/docs`, bloco **Treinar Fala**

A `/docs` promete a entrada por voz, mas não descreve o que acontece quando ela
não está disponível. Este bug é sobre o **caminho ruim não tratado**.

## Evidência

Verificado por automação em 07/09/2026, com o navegador configurado **sem**
permissão de microfone (projeto `microfone-negado`, em
`automacao/playwright.config.js`).

Comparação do texto da tela antes e depois do clique: **idêntico**. E o console
do navegador não registra **nenhum erro** — ou seja, a aplicação captura a falha
do `getUserMedia` e a descarta em silêncio, sem informar a pessoa.

Reproduzir manualmente: bloqueie o microfone para o site nas permissões do
navegador, recarregue e clique no botão de voz em qualquer das duas telas.

## Por que isto importa mais do que parece

É a **segunda falha silenciosa** encontrada no produto — a primeira é o
[bug 002](002-gerador-palavras-aceita-quantidade-invalida.md), no Gerador de
Palavras. Duas telas diferentes, o mesmo padrão: a operação falha e o usuário
não é informado. Vale reportar como padrão, não só como dois casos isolados.

No `/pronunciation` o impacto é maior: gravar a voz **é** a função da tela.
Sem microfone e sem aviso, a tela inteira parece quebrada.

## Observações

**Severidade Média**, seguindo o combinado de escolher a menor na dúvida: quem
concede o microfone não passa por isso. Mas basta ter negado uma vez, sem
querer, para a tela ficar inútil e sem explicação — e recusar permissão de
microfone é o padrão de muita gente.

**Não testado ainda:** o que acontece em um computador **sem microfone nenhum**
instalado (diferente de ter um e negar a permissão).
