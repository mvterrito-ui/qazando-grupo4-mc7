// ============================================================================
// PAGE OBJECT -- /progress (Meu Progresso)
//
// A tela tem dois blocos com os mesmos quatro numeros:
//   "Estatisticas de Frases"   -> vem dos Exercicios (regra 5)
//   "Estatisticas de Palavras" -> vem do Quiz        (regra 6)
// Cada numero e um <p> logo abaixo do seu rotulo. Nao ha data-testid, entao
// lemos o texto da tela e procuramos o numero que vem depois de cada rotulo.
// ============================================================================

class ProgressPage {
  constructor(page) {
    this.page = page;
    this.principal = page.locator('main');
    this.titulo = page.getByRole('heading', { level: 1 });
    this.blocoFrases = page.getByRole('heading', { name: /estat[ií]sticas de frases/i });
    this.blocoPalavras = page.getByRole('heading', { name: /estat[ií]sticas de palavras/i });
    this.linkNoMenu = page.getByRole('link', { name: 'Meu Progresso' });
  }

  async abrir() {
    await this.page.goto('/progress');
    await this.esperarCarregar();
  }

  /** Vai para a tela pelo menu lateral, SEM recarregar a pagina (regra 8). */
  async abrirPeloMenu() {
    await this.linkNoMenu.click();
    await this.esperarCarregar();
  }

  async esperarCarregar() {
    // So devolve quando os numeros ja chegaram -- antes disso o bloco aparece vazio.
    // A taxa pode ter casa decimal ("33.3%"), entao o numero aceita ponto.
    await this.principal.filter({ hasText: /Acerto em Palavras \(%\)\s*[\d.]+%/ }).waitFor({ timeout: 30000 });
  }

  /**
   * { respondidas, corretas, incorretas, taxa } de um bloco: 'Frases' ou 'Palavras'.
   * A taxa vem como a tela mostra: inteira quando a conta e exata ("30%"), com
   * uma casa decimal quando nao e ("33.3%").
   */
  async bloco(tipo) {
    const t = await this.principal.innerText();
    const num = (rotulo) => {
      const m = t.match(new RegExp(`${rotulo}\\s*\\n\\s*([\\d.]+)`, 'i'));
      return m ? parseFloat(m[1]) : null;
    };
    return {
      respondidas: num(`${tipo} Respondidas`),
      corretas: num(`${tipo} Corretas`),
      incorretas: num(`${tipo} Incorretas`),
      taxa: num(`Acerto em ${tipo} \\(%\\)`),
    };
  }

  async frases() { return this.bloco('Frases'); }
  async palavras() { return this.bloco('Palavras'); }
}

module.exports = { ProgressPage };
