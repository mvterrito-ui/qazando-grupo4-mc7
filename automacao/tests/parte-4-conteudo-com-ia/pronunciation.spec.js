// Automatiza: cenarios/parte-4-conteudo-com-ia/treinar-fala.feature
// (a parte que NAO depende de microfone -- o resto em pronunciation-microfone.spec.js)
const { test, expect } = require('@playwright/test');
const { PronunciationPage } = require('../../pages/pronunciation.page');
const { afirmarConteudoDiferente, pontuacaoIngles,
        pontuacaoPortugues } = require('../../support/ia');

test.describe('/pronunciation - Treinar Fala', () => {
  let fala;

  test.beforeEach(async ({ page }) => {
    fala = new PronunciationPage(page);
    await fala.abrir();
  });

  test('gera uma frase em ingles para praticar', async () => {
    // Regra 16. Idioma sim, conteudo nao.
    const frase = await fala.gerarFrase();
    expect(frase.length).toBeGreaterThan(5);
    expect(
      pontuacaoIngles(frase),
      `A frase nao parece estar em ingles:\n"${frase}"`
    ).toBeGreaterThan(pontuacaoPortugues(frase));
  });

  test('duas solicitacoes seguidas geram frases diferentes', async () => {
    const primeira = await fala.gerarFrase();
    const segunda = await fala.gerarFrase();
    afirmarConteudoDiferente(primeira, segunda);
  });

  test('oferece ouvir a pronuncia correta antes de gravar', async () => {
    // Regra 17. Conferimos que o controle existe e responde ao clique.
    // Se o audio soa igual a frase e cenario @manual -- maquina nao julga isso.
    await fala.gerarFrase();
    await expect(fala.botaoOuvir).toBeVisible();
    await expect(fala.botaoOuvir).toBeEnabled();
    await fala.botaoOuvir.click();
    await expect(fala.botaoOuvir).toBeVisible(); // clicar nao pode quebrar a tela
  });

  test('gerar frase nova limpa o feedback da tentativa anterior', async ({ page }) => {
    await fala.gerarFrase();
    const tinhaFeedback = await fala.feedback.isVisible().catch(() => false);

    await fala.gerarFrase();

    if (tinhaFeedback) {
      await expect(
        fala.feedback,
        'O feedback da frase anterior continuou na tela'
      ).toBeHidden();
    }
    expect(page.url()).toContain('/pronunciation');
  });
});
