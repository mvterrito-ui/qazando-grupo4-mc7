// PAGE OBJECT -- /stories (Historinhas)
//
// Seletores conferidos na tela real em 07/09/2026.
// O padrao da aplicacao inteira: os rotulos ("Tema da historia") sao <div>
// soltas, nao <label> ligados ao campo, e o placeholder comeca com "Ex:".
// Por isso getByLabel e getByPlaceholder(/tema/) nao funcionam aqui --
// o que resta estavel e o PAPEL do elemento.
const { esperarCarregamentoSumir } = require('../support/ia');

class StoriesPage {
  constructor(page) {
    this.page = page;
    this.campoTema = page.getByRole('textbox').first();
    this.botaoGerar = page.getByRole('button', { name: /gerar hist[oó]ria/i })
      .or(page.getByRole('button', { name: /gerar|criar/i })).first();

    // A tela mostra dois blocos: a historia em ingles e a traducao em portugues.
    // Nenhum dos dois tem id, classe util ou titulo proprio -- os cabecalhos
    // acima deles vem vazios na arvore de acessibilidade.
    //
    // O que os distingue e a POSICAO: os dois aparecem, nessa ordem, depois do
    // titulo "Sua Historia Esta Pronta!". Entao ancoramos nesse titulo e
    // pegamos os paragrafos seguintes. O primeiro e o ingles, o segundo a
    // traducao -- que e exatamente o que a regra 2 da /docs promete.
    const depoisDoTitulo = page
      .getByRole('heading', { name: /hist[oó]ria est[aá] pronta/i })
      .locator('xpath=following::p');

    this.historia = depoisDoTitulo.nth(0);
    this.traducao = depoisDoTitulo.nth(1);

    this.mensagemDeErro = page.getByRole('alert')
      .or(page.getByText(/obrigat[oó]ri|inv[aá]lid|informe/i));
  }

  async abrir() {
    await this.page.goto('/stories');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gerar(tema) {
    await this.campoTema.fill(tema);
    await this.botaoGerar.click();
    await this.historia.waitFor({ state: 'visible', timeout: 90000 });
    await esperarCarregamentoSumir(this.page);
  }

  async textoDaHistoria() { return (await this.historia.innerText()).trim(); }
  async textoDaTraducao() { return (await this.traducao.innerText()).trim(); }
  async podeGerar() { return this.botaoGerar.isEnabled(); }
}
module.exports = { StoriesPage };
