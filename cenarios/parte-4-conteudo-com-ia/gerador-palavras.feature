# Tela: /words — Gerador de Palavras
# Regras da /docs cobertas neste arquivo:
#   13. "Usuário escolhe o tema e a quantidade de palavras (1 a 100)"
#   14. "A IA gera palavras com tradução e frase de exemplo"
#   15. "Áudio disponível para ouvir a pronúncia de cada palavra"
#
# REGRA DE OURO desta parte: não se asserta QUAIS palavras a IA escolheu.
# Asserta-se QUANTAS vieram, que cada uma tem tradução e exemplo, e o estado da tela.

# language: pt
Funcionalidade: Gerador de Palavras

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela do Gerador de Palavras

  # ------------------------------------------------------------------
  # Caminho feliz
  # ------------------------------------------------------------------

  Cenário: Gerar a quantidade exata de palavras pedida
    Quando informo o tema "testes de software"
    E informo a quantidade 10
    E solicito a geração
    Então devo receber exatamente 10 palavras

  Cenário: Cada palavra vem com tradução e frase de exemplo
    Quando informo o tema "automação de testes"
    E informo a quantidade 5
    E solicito a geração
    Então cada uma das 5 palavras deve exibir a sua tradução
    E cada uma das 5 palavras deve exibir uma frase de exemplo

  Cenário: O indicador de carregamento aparece durante a geração e some ao final
    Quando informo o tema "qualidade de software"
    E informo a quantidade 3
    E solicito a geração
    Então devo ver o indicador de carregamento enquanto a IA responde
    E o indicador de carregamento deve sumir quando as palavras aparecerem

  # ------------------------------------------------------------------
  # Limites da quantidade — regra 13, "1 a 100"
  # É onde mais rende bug. Testa-se abaixo do mínimo, no mínimo,
  # no máximo e acima do máximo.
  # ------------------------------------------------------------------

  Cenário: Aceitar a quantidade mínima válida
    Quando informo o tema "bug"
    E informo a quantidade 1
    E solicito a geração
    Então devo receber exatamente 1 palavra

  Cenário: Aceitar a quantidade máxima válida
    Quando informo o tema "vocabulário de QA"
    E informo a quantidade 100
    E solicito a geração
    Então devo receber exatamente 100 palavras

  # Os três cenários abaixo cobrem o bug 002, já reportado e ainda aberto.
  # Enquanto o bug existir eles falham — e é isso que se espera deles.
  Cenário: Recusar quantidade abaixo do mínimo
    Quando informo o tema "teste"
    E informo a quantidade 0
    Então a geração não deve ser permitida
    E devo ver um aviso sobre o limite de 1 a 100 palavras

  Cenário: Recusar quantidade acima do máximo
    Quando informo o tema "teste"
    E informo a quantidade 101
    Então a geração não deve ser permitida
    E devo ver um aviso sobre o limite de 1 a 100 palavras

  Cenário: Recusar quantidade negativa
    Quando informo o tema "teste"
    E informo a quantidade -5
    Então a geração não deve ser permitida
    E devo ver um aviso sobre o limite de 1 a 100 palavras

  # ------------------------------------------------------------------
  # Tema
  # ------------------------------------------------------------------

  Cenário: Recusar a geração com o tema vazio
    Quando deixo o campo de tema vazio
    E informo a quantidade 10
    Então a geração não deve ser permitida

  # ------------------------------------------------------------------
  # Áudio de pronúncia — regra 15
  # ------------------------------------------------------------------

  Cenário: Cada palavra oferece o áudio de pronúncia
    Quando informo o tema "ferramentas de teste"
    E informo a quantidade 5
    E solicito a geração
    Então cada uma das 5 palavras deve oferecer a opção de ouvir a pronúncia

  # Este fica no teste MANUAL: só um ouvido humano confirma que o áudio
  # tocado corresponde à palavra escrita. Máquina não julga isso.
  @manual
  Cenário: O áudio tocado corresponde à palavra exibida
    Quando gero uma lista de palavras
    E ouço a pronúncia da primeira palavra
    Então o áudio deve pronunciar exatamente a palavra exibida
