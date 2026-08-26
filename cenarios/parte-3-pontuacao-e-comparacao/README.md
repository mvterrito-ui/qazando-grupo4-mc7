# Parte 3 — Pontuação e Comparação

**Responsável:** _(a definir)_

**Telas:** `/quiz` · `/progress` (Meu Progresso) · `/ranking`

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
- [ ] Responder uma pergunta corretamente e ver o contador de acertos subir *(caminho feliz)*
- [ ] Responder uma pergunta erradamente e ver o contador de erros subir
- [ ] Conferir que cada pergunta tem exatamente 3 opções *(regra 2)*
- [ ] Conferir que só uma opção é aceita como correta *(regra 2)*
- [ ] Conferir se o XP sobe a cada acerto *(regra 3)*
- [ ] Conferir se o XP **não** sobe quando erra
- [ ] Percorrer o quiz até a pergunta 30 e ver o que acontece no fim *(regra 1)*
- [ ] Reiniciar o quiz e conferir se os contadores voltam a zero *(regra 4)*
- [ ] Depois de reiniciar, conferir se o histórico anterior some ou acumula

### Meu Progresso
- [ ] Numa conta nova, conferir se todos os números começam em 0
- [ ] Responder 5 perguntas do quiz — 3 certas e 2 erradas — e conferir os três números:
      respondidas = 5, corretas = 3, erradas = 2 *(regra 6)*
- [ ] Conferir se a taxa de acerto bate com a conta: 3 ÷ 5 = 60% *(regra 7)*
- [ ] Fazer o mesmo pelos Exercícios e conferir o bloco de frases *(regra 5)*
- [ ] **Conferir que o quiz não contamina o bloco de frases, e vice-versa** *(regra 7)*
- [ ] Responder mais uma pergunta e conferir se o número muda sem precisar recarregar a
      página *(regra 8)*
- [ ] Conferir a taxa de acerto quando ainda não há nenhuma resposta — deve mostrar 0%, não erro

### Ranking
- [ ] Com 4 exercícios respondidos, confirmar que **não** apareço no ranking *(regra 9)*
- [ ] Responder o 5º e confirmar que passo a aparecer *(regra 9)*
- [ ] Conferir se o total exibido é a soma de Quiz + Exercícios *(regra 10)*
- [ ] Com duas contas de pontuações diferentes, conferir se quem tem mais acertos aparece
      acima *(regra 11)*
- [ ] Conferir se o nome exibido é o nome certo da conta *(regra 12)*
- [ ] Conferir se o e-mail exibido é o certo — **e levantar a pergunta se ele deveria mesmo
      estar visível para todos** *(regra 12)*
- [ ] Conferir os cartões do topo: Total de Competidores, Líder Atual, Maior Precisão

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
