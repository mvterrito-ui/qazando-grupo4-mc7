# Tela: /duolingo — Trilha do Inglês
# Regras da /docs cobertas neste arquivo:
#   1. "4 unidades progressivas, com lições dentro de cada uma"
#   2. "Lições desbloqueiam sequencialmente — complete a anterior para avançar"
#   3. "Cada lição concluída dá XP"
#   4. "Progresso é salvo automaticamente no banco de dados"
#
# REGRA DE OURO desta parte: quase toda regra só se prova saindo e voltando.
# Um teste que olha só a tela no momento do clique não enxerga a persistência.

# language: pt
Funcionalidade: Trilha do Inglês — Unidades, Lições, XP e Persistência

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela da Trilha do Inglês

  # ------------------------------------------------------------------
  # Estado inicial — conta nova
  # ------------------------------------------------------------------

  Cenário: Visualizar 4 unidades progressivas na trilha
    Então devo visualizar 4 unidades de aprendizado na tela
    E as unidades devem estar organizadas de forma progressiva

  Cenário: Conta nova inicia com apenas a Lição 1 da Unidade 1 liberada
    Dado que é o primeiro acesso desta conta na plataforma
    Então apenas a Lição 1 da Unidade 1 deve estar disponível para início
    E o contador de XP inicial deve ser 0
    E o contador de lições completadas inicial deve ser 0

  Cenário: As Unidades 2, 3 e 4 iniciam bloqueadas
    Dado que é o primeiro acesso desta conta na plataforma
    Então as Unidades 2, 3 e 4 devem estar marcadas como bloqueadas

  Cenário: Impedir o acesso direto a uma lição bloqueada
    Dado que a Lição 2 está bloqueada
    Quando tento acessar a Lição 2
    Então o sistema deve me manter na trilha
    E a Lição 2 não deve ser iniciada

  # ------------------------------------------------------------------
  # Desbloqueio e Pontuação (Caminho feliz) — regras 2 e 3
  # ------------------------------------------------------------------

  Cenário: Concluir a Lição 1 desbloqueia a Lição 2 sequencialmente
    Dado que a Lição 1 está disponível e a Lição 2 está bloqueada
    Quando inicio e concluo todas as etapas da Lição 1
    Então a Lição 1 deve ser marcada como concluída
    E a Lição 2 deve ser desbloqueada imediatamente

  Cenário: Errar todas as questões da lição não deve desbloquear a lição seguinte
    Dado que a Lição 1 está disponível e a Lição 2 está bloqueada
    Quando respondo incorretamente a todas as questões da Lição 1
    Então a lição não deve ser considerada concluída
    E a Lição 2 deve permanecer bloqueada
    E o sistema deve orientar a refazer a lição

  Cenário: Concluir uma lição credita o XP prometido
    Dado que o meu saldo atual de XP é conhecido
    Quando concluo uma lição que promete "+25 XP"
    Então o meu saldo de XP deve aumentar exatamente 25 pontos

  Cenário: Concluir uma lição incrementa o contador de lições completadas
    Dado que o contador exibe 0 lições completadas
    Quando concluo a Lição 1 com sucesso
    Então o contador deve exibir 1 lição completada

  # ------------------------------------------------------------------
  # Persistência e Memória do Sistema — regra 4
  # O coração da Parte 2: o sistema deve lembrar do estado salvo.
  # ------------------------------------------------------------------

  Cenário: O progresso da lição desbloqueada persiste após sair e voltar
    Dado que concluí a Lição 1 e desbloqueei a Lição 2
    Quando saio da tela da Trilha do Inglês navegando para outra rota
    E retorno para a Trilha do Inglês
    Então a Lição 1 deve continuar como concluída
    E a Lição 2 deve continuar desbloqueada

  Cenário: O saldo de XP acumulado persiste após sair da plataforma
    Dado que ganhei XP concluindo uma lição
    Quando faço logout e login novamente na plataforma
    E acesso a Trilha do Inglês
    Então o saldo de XP exibido deve ser idêntico ao acumulado anteriormente

  Cenário: O contador de lições completadas mantém o valor após recarregar a página
    Dado que tenho lições completadas registradas
    Quando recarrego a página no navegador
    Então o contador de lições completadas deve exibir exatamente o mesmo número anterior

  # ------------------------------------------------------------------
  # Avaliação de conteúdo — Teste manual
  # ------------------------------------------------------------------

  # Este fica no teste MANUAL: apenas um avaliador humano valida a didática
  # e clareza do conteúdo das perguntas da lição.
  @manual
  Cenário: O vocabulário ensinado na lição é condizente com o tema de QA
    Quando inicio a Lição 1 da Unidade 1
    Então as palavras e frases apresentadas devem ter contexto prático em testes de software
