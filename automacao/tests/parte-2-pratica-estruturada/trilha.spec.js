// ============================================================================
// Testes automatizados da Trilha do Inglês (/duolingo)
//
// Cenário em Gherkin coberto:
//   cenarios/parte-2-pratica-estruturada/trilha.feature
//   -> Cenário: Visualizar 4 unidades progressivas na trilha (T01)
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
});
