# Parte 3 — Pontuação e Comparação

**Responsável:** Marcos Vinicio Territo  
*(desde 25/11/2026 — ver [docs/06-sorteio-das-partes.md](../../docs/06-sorteio-das-partes.md))*

**Telas:** `/quiz` · `/progress` (Meu Progresso) · `/ranking`

---

## ✅ Os cenários estão escritos em Gherkin

As 23 sementes abaixo viraram **33 cenários** em quatro arquivos `.feature`, e a automação
**roda contra o site** (execução de 25/11/2026):

| Arquivo | Cenários | Automatizados | Manuais |
|---|---|---|---|
| [`quiz.feature`](quiz.feature) | 11 | 10 | 1 |
| [`meu-progresso.feature`](meu-progresso.feature) | 9 | 9 | 0 |
| [`ranking.feature`](ranking.feature) | 10 | 9 | 1 |
| [`coerencia.feature`](coerencia.feature) | 3 | 3 | 0 |
| **Total** | **33** | **31** | **2** |

A automação está em
[`automacao/tests/parte-3-pontuacao-e-comparacao/`](../../automacao/tests/parte-3-pontuacao-e-comparacao/).

**Achados:** 5 bugs novos, do [008](../../bugs/008-duplo-clique-no-quiz-registra-resposta-duas-vezes.md)
ao [012](../../bugs/012-ranking-nao-exibe-email.md), e o [003](../../bugs/003-titulo-progresso-texto-residual.md)
confirmado. O mais importante é o 008, achado exatamente como esta parte previa: comparando
as três telas. O quiz fechou com 30 respostas e 8 acertos; o Meu Progresso mostrava 50 e 15.

**As sementes de ranking com 4 e 5 exercícios e com duas contas** viraram regras conferidas em
**todas** as linhas do ranking real, que tem mais de 150 alunos. É uma cobertura maior do que a
das sementes, e não precisa de massa preparada.

---

## Regras da `/docs` que esta parte precisa cobrir

**Quiz**
1. 30 perguntas de múltipla escolha
2. 3 opções por pergunta — apenas uma correta
3. Ganha XP por cada acerto
4. Pode reiniciar para tentar melhorar a pontuação

**Meu Progresso**
5. Mostra frases respondidas, corretas e erradas (vindas dos Exercícios)
6. Mostra palavras respondidas, corretas e erradas (vindas do Quiz)
7. Taxa de acerto calculada **separadamente** para cada tipo
8. Dados atualizados em tempo real

**Ranking**
9. Mínimo de 5 exercícios completados para aparecer no ranking
10. Combina acertos de Quiz + Exercícios no total
11. Ordenado por total de acertos, do maior para o menor
12. Exibe nome, e-mail e estatísticas de cada participante

---

## Antes de começar: você precisa de massa

**Massa** é o dado que precisa existir antes do teste. O ranking hoje está vazio — 0
competidores, líder "N/A" — porque ninguém tem os 5 exercícios exigidos pela regra 9.

Então a sua primeira tarefa não é testar: é **responder pelo menos 5 exercícios** para você
mesmo aparecer no ranking. Só depois dá para testar ordenação, soma e exibição.

Isso não é bug. É a regra dos 5 exercícios funcionando — e conferir que ela funciona já é um
dos seus cenários.

---

## Cenários-semente

### Quiz
- [x] Responder uma pergunta corretamente e ver o contador de acertos subir *(caminho feliz)*
- [x] Responder uma pergunta erradamente e ver o contador de erros subir
- [x] Conferir que cada pergunta tem exatamente 3 opções *(regra 2)*
- [x] Conferir que só uma opção é aceita como correta *(regra 2)*
- [x] Conferir se o XP sobe a cada acerto *(regra 3)*
- [x] Conferir se o XP **não** sobe quando erra
- [x] Percorrer o quiz até a pergunta 30 e ver o que acontece no fim *(regra 1)*
- [x] Reiniciar o quiz e conferir se os contadores voltam a zero *(regra 4)*
- [x] Depois de reiniciar, conferir se o histórico anterior some ou acumula

### Meu Progresso
- [x] Numa conta nova, conferir se todos os números começam em 0
- [x] Responder 5 perguntas do quiz — 3 certas e 2 erradas — e conferir os três números:
      respondidas = 5, corretas = 3, erradas = 2 *(regra 6)*
- [x] Conferir se a taxa de acerto bate com a conta: 3 ÷ 5 = 60% *(regra 7)*
- [x] Fazer o mesmo pelos Exercícios e conferir o bloco de frases *(regra 5)*
- [x] **Conferir que o quiz não contamina o bloco de frases, e vice-versa** *(regra 7)*
- [x] Responder mais uma pergunta e conferir se o número muda sem precisar recarregar a
      página *(regra 8)*
- [x] Conferir a taxa de acerto quando ainda não há nenhuma resposta — deve mostrar 0%, não erro

### Ranking
- [x] Com 4 exercícios respondidos, confirmar que **não** apareço no ranking *(regra 9)*
- [x] Responder o 5º e confirmar que passo a aparecer *(regra 9)*
- [x] Conferir se o total exibido é a soma de Quiz + Exercícios *(regra 10)*
- [x] Com duas contas de pontuações diferentes, conferir se quem tem mais acertos aparece
      acima *(regra 11)*
- [x] Conferir se o nome exibido é o nome certo da conta *(regra 12)*
- [x] Conferir se o e-mail exibido é o certo — **e levantar a pergunta se ele deveria mesmo
      estar visível para todos** *(regra 12)*
- [x] Conferir os cartões do topo: Total de Competidores, Líder Atual, Maior Precisão

---

## O que faz esta parte valer ouro

As três telas contam **a mesma verdade três vezes**. E é exatamente aí que mora o bug que
ninguém mais vai achar.

Se você acerta 7 perguntas no Quiz:
- o **Quiz** tem que mostrar 7 acertos
- o **Meu Progresso** tem que mostrar 7 palavras corretas
- o **Ranking** tem que somar esses 7 no seu total

Qualquer diferença entre as três é defeito. E quem testa só uma tela isolada **nunca vê**,
porque cada uma delas, sozinha, parece coerente consigo mesma.

Escreva pelo menos um cenário assim, que atravessa as três:

```gherkin
# Telas: /quiz, /progress, /ranking
# Regras da /docs: "Taxa de acerto calculada separadamente para cada tipo"
#                  "Combina acertos de Quiz + Exercícios no total"

Funcionalidade: Coerência entre Quiz, Progresso e Ranking

  Cenário: O mesmo número de acertos aparece nas três telas
    Dado que estou logado com uma conta premium
    E que respondi 5 perguntas do quiz, acertando 3
    Quando acesso a tela Meu Progresso
    Então devo ver 5 palavras respondidas e 3 corretas
    E a taxa de acerto em palavras deve ser 60%
    Quando acesso a tela de Ranking
    Então os 3 acertos devem estar somados no meu total
```

Antes de escrever, **anote num papel** quantas você acertou. Não confie na memória: o valor
anotado é o seu resultado esperado, e é contra ele que você compara as três telas.
