// PAGE OBJECT -- /interview (Entrevistas)
const { esperarCarregamentoSumir, textoDoBlocoDe } = require('../support/ia');

class InterviewPage {
  constructor(page) {
    this.page = page;
    // Conferido na tela real em 07/09/2026.
    // O seletor anterior usava [class*="question"] e acabava casando com um
    // SVG -- daí o erro "Node is not an HTMLElement". Ancorar em texto e papel
    // evita isso: SVG nao tem papel de cabecalho nem de paragrafo.

    // O botao de gerar pergunta se chama so "Nova".
    this.botaoNovaPergunta = page.getByRole('button', { name: /^nova$/i })
      .or(page.getByRole('button', { name: /nova pergunta|gerar/i })).first();

    // COMO SE LOCALIZA UM BLOCO NESTA TELA
    //
    // Cada bloco tem um cabecalho ("PERGUNTA", "SUA RESPOSTA", "Analise e
    // Feedback", "Traducao em Portugues") e, logo abaixo, o conteudo. O
    // conteudo NAO tem tag fixa: as vezes e <p>, as vezes <div> com markdown
    // renderizado. Ancorar em following::p[1] quebrou por isso -- e pior,
    // chegou a casar com um paragrafo de outro bloco, dando falso verde.
    //
    // O que e estavel: o conteudo mora no MESMO container do cabecalho.
    // Entao subimos um nivel a partir do cabecalho. bloco() faz isso, e
    // textoDoBloco() devolve o conteudo ja sem o texto do proprio cabecalho.
    this.pergunta = bloco(page, /^pergunta$/i);

    this.campoResposta = page.getByRole('textbox').first();
    this.botaoEnviar = page.getByRole('button', { name: /enviar resposta/i })
      .or(page.getByRole('button', { name: /enviar|responder/i })).first();

    // O bloco de feedback so existe depois de responder.
    this.feedback = bloco(page, /an[aá]lise e feedback/i);

    // IMPORTANTE: a traducao NAO substitui o feedback. Ela aparece num bloco
    // NOVO, abaixo, com titulo proprio. Confundir os dois foi o que fez o teste
    // reclamar que "o feedback nao mudou" -- ele nao muda mesmo, e nem deveria.
    this.traducaoDoFeedback = bloco(page, /tradu[cç][aã]o em portugu[eê]s/i);

    this.botaoTraduzir = page
      .getByRole('button', { name: /traduzir|tradu[cç][aã]o|translate/i }).first();
  }

  async abrir() {
    await this.page.goto('/interview');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gerarPergunta() {
    await this.botaoNovaPergunta.click();
    await this.pergunta.waitFor({ state: 'visible', timeout: 90000 });
    await esperarCarregamentoSumir(this.page);
    return textoDoBloco(this.page, /^pergunta$/i);
  }

  async responder(texto) {
    await this.campoResposta.fill(texto);
    await this.botaoEnviar.click();
    await this.feedback.waitFor({ state: 'visible', timeout: 90000 });
    await esperarCarregamentoSumir(this.page);
    return textoDoBloco(this.page, /an[aá]lise e feedback/i);
  }

  /** Pede a traducao e devolve o texto do BLOCO TRADUZIDO (nao o feedback). */
  async traduzirFeedback() {
    await this.botaoTraduzir.click();
    await this.traducaoDoFeedback.waitFor({ state: 'visible', timeout: 90000 });
    await esperarCarregamentoSumir(this.page);
    return textoDoBloco(this.page, /tradu[cç][aã]o em portugu[eê]s/i);
  }

  /** O controle de traduzir ainda esta na tela? Some depois do primeiro uso. */
  async podeTraduzir() {
    return this.botaoTraduzir.isVisible().catch(() => false);
  }

  async podeEnviar() { return this.botaoEnviar.isEnabled(); }
}
/** O container que envolve o cabecalho -- e onde o conteudo do bloco mora. */
function bloco(page, regexTitulo) {
  return page.getByRole('heading', { name: regexTitulo }).locator('xpath=..');
}

/** O texto do bloco de um cabecalho. Delega para o ajudante compartilhado. */
async function textoDoBloco(page, regexTitulo, minimo = 20) {
  return textoDoBlocoDe(page.getByRole('heading', { name: regexTitulo }), minimo);
}

module.exports = { InterviewPage };
