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

*(Os 3 bugs iniciais são os que estão em [`../bugs/`](../bugs/), encontrados na exploração
inicial do produto.)*

---

## Como contar cenário

Um **cenário** é cada bloco que começa com a palavra `Cenário:` dentro dos arquivos `.feature`.
Um arquivo `.feature` costuma ter vários.

Enquanto os `.feature` não existirem, conte os itens marcados como concluídos nas listas de
cenários-semente de cada parte, em `cenarios/parte-*/README.md`.
