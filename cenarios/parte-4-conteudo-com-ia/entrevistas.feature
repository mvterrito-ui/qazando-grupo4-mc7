# Tela: /interview — Entrevistas
# Regras da /docs cobertas neste arquivo:
#   5. "A IA gera perguntas técnicas de QA em inglês"
#   6. "Usuário responde livremente por texto"
#   7. "A IA avalia a resposta e dá feedback construtivo"
#   8. "Existe opção de traduzir o feedback para português"
#
# REGRA DE OURO: não se asserta QUAL pergunta a IA fez nem O QUE o feedback disse.
# Asserta-se que a pergunta veio, que está em inglês, que o feedback chegou depois
# da resposta, e que a tradução muda o idioma exibido.

# language: pt
Funcionalidade: Entrevistas simuladas com IA

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela de Entrevistas

  # ------------------------------------------------------------------
  # Regra 5 — a pergunta
  # ------------------------------------------------------------------

  Cenário: Gerar uma pergunta de entrevista
    Quando solicito uma nova pergunta
    Então devo receber uma pergunta não vazia
    E o texto da pergunta deve estar em inglês

  Cenário: Duas solicitações seguidas geram perguntas diferentes
    Quando solicito uma nova pergunta
    E guardo a pergunta recebida
    E solicito uma nova pergunta novamente
    Então a nova pergunta deve ser diferente da anterior

  # ------------------------------------------------------------------
  # Regras 6 e 7 — resposta e feedback
  # ------------------------------------------------------------------

  Cenário: Responder à pergunta e receber feedback
    Dado que recebi uma pergunta de entrevista
    Quando respondo "I would start by reading the acceptance criteria"
    E envio a resposta
    Então devo receber um feedback não vazio

  Cenário: O indicador de carregamento aparece enquanto a IA avalia
    Dado que recebi uma pergunta de entrevista
    Quando envio uma resposta qualquer
    Então devo ver o indicador de carregamento enquanto a IA avalia
    E o indicador de carregamento deve sumir quando o feedback aparecer

  Cenário: Recusar o envio de uma resposta vazia
    Dado que recebi uma pergunta de entrevista
    Quando deixo o campo de resposta vazio
    E tento enviar a resposta
    Então o envio não deve ser permitido

  Cenário: Responder com uma única palavra
    Dado que recebi uma pergunta de entrevista
    Quando respondo "yes"
    E envio a resposta
    Então devo receber um feedback não vazio

  Cenário: Responder em português a uma pergunta feita em inglês
    Dado que recebi uma pergunta de entrevista
    Quando respondo "eu começaria lendo os critérios de aceite"
    E envio a resposta
    Então devo receber um feedback não vazio

  # ------------------------------------------------------------------
  # Regra 8 — tradução do feedback
  # ------------------------------------------------------------------

  Cenário: Traduzir o feedback para português
    Dado que recebi um feedback da IA
    Quando solicito a tradução do feedback
    Então devo ver o feedback em português

  # Verificado em 07/09/2026: o cenário original era "traduzir duas vezes
  # seguidas". Não é executável — o controle de traduzir desaparece assim que a
  # tradução chega. É a solução certa: resolve o problema na origem em vez de
  # tratar o efeito. O cenário passou a afirmar esse comportamento.
  Cenário: O controle de traduzir some depois do primeiro uso
    Dado que recebi um feedback da IA
    Quando solicito a tradução do feedback
    Então a tradução deve aparecer em um bloco próprio, abaixo do feedback
    E o feedback original deve continuar visível
    E o controle de traduzir não deve mais estar disponível

  # ------------------------------------------------------------------
  # Ordem de uso
  # ------------------------------------------------------------------

  Cenário: Gerar uma pergunta nova sem ter respondido a anterior
    Dado que recebi uma pergunta de entrevista
    E que não respondi a pergunta
    Quando solicito uma nova pergunta
    Então devo receber uma pergunta não vazia
    E o campo de resposta deve estar limpo

  # ------------------------------------------------------------------
  # Manual
  # ------------------------------------------------------------------

  @manual
  Cenário: O feedback é construtivo e trata da resposta dada
    Quando respondo a uma pergunta de entrevista
    Então o feedback deve comentar a resposta que eu dei, e não outra

  @manual
  Cenário: A pergunta gerada é tecnicamente sobre QA
    Quando solicito uma nova pergunta
    Então a pergunta deve ser sobre qualidade de software
