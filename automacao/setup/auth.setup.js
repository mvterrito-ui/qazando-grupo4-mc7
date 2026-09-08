// ============================================================================
// LOGIN + PREMIUM -- roda UMA vez, antes de todos os testes.
//
// Esta e a peca compartilhada pelas QUATRO partes do projeto. Ela nao pertence
// a parte nenhuma: as quatro precisam de uma conta logada com premium ativo, e
// nenhuma e dona disso.
//
// Se cada pessoa escrever o proprio login, o grupo termina com quatro
// autenticacoes diferentes, quatro jeitos de esperar a tela e nenhuma
// reaproveitavel. Por isso: mexa aqui, nao copie isto para dentro do seu teste.
//
// O que acontece:
//   1. abre /auth e entra com a conta do .env
//   2. confere se o premium ja esta ativo; se nao, ativa com o codigo
//   3. salva a sessao em .auth/premium.json
//
// Todo teste depois disso comeca ja logado. Ninguem repete login.
// ============================================================================

const { test: setup, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ARQUIVO_SESSAO = path.resolve(__dirname, '../.auth/premium.json');

setup('autenticar e garantir premium', async ({ page }) => {
  const email = process.env.QA_EMAIL;
  const senha = process.env.QA_PASSWORD;
  const codigo = process.env.PREMIUM_CODE || 'QAZANDOENGLISH2025';

  // Falha cedo e com mensagem util. Sem isto, o erro apareceria la na frente
  // como "campo de email nao encontrado", que nao ajuda ninguem.
  if (!email || !senha) {
    throw new Error(
      'Faltam QA_EMAIL e QA_PASSWORD.\n' +
      'Rode: cp automacao/.env.example automacao/.env e preencha com a SUA conta.\n' +
      'Lembrando: as contas de teste da /docs nao funcionam -- ver bugs/001.'
    );
  }

  // --------------------------------------------------------------------
  // 1. Login
  // --------------------------------------------------------------------
  await page.goto('/auth');

  // getByLabel/getByPlaceholder em vez de #id ou .classe: seletor que descreve
  // o que a PESSOA ve sobrevive a mudanca de CSS. O .or() da alternativas para
  // o caso de a tela rotular o campo de outro jeito.
  // >>> CONFERIR na tela real com: npx playwright codegen
  const campoEmail = page
    .getByLabel(/e-?mail/i)
    .or(page.getByPlaceholder(/e-?mail/i))
    .or(page.locator('input[type="email"]'))
    .first();

  const campoSenha = page
    .getByLabel(/senha|password/i)
    .or(page.getByPlaceholder(/senha|password/i))
    .or(page.locator('input[type="password"]'))
    .first();

  await campoEmail.fill(email);
  await campoSenha.fill(senha);

  await page
    .getByRole('button', { name: /entrar|login|acessar/i })
    .first()
    .click();

  // Login deu certo quando saimos de /auth. Esperar a URL mudar e mais
  // confiavel que esperar um texto de boas-vindas, que muda com frequencia.
  await expect(page).not.toHaveURL(/\/auth/, { timeout: 30000 });

  // --------------------------------------------------------------------
  // 2. Premium
  // --------------------------------------------------------------------
  // Nao ativamos as cegas: se a conta ja tem premium, ativar de novo pode
  // levar a tela de erro e derrubar o setup inteiro. Testamos primeiro.
  const jaTemPremium = await temPremium(page);

  if (!jaTemPremium) {
    await page.goto('/activate-premium');

    const campoCodigo = page
      .getByLabel(/c[oó]digo/i)
      .or(page.getByPlaceholder(/c[oó]digo/i))
      .or(page.locator('input[type="text"]'))
      .first();

    await campoCodigo.fill(codigo);
    await page
      .getByRole('button', { name: /ativar|confirmar|validar/i })
      .first()
      .click();

    // Damos tempo da ativacao ser processada antes de reconferir.
    await page.waitForTimeout(2000);

    if (!(await temPremium(page))) {
      throw new Error(
        `Nao consegui ativar o premium com o codigo "${codigo}".\n` +
        'Confira o codigo na tela /activate-premium. Se ele mudou, atualize o .env\n' +
        'E se a tela recusou um codigo valido, isso e BUG -- abra em bugs/.'
      );
    }
  }

  // --------------------------------------------------------------------
  // 3. Salvar a sessao
  // --------------------------------------------------------------------
  fs.mkdirSync(path.dirname(ARQUIVO_SESSAO), { recursive: true });
  await page.context().storageState({ path: ARQUIVO_SESSAO });

  console.log(`\n  Sessao salva em ${ARQUIVO_SESSAO}`);
  console.log('  Os testes vao comecar ja logados e com premium.\n');
});

/**
 * Premium ativo? Tenta abrir uma rota que so premium enxerga.
 *
 * Se continuarmos na rota pedida, tem premium. Se formos jogados para
 * /activate-premium ou /auth, nao tem. Isso e a propria regra da /docs:
 * "Sem premium: acesso apenas a Documentacao e ao Ativar Premium".
 */
async function temPremium(page) {
  await page.goto('/words');
  await page.waitForLoadState('domcontentloaded');
  const url = page.url();
  return !/\/activate-premium|\/auth/.test(url);
}
