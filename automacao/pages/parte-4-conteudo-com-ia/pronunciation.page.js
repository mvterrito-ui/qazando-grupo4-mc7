// PAGE OBJECT -- /pronunciation (Treinar Fala)
// A tela mais tecnica do projeto: depende de microfone.
const { esperarCarregamentoSumir } = require('../../support/ia');

class PronunciationPage {
  constructor(page) {
    this.page = page;
    // Conferido na tela real em 07/09/2026.
    this.botaoNovaFrase = page.getByRole('button', { name: /gerar outra frase/i })
      .or(page.getByRole('button', { name: /nova frase|gerar/i })).first();

    // A frase em ingles e o primeiro paragrafo depois do titulo do bloco.
    // (Logo abaixo dela a tela ainda mostra a traducao em portugues, que nao
    // e o que queremos aqui -- por isso [1], o primeiro.)
    this.frase = page
      .getByRole('heading', { name: /sua frase de pr[aá]tica/i })
      .locator('xpath=following::p[1]');

    this.botaoOuvir = page.getByRole('button', { name: /ouvir pron[uú]ncia/i })
      .or(page.getByRole('button', { name: /ouvir|escutar/i })).first();

    // Enquanto o audio toca, o MESMO botao troca o texto para "Reproduzindo..."
    // e fica desabilitado. Ele so volta a "Ouvir" quando o navegador avisa que o
    // audio terminou -- e a tela nao trata erro: sem voz instalada, nao volta.
    this.botaoReproduzindo = page.getByRole('button', { name: /reproduzindo/i });

    // O botao de gravar se chama "Falar Agora e Receber Feedback".
    this.botaoGravar = page.getByRole('button', { name: /falar agora/i })
      .or(page.getByRole('button', { name: /gravar|record/i })).first();

    // Durante a gravacao o proprio botao troca de texto para parar.
    this.botaoParar = page
      .getByRole('button', { name: /parar|stop|encerrar|finalizar/i }).first();

    this.feedback = page
      .getByRole('heading', { name: /feedback|resultado|an[aá]lise/i })
      .locator('xpath=..');
    this.avisoMicrofone = page.getByRole('alert')
      .or(page.getByText(/microfone|permiss[aã]o|n[aã]o dispon[ií]vel|negad/i));
  }

  async abrir() {
    await this.page.goto('/pronunciation');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gerarFrase() {
    await this.botaoNovaFrase.click();
    await this.frase.waitFor({ state: 'visible', timeout: 90000 });
    await esperarCarregamentoSumir(this.page);
    return (await this.frase.innerText()).trim();
  }

  /**
   * Quantas vozes de sintese o navegador tem. A lista carrega de forma
   * assincrona, entao espera o evento "voiceschanged" por ate 3 segundos.
   * No runner Linux do GitHub Actions costuma ser 0.
   */
  async vozesDisponiveis() {
    return this.page.evaluate(() => new Promise((resolve) => {
      if (!('speechSynthesis' in window)) return resolve(0);
      const agora = window.speechSynthesis.getVoices().length;
      if (agora > 0) return resolve(agora);
      const fim = setTimeout(() => resolve(window.speechSynthesis.getVoices().length), 3000);
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        clearTimeout(fim);
        resolve(window.speechSynthesis.getVoices().length);
      }, { once: true });
    }));
  }

  /** Grava por alguns segundos e encerra. O audio vem do dispositivo falso
   *  configurado no projeto "microfone" -- ver README, secao Microfone. */
  async gravar(segundos = 3) {
    await this.botaoGravar.click();
    await this.page.waitForTimeout(segundos * 1000);
    await this.botaoParar.click();
  }

  async esperarFeedback() {
    await this.feedback.waitFor({ state: 'visible', timeout: 90000 });
    await esperarCarregamentoSumir(this.page);
    return (await this.feedback.innerText()).trim();
  }
}
module.exports = { PronunciationPage };
