# Parte 2 — Prática Estruturada

**Responsável:** João Paulo  
*(definido por sorteio — ver [docs/06-sorteio-das-partes.md](../../docs/06-sorteio-das-partes.md))*

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

## ✅ Os cenários já estão escritos em Gherkin

As 27 sementes abaixo foram estruturadas em **34 cenários** em três arquivos `.feature`:

| Arquivo | Cenários | Automatizáveis | Manuais |
|---|---|---|---|
| [`trilha.feature`](trilha.feature) | 13 | 12 | 1 |
| [`exercicios.feature`](exercicios.feature) | 12 | 11 | 1 |
| [`flashcards.feature`](flashcards.feature) | 9 | 8 | 1 |
| **Total** | **34** | **31** | **3** |

Os cenários com `@manual` cobrem avaliações estritamente humanas (clareza pedagógica, naturalidade gramatical e adequação da tradução técnica).

---

## 📋 Acompanhamento da Execução Manual

Use esta tabela para acompanhar os seus testes. Conforme for testando, podemos atualizar o status:
- ⏳ **A testar** | ✅ **Passou** | ❌ **Falhou** (apontando o Bug) | ⚠️ **Dúvida / Atenção**

### Trilha do Inglês (`/duolingo`)
| ID | Cenário | Tipo | Status | Observações / Evidência |
|---|---|---|---|---|
| **T01** | Visualizar 4 unidades progressivas na trilha | Visual | ✅ Passou | 4 unidades exibidas progressivamente na tela |
| **T02** | Conta nova inicia com apenas Lição 1 liberada (0 XP / 0 comp.) | Estado Inicial | ✅ Passou | Conta nova iniciou com Lição 1 liberada, 0 XP e 0 completadas |
| **T03** | Unidades 2, 3 e 4 iniciam bloqueadas | Bloqueio | ✅ Passou | Unidades 2, 3 e 4 exibidas como bloqueadas |
| **T04** | Impedir acesso a lição bloqueada | Regra | ✅ Passou | Clicar em lição bloqueada não inicia a atividade |
| **T05** | Concluir Lição 1 desbloqueia Lição 2 sequencialmente | Fluxo | ✅ Passou | Lição anterior marcada como concluída e a seguinte desbloqueada |
| **T06** | Concluir lição credita o XP prometido (+25 XP) | Pontuação | ❌ Falhou | Promete +25 XP na interface, mas credita 30 XP — ver [Bug 006](../../bugs/006-trilha-promete-25-xp-mas-credita-30.md) |
| **T07** | Incremento do contador de lições completadas (0 para 1) | Contador | ✅ Passou | Contador incrementa a cada lição concluída |
| **T08** | Desbloqueio da Lição 2 persiste após mudar de tela e voltar | Persistência | ✅ Passou | Navegar para outra rota e retornar preserva as lições desbloqueadas |
| **T09** | Saldo de XP persiste após logout e novo login | Persistência | ✅ Passou | Saldo de XP e progresso preservados após nova autenticação |
| **T10** | Contador e lições persistem após recarregar a página (F5) | Persistência | ✅ Passou | Recarregar a página mantém contadores e estado das lições |
| **T11** | Vocabulário da lição no contexto de testes de software | `@manual` | ⚠️ Observação | Unidade 1 ensina vocabulário de inglês geral/cotidiano, e não termos estritos de QA |
| **T12** | Errar todas as questões não deve concluir a lição | Regra/Fluxo | ❌ Falhou | Exibe 'Lição completa: você ganhou 0 XP' e desbloqueia a fase seguinte — ver [Bug 007](../../bugs/007-trilha-conclui-licao-com-100-porcento-de-erros.md) |

### Exercícios (`/exercises`)
| ID | Cenário | Tipo | Status | Observações / Evidência |
|---|---|---|---|---|
| **E01** | Visualizar tela inicial na questão "1 de 30" com progresso 0% | Estado Inicial | ✅ Passou | Tela inicia na questão 1 de 30 com progresso 0% e lacuna |
| **E02** | Resposta correta avança questão e percentual de progresso | Fluxo | ✅ Passou | Resposta correta avança para a questão seguinte e incrementa progresso |
| **E03** | Resposta incorreta exibe aviso e registra tentativa | Validação | ✅ Passou | Exibe aviso de erro e avança para a próxima questão registrando a tentativa |
| **E04** | Impedir envio com o campo de resposta em branco | Validação | ✅ Passou | Sistema impede avanço e exige o preenchimento do campo |
| **E05** | Tolerar espaços extras antes ou depois da palavra | Formatação | ✅ Passou | Aplica trim e aceita a resposta com espaços adicionais |
| **E06** | Aceitar resposta correta digitada em letras maiúsculas | Formatação | ✅ Passou | Validação case-insensitive aceita respostas em maiúsculas |
| **E07** | Retomar de onde parou após sair da tela e voltar (regra 6) | Persistência | ✅ Passou | Mudar de tela e retornar mantém a posição exata da questão e o progresso |
| **E08** | Retomar de onde parou após logout e novo login | Persistência | ✅ Passou | Logout e novo login preservam o progresso e a questão subsequente |
| **E09** | Histórico exibe respostas corretas e erradas registradas | Histórico | ✅ Passou | Histórico lista todas as tentativas identificando certas e erradas |
| **E10** | Recomeçar exercícios reseta contador para 1 de 30 | Fluxo | ⚠️ Falha de UX | Reseta instantaneamente sem modal de confirmação, causando perda acidental do progresso |
| **E11** | Comportamento do histórico após recomeçar os exercícios | Histórico | ⚠️ Atenção | O histórico de respostas é totalmente apagado junto com o progresso sem confirmação |
| **E12** | Conclusão da 30ª questão exibe término e atinge 100% | Conclusão | ✅ Passou | Ao responder a questão 30, atinge 100% e exibe mensagem de conclusão |
| **E13** | Correção gramatical e naturalidade das frases em inglês | `@manual` | ✅ Passou | Frases em inglês e lacunas gramaticalmente corretas e bem contextualizadas |

### Flashcards QA (`/flashcards`)
| ID | Cenário | Tipo | Status | Observações / Evidência |
|---|---|---|---|---|
| **F01** | Visualizar 40 cards na fila e 0 revisados/dominados | Estado Inicial | ✅ Passou | Exibe 40 cards na fila, 0 revisados hoje e 0 dominados |
| **F02** | Revelar tradução (verso) habilita botões Difícil/Médio/Fácil | Interface | ✅ Passou | Revelar o verso exibe a tradução e os botões de avaliação |
| **F03** | Avaliar card diminui "Na fila" e aumenta "Revisados hoje" | Estatística | ✅ Passou | Avaliação deduz da fila e incrementa o contador de revisados no dia |
| **F04** | Card classificado como dominado após critério do algoritmo | Estatística | ⚠️ Observação | Marcar 'Fácil' 1 vez não classifica como Dominado de imediato (exige repetições pelo SM-2) |
| **F05** | Card avaliado como Difícil volta antes do Fácil (SM-2) | Algoritmo | ⏳ A testar | Requer nova rodada de revisões para cronometrar retorno |
| **F06** | Contagem de "Revisados hoje" persiste após mudar de rota | Persistência | ✅ Passou | 'Revisados hoje' é mantido após navegação entre telas |
| **F07** | Estatísticas persistem após logout e login no mesmo dia | Persistência | ✅ Passou | Dados de revisão permanecem salvos após nova sessão |
| **F08** | Recarregar página (F5) não reseta fila nem contadores | Persistência | ⚠️ Observação | 'Revisados hoje' persiste; fila extra recarregada é volátil em memória e zera no F5 |
| **F09** | Fidelidade da tradução dos termos técnicos de QA | `@manual` | ✅ Passou | Termos e definições fiéis aos conceitos práticos de testes de software |

---

## Estado inicial de uma conta nova

Anote, porque é a base de comparação de tudo:

- Trilha: **0 XP**, **0 completadas**, sequência **0**
- Só a **Lição 1 da Unidade 1** liberada; todo o resto marcado como "Bloqueado"
- Exercícios: questão **1 de 30**, progresso **0%**
- Flashcards: **40 na fila**, **0 revisados hoje**, **0 dominados**

---

## Cenários-semente

### Trilha do Inglês
- [x] Conferir que só a Lição 1 da Unidade 1 está liberada numa conta nova *(regra 2)*
- [x] Tentar abrir a Lição 2 antes de concluir a Lição 1 *(regra 2 — deve continuar bloqueada)*
- [x] Concluir a Lição 1 e conferir se a Lição 2 libera *(regra 2)*
- [x] Concluir a Lição 1 e conferir se o XP subiu *(regra 3)*
- [x] Conferir se o XP que a lição prometia ("+25 XP") é o XP que foi creditado
- [x] Conferir se o contador "Completadas" subiu de 0 para 1
- [x] Conferir que as Unidades 2, 3 e 4 continuam bloqueadas
- [x] **Sair da plataforma, entrar de novo e conferir se o progresso continua lá** *(regra 4)*

### Exercícios
- [x] Responder uma questão certa e ver o contador avançar *(caminho feliz)*
- [x] Responder uma questão errada e ver como a tela reage
- [x] Enviar a resposta com o campo vazio
- [x] Responder com espaços a mais antes ou depois da palavra
- [x] Responder com a palavra certa em maiúsculas
- [x] **Responder 3 questões, sair da tela, voltar e conferir se retomou na questão 4** *(regra 6)*
- [x] Recomeçar os exercícios e conferir se o contador volta para 1 de 30 *(regra 7)*
- [x] Depois de recomeçar, conferir o que aconteceu com o histórico anterior
- [x] Conferir se o histórico mostra a resposta errada que você acabou de dar *(regra 8)*
- [x] Chegar na questão 30 e ver o que acontece ao terminar *(regra 5)*

### Flashcards
- [x] Conferir os 40 cards iniciais numa conta nova *(regra 9)*
- [x] Mostrar a tradução de um card e conferir se corresponde à palavra
- [x] Avaliar um card como Fácil e observar quando ele volta *(regra 11)*
- [x] Avaliar um card como Difícil e observar quando ele volta *(regra 11)*
- [x] Comparar: o card marcado como Difícil deve voltar antes do marcado como Fácil
- [x] Conferir se "Na fila" diminui a cada card avaliado *(regra 12)*
- [x] Conferir se "Revisados hoje" aumenta a cada card avaliado *(regra 12)*
- [x] Descobrir o que faz um card ser contado como "Dominado" *(regra 12)*
- [x] **Sair, voltar no mesmo dia e conferir se "Revisados hoje" manteve a contagem**

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
