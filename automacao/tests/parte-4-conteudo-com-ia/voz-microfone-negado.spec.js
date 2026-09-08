// ============================================================================
// MICROFONE NEGADO -- o cenario que quase todo mundo esquece de testar.
//
// Roda no projeto "microfone-negado" do playwright.config.js, que sobe o
// navegador SEM a flag de conceder midia automaticamente e SEM permissao.
// Assim o getUserMedia e recusado de verdade.
//
//     npx playwright test --project=microfone-negado
//
// Por que arquivo separado: no projeto "microfone" a flag
// --use-fake-ui-for-media-stream concede a permissao no nivel do navegador, e
// clearPermissions() nao a desfaz. Um teste de recusa rodando la estaria, na
// verdade, testando o caminho feliz -- e passando por engano.
//
// O QUE SE ESPERA: um aviso legivel, e a tela continuando utilizavel pelo
// caminho de texto. O que NAO se aceita: nada acontecer.
// ============================================================================
const { test, expect } = require('@playwright/test');
const { ChatbotPage } = require('../../pages/chatbot.page');
const { PronunciationPage } = require('../../pages/pronunciation.page');

test.describe('microfone negado pelo navegador', () => {

  test('/chatbot avisa e continua funcionando por texto', async ({ page }) => {
    // BUG 005 em aberto: a tela nao avisa nada. test.fail() mantem o teste no
    // repositorio sem deixar a pipeline vermelha -- e ele vira VERMELHO no dia
    // em que o aviso for implementado, avisando que o comportamento mudou.
    // Quando o bug 005 for corrigido e retestado: apague esta linha.
    test.fail(true, 'Bug 005 em aberto: microfone negado nao gera aviso');

    const chat = new ChatbotPage(page);
    await chat.abrir();
    await chat.botaoVoz.click();

    await expect(
      chat.avisoMicrofone.first(),
      'A tela nao avisou que o microfone esta indisponivel'
    ).toBeVisible({ timeout: 20000 });

    // Negar o microfone nao pode inutilizar a tela inteira.
    await expect(chat.campoMensagem).toBeEditable();
    const antes = await chat.enviar('Still works by text');
    expect(await chat.contarRespostasDoMax()).toBe(antes + 1);
  });

  test('/pronunciation avisa e a tela continua respondendo', async ({ page }) => {
    test.fail(true, 'Bug 005 em aberto: microfone negado nao gera aviso');

    const fala = new PronunciationPage(page);
    await fala.abrir();
    await fala.gerarFrase();
    await fala.botaoGravar.click();

    await expect(
      fala.avisoMicrofone.first(),
      'A tela nao avisou que o microfone esta indisponivel'
    ).toBeVisible({ timeout: 20000 });

    await expect(fala.botaoNovaFrase).toBeEnabled();
  });
});
