// ============================================================================
// Testes automatizados da Trilha do Inglês (/duolingo)
//
// Cenários em Gherkin cobertos:
//   cenarios/parte-2-pratica-estruturada/trilha.feature
//   -> Cenário: Visualizar 4 unidades progressivas na trilha (T01)
//   -> Cenário: Impedir o acesso direto a uma lição bloqueada (T04)
//   -> Cenário: O contador de lições completadas mantém o valor após recarregar a página (T10)
//   -> Cenário: O progresso da lição desbloqueada persiste após sair e voltar (T08)
//   -> Cenário: O saldo de XP acumulado persiste após sair da plataforma (T09)
// ============================================================================

const { test, expect } = require('@playwright/test');
const { TrilhaPage } = require('../../pages/parte-2-pratica-estruturada/trilha.page');

test.describe('/duolingo - Trilha do Inglês', () => {
  let trilha;

  test.beforeEach(async ({ page }) => {
    trilha = new TrilhaPage(page);
    await trilha.abrir();
  });

  // --------------------------------------------------------------------
  // CENÁRIO 1 (T01)
  // --------------------------------------------------------------------
  test('Cenário 1: visualiza 4 unidades progressivas na trilha', async () => {
    // Regra 1 da /docs: "4 unidades progressivas, com lições dentro de cada uma"
    await expect(trilha.unidade(1)).toBeVisible();
    await expect(trilha.unidade(2)).toBeVisible();
    await expect(trilha.unidade(3)).toBeVisible();
    await expect(trilha.unidade(4)).toBeVisible();
  });

  // --------------------------------------------------------------------
  // CENÁRIO 4 (T04)
  // --------------------------------------------------------------------
  test('Cenário 4: impedir o acesso direto a uma lição bloqueada', async ({ page }) => {
    // 1. Validação semântica: o botão de acesso à lição bloqueada está visível e nativamente desabilitado
    const botaoBloqueado = trilha.primeiraLicaoBloqueada();
    await expect(botaoBloqueado).toBeVisible();
    await expect(botaoBloqueado).toBeDisabled();

    // 2. Validação visual: o card exibe o indicativo explícito de "Bloqueado"
    const cardBloqueado = trilha.primeiroCardBloqueado();
    await expect(cardBloqueado).toBeVisible();

    // 3. Interação real: usuário clica na área da lição bloqueada (card)
    await trilha.clicarCardBloqueado();

    // 4. Regra: o sistema deve se manter na trilha e não iniciar a lição
    await expect(page).toHaveURL(/\/duolingo/);
    await expect(trilha.botaoComecar).not.toBeVisible();
  });

  // --------------------------------------------------------------------
  // CENÁRIO 10 (T10) - Persistência no reload (F5)
  // --------------------------------------------------------------------
  test('Cenário 10: contadores e estado da trilha mantêm o valor após recarregar a página (F5)', async () => {
    // Captura estado antes do reload
    const xpAntes = await trilha.obterXpTotal();
    const completadasAntes = await trilha.obterLicoesCompletadas();
    const sequenciaAntes = await trilha.obterSequencia();
    const totalCardsCompletadosAntes = await trilha.contarLicoesCompletadas();
    const totalCardsBloqueadosAntes = await trilha.contarLicoesBloqueadas();

    // Executa recarregamento da página (F5)
    await trilha.recarregar();

    // Valida que todos os contadores do cabeçalho mantiveram seus valores
    expect(await trilha.obterXpTotal()).toBe(xpAntes);
    expect(await trilha.obterLicoesCompletadas()).toBe(completadasAntes);
    expect(await trilha.obterSequencia()).toBe(sequenciaAntes);

    // Valida que a distribuição de lições concluídas e bloqueadas na trilha permaneceu idêntica
    expect(await trilha.contarLicoesCompletadas()).toBe(totalCardsCompletadosAntes);
    expect(await trilha.contarLicoesBloqueadas()).toBe(totalCardsBloqueadosAntes);
  });

  // --------------------------------------------------------------------
  // CENÁRIO 8 (T08) - Persistência entre rotas
  // --------------------------------------------------------------------
  test('Cenário 8: o progresso da trilha persiste após sair da tela e voltar', async ({ page }) => {
    // Captura o estado das lições e do progresso na trilha
    const totalCompletadasAntes = await trilha.contarLicoesCompletadas();
    const totalBloqueadasAntes = await trilha.contarLicoesBloqueadas();
    const xpAntes = await trilha.obterXpTotal();

    // Navega para outra rota da aplicação (ex: Exercícios)
    await trilha.navegarParaOutraRota('/exercises');
    await expect(page).toHaveURL(/\/exercises/);

    // Retorna para a Trilha do Inglês
    await trilha.abrir();
    await expect(page).toHaveURL(/\/duolingo/);

    // Regra 4: o sistema deve lembrar do estado salvo
    expect(await trilha.contarLicoesCompletadas()).toBe(totalCompletadasAntes);
    expect(await trilha.contarLicoesBloqueadas()).toBe(totalBloqueadasAntes);
    expect(await trilha.obterXpTotal()).toBe(xpAntes);
  });

  // --------------------------------------------------------------------
  // CENÁRIO 9 (T09) - Persistência após logout e login
  // --------------------------------------------------------------------
  test('Cenário 9: saldo de XP e progresso persistem após logout e novo login', async ({ page }) => {
    const email = process.env.QA_EMAIL?.trim();
    const senha = process.env.QA_PASSWORD?.trim();
    expect(email, 'QA_EMAIL deve estar configurado no .env').toBeTruthy();
    expect(senha, 'QA_PASSWORD deve estar configurado no .env').toBeTruthy();

    // Captura saldo de XP e lições completadas antes de sair
    const xpAntes = await trilha.obterXpTotal();
    const completadasAntes = await trilha.obterLicoesCompletadas();

    // Efetua logout da plataforma
    await trilha.logout();
    await expect(page).toHaveURL(/\/auth/);

    // Refaz login com a conta do usuário
    await trilha.fazerLogin(email, senha);

    // Acessa novamente a Trilha do Inglês
    await trilha.abrir();

    // Regra 4: o saldo e progresso exibidos devem ser idênticos ao acumulado anteriormente
    expect(await trilha.obterXpTotal()).toBe(xpAntes);
    expect(await trilha.obterLicoesCompletadas()).toBe(completadasAntes);
  });
});
