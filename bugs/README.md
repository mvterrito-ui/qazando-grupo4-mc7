# Bugs encontrados

Um arquivo por bug. O nome do arquivo segue o padrão `NNN-descricao-curta.md`, com o número
em sequência: `001-`, `002-`, `003-`...

Cada bug daqui também deve ser aberto na ferramenta de gestão. Este repositório guarda o texto;
a ferramenta guarda o andamento (aberto, corrigido, retestado, fechado).

## Bugs já registrados

| # | Título | Parte | Severidade | Situação |
|---|---|---|---|---|
| [001](001-usuarios-de-teste-nao-logam.md) | Usuários de teste da documentação não conseguem logar | 1 | Alta | Aberto |
| [002](002-gerador-palavras-aceita-quantidade-invalida.md) | Gerador de Palavras aceita quantidade fora do limite | 4 | Média | Aberto |
| [003](003-titulo-progresso-texto-residual.md) | Título da tela de progresso tem texto residual | 3 | Baixa | Aberto |

## Modelo — copie para começar um bug novo

```markdown
# NNN — <título curto e direto>

**Parte:** <1, 2, 3 ou 4>
**Tela:** <endereço, ex: /words>
**Severidade:** <Alta / Média / Baixa>
**Encontrado por:** <seu nome>
**Data:** <DD/MM/AAAA>
**Situação:** Aberto

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
