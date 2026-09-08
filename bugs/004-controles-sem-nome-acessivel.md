# 004 — Controles do chat não têm nome acessível

**Parte:** 4 — Conteúdo com IA
**Tela:** `/chatbot`
**Severidade:** Média
**Encontrado por:** Marcos Vinicio Territo (automação)
**Data:** 07/09/2026
**Cartão no Jira:** *(a criar)*

## Descrição

```
CENÁRIO: Usar a tela Falar com Max por leitor de tela
DADO que sou uma pessoa que navega por leitor de tela
QUANDO chego ao botão que envia a mensagem
ENTÃO o leitor deveria anunciar o que aquele botão faz

PROBLEMA IDENTIFICADO: o botão de enviar não tem texto, nem `aria-label`, nem
título. Na árvore de acessibilidade ele aparece apenas como "button", sem nome
nenhum. O leitor de tela anuncia "botão" e a pessoa não tem como saber o que
ele faz. O mesmo vale para a imagem do avatar animado, que não tem texto
alternativo.
```

## Regra contrariada

Não há regra na `/docs` sobre acessibilidade — este bug **não** se apoia nela.
Apoia-se no [WCAG 2.1, critério 4.1.2 (Nome, Função, Valor)](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value),
que exige que todo controle de interface tenha um nome acessível.

Registrado assim de propósito: bug que não contraria a `/docs` é discutível, e a
pessoa que reportar precisa saber disso ao defender o achado.

## Evidência

Árvore de acessibilidade da tela `/chatbot`, capturada pelo Playwright:

```
- textbox "Type your message in English..."
- button "Gravar áudio"
- button                    <-- o botão de enviar, sem nome
```

E depois de ligar o avatar:

```
- img                       <-- o avatar, sem texto alternativo
```

Comparar com os vizinhos, que estão corretos: "Gravar áudio", "Nova Conversa" e
"Avatar" todos têm nome.

## Impacto no nosso próprio trabalho

Isto atrapalhou a automação antes de atrapalhar qualquer usuário. Um teste não
consegue localizar o botão de enviar por nome — foi preciso ancorá-lo no vizinho
("o botão logo depois de *Gravar áudio*"), o que é frágil: muda a ordem dos
botões e o teste quebra. Ver `automacao/pages/chatbot.page.js`.

Pelo mesmo motivo, o cenário "o avatar aparece e some" **não pôde ser
automatizado** e virou `@manual` no `falar-com-max.feature`: sem nome nem texto
alternativo, não há como uma máquina afirmar que o avatar apareceu.

## Correção sugerida

`aria-label="Enviar mensagem"` no botão de enviar, e `alt` descritivo na imagem
do avatar. São duas linhas.

## Observações

**Severidade Média**, seguindo o combinado de escolher a menor na dúvida: a tela
funciona para quem enxerga e usa mouse. Mas para quem depende de leitor de tela,
a função principal da tela fica inutilizável.
