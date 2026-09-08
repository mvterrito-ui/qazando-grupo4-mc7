// PAGE OBJECT -- /chatbot (Falar com Max)
// Uma das duas telas com microfone. Os testes de voz rodam no projeto
// "microfone" do playwright.config.js, que usa dispositivo falso.
const { expect } = require('@playwright/test');
const { esperarCarregamentoSumir, textoDoBlocoDe } = require('../support/ia');

class ChatbotPage {
  constructor(page) {
    this.page = page;
    // Conferido na tela real em 07/09/2026.
    this.campoMensagem = page.getByRole('textbox').first();

    // ATENCAO -- o botao de enviar NAO TEM NOME ACESSIVEL. Ele e um botao so
    // com icone, sem aria-label e sem texto, entao aparece na arvore de
    // acessibilidade como um "button" anonimo. getByRole('button', {name:...})
    // nunca vai encontra-lo.
    //
    // Isso e um problema de acessibilidade do produto, nao so do teste: quem
    // usa leitor de tela ouve "botao" e nao sabe o que ele faz. Reportado em
    // bugs/004.
    //
    // Enquanto nao for corrigido, ancoramos no vizinho: e o botao logo depois
    // do "Gravar audio", que esse sim tem nome.
    this.botaoEnviar = page.getByRole('button', { name: /enviar|send/i })
      .or(
        page.getByRole('button', { name: /gravar [aá]udio/i })
          .locator('xpath=following-sibling::button[1]')
      )
      .first();

    // COMO SE CONTA UMA MENSAGEM NESTA TELA
    //
    // As bolhas nao tem testid nem classe util. O que existe, e serve melhor:
    // cada resposta do Max traz ao lado um botao "Traduzir para portugues"
    // -- um por resposta, e em nenhum outro lugar da tela.
    //
    // Entao contamos as RESPOSTAS DO MAX por esses botoes, e conferimos as
    // MINHAS mensagens pelo proprio texto que enviei. Nao ha necessidade de um
    // seletor generico de bolha, que seria fragil.
    this.respostasDoMax = page.getByRole('button', { name: /traduzir/i });

    // O rotulo do bloco traduzido. Serve de contador: uma traducao, um rotulo.
    this.traducoes = page.getByText(/tradu[cç][aã]o pt-?br/i);

    this.botaoNovaConversa = page.getByRole('button', { name: /nova conversa/i })
      .or(page.getByRole('button', { name: /limpar|new chat/i })).first();
    // Regra 11: "mensagens podem ser traduzidas sob demanda". O controle fica
    // na propria bolha, por isso o localizador parte de uma mensagem.
    this.botaoTraduzir = page.getByRole('button', { name: /traduzir|tradu[cç][aã]o|translate/i });
    this.botaoVoz = page.getByRole('button', { name: /gravar [aá]udio/i })
      .or(page.getByRole('button', { name: /voz|microfone|falar/i })).first();
    this.botaoAvatar = page.getByRole('button', { name: /^avatar$/i })
      .or(page.getByRole('button', { name: /avatar/i })).first();
    this.avatar = page.getByTestId('avatar').or(page.locator('[class*="avatar"]')).first();
    this.avisoMicrofone = page.getByRole('alert')
      .or(page.getByText(/microfone|permiss[aã]o|n[aã]o dispon[ií]vel|negad/i));
  }

  async abrir() {
    await this.page.goto('/chatbot');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async contarRespostasDoMax() { return this.respostasDoMax.count(); }

  /**
   * Envia a mensagem e espera o Max responder.
   *
   * Esperamos o CONTADOR crescer, nao um texto especifico -- o que o Max
   * responde muda toda vez, e assertar o conteudo seria justamente o erro
   * que a regra de ouro proibe.
   */
  async enviar(texto) {
    const antes = await this.contarRespostasDoMax();
    await this.campoMensagem.fill(texto);
    await this.botaoEnviar.click();
    await expect(this.respostasDoMax).toHaveCount(antes + 1, { timeout: 90000 });
    await esperarCarregamentoSumir(this.page);
    return antes;
  }

  /** O texto da ultima resposta do Max: o paragrafo irmao do botao traduzir. */
  async ultimaRespostaDoMax() {
    return textoDoBlocoDe(this.respostasDoMax.last(), 5);
  }

  /**
   * Traduz a ultima resposta e devolve o texto TRADUZIDO.
   *
   * A traducao NAO substitui a mensagem: aparece num bloco novo, rotulado
   * "Traducao PT-BR", logo abaixo da resposta original. Ler a bolha original
   * depois de traduzir devolve o mesmo texto de antes -- foi o que fez o teste
   * reclamar que "a mensagem nao mudou". Ela nao muda mesmo.
   */
  async traduzirUltimaResposta() {
    const antes = await this.ultimaRespostaDoMax();
    const qtdAntes = await this.traducoes.count();

    await this.respostasDoMax.last().click();
    await expect(this.traducoes).toHaveCount(qtdAntes + 1, { timeout: 90000 });
    await esperarCarregamentoSumir(this.page);

    const depois = await textoDoBlocoDe(this.traducoes.last());
    return { antes, depois };
  }

  async podeEnviar() { return this.botaoEnviar.isEnabled(); }

}
module.exports = { ChatbotPage };
