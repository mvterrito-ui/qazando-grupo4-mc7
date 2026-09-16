// ============================================================================
// PAGE OBJECT -- /duolingo (Trilha do Inglês)
//
// Regra do projeto: Page Object descreve A TELA e seus seletores.
// NÃO contém expect -- asserções ficam nos arquivos .spec.js.
// ============================================================================

class TrilhaPage {
  constructor(page) {
    this.page = page;

    // Seletor das unidades da trilha
    this.unidades = page.getByText(/Unidade \d/i);
  }

  async abrir() {
    await this.page.goto('/duolingo');
    await this.page.waitForLoadState('domcontentloaded');
  }

  unidade(numero) {
    return this.page.getByText(new RegExp(`Unidade ${numero}`, 'i')).first();
  }
}

module.exports = { TrilhaPage };
