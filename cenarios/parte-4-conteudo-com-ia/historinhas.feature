# Tela: /stories — Historinhas
# Regras da /docs cobertas neste arquivo:
#   1. "Usuário digita o tema desejado para a história"
#   2. "A IA gera a história em inglês com tradução em português"
#   3. "Requer acesso premium"
#   4. "Nova história gerada a cada solicitação"
#
# REGRA DE OURO: não se asserta o ENREDO da história — ele muda toda vez e a IA
# tem o direito de mudar. Asserta-se que veio texto, em que idioma veio, e que
# duas solicitações produzem resultados diferentes.

# language: pt
Funcionalidade: Historinhas geradas por IA

  Contexto:
    Dado que estou logado com uma conta premium
    E que estou na tela de Historinhas

  # ------------------------------------------------------------------
  # Caminho feliz — regra 2
  # ------------------------------------------------------------------

  Cenário: Gerar uma história a partir de um tema
    Quando informo o tema "a day in the life of a QA analyst"
    E solicito a geração da história
    Então devo receber uma história não vazia
    E devo receber a tradução em português correspondente

  Cenário: A história vem em inglês e a tradução em português
    Quando informo o tema "software testing"
    E solicito a geração da história
    Então o texto da história deve estar em inglês
    E o texto da tradução deve estar em português

  Cenário: O indicador de carregamento aparece e some ao final
    Quando informo o tema "bug hunting"
    E solicito a geração da história
    Então devo ver o indicador de carregamento enquanto a IA responde
    E o indicador de carregamento deve sumir quando a história aparecer

  # ------------------------------------------------------------------
  # Regra 4 — "nova história a cada solicitação"
  # Este é o cenário que prova a regra 4, e o único jeito honesto de
  # testá-la: mesmo tema, duas vezes, resultados diferentes.
  # ------------------------------------------------------------------

  Cenário: Duas solicitações com o mesmo tema geram histórias diferentes
    Quando informo o tema "automation testing"
    E solicito a geração da história
    E guardo a história recebida
    E solicito a geração da história novamente com o mesmo tema
    Então a nova história deve ser diferente da anterior

  # ------------------------------------------------------------------
  # Limites de entrada do campo de tema
  # ------------------------------------------------------------------

  Cenário: Recusar a geração com o tema vazio
    Quando deixo o campo de tema vazio
    E solicito a geração da história
    Então a geração não deve ser permitida
    E devo ver um aviso de que o tema é obrigatório

  Cenário: Gerar com um tema de um único caractere
    Quando informo o tema "a"
    E solicito a geração da história
    Então devo receber uma história não vazia
    Ou devo ver um aviso explicando por que o tema é curto demais

  Cenário: Gerar com um tema muito longo
    Quando informo um tema com 2000 caracteres
    E solicito a geração da história
    Então a tela não deve travar
    E devo receber uma história ou um aviso claro sobre o tamanho do tema

  Cenário: Gerar com o tema escrito em inglês
    Quando informo o tema "quality assurance career"
    E solicito a geração da história
    Então devo receber uma história não vazia
    E devo receber a tradução em português correspondente

  # ------------------------------------------------------------------
  # Regra 3 — requer premium. O bloqueio em si é da Parte 1, mas o
  # comportamento DESTA tela sem premium é responsabilidade daqui.
  # ------------------------------------------------------------------

  Cenário: Uma conta sem premium não acessa as Historinhas
    Dado que estou logado com uma conta sem premium
    Quando tento abrir a tela de Historinhas pelo endereço direto
    Então não devo conseguir gerar histórias
    E devo ser levado para a tela de ativação do premium

  # ------------------------------------------------------------------
  # Manual — nenhuma máquina julga isto
  # ------------------------------------------------------------------

  @manual
  Cenário: A tradução corresponde ao texto em inglês
    Quando gero uma história com um tema qualquer
    Então a tradução em português deve corresponder ao texto em inglês

  @manual
  Cenário: A história tem relação com o tema pedido
    Quando informo o tema "restaurant" e gero a história
    Então a história deve ter relação com o tema informado
