# Bugs encontrados

Um arquivo por bug. O nome do arquivo segue o padrão `NNN-descricao-curta.md`, com o número
em sequência: `001-`, `002-`, `003-`...

Cada bug daqui também deve ser aberto na ferramenta de gestão. A divisão é esta, e não se mistura:

| | O repositório guarda | O Jira guarda |
|---|---|---|
| **o quê** | o que não muda | o que muda |
| | descrição, regra contrariada, evidência | aberto → corrigido → retestado → fechado |
| **por quê** | fica versionado, revisado em PR e legível sem conta no Jira | é de onde saem as métricas 3, 4 e 5 |

**Status não se escreve aqui.** Se ele existisse nos dois lugares, na primeira vez que um bug
mudasse de situação no Jira ninguém lembraria de editar o repositório também — e aí o
repositório passa a mentir. Cada fato tem uma fonte só. Para saber a situação de um bug, abra
o cartão dele no Jira, pelo link da tabela abaixo.

## Bugs já registrados

| # | Título | Parte | Severidade | Cartão no Jira |
|---|---|---|---|---|
| [001](001-usuarios-de-teste-nao-logam.md) | Usuários de teste da documentação não conseguem logar | 1 | Alta | SCRUM-5 |
| [002](002-gerador-palavras-aceita-quantidade-invalida.md) | Gerador de Palavras aceita quantidade fora do limite | 4 | Média | SCRUM-6 |
| [003](003-titulo-progresso-texto-residual.md) | Título da tela de progresso tem texto residual | 3 | Baixa | SCRUM-7 |
| [004](004-controles-sem-nome-acessivel.md) | Controles do chat não têm nome acessível | 4 | Média | SCRUM-8 |
| [005](005-microfone-negado-falha-em-silencio.md) | Microfone negado: a tela não avisa nada | 4 | Média | SCRUM-9 |
| [006](006-trilha-promete-25-xp-mas-credita-30.md) | Lição da Trilha promete +25 XP mas credita 30 XP | 2 | Média | SCRUM-34 |
| [007](007-trilha-conclui-licao-com-100-porcento-de-erros.md) | Trilha conclui lição e desbloqueia próxima fase com 100% de erros | 2 | Alta | SCRUM-35 |
| [008](008-duplo-clique-no-quiz-registra-resposta-duas-vezes.md) | Duplo clique no Quiz registra a resposta duas vezes e as três telas divergem | 3 | Média | *(a criar)* |
| [009](009-quiz-nao-credita-xp-por-acerto.md) | Acertos no Quiz não creditam XP | 3 | Média | *(a criar)* |
| [010](010-ranking-lista-quem-tem-menos-de-5-exercicios.md) | Ranking lista alunos com menos de 5 exercícios | 3 | Média | *(a criar)* |
| [011](011-ranking-ordena-por-taxa-e-nao-por-acertos.md) | Ranking ordena por taxa de acerto, e não por total de acertos | 3 | Média | *(a criar)* |
| [012](012-ranking-nao-exibe-email.md) | Ranking não exibe o e-mail, e nomes repetidos ficam indistinguíveis | 3 | Baixa | *(a criar)* |

> Os bugs 001 a 007 estão no Jira, no quadro do projeto (chave `SCRUM`), e **todos seguem em aberto**:
> o grupo não tem canal com quem desenvolve o English QA, então nenhum foi corrigido. Um bug só
> sai de aberto quando alguém corrige e o grupo retesta.
>
> Os bugs 008 a 012, da Parte 3, foram encontrados em 25/11/2026 e ainda precisam de cartão
> no Jira. Ao criar cada um, troque o *(a criar)* pela chave dele.


## Um padrão que já aparece duas vezes

Os bugs [002](002-gerador-palavras-aceita-quantidade-invalida.md) e
[005](005-microfone-negado-falha-em-silencio.md) são o mesmo tipo de defeito em telas
diferentes: **a operação falha e o usuário não é avisado**. Nos dois casos a pessoa clica,
espera, e não recebe nem resultado nem explicação.

Quando um padrão se repete, vale apontá-lo na apresentação — dois bugs isolados valem menos
que um problema sistêmico identificado.

## Modelo — copie para começar um bug novo

```markdown
# NNN — <título curto e direto>

**Parte:** <1, 2, 3 ou 4>
**Tela:** <endereço, ex: /words>
**Severidade:** <Alta / Média / Baixa>
**Encontrado por:** <seu nome>
**Data:** <DD/MM/AAAA>
**Cartão no Jira:** <link — crie o cartão e cole aqui>

## Descrição

CENÁRIO: <o que você tentou fazer>
DADO <como as coisas estavam>
QUANDO <o que você fez>
ENTÃO <o que deveria ter acontecido>

PROBLEMA IDENTIFICADO: <o que aconteceu de verdade>

## Regra contrariada

> <cole aqui a frase exata da página /docs que o sistema não está cumprindo>

## Evidência

<print, vídeo, ou a descrição do que se vê na tela>

## Observações

<o que ainda precisa ser confirmado, se for o caso>
```

## Lembretes

- **Sem evidência não é bug, é opinião.** Print ou vídeo sempre.
- **Sempre cite a regra da `/docs`.** Bug que aponta a regra contrariada não é discutido.
- **Um problema por arquivo.** Se você achou duas coisas, são dois bugs.
- **Na dúvida sobre severidade, escolha a menor** e explique o porquê. Exagerar severidade
  queima a credibilidade do grupo.
- **Não escreva a situação do bug aqui.** Ela vive no Jira, e só lá. Quando o bug for
  corrigido, o que muda no repositório é outra coisa: o teste automatizado que o cobria perde
  o `test.fail()` — ver [`automacao/README.md`](../automacao/README.md).
