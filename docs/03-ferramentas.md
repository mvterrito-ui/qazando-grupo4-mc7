# Ferramentas do projeto

O enunciado da atividade só pede a ferramenta de **gestão**. Na prática, um projeto de testes
precisa decidir sete coisas. Se a gente deixar as outras seis implícitas, cada pessoa escolhe
a sua e o trabalho não se junta no final.

---

## 1. Gestão do projeto e dos bugs — **JIRA (plano gratuito)**

É onde os bugs vão morar e onde a gente acompanha o andamento.

### Por que não o Qase

O Qase era o candidato natural: é a única das opções feita especificamente para QA, com
repositório de casos de teste e relatórios prontos. Mas o plano gratuito dele:

- aceita só **4 usuários** — e o grupo pode crescer ou receber visita do mentor
- limita a **2 projetos** e **500 MB**
- e, o mais grave: **bloqueia justamente os relatórios e dashboards**, que são o entregável de
  métricas da atividade

O plano pago custa US$ 35 por usuário por mês. Fora de cogitação.

### Comparação

| Ferramenta | Usuários no free | Casos de teste | Bugs | Métricas prontas |
|---|---|---|---|---|
| **JIRA free** | **10** | não (precisa de plugin pago) | ótimo | sim, relatórios inclusos |
| Qase free | 4 | sim, nativo | sim | **bloqueadas no free** |
| Trello free | ok | não, vira cartão | ok | não, planilha na mão |
| QA Recorder | — | grava sessão de teste | ok | não |

### Onde cada coisa fica

Como o JIRA só gerencia caso de teste com plugin pago, **os cenários não ficam no JIRA** —
ficam neste repositório, que é onde a automação vai viver de qualquer jeito.

| O quê | Onde fica | De onde sai o número para a métrica |
|---|---|---|
| Cenários e Gherkin | `cenarios/`, neste repositório | contagem dos arquivos |
| Bugs | JIRA, com evidência anexada | relatório do próprio JIRA |
| Automação | `automacao/`, neste repositório | quantos cenários viraram teste automatizado |

Cada número tem **uma fonte só**, e nenhum depende de alguém lembrar de atualizar planilha.

### Cuidados com o JIRA gratuito
- Todo mundo é administrador — não existe permissão separada. Combinem quem mexe na configuração.
- Limite de 100 e-mails de notificação por dia.
- A Atlassian desativa site gratuito por inatividade. Como vamos usar toda semana, resolve sozinho.

---

## 2. Cenários e Gherkin — **GitHub** (este repositório)

Os cenários ficam em arquivos de texto, revisados por *pull request*. É assim que time de
automação de verdade guarda cenário: junto do código que os executa.

## 3. Automação — **Playwright com JavaScript**

Abre um navegador de verdade e faz o teste sozinho. Instalação em dois comandos, sem Java,
sem Docker, sem dia perdido configurando ambiente. Já vem com espera automática, print de
falha, gravação do que aconteceu e relatório pronto.

**Ninguém começa do zero.** O repositório vai ter um exemplo comentado linha por linha, e
haverá duas sessões de programação em par com o grupo.

## 4. Pipeline — **GitHub Actions**

Roda os testes sozinho, no mesmo lugar onde o código está. Gratuito e sem configuração extra.

## 5. Evidência de bug — **QA Recorder** *(a confirmar com o mentor)*

Ferramenta de gravação de sessão de teste, citada no enunciado da atividade. Não conseguimos
acessar o site dela para confirmar o que é — **alguém pergunta ao mentor** antes de descartar.
Print e vídeo comum resolvem enquanto isso.

## 6. Reunião — **Google Meet**

Gratuito, link fixo, e o limite de 60 minutos por chamada cabe folgado numa reunião de 45.

## 7. Ata, relatório e apresentação — **Google Docs e Slides**

Edição simultânea, sem ninguém mandando "a versão final" por WhatsApp.

---

## Resumo

Das sete frentes, **seis fecham sem discussão**. A única que depende do grupo é a de
automação — e não por dúvida técnica, mas porque depende de quem já mexeu com o quê.

Se a maioria do grupo já souber **Cypress**, dá para trocar sem drama: a divisão do trabalho e
os cenários continuam valendo. O que **não** dá é cada pessoa usar uma ferramenta diferente.
