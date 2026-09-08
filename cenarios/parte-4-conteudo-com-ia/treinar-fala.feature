# Tela: /pronunciation — Treinar Fala
# Regras da /docs cobertas neste arquivo:
#   16. "A IA gera uma frase em inglês para praticar"
#   17. "Usuário ouve a pronúncia correta antes de tentar"
#   18. "Grava a própria voz e o sistema compara"
#   19. "O feedback mostra o que foi reconhecido vs. o que era esperado"
#
# REGRA DE OURO: não se asserta QUAL frase a IA gerou nem a NOTA que ela deu.
# Asserta-se que a frase veio, que o áudio existe, que a gravação produz feedback,
# e que o feedback mostra os dois lados da comparação.
#
# ATENÇÃO — segunda tela com microfone, e a mais técnica do projeto inteiro.
# Na automação, o navegador substitui o microfone real por um arquivo de áudio.

# language: pt
Funcionalidade: Treino de pronúncia

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela Treinar Fala

  # ------------------------------------------------------------------
  # Regra 16 — a frase
  # ------------------------------------------------------------------

  Cenário: Gerar uma frase para praticar
    Quando solicito uma nova frase
    Então devo receber uma frase não vazia
    E o texto da frase deve estar em inglês

  Cenário: Duas solicitações seguidas geram frases diferentes
    Quando solicito uma nova frase
    E guardo a frase recebida
    E solicito uma nova frase novamente
    Então a nova frase deve ser diferente da anterior

  Cenário: Gerar uma frase nova sem ter gravado a anterior
    Dado que recebi uma frase para praticar
    E que não gravei a minha voz
    Quando solicito uma nova frase
    Então devo receber uma frase não vazia
    E o feedback da tentativa anterior não deve mais aparecer

  # ------------------------------------------------------------------
  # Regra 17 — ouvir antes de tentar
  # ------------------------------------------------------------------

  Cenário: Ouvir a pronúncia correta antes de gravar
    Dado que recebi uma frase para praticar
    Então devo ter a opção de ouvir a pronúncia correta
    Quando solicito ouvir a pronúncia correta
    Então o áudio deve ser reproduzido

  # ------------------------------------------------------------------
  # Regras 18 e 19 — gravar e comparar
  # ------------------------------------------------------------------

  # ------------------------------------------------------------------
  # OS QUATRO CENÁRIOS ABAIXO SÃO @manual, e não por preguiça.
  #
  # Verificado em 07/09/2026: a tela usa o reconhecimento de fala do navegador,
  # que não funciona com o dispositivo de áudio falso do Playwright em modo
  # headless — ao clicar em "Falar Agora e Receber Feedback" a tela não muda de
  # estado. Isso é limitação do ambiente de automação, NÃO defeito do produto:
  # para uma pessoa falando num microfone real, o recurso funciona.
  #
  # Automatizar isso exigiria injetar um WAV real e ainda assim depende de um
  # serviço de reconhecimento que o headless não expõe. É a mesma decisão que
  # se toma sobre a qualidade do texto da IA: quando a máquina não consegue
  # julgar com honestidade, quem julga é uma pessoa.
  # ------------------------------------------------------------------

  @manual
  Cenário: Gravar a voz e receber o feedback
    Dado que concedi a permissão de uso do microfone ao navegador
    E que recebi uma frase para praticar
    Quando gravo a minha voz lendo a frase
    E encerro a gravação
    Então devo receber um feedback não vazio

  @manual
  Cenário: O feedback mostra o reconhecido e o esperado lado a lado
    Dado que concedi a permissão de uso do microfone ao navegador
    E que gravei a minha voz lendo a frase
    Então o feedback deve exibir o que foi reconhecido na minha fala
    E o feedback deve exibir o que era esperado

  @manual
  Cenário: O indicador de processamento aparece enquanto a fala é analisada
    Dado que concedi a permissão de uso do microfone ao navegador
    E que recebi uma frase para praticar
    Quando gravo a minha voz e encerro a gravação
    Então devo ver o indicador de que a fala está sendo analisada
    E o indicador deve sumir quando o feedback aparecer

  @manual
  Cenário: Gravar em silêncio, sem falar nada
    Dado que concedi a permissão de uso do microfone ao navegador
    E que recebi uma frase para praticar
    Quando gravo sem falar nada e encerro a gravação
    Então a tela não deve travar
    E devo ver um feedback ou um aviso de que nada foi reconhecido

  # ------------------------------------------------------------------
  # O caminho ruim do microfone
  # ------------------------------------------------------------------

  # BUG 005 EM ABERTO — verificado em 07/09/2026: não aparece aviso nenhum.
  Cenário: Negar a permissão de microfone deve avisar, não travar
    Dado que neguei a permissão de uso do microfone ao navegador
    Quando tento gravar a minha voz
    Então devo ver um aviso claro de que o microfone não está disponível
    E a tela deve continuar respondendo

  # ------------------------------------------------------------------
  # Manual
  # ------------------------------------------------------------------

  @manual
  Cenário: O áudio da pronúncia correta corresponde à frase exibida
    Dado que recebi uma frase para praticar
    Quando ouço a pronúncia correta
    Então o áudio deve pronunciar a frase que está na tela

  @manual
  Cenário: O reconhecimento da fala corresponde ao que foi dito
    Dado que gravei a minha voz lendo a frase corretamente
    Então o texto reconhecido deve corresponder ao que eu falei
