# Tela: /exercises — Exercícios
# Regras da /docs cobertas neste arquivo:
#   5. "30 questões de preenchimento de frase"
#   6. "Progresso é salvo — pode sair e voltar"
#   7. "Pode recomeçar a qualquer momento"
#   8. "Histórico completo de respostas fica visível"
#
# REGRA DE OURO desta parte: o teste central não é se funcionou agora,
# é se continuou funcionando depois que você saiu e voltou.

# language: pt
Funcionalidade: Exercícios — Preenchimento de frases, Histórico e Persistência

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela de Exercícios

  # ------------------------------------------------------------------
  # Estado inicial — regra 5
  # ------------------------------------------------------------------

  Cenário: Visualizar a tela inicial de exercícios com a primeira questão
    Dado que é o primeiro acesso aos exercícios nesta conta
    Então devo visualizar o contador na questão "1 de 30"
    E o indicador de progresso deve iniciar em 0%
    E devo visualizar a frase em inglês com a lacuna para preenchimento

  # ------------------------------------------------------------------
  # Caminho feliz e respostas
  # ------------------------------------------------------------------

  Cenário: Responder corretamente avança para a próxima questão
    Dado que estou na questão 1 de 30
    Quando preencho a lacuna com a palavra correta
    E confirmo o envio da resposta
    Então devo receber a confirmação de acerto
    E o contador deve avançar para a questão 2 de 30
    E o percentual de progresso deve aumentar

  Cenário: Responder incorretamente exibe feedback e registra o erro
    Dado que estou em uma questão dos exercícios
    Quando preencho a lacuna com uma palavra incorreta
    E confirmo o envio da resposta
    Então devo receber o aviso de resposta incorreta
    E o sistema deve exibir ou registrar a tentativa sem quebrar o fluxo

  # ------------------------------------------------------------------
  # Tratamento de entrada e formatação
  # ------------------------------------------------------------------

  Cenário: Impedir o envio com o campo de resposta em branco
    Quando tento confirmar a resposta com o campo de preenchimento vazio
    Então o sistema não deve avançar de questão
    E deve me avisar que o preenchimento é obrigatório

  Cenário: Tolerar espaços em branco antes ou depois da resposta correta
    Quando preencho a lacuna com a resposta correta contendo espaços extras antes e depois
    E confirmo o envio da resposta
    Então o sistema deve desconsiderar os espaços extras e aceitar como correta

  Cenário: Aceitar resposta correta digitada em letras maiúsculas
    Quando preencho a lacuna com a palavra correta inteiramente em maiúsculas
    E confirmo o envio da resposta
    Então o sistema não deve diferenciar maiúsculas de minúsculas e deve aceitar a resposta

  # ------------------------------------------------------------------
  # Persistência no banco de dados — "Sair e Voltar" — regra 6
  # ------------------------------------------------------------------

  Cenário: Retomar os exercícios de onde parei após navegar para outra rota
    Dado que respondi 3 questões dos exercícios
    Quando navego para a tela "Trilha do Inglês"
    E retorno para a tela de Exercícios
    Então devo estar na questão 4 de 30
    E o percentual de progresso deve refletir as questões já concluídas

  Cenário: Retomar os exercícios de onde parei após fechar e reabrir a sessão
    Dado que avancei no preenchimento de questões
    Quando faço logout e realizo login novamente
    E acesso a tela de Exercícios
    Então devo ser posicionado na questão subsequente à última respondida
    E meu progresso anterior deve estar intacto

  # ------------------------------------------------------------------
  # Histórico de respostas — regra 8
  # ------------------------------------------------------------------

  Cenário: O histórico registra as respostas fornecidas
    Quando respondo a uma questão
    Então a tentativa deve ser adicionada ao histórico completo de respostas
    E o histórico deve mostrar se a resposta foi considerada correta ou errada

  # ------------------------------------------------------------------
  # Recomeço e Término — regras 5 e 7
  # ------------------------------------------------------------------

  Cenário: Recomeçar os exercícios a qualquer momento
    Dado que já respondi várias questões e estou avançado no progresso
    Quando solicito o recomeço dos exercícios
    E confirmo a reinicialização
    Então o contador deve retornar para a questão 1 de 30
    E o progresso deve reiniciar a partir do início

  Cenário: Comportamento do histórico após solicitar o recomeço
    Dado que possuo respostas registradas no histórico
    Quando solicito e confirmo o recomeço dos exercícios
    Então o sistema deve limpar o histórico anterior ou marcá-lo como nova tentativa

  Cenário: Conclusão das 30 questões de exercícios
    Dado que estou na questão 30 de 30
    Quando submeto a resposta da 30ª questão
    Então devo ver uma mensagem ou tela de conclusão de todos os exercícios
    E o progresso total deve atingir 100%

  # ------------------------------------------------------------------
  # Avaliação de conteúdo — Teste manual
  # ------------------------------------------------------------------

  @manual
  Cenário: Gramática e naturalidade das frases em inglês
    Quando leio as questões apresentadas nos exercícios
    Então as frases em inglês e suas lacunas devem ser gramaticalmente corretas e naturais
