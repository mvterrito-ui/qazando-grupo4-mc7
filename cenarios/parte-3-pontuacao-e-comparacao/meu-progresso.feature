# Tela: /progress — Meu Progresso
# Regras da /docs cobertas neste arquivo:
#   5. "Mostra frases respondidas, corretas e erradas (vindas dos Exercícios)"
#   6. "Mostra palavras respondidas, corretas e erradas (vindas do Quiz)"
#   7. "Taxa de acerto calculada separadamente para cada tipo"
#   8. "Dados atualizados em tempo real"
#
# A tela tem dois blocos: "Estatísticas de Frases" (Exercícios) e
# "Estatísticas de Palavras" (Quiz), cada um com respondidas, corretas,
# incorretas e taxa de acerto.
#
# Comportamento observado em 25/11/2026, sem regra na /docs que o confirme ou
# negue: "Refazer Quiz" ZERA o bloco de palavras. O histórico anterior some.

# language: pt
Funcionalidade: Meu Progresso

  Contexto:
    Dado que estou logado com uma conta premium

  # ------------------------------------------------------------------
  # Estrutura
  # ------------------------------------------------------------------

  Cenário: A tela mostra os blocos de frases e de palavras separados
    Quando acesso a tela Meu Progresso
    Então devo ver o bloco de estatísticas de frases
    E devo ver o bloco de estatísticas de palavras
    E cada bloco deve exibir respondidas, corretas, incorretas e taxa de acerto

  # BUG 003 EM ABERTO — o título é "Seu Progresso aqui".
  Cenário: O título da tela não tem texto residual
    Quando acesso a tela Meu Progresso
    Então o título deve ser "Seu Progresso", sem a palavra "aqui" sobrando

  # ------------------------------------------------------------------
  # Regras 6 e 7 — o bloco de palavras confere com o quiz
  # ------------------------------------------------------------------

  Cenário: Sem respostas no quiz, a taxa de palavras é 0%, e não erro
    Dado que reiniciei o quiz
    Quando acesso a tela Meu Progresso
    Então as palavras respondidas, corretas e incorretas devem ser 0
    E a taxa de acerto em palavras deve ser 0%

  Cenário: As palavras respondidas, corretas e incorretas batem com o quiz
    Dado que reiniciei o quiz
    E que respondi 5 perguntas, anotando os acertos e os erros mostrados no quiz
    Quando acesso a tela Meu Progresso
    Então as palavras respondidas devem ser 5
    E as palavras corretas devem ser os acertos anotados
    E as palavras incorretas devem ser os erros anotados

  Cenário: A taxa de acerto em palavras é corretas divididas por respondidas
    Dado que respondi perguntas do quiz
    Quando acesso a tela Meu Progresso
    Então a taxa de acerto em palavras deve ser corretas ÷ respondidas, com até uma casa decimal

  Cenário: A taxa de acerto em frases é corretas divididas por respondidas
    Quando acesso a tela Meu Progresso
    Então a taxa de acerto em frases deve ser corretas ÷ respondidas, com até uma casa decimal

  # ------------------------------------------------------------------
  # Regra 7 — um tipo não contamina o outro
  # ------------------------------------------------------------------

  Cenário: Responder o quiz não altera o bloco de frases
    Dado que anotei os números do bloco de frases
    Quando respondo perguntas do quiz
    E acesso a tela Meu Progresso
    Então os números do bloco de frases devem continuar os mesmos

  # ------------------------------------------------------------------
  # Regra 8 — tempo real
  # ------------------------------------------------------------------

  Cenário: Os números mudam sem recarregar a página
    Dado que anotei as palavras respondidas
    Quando respondo uma pergunta do quiz
    E navego para Meu Progresso pelo menu, sem recarregar a página
    Então as palavras respondidas devem ter aumentado 1

  # ------------------------------------------------------------------
  # Comportamento observado
  # ------------------------------------------------------------------

  Cenário: Refazer o quiz zera o bloco de palavras
    Dado que respondi perguntas do quiz
    Quando concluo e refaço o quiz
    E acesso a tela Meu Progresso
    Então as palavras respondidas, corretas e incorretas devem ser 0
    E o bloco de frases deve continuar o mesmo
