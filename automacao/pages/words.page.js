// ============================================================================
// PAGE OBJECT -- /words (Gerador de Palavras)
//
// Por que existe: os seletores de uma tela ficam TODOS aqui, num lugar so.
// Quando o site mudar um botao, conserta-se este arquivo e os testes que usam
// a tela continuam valendo. Sem isso, o mesmo seletor aparece copiado em dez
// specs e a manutencao vira um dia perdido.
//
// Regra: page object descreve A TELA (o que da para fazer nela).
// Ele NAO contem expect -- afirmar e trabalho do teste, nao da tela.
// ============================================================================

const { esperarCarregamentoSumir } = require('../support/ia');

class WordsPage {
  constructor(page) {
    this.page = page;

    // SELETORES CONFERIDOS NA TELA REAL em 07/09/2026.
    //
    // Cuidado aqui: a tela NAO usa <label> ligado aos campos. Os textos
    // "Tema do vocabulario" e "Quantidade de palavras" sao <div> soltas, entao
    // getByLabel() nao encontra nada -- foi o que quebrou na primeira execucao.
    // E o placeholder do tema e "Ex: comida, animais, viagens...", que nao
    // contem a palavra "tema", entao getByPlaceholder(/tema/) tambem falha.
    //
    // O que sobra de estavel e o PAPEL do elemento. O formulario tem um campo
    // de texto e um numerico, e so.
    this.campoTema = page
      .getByRole('textbox')
      .or(page.getByPlaceholder(/Ex:.*comida|animais|viagens/i))
      .first();

    // Papel "spinbutton" = input[type=number]. Declara min="1" e max="100",
    // e a tela ainda exibe "Maximo: 100 palavras" -- mas nao aplica. Bug 002.
    this.campoQuantidade = page
      .getByRole('spinbutton')
      .or(page.locator('input[type="number"]'))
      .first();

    this.botaoGerar = page
      .getByRole('button', { name: /gerar/i })
      .first();

    // COMO SE CONTA UMA PALAVRA NESTA TELA
    //
    // Nao ha data-testid nem classe util nos cartoes. O que existe, e e melhor,
    // sao tres elementos que aparecem EXATAMENTE UMA VEZ POR PALAVRA e em
    // nenhum outro lugar da tela:
    //
    //   botao "Ouvir pronuncia"  -> 1 por palavra (regra 15, audio)
    //   "Exemplo em ingles:"     -> 1 por palavra (regra 14, frase exemplo)
    //   "Traducao:"              -> 1 por palavra (regra 14, traducao)
    //
    // Contar os tres separadamente e MELHOR que contar cartoes: se a IA devolver
    // uma palavra sem traducao, os numeros divergem e o teste acusa. Um seletor
    // de cartao unico esconderia isso.
    this.botoesDeAudio = page.getByRole('button', { name: /ouvir pron[uú]ncia/i });
    this.exemplosEmIngles = page.getByText(/exemplo em ingl[eê]s/i);
    this.traducoes = page.getByText(/tradu[cç][aã]o:/i);

    // A propria tela exibe um contador "Total". Vale confrontar o numero que
    // ela anuncia com o numero de palavras que ela realmente desenhou --
    // divergir entre os dois e bug, e so aparece para quem confere os dois.
    this.totalExibido = page
      .getByText('Total', { exact: true })
      .locator('xpath=following-sibling::*[1]');

    this.mensagemDeErro = page
      .getByRole('alert')
      .or(page.getByText(/limite|inv[aá]lid|obrigat[oó]ri|entre 1 e 100/i));
  }

  async abrir() {
    await this.page.goto('/words');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async informarTema(tema) {
    await this.campoTema.fill(tema);
  }

  /**
   * fill() com String() de proposito: fill so aceita string, e passar 0
   * (numero) resultaria em campo vazio em vez de "0" -- exatamente o valor
   * que precisamos testar no bug 002.
   */
  async informarQuantidade(quantidade) {
    await this.campoQuantidade.fill(String(quantidade));
  }

  async solicitarGeracao() {
    await this.botaoGerar.click();
  }

  /** Gera e espera a resposta da IA chegar. O caminho usado na maioria dos testes. */
  async gerar(tema, quantidade) {
    await this.informarTema(tema);
    await this.informarQuantidade(quantidade);
    await this.solicitarGeracao();
    await this.esperarPalavras();
  }

  /**
   * Espera as palavras aparecerem.
   *
   * Espera pelo PRIMEIRO cartao e depois o carregamento sumir. Nao usamos
   * waitForTimeout fixo: a IA leva de 2 a 30 segundos e qualquer numero
   * escolhido seria curto num dia e desperdicio no outro.
   */
  async esperarPalavras(timeout = 90000) {
    await this.botoesDeAudio.first().waitFor({ state: 'visible', timeout });
    await esperarCarregamentoSumir(this.page);
  }

  /** Quantas palavras a tela realmente desenhou. */
  async contarPalavras() {
    return this.botoesDeAudio.count();
  }

  /** O numero que a propria tela anuncia no contador "Total". */
  async totalAnunciado() {
    const txt = (await this.totalExibido.innerText()).trim();
    return Number.parseInt(txt, 10);
  }

  /** O botao esta clicavel? Usado nos cenarios de limite invalido. */
  async podeGerar() {
    return this.botaoGerar.isEnabled();
  }
}

module.exports = { WordsPage };
