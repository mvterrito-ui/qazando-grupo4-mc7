# 003 — Título da tela de progresso tem texto residual

**Parte:** 3 — Pontuação e Comparação
**Tela:** `/progress`
**Severidade:** Baixa
**Encontrado por:** Grupo 4
**Data:** 26/08/2026

## Descrição

```
CENÁRIO: Abrir a tela Meu Progresso
DADO que estou logado com uma conta premium
QUANDO acesso a tela Meu Progresso
ENTÃO o título deveria ser "Seu Progresso"

PROBLEMA IDENTIFICADO: o título exibido é "📊 Seu Progresso aqui". A palavra
"aqui" no fim da frase parece sobra de um texto de rascunho.
```

## Regra contrariada

Nenhuma regra funcional. É um problema de texto: o menu lateral chama a tela de
**Meu Progresso**, e o título dentro dela diz **"Seu Progresso aqui"** — dois nomes diferentes
para a mesma tela, e o segundo com uma palavra sobrando.

## Evidência

Título da tela `/progress` exibindo literalmente `📊 Seu Progresso aqui`.

## Por que vale reportar mesmo sendo Baixa

É cosmético e não impede ninguém de usar o sistema. Mas é a primeira coisa que se lê ao abrir
a tela, e passa a impressão de rascunho esquecido em produção. Bug barato de corrigir e de
efeito imediato.
