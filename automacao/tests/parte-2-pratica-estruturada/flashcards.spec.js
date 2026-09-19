// ============================================================================
// Testes automatizados de Flashcards QA (/flashcards)
//
// Cenários em Gherkin cobertos:
//   cenarios/parte-2-pratica-estruturada/flashcards.feature
//   -> [FC-C01] Exibir estado inicial dos flashcards (FC-01, FC-04)
//   -> [FC-C02] Disponibilizar as três avaliações após revelar a tradução (FC-02)
//   -> [FC-C03] Preservar estado do card após sair e voltar (FC-05)
// ============================================================================

const { test, expect } = require('@playwright/test');
const { FlashcardsPage } = require('../../pages/parte-2-pratica-estruturada/flashcards.page');

test.describe('/flashcards - Flashcards QA (Repetição Espaçada)', () => {
  let flashcards;

  test.beforeEach(async ({ page }) => {
    flashcards = new FlashcardsPage(page);
    await flashcards.abrir();
  });

  // --------------------------------------------------------------------
  // CENÁRIO 1 (FC-C01) — Estado inicial dos flashcards
  // --------------------------------------------------------------------
  test('[FC-C01] Estado inicial — Exibir contadores de estatísticas e frente do card', async () => {
    // Valida que o título principal está visível
    await expect(flashcards.tituloPrincipal).toBeVisible();

    // Valida que os 3 contadores estão presentes no topo
    await expect(flashcards.contadorNaFila).toBeVisible();
    await expect(flashcards.contadorRevisados).toBeVisible();
    await expect(flashcards.contadorDominados).toBeVisible();

    // Valida que há cards na fila (valor numérico maior que zero)
    const naFila = await flashcards.obterTotalNaFila();
    expect(naFila).toBeGreaterThan(0);

    // Valida que a frente do card está apresentada com termo e ação de revelar
    await expect(flashcards.termoAtual).toBeVisible();
    await expect(flashcards.botaoMostrarTraducao).toBeVisible();

    // Valida que as opções de avaliação não estão visíveis antes de virar o card
    await expect(flashcards.botaoDificil).not.toBeVisible();
    await expect(flashcards.botaoMedio).not.toBeVisible();
    await expect(flashcards.botaoFacil).not.toBeVisible();
  });

  // --------------------------------------------------------------------
  // CENÁRIO 2 (FC-C02) — Disponibilizar avaliações após revelar
  // --------------------------------------------------------------------
  test('[FC-C02] Revelar tradução — Disponibilizar opções Difícil, Médio e Fácil', async () => {
    // Clica no botão para virar o card
    await flashcards.revelarTraducao();

    // Valida que o rótulo de Tradução fica visível
    await expect(flashcards.rotuloTraducao).toBeVisible();

    // Valida que os 3 botões de autoavaliação tornam-se visíveis e habilitados
    await expect(flashcards.botaoDificil).toBeVisible();
    await expect(flashcards.botaoDificil).toBeEnabled();

    await expect(flashcards.botaoMedio).toBeVisible();
    await expect(flashcards.botaoMedio).toBeEnabled();

    await expect(flashcards.botaoFacil).toBeVisible();
    await expect(flashcards.botaoFacil).toBeEnabled();

    // Valida que o botão inicial "Mostrar Tradução" deixou de ser exibido
    await expect(flashcards.botaoMostrarTraducao).not.toBeVisible();
  });

  // --------------------------------------------------------------------
  // CENÁRIO 3 (FC-C03) — Preservar estado após sair e voltar
  // --------------------------------------------------------------------
  test('[FC-C03] Persistência — Preservar contadores e o mesmo card após sair e voltar', async ({ page }) => {
    // Captura os valores dos 3 contadores antes da saída
    const naFilaAntes = await flashcards.obterTotalNaFila();
    const revisadosAntes = await flashcards.obterTotalRevisados();
    const dominadosAntes = await flashcards.obterTotalDominados();

    // Captura o termo/card atualmente apresentado antes da saída
    const termoAntes = await flashcards.obterTermoAtual();
    expect(termoAntes.length).toBeGreaterThan(0);

    // Navega para rota neutra (raiz '/')
    await page.goto('/');

    // Retorna para a tela de Flashcards
    await flashcards.abrir();

    // Aguarda a visibilidade do termo na tela antes das asserções síncronas
    await expect(flashcards.termoAtual).toBeVisible();

    // Valida que todos os contadores mantêm rigorosamente os mesmos valores
    expect(await flashcards.obterTotalNaFila()).toBe(naFilaAntes);
    expect(await flashcards.obterTotalRevisados()).toBe(revisadosAntes);
    expect(await flashcards.obterTotalDominados()).toBe(dominadosAntes);

    // Valida que o mesmo card/termo continua sendo apresentado
    expect(await flashcards.obterTermoAtual()).toBe(termoAntes);
  });
});
