# Tela: /chatbot — Falar com Max
# Regras da /docs cobertas neste arquivo:
#    9. "Chat livre com IA — conversa sobre qualquer assunto"
#   10. "Suporta entrada por voz (microfone)"
#   11. "Mensagens podem ser traduzidas sob demanda"
#   12. "Avatar animado opcional durante a conversa"
#
# REGRA DE OURO: não se asserta O QUE o Max respondeu. Asserta-se que a mensagem
# entrou na conversa, que a resposta chegou, e que o estado da tela mudou.
#
# ATENÇÃO — esta é uma das duas telas com microfone. O cenário que mais rende bug
# não é conceder a permissão: é NEGAR e ver se a tela avisa em vez de travar.

# language: pt
Funcionalidade: Conversa livre com o Max

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela Falar com Max

  # ------------------------------------------------------------------
  # Regra 9 — conversa por texto
  # ------------------------------------------------------------------

  Cenário: Enviar uma mensagem e receber resposta
    Quando envio a mensagem "Hello Max, how are you?"
    Então a minha mensagem deve aparecer na conversa
    E devo receber uma resposta não vazia do Max

  Cenário: O indicador de digitação aparece enquanto o Max responde
    Quando envio a mensagem "What is regression testing?"
    Então devo ver o indicador de que o Max está respondendo
    E o indicador deve sumir quando a resposta aparecer

  Cenário: A conversa mantém as mensagens anteriores
    Quando envio a mensagem "First message"
    E aguardo a resposta do Max
    E envio a mensagem "Second message"
    Então a conversa deve exibir as duas mensagens que eu enviei
    E a conversa deve exibir as duas respostas do Max

  Cenário: Recusar o envio de mensagem vazia
    Quando deixo o campo de mensagem vazio
    E tento enviar a mensagem
    Então o envio não deve ser permitido

  Cenário: Enviar uma mensagem muito longa
    Quando envio uma mensagem com 2000 caracteres
    Então a tela não deve travar
    E devo receber uma resposta do Max ou um aviso claro sobre o tamanho

  # ------------------------------------------------------------------
  # Nova conversa
  # ------------------------------------------------------------------

  Cenário: Iniciar uma nova conversa limpa o histórico anterior
    Dado que já troquei mensagens com o Max
    Quando inicio uma nova conversa
    Então a conversa anterior não deve mais aparecer na tela

  # ------------------------------------------------------------------
  # Regra 11 — tradução sob demanda
  # ------------------------------------------------------------------

  Cenário: Traduzir uma mensagem da conversa
    Dado que recebi uma resposta do Max
    Quando solicito a tradução dessa resposta
    Então devo ver a tradução em português da mensagem

  # ------------------------------------------------------------------
  # Regra 12 — avatar opcional
  # ------------------------------------------------------------------

  Cenário: O controle do avatar liga e desliga sem quebrar a conversa
    Quando ativo o avatar animado
    E desativo o avatar animado
    Então o controle deve continuar disponível
    E devo continuar conseguindo enviar mensagens

  # Verificado em 07/09/2026: o avatar é uma imagem SEM texto alternativo, sem
  # identificador e sem rótulo. Nenhuma máquina consegue afirmar com honestidade
  # que "o avatar apareceu" — só que surgiu mais uma imagem anônima, o que não
  # prova nada. A confirmação visual é de olho humano. Ver bug 004.
  @manual
  Cenário: O avatar animado aparece e some ao ser ligado e desligado
    Quando ativo o avatar animado
    Então o avatar deve aparecer na tela
    Quando desativo o avatar animado
    Então o avatar não deve mais aparecer na tela

  Cenário: A conversa continua funcionando com o avatar desligado
    Dado que o avatar animado está desativado
    Quando envio a mensagem "Testing without avatar"
    Então devo receber uma resposta não vazia do Max

  # ------------------------------------------------------------------
  # Regra 10 — entrada por voz
  # O caminho ruim vem primeiro de propósito: é o que quase todo mundo
  # esquece de testar, e é onde costuma haver defeito.
  # ------------------------------------------------------------------

  # BUG 005 EM ABERTO — verificado em 07/09/2026: não aparece aviso nenhum.
  # A tela não muda de estado e o console do navegador não registra erro.
  Cenário: Negar a permissão de microfone deve avisar, não travar
    Dado que neguei a permissão de uso do microfone ao navegador
    Quando tento usar a entrada por voz
    Então devo ver um aviso claro de que o microfone não está disponível
    E a tela deve continuar respondendo
    E devo continuar conseguindo enviar mensagens por texto

  Cenário: Usar a entrada por voz com a permissão concedida
    Dado que concedi a permissão de uso do microfone ao navegador
    Quando uso a entrada por voz para ditar uma mensagem
    Então o texto reconhecido deve aparecer no campo de mensagem

  @manual
  Cenário: O texto reconhecido corresponde ao que foi falado
    Dado que concedi a permissão de uso do microfone
    Quando falo "hello world" na entrada por voz
    Então o campo de mensagem deve conter o que eu falei
