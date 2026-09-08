# Pauta — Reunião 2 · domingo, 30/08/2026, 20:00 (45 min)

**Presentes:** *(preencher)* — Denaide · Flavia · João Paulo · Marcos
**Objetivo da reunião:** fechar a semana 1 e destravar a semana 2. Sair com **nome em tudo**.

---

## Os dois números que mandam nesta reunião

| | |
|---|---|
| **11 dias** | até o marco duro de **07/09**: todos os cenários levantados e em Gherkin |
| **40 dias** | até a entrega — **06/10/2026, 20:00** |

Hoje temos **118 cenários-semente escritos e 0 arquivos `.feature`**. São ~30 cenários por
pessoa em 11 dias. É possível, mas só se a semana 2 começar na segunda-feira já sabendo quem
faz o quê. É para isso que esta reunião existe.

O plano já decidiu o que acontece se a semana 2 atrasar: **corta-se escopo, tira-se uma parte
inteira do ar** em vez de entregar quatro pela metade. Ninguém decide isso no dia 07 — decide-se
o critério hoje.

---

## Antes de entrar na chamada (15 min de cada um)

Sem isso a reunião vira consulta de status e some os 45 minutos.

- [ ] Abrir o repositório e confirmar que consegue ver: https://github.com/mvterrito-ui/qazando-grupo4-mc7
- [ ] Ter à mão o **seu usuário do GitHub** — sem ele você não consegue subir nada
- [ ] Confirmar que sua conta na plataforma está criada e com premium ativo (`QAZANDOENGLISH2025`)
- [ ] Ler a lista de cenários-semente da **sua** parte em `cenarios/parte-*/README.md`
- [ ] Chegar com uma resposta para: *"quantas horas por semana eu consigo dar até 06/10?"*

---

## Placar da semana 1 — o que dá para conferir no repositório

As 12 tarefas da semana 1 estão no plano (`docs/anexos/plano-com-cronograma.md`, §10).
Verificado em 27/08:

| # | Tarefa | Prazo | Situação |
|---|---|---|---|
| 4 | Criar o repositório e dar acesso a todos | qui 27/08 | ⚠️ criado em 26/08 — **só o Marcos tem acesso** |
| 11 | Página de métricas com os 6 indicadores | dom 30/08 | ✅ pronta em `metricas/` |
| 1 | Criar o site do Jira e convidar as 4 pessoas | **qui 27/08** | ❌ sem sinal de que exista |
| 5 | Esqueleto do Playwright com spec de exemplo | dom 30/08 | ❌ pasta `automacao/` não existe |
| 9 | 1h de exploratório e primeiros bugs | dom 30/08 | ❌ 0 sementes marcadas, 0 bugs novos desde 26/08 |
| 2, 3, 6, 12 | Fluxo do bug · 3 achados no Jira · pareamento · QA Recorder | — | ❌ pendentes |
| 7, 8, 10 | Conta e premium · ler `/docs` · agendar reunião | — | 🔎 **cada um responde por si na chamada** |

**Leitura honesta:** a semana 1 fecha com 1 tarefa concluída, 1 pela metade e o resto parado.
Não é falta de esforço — é que **oito dessas doze tarefas têm dono definido por um papel que
ninguém assumiu ainda**. É o primeiro bloco da pauta, e o mais importante.

---

## Os 45 minutos

### 1 · Placar da semana 1 — 5 min
Ler a tabela acima em voz alta. Cada um responde só pelas tarefas 7, 8 e 10 (conta com premium,
`/docs` lido, reunião no calendário).

> **Saída:** todo mundo olhando o mesmo placar. Sem discussão de culpa — o diagnóstico está
> no bloco 2.

---

### 2 · Os quatro papéis ganham nome — 10 min ⭐

Este é **o bloco que destrava a semana 2**. O plano distribui as tarefas por papel, e nenhum
papel tem dono registrado. Por isso oito tarefas não andaram: não eram de ninguém.

São quatro chapéus para quatro pessoas — **um por cabeça, e todo mundo leva um**. É trabalho
por cima da sua parte, mas é pouco: nenhum passa de ~1h por semana.

| Papel | O que faz | Quem |
|---|---|---|
| **Dono da ferramenta** | Cria o site do Jira, convida os 4, define o fluxo do bug, abre os 3 achados | |
| **Guardião das métricas** | Atualiza os 6 indicadores toda sexta e traz os números para a reunião | |
| **Ata e comunicação** | Escreve a ata de cada reunião, mantém o Meet no calendário, coordena a apresentação da semana 6 | |
| **Arquitetura** | Sobe o esqueleto do Playwright, a pipeline e a spec de exemplo; conduz os 2 pareamentos | |

**Sugestão para não gastar os 10 minutos decidindo:** *Arquitetura* vai para quem tem mais
experiência com automação — pelo registro do sorteio, o Marcos. Os outros três se dividem como
preferirem; nenhum dos três exige conhecimento técnico prévio.

E o papel de **Ata** começa a valer agora: quem assumir escreve a ata desta reunião **e** a da
reunião 1, que está faltando.

> **Saída:** a tabela acima preenchida com quatro nomes, e commitada no repositório antes de
> todo mundo sair da chamada.

---

### 3 · Acesso ao repositório — 5 min

Ninguém além do Marcos consegue subir nada. Enquanto isso durar, o combinado de
*"toda alteração passa por revisão de outra pessoa"* é fisicamente impossível — e o entregável
de automação não tem como ser feito a quatro mãos.

Cada um dita o seu **usuário do GitHub** na chamada. O Marcos adiciona os três como
colaboradores ali mesmo, com a tela compartilhada. Leva dois minutos.

Aproveitar para combinar como se sobe alteração: branch própria → pull request → **um** revisor
→ merge. Revisão em rodízio, ninguém vira gargalo.

> **Saída:** três colaboradores adicionados, ao vivo. Não fica "para depois da reunião".

---

### 4 · Automação: Playwright fica, ou vira Cypress? — 5 min

O plano deixou essa porta aberta de propósito: *"se a maioria já souber Cypress, troca-se sem
drama"*. Mas ela precisa **fechar hoje** — a semana 3 cobra pipeline verde, e não dá para
montar pipeline de uma ferramenta que ainda está em votação.

Pergunta única, resposta de uma palavra por pessoa: *"você já escreveu teste automatizado em
alguma dessas duas?"*

- Se ninguém já mexeu com nenhuma → **fica Playwright** (é o que tem arquitetura pronta para doar).
- Se a maioria já usou Cypress → **troca**, e o dono da Arquitetura refaz o esqueleto nesta semana.

O que não vale é cada pessoa usar uma.

> **Saída:** ferramenta decidida e escrita na ata. Não se reabre.

---

### 5 · O marco duro de 07/09 — 10 min

118 cenários-semente, 4 pessoas, 11 dias. A conta por pessoa:

| Parte | Responsável | Sementes | Por dia |
|---|---|---|---|
| 1 — Acesso e Permissão | Flavia | 27 | ~2,5 |
| 2 — Prática Estruturada | João Paulo | 27 | ~2,5 |
| 3 — Pontuação e Comparação | Denaide | 23 | ~2 |
| 4 — Conteúdo com IA | Marcos | 41 | ~4 |

Três coisas para acertar aqui:

**a) A semente não é o cenário.** As 118 saíram da leitura da `/docs` — são teoria. Cada uma
precisa ser confirmada no produto antes de virar `.feature`. E a exploração vai **aumentar** a
lista, não diminuir. Contem com isso.

**b) A Parte 1 vem primeiro.** As outras três dependem de conta com premium funcionando. A
Flavia entrega antes — não porque trabalha mais, mas porque o resto do grupo está esperando.

**c) O critério de corte, decidido hoje e não no dia 07.** O plano diz para cortar a Parte 4
primeiro, por ser a mais rasa por tela. Só que ela é também a parte de quem carrega a
Arquitetura, e a que define como o grupo trata teste de IA — cortar ela não é de graça.
**Decidam agora**: se em 07/09 o Gherkin não estiver fechado, corta-se a Parte 4 inteira, ou
corta-se a metade menos crítica de cada uma das quatro?

> **Saída:** meta diária por pessoa aceita em voz alta, e o critério de corte escrito na ata.

---

### 6 · Severidade e "cenário pronto" — 5 min

Ficou explicitamente adiado da reunião 1 para esta. Duas definições curtas:

**Severidade** — proposta, para aprovar ou ajustar:
- **Alta** — impede o uso da funcionalidade, ou contraria uma regra da `/docs` numa tela principal
- **Média** — funciona, mas errado: cálculo torto, validação que não valida, estado que não persiste
- **Baixa** — incomoda mas não impede: texto errado, layout, detalhe visual

Na dúvida, **escolha a menor e explique o porquê**. Exagerar severidade queima a credibilidade
do grupo na apresentação.

**Cenário pronto** significa, cumulativamente: está em `.feature`, cita a regra da `/docs` que
cobre, foi confirmado no produto de verdade, e passou pela revisão de outra pessoa em pull request.

> **Saída:** as duas definições escritas em `docs/`, valendo para os quatro.

---

### 7 · Jira e os pendentes vencidos — 5 min

O Jira venceu em 27/08 e é de onde saem **três dos seis indicadores de métrica**. Sem ele, a
apresentação final fica sem número de bug aberto, corrigido e retestado.

- Quem cria e até quando (proposta: **terça, 01/09**, para não comer a semana 2 inteira)
- Fluxo de status do bug: Aberto → Em correção → Corrigido → Retestado → Fechado
- Os 3 achados de `bugs/` entram no Jira junto com a criação
- **QA Recorder:** alguém já perguntou ao mentor? Se não, quem pergunta e quando. Se não houver
  resposta até a reunião 3, descarta-se e segue com print e vídeo comum.

> **Saída:** data e nome para cada item. E o 1º pareamento de automação marcado no calendário.

---

## O que NÃO entra nesta reunião

Para proteger os 45 minutos:

- Discutir qual bug é mais importante — isso é trabalho do dono da parte, não de reunião
- Revisar cenário linha a linha — isso acontece no pull request
- Rediscutir a divisão em 4 partes ou o sorteio — está fechado e registrado
- Escolher ferramenta de apresentação — semana 6

---

## Como esta pauta vira ata

Quem assumir o papel de **Ata** copia este arquivo para `2026-08-30-reuniao-2.md`, preenche
os presentes, substitui cada bloco "Saída" pelo que foi realmente decidido, e sobe por pull
request na mesma noite. Enquanto não subir, pelo nosso próprio combinado, a reunião não aconteceu.

---

## Se sobrar tempo

Ninguém precisa puxar assunto para preencher 45 minutos. **Se a pauta fechar em 30, encerra-se
em 30** — e os 15 que sobraram viram exploração da própria parte, que é o que está faltando.
