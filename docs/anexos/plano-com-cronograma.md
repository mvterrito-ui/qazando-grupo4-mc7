# Grupo 4 — MC7 · Plano de trabalho

**Produto:** https://english.qazando.com.br/ — plataforma da Qazando pra QA aprender inglês técnico.
**Cupom premium:** `QAZANDOENGLISH2025` (os códigos são **reutilizáveis** — todos podem usar o mesmo)
**Início do desafio:** 13/08/2026 · **Entrega:** 06/10/2026, 20:00 (terça)
**Hoje:** 26/08/2026 — restam **6 semanas**.

**Time (4):** Denaide de Cassia Sónora Souza Costa · Marcos Vinicio Territo · João Paulo · Flavia
*(Bruno Zimmermann Dotto saiu do projeto em 26/08.)*

---

## 1. O que a atividade cobra

| # | Entregável | Onde vai morar |
|---|---|---|
| 1 | Cenários levantados | `cenarios/` (ver §3 — caso de teste no Jira exige plugin pago) |
| 2 | Cenários em Gherkin (Dado/E/Quando/Então) | `cenarios/*.feature` |
| 3 | Automação web (stack, arquitetura, pipeline) | `automacao/` + GitHub Actions |
| 4 | Bugs reportados | Ferramenta de gestão + `bugs/` |
| 5 | Projeto organizado em ferramenta | JIRA free (§2) |
| 6 | Métricas (cenários, bugs abertos, resolvidos) | `metricas/` + relatório final |
| 7 | Reuniões entre os alunos | `docs/atas/` |

**Regra do grupo:** o que não está na ferramenta ou no repositório não existe.

---

## 2. O produto, de verdade

Explorado com login em 26/08/2026. **A landing anuncia 6 features. O app tem 13 telas.** Quem planejar pela landing vai errar o escopo.

| Rota | Tela | Acesso | Natureza |
|---|---|---|---|
| `/auth` | Login / Cadastro | livre | formulário |
| `/activate-premium` | Ativar código premium | livre | formulário |
| `/docs` | Documentação | livre | **regras de negócio** |
| `/duolingo` | Trilha do Inglês | premium | gamificado |
| `/exercises` | Exercícios — completar frase | premium | 30 questões |
| `/quiz` | Quiz de vocabulário | premium | 30 questões |
| `/progress` | Meu Progresso | premium | cálculo |
| `/ranking` | Ranking | premium | agregação |
| `/flashcards` | Flashcards QA | premium | algoritmo SM-2 |
| `/stories` | Historinhas | premium | IA |
| `/interview` | Entrevistas | premium | IA |
| `/chatbot` | Falar com Max | premium | IA + voz |
| `/words` | Gerador de Palavras | premium | IA + áudio |
| `/pronunciation` | Treinar Fala | premium | IA + voz |
| — | Painel Admin | admin | gestão de códigos |

### O achado mais valioso: `/docs`

A plataforma **publica as regras de negócio de cada feature** numa página aberta. Isso é raro e muda o trabalho de vocês: o levantamento de cenários **não parte do zero nem de achismo** — parte de um oráculo escrito pelo próprio produto.

Exemplos do que está lá:
- *"Senha deve ter no mínimo 6 caracteres"*
- *"Lições desbloqueiam sequencialmente"*
- *"Mínimo de 5 exercícios completados para aparecer no ranking"*
- *"Usuário escolhe o tema e quantidade de palavras (1 a 100)"*

**Cada regra dessas é um cenário.** E cada regra que a tela não cumpre é um bug com evidência documental — o tipo de bug que ninguém contesta. Leiam `/docs` inteiro antes de escrever o primeiro cenário: é a especificação que vocês não teriam em projeto real.

### Contas

O `/docs` publica quatro usuários de teste (`admin@teste.com`, `ativo@teste.com`, `inativo@teste.com`, `semconfirmar@teste.com`, senha `Teste@123`). **Nenhum deles funciona** — ver §7, achado 1. Então: cada pessoa cria a própria conta e ativa o premium com o cupom. Nada de conta compartilhada — um limpa o progresso do outro e vira bug fantasma.

---

## 3. Ferramentas

### Gestão: **JIRA free**

O Qase era o candidato natural — é a única das quatro feita pra QA — mas o free tem **4 usuários**, **2 projetos** e **dashboards e relatórios bloqueados**, que é justamente o que resolveria o entregável de métricas. Pago é US$ 35/usuário/mês.

| Opção | Usuários | Casos de teste | Bugs | Métricas | Veredito |
|---|---|---|---|---|---|
| **JIRA free** | **10** | não (Xray/Zephyr é pago) | ótimo | agile reporting | **escolhido** |
| Qase free | 4 | nativo | sim | **bloqueado** | perde o entregável |
| Trello free | ok | vira cartão | ok | planilha na mão | perde pro Jira |
| QA Recorder | — | evidência de sessão | ok | não | complementa |

### As outras seis frentes

| Frente | Escolha | Por quê |
|---|---|---|
| Cenários e Gherkin | **GitHub** — `.feature` por pull request | caso de teste no Jira exige plugin pago; e é onde a automação vive |
| Automação | **Playwright + JavaScript** | arquitetura doada pronta; instalação em dois comandos |
| Pipeline | **GitHub Actions** | mesmo repositório, grátis, responde o "pipeline?" do enunciado |
| Evidência | **QA Recorder** — confirmar com o mentor | não consegui acessar o site: perguntar o que é antes de descartar |
| Reunião | **Google Meet** | grátis, link fixo, limite de 60 min cabe nos 45 |
| Ata e apresentação | **Google Docs/Slides** + README | edição simultânea |

Das sete frentes, **só a automação depende do grupo**. As outras seis fecham sem discussão longa.

Sobre Playwright: instalação é `npm install` + `npx playwright install`, e ele já traz espera automática, trace, screenshot e relatório. Quem nunca escreveu automação não aprende sozinho em 6 semanas *e* entrega junto — então o esqueleto vem pronto com uma spec de exemplo comentada linha a linha, todo mundo copia o template, e há duas sessões de pareamento (semanas 1 e 3). Revisão é **rodízio**: cada um revisa a PR de outro, ninguém é gargalo. Se a maioria já souber Cypress, troca-se sem drama — o que não dá é cada pessoa usar uma coisa.

---

## 4. Divisão em 4 partes

As 13 telas foram agrupadas **pela técnica de teste que exigem**, não pela ordem do menu. Assim cada pessoa desenvolve uma competência inteira em vez de pular de assunto — e o que aprende na primeira tela serve nas outras da mesma parte.

Cada dono faz a parte **ponta a ponta**: levanta cenários → escreve Gherkin → automatiza → reporta bugs → alimenta as métricas da sua parte.

### Parte 1 — Acesso e Permissão
**Telas:** `/auth` (login, cadastro, esqueci senha, login social), `/activate-premium`, Painel Admin, e a regra de bloqueio premium em todas as rotas.
**Técnica:** validação de formulário, autenticação, autorização.
**Regras a cobrir:** e-mail válido e confirmação obrigatória; login só após confirmar; senha mínima de 6 caracteres; link de redefinição; código premium reutilizável; sem premium só se vê `/docs` e `/activate-premium`; admin acessa tudo independente de premium; admin cria, gera e deleta códigos.
**Por que é a mais crítica:** as outras três partes **não existem sem ela** — ninguém testa nada sem conta premium. Quem pegar entrega antes dos outros.
**Sem IA. É a parte mais determinística e mais fácil de automatizar.**

### Parte 2 — Prática Estruturada
**Telas:** `/duolingo` (Trilha), `/exercises`, `/flashcards`.
**Técnica:** progressão, persistência de estado entre sessões, algoritmo.
**Regras a cobrir:** 4 unidades com desbloqueio sequencial; XP por lição concluída; progresso salvo automaticamente; 30 questões de completar frase, podendo sair e voltar; recomeçar a qualquer momento; histórico de respostas visível; 40 flashcards com avaliação Difícil/Médio/Fácil e retorno por SM-2; estatísticas de fila, revisados e dominados.
**O nó:** quase tudo aqui só se prova **saindo e voltando**. É a parte que mais exige cenário de duas sessões — e onde bug de persistência se esconde.

### Parte 3 — Pontuação e Comparação
**Telas:** `/quiz`, `/progress`, `/ranking`.
**Técnica:** conferência de cálculo e agregação.
**Regras a cobrir:** 30 perguntas de múltipla escolha com 3 opções e uma correta; XP por acerto; reiniciar o quiz; progresso mostra respondidas/corretas/erradas e taxa de acerto **separadas** para frases e palavras; atualização em tempo real; ranking exige mínimo de 5 exercícios, soma Quiz + Exercícios, ordena por total de acertos e exibe nome, e-mail e estatísticas.
**O nó:** as três telas são **a mesma verdade contada três vezes**. Se o quiz diz 7 acertos, o progresso tem que dizer 7 e o ranking tem que somar 7. Divergência entre elas é bug — e é o tipo de bug que só quem testa as três juntas encontra.
**Atenção à massa:** o ranking está vazio hoje (0 competidores). Pra testá-lo é preciso **responder pelo menos 5 exercícios primeiro**.

### Parte 4 — Conteúdo com IA
**Telas:** `/stories`, `/interview`, `/chatbot`, `/words`, `/pronunciation`.
**Técnica:** testar o não-determinístico, mídia (microfone e áudio), limites de entrada.
**Regras a cobrir:** história a partir de tema livre, em inglês com tradução, nova a cada solicitação; entrevista gera pergunta, aceita resposta em texto, devolve feedback e traduz o feedback; chat livre com Max, entrada por voz, tradução sob demanda, avatar opcional; gerador de palavras com tema e **quantidade de 1 a 100**, com tradução, frase de exemplo e áudio; treino de fala gera frase, toca a pronúncia correta, grava a voz e compara reconhecido vs. esperado.
**A regra de ouro:** **não assertar o conteúdo gerado** — ele muda a cada execução. Assertar o **contrato e o estado**: a requisição saiu, a resposta chegou, o loading sumiu, a tela mudou de estado, o texto não veio vazio, o idioma é o esperado. Qualidade do texto fica no teste manual.
**É a parte com mais telas, mas a mais rasa em cada uma** — e a que tem os limites de entrada mais fáceis de quebrar (§7, achado 2).

### Papéis, além da parte

Quatro pessoas, quatro chapéus:

| Papel | O que faz |
|---|---|
| Dono da ferramenta | Cria o site do Jira, convida todos, define campos e fluxo de status do bug |
| Guardião das métricas | Atualiza os números toda sexta e leva pra reunião |
| Ata e comunicação | Registra decisão de cada reunião, mantém o Meet no calendário |
| Arquitetura | Sobe o esqueleto do Playwright, a pipeline e a spec de exemplo; conduz os dois pareamentos |

A **apresentação final é tarefa coletiva da semana 6**, coordenada por quem faz a ata. Com quatro pessoas não sobra ninguém para carregá-la sozinho.

---

## 5. Cronograma — 6 semanas

Reunião fixa: **domingo, 20:00, 45 min**. Entre elas, acompanhamento assíncrono no WhatsApp: o que fiz, o que travou, o que faço hoje.

| Semana | Período | Precisa estar pronto no fim |
|---|---|---|
| **1** | 26–31/08 | Jira no ar com todos dentro · repositório com esqueleto e 1 spec rodando · todos com conta própria e premium ativo · `/docs` lido por todos · cada um fez exploratório da sua parte e abriu os primeiros bugs · 1º pareamento |
| **2** | 01–07/09 | **Todos os cenários levantados e em Gherkin**, revisados em par, cadastrados na ferramenta |
| **3** | 08–14/09 | Smoke verde: login + 1 fluxo crítico por parte · **pipeline no GitHub Actions** · 2º pareamento |
| **4** | 15–21/09 | Fluxos principais de cada parte automatizados · bugs abertos com evidência |
| **5** | 22–28/09 | Cobertura fechada · **reteste dos bugs corrigidos** · métricas consolidadas · congelamento de escopo |
| **6** | 29/09–05/10 | Relatório final · apresentação · ensaio · repositório limpo com README |
| **Entrega** | **06/10, 20:00** | — |

**Marco duro:** se no fim da semana 2 o Gherkin não estiver fechado, corta-se escopo — tira-se uma parte do ar em vez de entregar quatro pela metade.

**Dependência a respeitar:** a Parte 1 destrava as outras três. Ela entrega primeiro.

---

## 6. Combinados

Todo bug sai no mesmo formato, um bloco por problema:

```
CENÁRIO: <o que se tentou fazer>
DADO <estado inicial>
QUANDO <ação>
ENTÃO <o que deveria acontecer>

PROBLEMA IDENTIFICADO: <o que acontece de fato, com evidência>
```

- **Sem evidência não é bug, é opinião.** Print ou vídeo sempre; se pegou na automação, anexa o trace.
- **Bug que contraria o `/docs` é bug de ouro.** Cite a regra na descrição — vira indiscutível.
- **Gherkin fala a linguagem do negócio, não da tela.** "Quando informo um e-mail já cadastrado", não "Quando clico no #btn-submit".
- **Automação não copia o Gherkin um-pra-um.** Automatiza o que dói se quebrar; o resto fica manual e documentado.
- **Nada entra no repositório sem revisão.** Pull request, um revisor, merge.
- **Reunião sem ata não aconteceu.**

---

## 7. Achados da exploração de 26/08

Três já saíram de uma hora de exploração. Servem de exemplo do formato e **já podem ser abertos** assim que o Jira existir.

### Achado 1 — Usuários de teste da documentação não conseguem logar

```
CENÁRIO: Entrar com os usuários de teste publicados na documentação
DADO que a página /docs publica quatro contas de teste com a senha Teste@123
QUANDO faço login com ativo@teste.com / Teste@123
ENTÃO deveria entrar como usuário premium, conforme a documentação descreve

PROBLEMA IDENTIFICADO: a tela exibe "Erro ao fazer login — Email ou senha incorretos"
e a API de autenticação responde 400. O mesmo acontece com inativo@teste.com.
As contas documentadas não existem ou estão com outra senha.
```
**Severidade alta:** bloqueia quem for testar os perfis premium, comum e admin sem criar conta própria. É o primeiro bug que qualquer QA da turma vai encontrar.

### Achado 2 — Gerador de Palavras aceita quantidade fora do intervalo documentado

```
CENÁRIO: Gerar vocabulário com quantidade inválida
DADO que /docs define "quantidade de palavras (1 a 100)"
E que o campo declara min="1" e max="100"
QUANDO informo 0, 101 ou -5 no campo de quantidade
ENTÃO a tela deveria impedir o envio e avisar o limite

PROBLEMA IDENTIFICADO: o campo aceita os três valores e o botão "Gerar Palavras
com IA" continua habilitado. Os atributos min e max estão declarados no HTML mas
não são aplicados, porque o envio não passa por validação de formulário nativa.
```
**Confirmar no reteste:** o que o backend faz ao receber −5 ou 101 — recusa, trunca, ou tenta gerar.

### Achado 3 — Título da tela de progresso tem texto residual

```
CENÁRIO: Abrir a tela Meu Progresso
DADO que estou logado com premium
QUANDO acesso /progress
ENTÃO o título deveria ser "Seu Progresso"

PROBLEMA IDENTIFICADO: o título exibido é "📊 Seu Progresso aqui" — a palavra
"aqui" parece sobra de texto de rascunho.
```
**Severidade baixa**, mas é achado de vitrine: aparece na primeira tela que qualquer avaliador abre.

---

## 8. Métricas

Atualizadas toda sexta pelo guardião das métricas:

- Cenários levantados — total e por parte
- Cenários automatizados vs. manuais, e o % automatizado
- Bugs abertos — total, por parte, por severidade
- Bugs corrigidos e **retestados** — número e % do total
- Bugs em aberto no fechamento, com justificativa
- Execuções da pipeline — verdes vs. vermelhas

Métrica que ninguém vai olhar na apresentação, não se coleta.

---

## 9. Riscos

| Risco | Como tratar |
|---|---|
| **5 das 13 telas são de IA** — resposta muda a cada execução | Assertar contrato e estado, nunca o conteúdo gerado. Qualidade do texto fica no manual. |
| **Duas telas exigem microfone** (Falar com Max, Treinar Fala) | Playwright concede permissão e injeta áudio de arquivo. É o ponto mais técnico da Parte 4. |
| **Contas de teste da documentação não funcionam** | Cada pessoa cria a própria conta e ativa o cupom. Já virou o achado 1. |
| **Ranking e Progresso dependem de massa** | Quem pegar a Parte 3 precisa responder ao menos 5 exercícios antes de testar o ranking. |
| **Ambiente compartilhado** | Conta própria por pessoa, sempre. |
| **Colega trava e some** | Aparece na daily assíncrona. Dois dias no mesmo ponto = pareia, não espera a reunião. |
| **Grupo encolheu de 5 para 4** | O escopo não encolheu junto. Se a semana 2 atrasar, corta-se a Parte 4 primeiro — é a mais rasa por tela. |

---

## 10. Tarefas da semana 1

| # | Tarefa | Dono | Até |
|---|---|---|---|
| 1 | Criar o site do Jira e convidar as 4 pessoas | Dono da ferramenta | qui 27/08 |
| 2 | Definir campos e fluxo do bug: Aberto → Em correção → Corrigido → Retestado → Fechado | Dono da ferramenta | dom 30/08 |
| 3 | Abrir no Jira os 3 achados da §7 | Dono da ferramenta | dom 30/08 |
| 4 | Criar o repositório no GitHub e dar acesso a todos | Arquitetura | qui 27/08 |
| 5 | Subir o esqueleto do Playwright com spec de exemplo comentada | Arquitetura | dom 30/08 |
| 6 | Agendar a 1ª sessão de pareamento | Arquitetura | dom 30/08 |
| 7 | Criar conta própria e ativar o premium com `QAZANDOENGLISH2025` | Todos | qua 26/08 |
| 8 | **Ler `/docs` inteiro** e marcar as regras da própria parte | Todos | qui 27/08 |
| 9 | 1h de exploratório na própria parte e abrir os primeiros bugs | Todos | dom 30/08 |
| 10 | Marcar a reunião recorrente de domingo 20:00 | Ata | qua 26/08 |
| 11 | Criar a página de métricas com os 6 indicadores da §8 | Métricas | dom 30/08 |
| 12 | Perguntar ao mentor o que é o QA Recorder e se ele espera que usemos | Qualquer um | qua 26/08 |

**Fica pra reunião 2 (30/08):** níveis de severidade e o que torna um cenário "pronto". Não vale travar a semana 1 nisso.

---

## 11. Pauta da reunião 1 — 45 min

| Tempo | Assunto | Saída |
|---|---|---|
| 5 min | Apresentação: experiência com automação e horas por semana | Expectativa alinhada |
| 5 min | **O produto de verdade** (§2) — 13 telas, não 6, e o `/docs` como especificação | Todos entendem o tamanho real |
| 10 min | **Ferramentas** (§3) — números do free tier já conferidos | Decidido; dono já cria o Jira |
| 15 min | **Divisão em 4 partes** (§4) — cada um escolhe a sua e o papel | Tabela preenchida |
| 5 min | **Cronograma** (§5) e dia fixo da reunião | Calendário confirmado |
| 5 min | **Combinados** (§6) | Aceitos |

Sai da reunião com: Jira criado, partes com dono, repositório compartilhado e reunião recorrente no calendário de todos.
