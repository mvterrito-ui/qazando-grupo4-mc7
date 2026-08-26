# Parte 4 — Conteúdo com IA

**Responsável:** _(a definir)_

**Telas:** `/stories` (Historinhas) · `/interview` (Entrevistas) · `/chatbot` (Falar com Max) ·
`/words` (Gerador de Palavras) · `/pronunciation` (Treinar Fala)

---

## Leia isto antes de escrever o primeiro cenário

Esta parte tem uma dificuldade que as outras três não têm: **a IA responde diferente toda vez**.

Se você escrever um cenário assim:

> ❌ `Então a história deve contar sobre um dragão que voa sobre a montanha`

ele vai falhar amanhã **sem que exista bug nenhum** — porque a IA escreveu outra história, e ela
tinha todo o direito de escrever. Você criou um teste que acusa defeito onde não há. Isso é pior
do que não ter teste: destrói a confiança do time no resultado.

### A regra de ouro

**Não verifique o conteúdo que a IA gerou. Verifique o comportamento em volta dele.**

| ❌ Não verifique isto | ✅ Verifique isto |
|---|---|
| o texto exato que a IA escreveu | que veio algum texto, e que não veio vazio |
| se a história ficou boa | que a história está em inglês e a tradução em português |
| a resposta específica do Max | que a mensagem apareceu na conversa |
| quais palavras a IA escolheu | que vieram **exatamente** as 10 palavras que eu pedi |
| — | que o "carregando" apareceu e depois sumiu |
| — | que a tela mudou de estado depois da ação |
| — | que dois pedidos seguidos geraram resultados diferentes |

A qualidade do texto em si fica no **teste manual**, avaliado por uma pessoa. Isso não é
preguiça: é a decisão certa. Máquina não julga se um texto ficou bom.

---

## Regras da `/docs` que esta parte precisa cobrir

**Historinhas**
1. Usuário digita o tema desejado para a história
2. A IA gera a história em inglês com tradução em português
3. Requer acesso premium
4. Nova história gerada a cada solicitação

**Entrevistas**
5. A IA gera perguntas técnicas de QA em inglês
6. Usuário responde livremente por texto
7. A IA avalia a resposta e dá feedback construtivo
8. Existe opção de traduzir o feedback para português

**Falar com Max**
9. Chat livre com IA — conversa sobre qualquer assunto
10. Suporta entrada por voz (microfone)
11. Mensagens podem ser traduzidas sob demanda
12. Avatar animado opcional durante a conversa

**Gerador de Palavras**
13. Usuário escolhe o tema e a quantidade de palavras (**1 a 100**)
14. A IA gera palavras com tradução e frase de exemplo
15. Áudio disponível para ouvir a pronúncia de cada palavra

**Treinar Fala**
16. A IA gera uma frase em inglês para praticar
17. Usuário ouve a pronúncia correta antes de tentar
18. Grava a própria voz e o sistema compara
19. O feedback mostra o que foi reconhecido vs. o que era esperado

---

## Cenários-semente

### Historinhas
- [ ] Gerar uma história com um tema comum *(caminho feliz)* — conferir que veio texto em
      inglês e tradução em português *(regra 2)*
- [ ] Gerar com o campo de tema **vazio**
- [ ] Gerar com um tema de **1 caractere**
- [ ] Gerar com um tema **muito longo** (cole um parágrafo inteiro)
- [ ] Gerar com o tema em inglês em vez de português
- [ ] Gerar duas histórias com o **mesmo tema** e conferir que são diferentes *(regra 4)*
- [ ] Conferir se a tradução corresponde ao texto em inglês — este fica no manual
- [ ] Conferir se o "carregando" aparece durante a geração e some depois

### Entrevistas
- [ ] Gerar uma pergunta e conferir que veio em inglês *(regra 5)*
- [ ] Responder normalmente e receber o feedback *(caminho feliz — regra 7)*
- [ ] Enviar a resposta **vazia**
- [ ] Responder com **uma única palavra**
- [ ] Responder **em português** e ver como a IA reage
- [ ] Traduzir o feedback e conferir se traduziu o feedback certo *(regra 8)*
- [ ] Traduzir duas vezes seguidas e ver o que acontece
- [ ] Gerar uma pergunta nova sem ter respondido a anterior

### Falar com Max
- [ ] Enviar uma mensagem e receber resposta *(caminho feliz — regra 9)*
- [ ] Enviar mensagem vazia
- [ ] Enviar uma mensagem muito longa
- [ ] Traduzir uma mensagem da conversa *(regra 11)*
- [ ] Ligar e desligar o avatar durante a conversa *(regra 12)*
- [ ] Iniciar uma "Nova Conversa" e conferir se a anterior sumiu
- [ ] **Negar a permissão de microfone** e conferir se a tela avisa em vez de travar *(regra 10)*
- [ ] Conceder o microfone e usar a entrada por voz *(regra 10)*

### Gerador de Palavras
- [ ] Gerar 10 palavras sobre um tema *(caminho feliz)*
- [ ] Conferir se vieram **exatamente** 10 palavras — a quantidade pedida é a entregue?
- [ ] Conferir se cada palavra veio com tradução e frase de exemplo *(regra 14)*
- [ ] Gerar com quantidade **1** *(limite mínimo válido — regra 13)*
- [ ] Gerar com quantidade **100** *(limite máximo válido — regra 13)*
- [ ] Gerar com quantidade **0** *(inválido — já achamos bug aqui, ver bug 002)*
- [ ] Gerar com quantidade **101** *(inválido — ver bug 002)*
- [ ] Gerar com quantidade **negativa** *(inválido — ver bug 002)*
- [ ] Gerar com o campo de tema vazio
- [ ] Tocar o áudio de uma palavra e conferir se toca a palavra certa *(regra 15)*

### Treinar Fala
- [ ] Gerar uma frase para praticar *(regra 16)*
- [ ] Ouvir a pronúncia correta antes de gravar *(regra 17)*
- [ ] Gravar a voz e receber o feedback *(caminho feliz — regra 18)*
- [ ] Conferir se o feedback mostra o reconhecido e o esperado lado a lado *(regra 19)*
- [ ] **Negar a permissão de microfone** e conferir se a tela avisa em vez de travar
- [ ] Gravar em silêncio, sem falar nada
- [ ] Gerar uma frase nova sem ter gravado a anterior

---

## O que mais rende bug aqui

Os **limites de entrada**. É a parte mais fácil de quebrar do projeto inteiro. Um bug já foi
encontrado assim, em cinco minutos: o campo de quantidade do Gerador de Palavras aceita 0, 101
e −5, apesar de a `/docs` dizer "1 a 100". Veja o
[bug 002](../../bugs/002-gerador-palavras-aceita-quantidade-invalida.md).

Faça isso em **todo** campo que você encontrar: se existe um limite escrito, teste o valor
logo abaixo, o limite exato, e o valor logo acima.

## O ponto mais difícil

Duas telas usam **microfone**: Falar com Max e Treinar Fala. Testar áudio no navegador é a
tarefa mais técnica deste projeto.

No teste manual não tem mistério: conceda a permissão e fale. O trabalho está em cobrir o
caminho ruim — **negar a permissão** e conferir se a tela avisa com clareza em vez de simplesmente
travar. Esse é o cenário que quase todo mundo esquece e onde costuma haver defeito.

Na automação, existe um jeito de o navegador usar um arquivo de áudio no lugar do microfone
real. Quando chegar essa hora, peça ajuda — está previsto que essa parte precise de apoio.

---

## Exemplo pronto, para copiar

```gherkin
# Tela: /words
# Regra da /docs: "Usuário escolhe o tema e quantidade de palavras (1 a 100)"

Funcionalidade: Gerador de Palavras — quantidade solicitada

  Cenário: Gerar a quantidade exata de palavras pedida
    Dado que estou logado com uma conta premium
    E que estou na tela do Gerador de Palavras
    Quando informo o tema "testes de software"
    E informo a quantidade 10
    E solicito a geração
    Então devo receber exatamente 10 palavras
    E cada palavra deve vir com tradução e frase de exemplo

  Cenário: Recusar quantidade acima do limite
    Dado que estou logado com uma conta premium
    E que estou na tela do Gerador de Palavras
    Quando informo a quantidade 101
    Então a geração não deve ser permitida
    E devo ver um aviso sobre o limite de 100 palavras
```

Repare no primeiro cenário: ele verifica **a quantidade**, que é previsível, e não **quais
palavras**, que muda toda vez. É assim que se testa IA.
