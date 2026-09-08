// Automatiza: cenarios/parte-4-conteudo-com-ia/historinhas.feature
// Comentado de forma resumida -- o exemplo explicado linha a linha e words.spec.js
const { test, expect } = require('@playwright/test');
const { StoriesPage } = require('../../pages/stories.page');
const { esperarTextoNaoVazio, afirmarIdiomas, afirmarConteudoDiferente,
        esperarCarregamentoSumir, apareceu } = require('../../support/ia');

test.describe('/stories - Historinhas', () => {
  let stories;

  test.beforeEach(async ({ page }) => {
    stories = new StoriesPage(page);
    await stories.abrir();
  });

  test('gera uma historia a partir de um tema', async () => {
    await stories.gerar('a day in the life of a QA analyst');
    // Nao assertamos o enredo. Assertamos que veio texto de verdade nos dois blocos.
    await esperarTextoNaoVazio(stories.historia, 40);
    await esperarTextoNaoVazio(stories.traducao, 40);
  });

  test('a historia vem em ingles e a traducao em portugues', async () => {
    // Regra 2 da /docs. A verificacao e COMPARATIVA: o bloco da historia tem de
    // parecer mais ingles que o da traducao, e vice-versa. Uma nota absoluta
    // quebraria num texto curto sem que houvesse bug. Ver support/ia.js.
    await stories.gerar('software testing');
    afirmarIdiomas(await stories.textoDaHistoria(), await stories.textoDaTraducao());
  });

  test('o carregamento aparece e some ao final', async ({ page }) => {
    // Conferido na tela real: enquanto gera, o botao troca o texto para
    // "Criando sua historia magica..." e o campo de tema fica desabilitado.
    // Assertar ESSE sinal e melhor que caçar um spinner generico -- e o que
    // a pessoa de fato ve, e some sozinho quando a historia chega.
    await stories.campoTema.fill('bug hunting');
    await stories.botaoGerar.click();

    const botaoCriando = page.getByRole('button', { name: /criando/i });
    await expect(botaoCriando, 'A tela nao indicou que estava gerando').toBeVisible();
    await expect(stories.campoTema, 'O campo deveria travar durante a geracao').toBeDisabled();

    await stories.historia.waitFor({ state: 'visible', timeout: 90000 });

    await expect(
      botaoCriando,
      'O botao continuou dizendo "Criando..." depois de a historia aparecer'
    ).toBeHidden();
    await expect(stories.campoTema).toBeEditable();
  });

  test('duas solicitacoes com o mesmo tema geram historias diferentes', async () => {
    // Regra 4: "nova historia gerada a cada solicitacao".
    // Este e o unico jeito honesto de provar a regra sem assertar conteudo:
    // mesmo tema, duas vezes, e o resultado tem de ser OUTRO.
    await stories.gerar('automation testing');
    const primeira = await stories.textoDaHistoria();

    await stories.gerar('automation testing');
    const segunda = await stories.textoDaHistoria();

    afirmarConteudoDiferente(primeira, segunda);
  });

  test('recusa a geracao com o tema vazio', async () => {
    await stories.campoTema.fill('');
    if (await stories.podeGerar()) {
      await stories.botaoGerar.click();
      await expect(stories.mensagemDeErro.first()).toBeVisible();
    } else {
      expect(await stories.podeGerar()).toBe(false);
    }
  });

  test('aceita um tema de um unico caractere', async () => {
    // A /docs nao proibe tema curto. Entao duas saidas sao validas: gerar,
    // ou avisar. O teste recusa apenas a terceira -- travar sem dizer nada.
    await stories.campoTema.fill('a');
    await stories.botaoGerar.click();

    const gerou = await apareceu(stories.historia);
    const avisou = await stories.mensagemDeErro.first().isVisible().catch(() => false);
    expect(gerou || avisou, 'A tela nao gerou nada e tambem nao avisou o porque').toBe(true);
  });

  test('aguenta um tema muito longo sem travar', async ({ page }) => {
    await stories.campoTema.fill('software testing '.repeat(120)); // ~2000 caracteres
    await stories.botaoGerar.click();

    const gerou = await apareceu(stories.historia);
    const avisou = await stories.mensagemDeErro.first().isVisible().catch(() => false);
    expect(gerou || avisou, 'Tema longo travou a tela: nao gerou e nao avisou').toBe(true);

    // "Nao travar" tem de ser verificavel: a pagina ainda responde a interacao.
    await expect(stories.campoTema).toBeEditable();
    expect(page.url()).toContain('/stories');
  });

  test('aceita o tema escrito em ingles', async () => {
    await stories.gerar('quality assurance career');
    await esperarTextoNaoVazio(stories.historia, 40);
    await esperarTextoNaoVazio(stories.traducao, 40);
  });
});
