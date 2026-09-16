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

    // Contadores do topo (XP Total, Completadas, Sequência)
    this.contadorXp = page.locator('div.text-center').filter({ hasText: /XP Total/i });
    this.contadorCompletadas = page.locator('div.text-center').filter({ hasText: /Completadas/i });
    this.contadorSequencia = page.locator('div.text-center').filter({ hasText: /Sequência/i });

    // Seletores de status das lições
    this.botoesBloqueados = page.locator('button[disabled]');
    this.cardsBloqueados = page.locator('.rounded-lg').filter({ hasText: /Bloqueado/i });
    this.cardsCompletados = page.locator('.rounded-lg').filter({ hasText: /Completado/i });

    // Botão de início exibido apenas quando uma lição liberada é aberta
    this.botaoComecar = page.getByRole('button', { name: /^começar$/i });

    // Navegação e autenticação
    this.botaoSair = page.getByRole('button', { name: /sair/i }).first();
    this.campoEmail = page
      .getByLabel(/e-?mail/i)
      .or(page.getByPlaceholder(/e-?mail/i))
      .or(page.locator('input[type="email"]'))
      .first();
    this.campoSenha = page
      .getByLabel(/senha|password/i)
      .or(page.getByPlaceholder(/senha|password/i))
      .or(page.locator('input[type="password"]'))
      .first();
    this.botaoEntrar = page.getByRole('button', { name: /entrar|login|acessar/i }).first();
  }

  async abrir() {
    await this.page.goto('/duolingo');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async recarregar() {
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navegarParaOutraRota(rota = '/exercises') {
    await this.page.goto(rota);
    await this.page.waitForLoadState('domcontentloaded');
  }

  unidade(numero) {
    return this.page.getByText(new RegExp(`Unidade ${numero}`, 'i')).first();
  }

  licao(numero) {
    return this.page.getByText(new RegExp(`Lição ${numero}`, 'i')).first();
  }

  primeiraLicaoBloqueada() {
    return this.botoesBloqueados.first();
  }

  primeiroCardBloqueado() {
    return this.cardsBloqueados.first();
  }

  async clicarCardBloqueado() {
    await this.primeiroCardBloqueado().click();
  }

  async obterXpTotal() {
    const texto = await this.contadorXp.innerText();
    const match = texto.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async obterLicoesCompletadas() {
    const texto = await this.contadorCompletadas.innerText();
    const match = texto.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async obterSequencia() {
    const texto = await this.contadorSequencia.innerText();
    const match = texto.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async contarLicoesCompletadas() {
    return await this.cardsCompletados.count();
  }

  async contarLicoesBloqueadas() {
    return await this.cardsBloqueados.count();
  }

  async logout() {
    await this.botaoSair.click();
    await this.page.waitForURL(/\/auth/, { timeout: 15000 });
  }

  async fazerLogin(email, senha) {
    await this.campoEmail.fill(email);
    await this.campoSenha.fill(senha);
    await this.botaoEntrar.click();
    await this.page.waitForURL(url => !url.pathname.includes('/auth'), { timeout: 30000 });
  }
}

module.exports = { TrilhaPage };
