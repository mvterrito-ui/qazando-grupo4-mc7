# Testes automatizados — Parte 3 — Pontuação e Comparação

**Responsável:** Marcos Vinicio Territo *(desde 25/11/2026)*

| Arquivo | O que testa |
|---|---|
| [`ranking.spec.js`](ranking.spec.js) | regras do ranking em **todas** as linhas. Só lê a tela, roda em paralelo com qualquer coisa |
| [`pontuacao.spec.js`](pontuacao.spec.js) | Quiz, Meu Progresso e a coerência entre as três telas |

## Por que Quiz e Progresso estão num arquivo só

Todos esses testes mexem no **mesmo quiz** da conta de teste: respondem, terminam, refazem.
Em arquivos separados, o Playwright os rodaria em paralelo, e um teste refaria o quiz no meio
do outro. Num arquivo só, rodam um depois do outro.

## Três coisas que a tela ensinou

1. **Responder rápido demais fabrica o bug 008.** O quiz avança sozinho depois do clique.
   Clicar de novo antes da próxima pergunta aparecer grava duas respostas. Por isso o
   `responder()` do page object espera o contador de questão mudar.
2. **"Refazer Quiz" só existe no resultado final**, e refazer **zera** as palavras do Meu
   Progresso. O `reiniciar()` termina o quiz antes de refazer. Isso pode levar até 30
   respostas, então os testes têm limite de 4 minutos.
3. **A taxa de acerto do Progresso tem casa decimal quando a conta não é exata** ("33.3%").
   Esperar um número inteiro trava o teste.

## Rodando

```bash
npx playwright test tests/parte-3-pontuacao-e-comparacao
```

Leva uns 18 minutos, por causa das voltas completas no quiz. Os testes de Exercícios da
Parte 2 mudam o bloco de frases. Na pipeline, os testes rodam um de cada vez e não há
conflito; localmente, rode a Parte 3 sozinha.
