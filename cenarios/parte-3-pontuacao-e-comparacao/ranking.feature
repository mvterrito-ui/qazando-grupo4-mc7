# Tela: /ranking — Ranking Alunos Qazando
# Regras da /docs cobertas neste arquivo:
#   9.  "Mínimo de 5 exercícios completados para aparecer no ranking"
#   10. "Combina acertos de Quiz + Exercícios no total"
#   11. "Ordenado por total de acertos, do maior para o menor"
#   12. "Exibe nome, e-mail e estatísticas de cada participante"
#
# O que a tela mostra, conferido em 25/11/2026: três cartões (Total de
# Competidores, Líder Atual, Maior Precisão) e uma tabela com Posição, Nome,
# Exercícios, Corretas e Taxa de Acerto. O ranking é de TODOS os alunos da
# plataforma, não só do grupo — por isso estes cenários conferem regras que
# valem para qualquer linha, e não valores fixos.
#
# A coluna "Exercícios" soma frases dos Exercícios e palavras do Quiz (regra
# 10 funcionando), apesar do nome.

# language: pt
Funcionalidade: Ranking

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela de Ranking

  # ------------------------------------------------------------------
  # Regra 9 — mínimo de 5 exercícios
  # ------------------------------------------------------------------

  # BUG 010 EM ABERTO — verificado em 25/11/2026: dezenas de linhas com 0 a 4.
  Cenário: Só aparece no ranking quem completou pelo menos 5 exercícios
    Então todas as linhas da tabela devem ter 5 ou mais exercícios

  # ------------------------------------------------------------------
  # Regra 11 — ordenação
  # ------------------------------------------------------------------

  # BUG 011 EM ABERTO — a tela ordena por taxa de acerto, e o próprio subtítulo
  # diz "pela maior taxa de acerto".
  Cenário: O ranking é ordenado por total de acertos, do maior para o menor
    Então cada linha deve ter um total de acertos maior ou igual ao da linha de baixo

  Cenário: As posições são numeradas em sequência, a partir de 1
    Então as posições devem ir de 1 até o número de linhas, sem pular nenhuma

  # ------------------------------------------------------------------
  # Regra 12 — o que cada linha exibe
  # ------------------------------------------------------------------

  # BUG 012 EM ABERTO — não há coluna de e-mail.
  Cenário: Cada participante é exibido com nome e e-mail
    Então a tabela deve ter uma coluna de nome
    E a tabela deve ter uma coluna de e-mail

  Cenário: A taxa de acerto de cada linha é corretas divididas por exercícios
    Então em cada linha com exercícios, a taxa deve ser corretas ÷ exercícios, com uma casa decimal

  Cenário: Nenhuma linha tem mais corretas do que exercícios
    Então em cada linha, as corretas devem ser menores ou iguais aos exercícios

  # ------------------------------------------------------------------
  # Os cartões do topo contam a mesma verdade que a tabela
  # ------------------------------------------------------------------

  Cenário: O total de competidores é o número de linhas da tabela
    Então o cartão "Total de Competidores" deve ser igual ao número de linhas

  Cenário: O líder atual é quem está na primeira posição
    Então o cartão "Líder Atual" deve exibir o nome da linha de posição 1

  Cenário: A maior precisão é a maior taxa de acerto da tabela
    Então o cartão "Maior Precisão" deve ser igual à maior taxa de acerto da tabela

  # ------------------------------------------------------------------
  # Manual
  # ------------------------------------------------------------------

  @manual
  Cenário: Exibir o e-mail de todos os participantes é uma decisão consciente de privacidade
    Dado que a /docs promete exibir o e-mail de cada participante
    Então o grupo deve registrar se expor o e-mail de todos os alunos é desejável
