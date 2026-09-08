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
| [001](001-usuarios-de-teste-nao-logam.md) | Usuários de teste da documentação não conseguem logar | 1 | Alta | *(a criar)* |
| [002](002-gerador-palavras-aceita-quantidade-invalida.md) | Gerador de Palavras aceita quantidade fora do limite | 4 | Média | *(a criar)* |
| [003](003-titulo-progresso-texto-residual.md) | Título da tela de progresso tem texto residual | 3 | Baixa | *(a criar)* |
| [004](004-controles-sem-nome-acessivel.md) | Controles do chat não têm nome acessível | 4 | Média | *(a criar)* |
| [005](005-microfone-negado-falha-em-silencio.md) | Microfone negado: a tela não avisa nada | 4 | Média | *(a criar)* |

> Nenhum foi aberto no Jira ainda — é a tarefa 3 da semana 1. Ao criar cada cartão,
> troque o *(a criar)* pelo link dele.


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
