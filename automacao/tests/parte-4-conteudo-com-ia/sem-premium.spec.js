// ============================================================================
// Regra 3 da /docs: "Requer acesso premium"
// Cenario: historinhas.feature > "Uma conta sem premium nao acessa as Historinhas"
//
// Este e o unico teste da Parte 4 que NAO comeca logado com premium -- por isso
// mora em arquivo separado. O test.use() abaixo descarta a sessao salva pelo
// setup e o teste faz o proprio login, com a segunda conta.
//
// PRECISA DE UMA SEGUNDA CONTA, sem premium ativado. Preencha no .env:
//     QA_EMAIL_SEM_PREMIUM=
//     QA_PASSWORD_SEM_PREMIUM=
// Sem ela o teste e PULADO, nao falha -- ninguem deve ficar com pipeline
// vermelha por nao ter criado uma conta extra ainda.
//
// NOTA PARA A PARTE 1: o bloqueio de rota premium e responsabilidade da Flavia,
// que precisa cobrir as 10 rotas premium. Este teste cobre so /stories, que e
// da Parte 4. Ele serve de modelo para o teste dela.
// ============================================================================

const { test, expect } = require('@playwright/test');

// storageState: undefined descarta a sessao premium herdada do projeto.
test.use({ storageState: undefined });

test.describe('/stories - bloqueio sem premium', () => {

  test('uma conta sem premium nao acessa as Historinhas', async ({ page }) => {
    const email = process.env.QA_EMAIL_SEM_PREMIUM;
    const senha = process.env.QA_PASSWORD_SEM_PREMIUM;

    test.skip(
      !email || !senha,
      'Sem conta sem-premium no .env (QA_EMAIL_SEM_PREMIUM). Crie uma em /auth e NAO ative o premium.'
    );

    // 1. Login com a conta comum
    await page.goto('/auth');
    await page.getByLabel(/e-?mail/i)
      .or(page.getByPlaceholder(/e-?mail/i))
      .or(page.locator('input[type="email"]'))
      .first().fill(email);
    await page.getByLabel(/senha|password/i)
      .or(page.getByPlaceholder(/senha|password/i))
      .or(page.locator('input[type="password"]'))
      .first().fill(senha);
    await page.getByRole('button', { name: /entrar|login|acessar/i }).first().click();
    await expect(page).not.toHaveURL(/\/auth/, { timeout: 30000 });

    // 2. Tenta abrir a rota premium DIGITANDO O ENDERECO DIRETO.
    //    Este e o ponto do teste: nao adianta so esconder o link do menu.
    //    Bloqueio que so some da navegacao nao e bloqueio.
    await page.goto('/stories');
    await page.waitForLoadState('domcontentloaded');

    // 3. A regra da /docs: "sem premium, acesso apenas a Documentacao e ao
    //    Ativar Premium". Entao ou fomos redirecionados, ou ha um aviso claro.
    const foiRedirecionado = /\/activate-premium|\/auth|\/docs/.test(page.url());
    const viuAviso = await page
      .getByText(/premium|ative|acesso restrito|assinatura/i)
      .first().isVisible().catch(() => false);

    expect(
      foiRedirecionado || viuAviso,
      `Conta SEM premium abriu /stories sem bloqueio nenhum. URL: ${page.url()}`
    ).toBe(true);

    // 4. E, principalmente: nao pode dar para GERAR historia.
    const botaoGerar = page.getByRole('button', { name: /gerar|criar/i }).first();
    if (await botaoGerar.isVisible().catch(() => false)) {
      expect(
        await botaoGerar.isEnabled(),
        'A tela ofereceu gerar historia para quem nao tem premium'
      ).toBe(false);
    }
  });
});
