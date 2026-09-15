# Tela: /flashcards — Flashcards QA
# Regras da /docs cobertas neste arquivo:
#   9. "40 cards iniciais de vocabulário de QA"
#   10. "Usuário avalia cada card como Difícil, Médio ou Fácil"
#   11. "Algoritmo SM-2 simplificado define quando o card volta"
#   12. "Estatísticas: fila do dia, revisados hoje, dominados"
#
# REGRA DE OURO desta parte: além do comportamento visual imediato,
# o teste chave é a persistência das estatísticas e o agendamento da repetição espaçada.

# language: pt
Funcionalidade: Flashcards QA — Vocabulário, Avaliação, Algoritmo SM-2 e Estatísticas

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela de Flashcards QA

  # ------------------------------------------------------------------
  # Estado inicial em conta nova — regras 9 e 12
  # ------------------------------------------------------------------

  Cenário: Visualizar os 40 cards iniciais na fila do dia
    Dado que é o primeiro acesso aos flashcards nesta conta
    Então o contador "Na fila" ou "Fila do dia" deve exibir exatamente 40 cards
    E o contador "Revisados hoje" deve exibir 0
    E o contador "Dominados" deve exibir 0

  # ------------------------------------------------------------------
  # Interação com o Card (Frente e Verso) — regra 10
  # ------------------------------------------------------------------

  Cenário: Revelar a tradução de um flashcard
    Dado que visualizo a frente de um cartão com o termo técnico em inglês
    Quando solicito a exibição da tradução ou verso do cartão
    Então o significado em português deve ficar visível
    E os botões de avaliação "Difícil", "Médio" e "Fácil" devem estar habilitados

  # ------------------------------------------------------------------
  # Avaliação e Atualização de Estatísticas — regras 10 e 12
  # ------------------------------------------------------------------

  Cenário: Avaliar um card reduz a fila do dia e incrementa revisados hoje
    Dado que tenho 40 cards na fila e 0 revisados hoje
    Quando revelo o verso do cartão
    E avalio o cartão como "Médio"
    Então a contagem "Na fila" deve diminuir para 39
    E a contagem "Revisados hoje" deve aumentar para 1

  Cenário: Card classificado como dominado após avaliações consistentes
    Dado que realizo revisões sucessivas com avaliação "Fácil" para o mesmo cartão
    Quando o critério de domínio do algoritmo for atingido
    Então a contagem de cartões "Dominados" deve ser incrementada

  # ------------------------------------------------------------------
  # Repetição espaçada (Algoritmo SM-2 simplificado) — regra 11
  # ------------------------------------------------------------------

  Cenário: Card avaliado como Difícil retorna antes de card avaliado como Fácil
    Dado que avaliei um cartão "A" como "Difícil" e um cartão "B" como "Fácil"
    Quando continuo a rodada de revisões na fila
    Então o cartão "A" deve reaparecer para repetição antes do cartão "B"

  # ------------------------------------------------------------------
  # Persistência e Memória do Sistema — "Sair e Voltar" — regra 12
  # ------------------------------------------------------------------

  Cenário: A contagem de revisados hoje persiste após navegar para outra rota
    Dado que revisei 5 cartões hoje
    Quando navego para a tela de Documentação
    E retorno para a tela de Flashcards QA
    Então o indicador "Revisados hoje" deve continuar exibindo 5
    E a fila diária deve refletir as deduções já realizadas

  Cenário: O progresso dos flashcards persiste após logout e novo login no mesmo dia
    Dado que avaliei cartões e alterei o estado inicial da fila
    Quando realizo logout e entro novamente com a mesma conta no mesmo dia
    E acesso a tela de Flashcards QA
    Então os valores de "Revisados hoje" e "Dominados" devem permanecer inalterados

  Cenário: Recarregar a página não reseta o estado da fila
    Dado que estou no meio de uma sessão de revisão com contadores atualizados
    Quando recarrego a página do navegador
    Então os números exibidos nas estatísticas devem ser preservados exatamente como estavam

  # ------------------------------------------------------------------
  # Avaliação de conteúdo — Teste manual
  # ------------------------------------------------------------------

  @manual
  Cenário: Fidelidade da tradução e contextualização para área de QA
    Quando vejo o termo em inglês e viro o cartão para ver o verso
    Então a definição e tradução devem ser fiéis aos conceitos de teste de software
