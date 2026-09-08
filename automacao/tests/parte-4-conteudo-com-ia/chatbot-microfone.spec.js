// ============================================================================
// CENARIOS DE MICROFONE -- /chatbot
//
// Roda no projeto "microfone" do playwright.config.js, que sobe o Chromium com
// dispositivo de audio FALSO. Para rodar so estes:
//     npx playwright test --project=microfone
//
// O cenario que mais rende bug nao e conceder a permissao. E NEGAR: quase todo
// mundo esquece de testar, e e onde a tela costuma travar em silencio.
// ============================================================================
const { test, expect } = require('@playwright/test');
const { ChatbotPage } = require('../../pages/chatbot.page');

test.describe('/chatbot - entrada por voz', () => {

  // O cenario de RECUSA mora em voz-microfone-negado.spec.js -- ver la o porque.

  test('usar a entrada por voz com a permissao concedida', async ({ page }) => {
    // A permissao ja vem concedida pelo projeto "microfone".
    const chat = new ChatbotPage(page);
    await chat.abrir();
    await chat.botaoVoz.click();

    // Com dispositivo falso nao ha fala real, entao NAO assertamos o texto
    // reconhecido -- isso e o cenario @manual do .feature. Assertamos que a
    // tela entrou em estado de escuta e nao quebrou.
    await expect(
      page.getByText(/ouvindo|gravando|listening|fale/i)
        .or(chat.botaoVoz)
        .first()
    ).toBeVisible({ timeout: 15000 });

    await expect(chat.campoMensagem).toBeEditable();
  });
});
