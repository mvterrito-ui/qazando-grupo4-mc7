// ============================================================================
// PAGE OBJECT -- /exercises (Exercícios: Complete a Frase)
//
// Regra do projeto: Page Object descreve A TELA e seus seletores.
// NÃO contém expect -- asserções ficam nos arquivos .spec.js.
// ============================================================================

class ExercisesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators semânticos principais
    this.tituloPrincipal = page.getByRole('heading', { name: 'Complete a Frase' });
    this.indicadorQuestao = page.getByRole('heading', { name: /de 30/i });
    this.labelPercentualZero = page.getByText('0%');
    this.inputResposta = page.getByPlaceholder('Sua resposta aqui...');
    this.botaoVerificar = page.getByRole('button', { name: 'Verificar Resposta' });
    this.botaoRecomecar = page.getByRole('button', { name: 'Recomeçar' });

    // Seção de Histórico de Respostas
    this.secaoHistorico = page.getByRole('heading', { name: /Histórico de Respostas/i });
  }

  async abrir() {
    await this.page.goto('/exercises');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async responderQuestao(resposta) {
    await this.inputResposta.fill(resposta);
    await this.botaoVerificar.click();
  }

  async clicarRecomecar() {
    await this.botaoRecomecar.click();
  }

  /**
   * Localiza o card do histórico correspondente a uma frase específica
   * @param {string} fraseIngles
   */
  obterCardHistoricoPorFrase(fraseIngles) {
    return this.page
      .locator('main')
      .locator('div')
      .filter({ hasText: fraseIngles })
      .filter({ hasText: 'Você respondeu:' })
      .first();
  }
}

module.exports = { ExercisesPage };
