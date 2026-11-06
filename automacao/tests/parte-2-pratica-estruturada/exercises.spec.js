// ============================================================================
// Testes automatizados de Exercícios (/exercises)
//
// Cenários em Gherkin cobertos:
//   cenarios/parte-2-pratica-estruturada/exercicios.feature
//   -> [EX-C01] Exibir estado inicial e total dos exercícios (EX-01, EX-05)
//   -> [EX-C02] Retomar exercícios após sair e voltar (EX-02)
//   -> [EX-C03] Exibir respostas realizadas no histórico (EX-04)
//   -> [EX-C04] Recomeçar os exercícios (EX-03, EX-05)
// ============================================================================

const { test, expect } = require('@playwright/test');
const { ExercisesPage } = require('../../pages/parte-2-pratica-estruturada/exercises.page');
const dados = require('../../data/parte-2-pratica-estruturada/exercises.data.json');

test.describe.serial('/exercises - Exercícios (Complete a Frase)', () => {
  let exercises;

  test.beforeEach(async ({ page }) => {
    exercises = new ExercisesPage(page);
    await exercises.abrir();
  });

  // --------------------------------------------------------------------
  // CENÁRIO 1 (EX-C01) — Estado inicial
  // --------------------------------------------------------------------
  test('[EX-C01] Estado inicial — Iniciar na questão 1 de 30 com 0% e sem histórico', async () => {
    // Valida que inicia na questão 1 de 30
    await expect(exercises.indicadorQuestao).toHaveText(/1\s*de\s*30/);

    // Valida indicador de progresso inicial em 0%
    await expect(exercises.labelPercentualZero).toBeVisible();

    // Valida campo de resposta disponível e vazio
    await expect(exercises.inputResposta).toBeVisible();
    await expect(exercises.inputResposta).toHaveValue('');

    // Valida que não há histórico renderizado inicialmente
    await expect(exercises.secaoHistorico).not.toBeVisible();
  });

  // --------------------------------------------------------------------
  // CENÁRIO 2 (EX-C02) — Retomada após saída
  // --------------------------------------------------------------------
  test('[EX-C02] Retomada após saída — Preservar questão atual após navegar para outra rota e retornar', async ({ page }) => {
    // Responde corretamente à questão 1
    await exercises.responderQuestao(dados.questao1.respostaCorreta);

    // Valida que avançou para a questão 2 de 30
    await expect(exercises.indicadorQuestao).toHaveText(/2\s*de\s*30/);

    // Navega para outra rota (/duolingo) permanecendo na mesma sessão
    await page.goto('/duolingo');
    await expect(page.getByRole('heading', { name: 'Trilha do Inglês' })).toBeVisible();

    // Retorna para /exercises
    await exercises.abrir();

    // Valida que o progresso foi preservado na questão 2 de 30
    await expect(exercises.indicadorQuestao).toHaveText(/2\s*de\s*30/);
  });

  // --------------------------------------------------------------------
  // CENÁRIO 3 (EX-C03) — Histórico visível
  // --------------------------------------------------------------------
  test('[EX-C03] Histórico visível — Exibir respostas anteriores com frase, resposta e status', async () => {
    // Valida que a seção de histórico está visível
    await expect(exercises.secaoHistorico).toBeVisible();

    // Localiza o card específico do histórico encapsulado via POM
    const cardHistorico = exercises.obterCardHistoricoPorFrase(dados.questao1.fraseIngles);
    await expect(cardHistorico).toBeVisible();

    // Valida frase, resposta do usuário e status "Correto" estritamente no card da questão
    await expect(cardHistorico.getByText(dados.questao1.fraseIngles)).toBeVisible();
    await expect(cardHistorico.getByText(`Você respondeu: ${dados.questao1.respostaCorreta}`)).toBeVisible();
    await expect(cardHistorico.getByText('Correto')).toBeVisible();
  });

  // --------------------------------------------------------------------
  // CENÁRIO 4 (EX-C04) — Recomeçar exercícios
  // --------------------------------------------------------------------
  test('[EX-C04] Recomeçar exercícios — Restaurar estado inicial na questão 1 de 30 com 0% e sem histórico', async () => {
    // Aciona a ação Recomeçar
    await expect(exercises.botaoRecomecar).toBeVisible();
    await exercises.clicarRecomecar();

    // Valida restauração completa do estado inicial
    await expect(exercises.indicadorQuestao).toHaveText(/1\s*de\s*30/);
    await expect(exercises.labelPercentualZero).toBeVisible();
    await expect(exercises.inputResposta).toBeVisible();
    await expect(exercises.inputResposta).toHaveValue('');
    await expect(exercises.secaoHistorico).not.toBeVisible();
    await expect(exercises.botaoRecomecar).not.toBeVisible();
  });
});
