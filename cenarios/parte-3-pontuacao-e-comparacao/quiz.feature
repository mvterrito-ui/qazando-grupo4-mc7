# Tela: /quiz — Quiz de Inglês
# Regras da /docs cobertas neste arquivo:
#   1. "30 perguntas de múltipla escolha"
#   2. "3 opções por pergunta — apenas uma correta"
#   3. "Ganha XP por cada acerto"
#   4. "Pode reiniciar para tentar melhorar a pontuação"
#
# O que a tela faz, conferido em 25/11/2026: ao clicar numa opção, o quiz
# avança sozinho para a próxima pergunta e atualiza os contadores de acertos e
# erros. Não mostra qual era a opção correta. Depois da 30ª resposta, exibe o
# "Resultado Final" com o botão "Refazer Quiz".

# language: pt
Funcionalidade: Quiz de Inglês

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela do Quiz

  # ------------------------------------------------------------------
  # Regras 1 e 2 — estrutura do quiz
  # ------------------------------------------------------------------

  Cenário: O quiz começa na primeira de 30 perguntas
    Dado que o quiz acabou de ser reiniciado
    Então devo ver a pergunta 1 de 30
    E os contadores de acertos e erros devem estar em 0

  Cenário: Cada pergunta oferece exatamente 3 opções
    Quando percorro as perguntas do quiz
    Então cada pergunta deve exibir exatamente 3 opções de resposta

  @manual
  Cenário: Apenas uma das 3 opções é aceita como correta
    Dado que anotei as 3 opções de uma pergunta
    Quando respondo a mesma pergunta com cada opção, reiniciando o quiz entre as tentativas
    Então apenas uma das 3 opções deve contar como acerto

  # ------------------------------------------------------------------
  # Contadores
  # ------------------------------------------------------------------

  Cenário: Responder avança para a próxima pergunta
    Dado que estou na pergunta 1 de 30
    Quando respondo a pergunta
    Então devo ver a pergunta 2 de 30

  Cenário: Uma resposta certa soma 1 acerto e uma errada soma 1 erro
    Quando respondo uma pergunta
    Então a soma de acertos e erros deve aumentar exatamente 1

  # BUG 008 EM ABERTO — verificado em 25/11/2026: com duplo clique, a tela
  # soma 2 respostas para a mesma pergunta, e o Meu Progresso também.
  Cenário: Um duplo clique numa opção registra uma resposta só
    Dado que estou na pergunta 1 de 30
    Quando dou um duplo clique numa opção
    Então devo ver a pergunta 2 de 30
    E a soma de acertos e erros deve ser 1

  # ------------------------------------------------------------------
  # Regra 3 — XP
  # ------------------------------------------------------------------

  # BUG 009 EM ABERTO — verificado em 25/11/2026: o XP Total da Trilha fica
  # em 0 mesmo depois de 15 acertos no quiz.
  Cenário: Acertar uma pergunta credita XP
    Dado que anotei o meu XP Total
    Quando acerto uma pergunta do quiz
    Então o meu XP Total deve aumentar

  Cenário: Errar uma pergunta não credita XP
    Dado que anotei o meu XP Total
    Quando erro uma pergunta do quiz
    Então o meu XP Total não deve mudar

  # ------------------------------------------------------------------
  # Persistência
  # ------------------------------------------------------------------

  Cenário: O quiz continua de onde parei depois de sair da tela
    Dado que respondi algumas perguntas do quiz
    Quando saio para outra tela e volto ao Quiz
    Então devo ver a mesma pergunta em que parei
    E os mesmos números de acertos e erros

  # ------------------------------------------------------------------
  # Regras 1 e 4 — fim e reinício
  # ------------------------------------------------------------------

  Cenário: Depois da 30ª resposta aparece o resultado final
    Quando respondo as 30 perguntas
    Então devo ver o resultado final com 30 questões
    E os acertos e erros do resultado devem somar 30
    E a porcentagem deve ser os acertos divididos por 30, arredondada

  Cenário: Refazer o quiz volta à primeira pergunta com os contadores zerados
    Dado que concluí o quiz
    Quando escolho refazer o quiz
    Então devo ver a pergunta 1 de 30
    E os contadores de acertos e erros devem estar em 0
