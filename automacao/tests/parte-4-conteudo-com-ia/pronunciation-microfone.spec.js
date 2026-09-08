// ============================================================================
// GRAVACAO DE VOZ -- /pronunciation
//
// ESTES TESTES ESTAO PULADOS, DE PROPOSITO. Leia antes de "consertar".
//
// A tela usa o reconhecimento de fala do proprio navegador. Verificado em
// 07/09/2026: ao clicar em "Falar Agora e Receber Feedback" com o dispositivo
// de audio FALSO do Playwright, a tela nao muda de estado -- nao aparece botao
// de parar, nao aparece indicador de gravacao, nada. O reconhecimento de fala
// do Chromium headless nao funciona com audio sintetico.
//
// Isso NAO e bug do produto: e limitacao do ambiente de automacao. Reportar
// como bug seria erro -- o recurso funciona para uma pessoa de verdade falando
// num microfone de verdade.
//
// Entao estes quatro cenarios ficam como TESTE MANUAL, e estao marcados
// @manual no treinar-fala.feature. E a mesma decisao que se toma sobre a
// qualidade do texto gerado pela IA: quando a maquina nao consegue julgar com
// honestidade, quem julga e uma pessoa.
//
// O que JA e automatizado desta tela, e passa, esta em:
//   pronunciation.spec.js        (gerar frase, idioma, ouvir pronuncia)
//   voz-microfone-negado.spec.js (o caminho ruim -- bug 005)
//
// SE VOCE QUISER TENTAR AUTOMATIZAR: injete um WAV mono 16 bits real com
// --use-file-for-fake-audio-capture (ver README, secao Microfone) e rode
// removendo o test.skip abaixo. Se funcionar, atualize este comentario.
// ============================================================================

const { test, expect } = require('@playwright/test');
const { PronunciationPage } = require('../../pages/pronunciation.page');
const { apareceu } = require('../../support/ia');

test.describe('/pronunciation - gravacao de voz', () => {

  // Ver o cabecalho deste arquivo: reconhecimento de fala nao roda com audio
  // sintetico em headless. Cenarios cobertos por teste manual.
  test.skip(true, 'Reconhecimento de fala nao funciona com dispositivo de audio falso -- coberto por teste manual');


  // O cenario de RECUSA mora em voz-microfone-negado.spec.js -- ver la o porque.

  test('gravar a voz devolve feedback', async ({ page }) => {
    // Regra 18. Com dispositivo falso, o audio e sintetico -- por isso NAO
    // assertamos a nota nem o texto reconhecido. Assertamos que o ciclo
    // gravar -> parar -> feedback se completou.
    const fala = new PronunciationPage(page);
    await fala.abrir();
    await fala.gerarFrase();

    await fala.gravar(3);
    const feedback = await fala.esperarFeedback();

    expect(feedback.length, 'O feedback veio vazio apos a gravacao').toBeGreaterThan(5);
  });

  test('o indicador de analise aparece e some quando o feedback chega', async ({ page }) => {
    const fala = new PronunciationPage(page);
    await fala.abrir();
    await fala.gerarFrase();

    await fala.gravar(3);
    await fala.esperarFeedback();

    await expect(
      page.getByText(/analisando|processando|carregando|aguarde/i).first(),
      'O indicador continuou girando depois de o feedback aparecer'
    ).toBeHidden();
  });

  test('o feedback mostra o reconhecido e o esperado', async ({ page }) => {
    // Regra 19: "o feedback mostra o que foi reconhecido vs. o que era esperado".
    // Assertamos que os DOIS lados da comparacao aparecem -- nao o valor deles.
    const fala = new PronunciationPage(page);
    await fala.abrir();
    const frase = await fala.gerarFrase();

    await fala.gravar(3);
    await fala.esperarFeedback();

    await expect(
      page.getByText(/reconhecid|voc[eê] disse|recognized|ouvi/i).first(),
      'O feedback nao mostra o que foi RECONHECIDO'
    ).toBeVisible();

    await expect(
      page.getByText(/esperad|expected|correto|original/i).or(page.getByText(frase)).first(),
      'O feedback nao mostra o que era ESPERADO'
    ).toBeVisible();
  });

  test('gravar em silencio nao trava a tela', async ({ page }) => {
    // O dispositivo falso sem arquivo de audio produz silencio -- e exatamente
    // o cenario "gravei sem falar nada". Duas saidas validas: feedback vazio
    // ou aviso. Invalida: a tela parar de responder.
    const fala = new PronunciationPage(page);
    await fala.abrir();
    await fala.gerarFrase();

    await fala.gravar(2);

    const veioFeedback = await apareceu(fala.feedback, 60000);
    const veioAviso = await page.getByText(/n[aã]o reconhec|nada foi|tente novamente|sil[eê]ncio/i)
      .first().isVisible().catch(() => false);

    expect(
      veioFeedback || veioAviso,
      'Gravacao em silencio: a tela nao deu feedback e nao avisou nada'
    ).toBe(true);
    await expect(fala.botaoNovaFrase).toBeEnabled();
  });
});
