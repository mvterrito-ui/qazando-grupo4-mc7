# Parte 2 — Prática Estruturada

**Responsável:** _(a definir)_

**Telas:** `/duolingo` (Trilha do Inglês) · `/exercises` (Exercícios) · `/flashcards` (Flashcards QA)

---

## Regras da `/docs` que esta parte precisa cobrir

**Trilha do Inglês**
1. 4 unidades progressivas, com lições dentro de cada uma
2. Lições desbloqueiam sequencialmente — complete a anterior para avançar
3. Cada lição concluída dá XP
4. Progresso é salvo automaticamente no banco de dados

**Exercícios**
5. 30 questões de preenchimento de frase
6. Progresso é salvo — pode sair e voltar
7. Pode recomeçar a qualquer momento
8. Histórico completo de respostas fica visível

**Flashcards QA**
9. 40 cards iniciais de vocabulário de QA
10. Usuário avalia cada card como Difícil, Médio ou Fácil
11. Algoritmo SM-2 simplificado define quando o card volta
12. Estatísticas: fila do dia, revisados hoje, dominados

---

## Estado inicial de uma conta nova

Anote, porque é a base de comparação de tudo:

- Trilha: **0 XP**, **0 completadas**, sequência **0**
- Só a **Lição 1 da Unidade 1** liberada; todo o resto marcado como "Bloqueado"
- Exercícios: questão **1 de 30**, progresso **0%**
- Flashcards: **40 na fila**, **0 revisados hoje**, **0 dominados**

---

## Cenários-semente

Marque `[x]` conforme for escrevendo o `.feature`. **Aumente a lista** conforme explorar.

### Trilha do Inglês
- [ ] Conferir que só a Lição 1 da Unidade 1 está liberada numa conta nova *(regra 2)*
- [ ] Tentar abrir a Lição 2 antes de concluir a Lição 1 *(regra 2 — deve continuar bloqueada)*
- [ ] Concluir a Lição 1 e conferir se a Lição 2 libera *(regra 2)*
- [ ] Concluir a Lição 1 e conferir se o XP subiu *(regra 3)*
- [ ] Conferir se o XP que a lição prometia ("+25 XP") é o XP que foi creditado
- [ ] Conferir se o contador "Completadas" subiu de 0 para 1
- [ ] Conferir que as Unidades 2, 3 e 4 continuam bloqueadas
- [ ] **Sair da plataforma, entrar de novo e conferir se o progresso continua lá** *(regra 4)*

### Exercícios
- [ ] Responder uma questão certa e ver o contador avançar *(caminho feliz)*
- [ ] Responder uma questão errada e ver como a tela reage
- [ ] Enviar a resposta com o campo vazio
- [ ] Responder com espaços a mais antes ou depois da palavra
- [ ] Responder com a palavra certa em maiúsculas
- [ ] **Responder 3 questões, sair da tela, voltar e conferir se retomou na questão 4** *(regra 6)*
- [ ] Recomeçar os exercícios e conferir se o contador volta para 1 de 30 *(regra 7)*
- [ ] Depois de recomeçar, conferir o que aconteceu com o histórico anterior
- [ ] Conferir se o histórico mostra a resposta errada que você acabou de dar *(regra 8)*
- [ ] Chegar na questão 30 e ver o que acontece ao terminar *(regra 5)*

### Flashcards
- [ ] Conferir os 40 cards iniciais numa conta nova *(regra 9)*
- [ ] Mostrar a tradução de um card e conferir se corresponde à palavra
- [ ] Avaliar um card como Fácil e observar quando ele volta *(regra 11)*
- [ ] Avaliar um card como Difícil e observar quando ele volta *(regra 11)*
- [ ] Comparar: o card marcado como Difícil deve voltar antes do marcado como Fácil
- [ ] Conferir se "Na fila" diminui a cada card avaliado *(regra 12)*
- [ ] Conferir se "Revisados hoje" aumenta a cada card avaliado *(regra 12)*
- [ ] Descobrir o que faz um card ser contado como "Dominado" *(regra 12)*
- [ ] **Sair, voltar no mesmo dia e conferir se "Revisados hoje" manteve a contagem**

---

## O jeito de testar desta parte

Repare que muitos cenários acima têm a palavra **sair e voltar**. Isso não é enfeite: é o
coração da sua parte.

A pergunta que essas três telas fazem ao sistema é sempre a mesma: **"você lembra do que eu
fiz?"**. Um teste que só olha a tela no momento da ação não responde essa pergunta.

Como escrever esse tipo de cenário em Gherkin:

```gherkin
# Tela: /exercises
# Regra da /docs: "Progresso é salvo — pode sair e voltar"

Funcionalidade: Exercícios — persistência do progresso

  Cenário: Retomar os exercícios de onde parei
    Dado que estou logado com uma conta premium
    E que respondi 3 questões dos exercícios
    Quando saio da tela de exercícios
    E acesso a tela de exercícios novamente
    Então devo estar na questão 4 de 30
    E o progresso exibido não deve ter voltado a zero
```

O `Dado` carrega a situação já construída ("respondi 3 questões"). O `Quando` é a saída e o
retorno. O `Então` verifica a memória do sistema. **Esse é o formato que você vai repetir
muitas vezes nesta parte.**
