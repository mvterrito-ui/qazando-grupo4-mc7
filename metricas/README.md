# Métricas

A atividade pede que a gente apresente números: quantos cenários levantamos, quantos bugs
achamos, quantos foram resolvidos. Este arquivo diz **quais números** e **de onde cada um sai**.

Uma pessoa do grupo fica responsável por atualizar isto e levar os números para a reunião.

---

## Os seis indicadores

| # | Indicador | De onde sai |
|---|---|---|
| 1 | Cenários levantados — total e por parte | contagem dos cenários nos arquivos de `cenarios/` |
| 2 | Cenários automatizados vs. manuais, e o % automatizado | quantos cenários viraram teste em `automacao/` |
| 3 | Bugs abertos — total, por parte e por severidade | ferramenta de gestão + `bugs/` |
| 4 | Bugs corrigidos e **retestados** — número e % do total | ferramenta de gestão |
| 5 | Bugs em aberto no fechamento, com justificativa | ferramenta de gestão |
| 6 | Execuções da pipeline — verdes vs. vermelhas | GitHub Actions |

Só estes. **Métrica que ninguém vai olhar na apresentação, a gente não coleta** — dá trabalho
de manter e não ajuda ninguém a decidir nada.

---

## Sobre o indicador 4

Repare que ele diz **corrigidos e retestados**, não só "corrigidos".

Bug marcado como corrigido que ninguém conferiu **não está corrigido** — está apenas marcado.
O número que vale na apresentação é o de bugs que alguém testou de novo e confirmou que o
conserto funcionou.

---

## Planilha de acompanhamento

Preencha a cada atualização. Copie a última linha e ajuste.

| Data | Cenários | Automatizados | % autom. | Bugs abertos | Corrigidos | Retestados | Pipeline verde |
|---|---|---|---|---|---|---|---|
| 26/08/2026 | 0 | 0 | 0% | 3 | 0 | 0 | — |
| 07/09/2026 | 58 | 45 | 78% | 5 | 0 | 0 | — |

*(Os 3 bugs iniciais são os que estão em [`../bugs/`](../bugs/), encontrados na exploração
inicial do produto.)*


### Nota sobre a linha de 07/09/2026

Os 58 cenários são **só da Parte 4** — são os únicos que já existem como `.feature`. As partes
1, 2 e 3 ainda estão em cenário-semente, que não conta pela regra acima, e nenhum foi marcado.

**Estes números foram verificados rodando contra o site**, não estimados: a suíte executa
46 testes verdes, 5 pulados e nenhuma falha. Os 13 cenários restantes são `@manual` — a
qualidade do texto gerado pela IA, a correspondência do áudio com a palavra, e os quatro de
gravação de voz, que o reconhecimento de fala do navegador não permite automatizar com
áudio sintético.

O `%` automatizado (78%) vai **cair** quando as outras partes entrarem, e isso é normal —
não é piora.

**Bugs subiram de 3 para 5** — os dois novos saíram justamente de rodar a automação:
[004](../bugs/004-controles-sem-nome-acessivel.md) e
[005](../bugs/005-microfone-negado-falha-em-silencio.md). E a pendência aberta do
[bug 002](../bugs/002-gerador-palavras-aceita-quantidade-invalida.md) desde 26/08 foi
respondida por teste.

Pipeline em `—` porque ainda não rodou nenhuma vez no GitHub Actions.

> ⚠️ **Sobre os indicadores 4 e 5.** O grupo não tem canal com quem desenvolve o English QA,
> então ninguém do outro lado vai corrigir os bugs reportados. É provável que "corrigidos" e
> "retestados" fechem em **zero** em 06/10 — e isso não é falha do grupo. Decidam antes da
> apresentação como explicar: *"reportamos N bugs com evidência documental; 0 corrigidos porque
> não temos canal com o time do produto"* é uma resposta legítima. Descobrir isso na véspera
> não é.

---

## Como contar cenário

Um **cenário** é cada bloco que começa com a palavra `Cenário:` dentro dos arquivos `.feature`.
Um arquivo `.feature` costuma ter vários.

Enquanto os `.feature` não existirem, conte os itens marcados como concluídos nas listas de
cenários-semente de cada parte, em `cenarios/parte-*/README.md`.
