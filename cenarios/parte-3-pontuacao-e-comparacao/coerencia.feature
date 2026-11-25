# Telas: /quiz, /progress e /ranking — a mesma verdade contada três vezes
# Regras da /docs cobertas neste arquivo:
#   6.  "Mostra palavras respondidas, corretas e erradas (vindas do Quiz)"
#   10. "Combina acertos de Quiz + Exercícios no total"
#
# ESTE É O ARQUIVO MAIS IMPORTANTE DA PARTE 3. Cada tela, sozinha, parece
# coerente consigo mesma. O defeito só aparece para quem compara as três.
#
# O quiz é o oráculo: os acertos e erros que ELE mostra são o resultado
# esperado nas outras duas telas.
#
# BUG 008 foi achado exatamente assim, em 25/11/2026: o quiz fechou com 30
# respostas e 8 acertos; o Meu Progresso mostrava 50 e 15; o Ranking, 51 e 16.

# language: pt
Funcionalidade: Coerência entre Quiz, Meu Progresso e Ranking

  Contexto:
    Dado que estou logado com uma conta premium

  Cenário: O Meu Progresso mostra os mesmos acertos e erros do quiz
    Dado que reiniciei o quiz
    E que respondi 5 perguntas, anotando os acertos e os erros mostrados no quiz
    Quando acesso a tela Meu Progresso
    Então as palavras corretas devem ser os acertos anotados
    E as palavras incorretas devem ser os erros anotados

  Cenário: O Ranking soma frases e palavras do Meu Progresso
    Dado que anotei as frases e as palavras respondidas e corretas no Meu Progresso
    Quando acesso a tela de Ranking
    Então devo encontrar a minha linha com exercícios = frases respondidas + palavras respondidas
    E com corretas = frases corretas + palavras corretas

  # BUG 008 EM ABERTO.
  Cenário: Um duplo clique no quiz não faz as três telas divergirem
    Dado que reiniciei o quiz
    Quando dou um duplo clique numa opção da primeira pergunta
    Então o quiz deve mostrar 1 resposta
    E o Meu Progresso deve mostrar 1 palavra respondida
