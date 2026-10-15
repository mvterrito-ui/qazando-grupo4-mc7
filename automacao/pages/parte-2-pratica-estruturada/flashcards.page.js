// ============================================================================
// PAGE OBJECT -- /flashcards (Flashcards QA: Repetição Espaçada)
//
// Regra do projeto: Page Object descreve A TELA e seus seletores.
// NÃO contém expect -- asserções ficam nos arquivos .spec.js.
// ============================================================================

class FlashcardsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Cabeçalho e título
    this.tituloPrincipal = page.getByRole('heading', { name: 'Flashcards QA' });

    // Contadores de estatísticas do topo
    this.contadorNaFila = page.locator('div.text-center').filter({ hasText: /Na fila/i });
    this.contadorRevisados = page.locator('div.text-center').filter({ hasText: /Revisados hoje/i });
    this.contadorDominados = page.locator('div.text-center').filter({ hasText: /Dominados/i });

    // Elementos do Card (Frente)
    this.termoAtual = page.locator('main p.font-bold').first();
    this.botaoMostrarTraducao = page.getByRole('button', { name: 'Mostrar Tradução' });

    // Elementos do Card (Verso)
    this.rotuloTraducao = page.getByText('Tradução', { exact: true });
    this.botaoDificil = page.getByRole('button', { name: /Difícil/i });
    this.botaoMedio = page.getByRole('button', { name: /Médio/i });
    this.botaoFacil = page.getByRole('button', { name: /Fácil/i });
  }

  async abrir() {
    await this.page.goto('/flashcards');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async revelarTraducao() {
    await this.botaoMostrarTraducao.click();
  }

  async obterTermoAtual() {
    return (await this.termoAtual.innerText()).trim();
  }

  async obterTotalNaFila() {
    const texto = await this.contadorNaFila.innerText();
    const match = texto.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async obterTotalRevisados() {
    const texto = await this.contadorRevisados.innerText();
    const match = texto.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async obterTotalDominados() {
    const texto = await this.contadorDominados.innerText();
    const match = texto.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}

module.exports = { FlashcardsPage };
