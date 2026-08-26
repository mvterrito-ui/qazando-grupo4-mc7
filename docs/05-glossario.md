# Glossário

Os termos que aparecem neste repositório, explicados sem rodeio. Em ordem alfabética.

**Ambiente**
O lugar onde o sistema está rodando. Aqui só temos um: o site publicado em
`english.qazando.com.br`. Em empresa, é comum ter vários (desenvolvimento, homologação, produção).

**Automação de teste**
Um programa que executa o teste no seu lugar, sempre do mesmo jeito. Não substitui a pessoa —
repete o que a pessoa já sabia verificar.

**Bug (ou defeito)**
O sistema se comportando diferente do que a regra de negócio diz. Não é "não gostei".

**Caminho feliz**
O uso normal, em que tudo dá certo. É o primeiro cenário a escrever e quase sempre o menos
interessante — os bugs moram nos outros caminhos.

**Caso de teste**
A versão detalhada de um cenário: passo a passo, dado de entrada, resultado esperado. Neste
projeto a gente usa "cenário" para quase tudo; não se preocupe com a diferença.

**Cenário de teste**
Uma situação de uso que se decide verificar. Responde a "o que acontece se...".

**Cobertura**
Quanto do sistema já foi testado. Pode ser dita em telas, em regras ou em cenários.

**End-to-end (E2E)**
Teste que percorre o caminho inteiro como uma pessoa faria: abre o navegador, faz login, clica,
digita, confere o resultado. É o tipo de teste deste projeto.

**Especificação**
O documento que diz como o sistema deveria funcionar. Neste projeto, é a página `/docs` da
própria plataforma — uma sorte rara.

**Evidência**
A prova do que você viu: print, vídeo, a URL, qual conta usava. Sem evidência, o bug vira
opinião e é ignorado.

**Gherkin**
Formato padrão de escrever cenário, com as palavras **Dado**, **Quando**, **Então**, **E**, **Mas**.
Serve para todo mundo ler a mesma coisa.

**Massa de teste (ou massa de dados)**
Os dados que precisam existir para o teste rodar. Exemplo deste projeto: para testar o ranking
é preciso ter respondido pelo menos 5 exercícios antes — esses 5 exercícios são a massa.

**Pipeline**
Uma automação que roda os testes sozinha, num servidor, sempre que alguém altera o código.
A gente vai usar o GitHub Actions.

**Premium**
Nesta plataforma, o acesso liberado por um código. Sem premium, só duas telas ficam visíveis.

**Pull request (PR)**
O pedido para incluir uma alteração no repositório. Outra pessoa revisa antes de aceitar.
É como a gente garante que ninguém sobe nada sozinho.

**QA**
*Quality Assurance*, garantia de qualidade. É o que a gente é.

**Regra de negócio**
Uma decisão sobre como o sistema deve se comportar. É de onde vem o "resultado esperado" de
todo teste.

**Reteste**
Testar de novo um bug depois que ele foi corrigido, para confirmar que o conserto funcionou.
É o passo mais esquecido e um dos mais importantes.

**Severidade**
O tamanho do estrago que o bug causa. Aqui usamos Alta, Média e Baixa.

**Smoke test (teste de fumaça)**
Um punhado de testes rápidos que confirmam se o básico está de pé. Se o smoke falha, nem
adianta rodar o resto.

**Teste exploratório**
Usar o sistema sem roteiro pronto, investigando e anotando o que estranhar. É como se começa,
antes de existirem cenários escritos.

**Teste manual**
Teste feito por uma pessoa, na mão. Não é inferior à automação — é o certo para tudo que exige
julgamento humano, como avaliar se um texto gerado por IA ficou bom.

**Trace**
Um arquivo que o Playwright grava quando um teste automatizado falha, com tudo que aconteceu:
telas, cliques, requisições de rede. Serve como evidência.

**XP**
Nesta plataforma, os pontos de experiência que o usuário ganha ao concluir lições e acertar
questões.
