// ============================================================================
// Testes automatizados do Ranking (/ranking)
//
// Cenarios em Gherkin cobertos:
//   cenarios/parte-3-pontuacao-e-comparacao/ranking.feature
//   (todos, menos o @manual sobre privacidade do e-mail)
//
// Este arquivo SO LE a tela -- nao responde nada, nao muda massa. Por isso
// pode rodar em paralelo com qualquer outro.
//
// O ranking tem todos os alunos da plataforma e muda a qualquer momento.
// Nenhum teste aqui confere valor fixo: cada um confere uma REGRA que tem de
// valer para todas as linhas. Quando falha, a mensagem lista as linhas que
// quebram a regra -- e essa lista e a evidencia do bug.
// ============================================================================

const { test, expect } = require('@playwright/test');
const { RankingPage } = require('../../pages/parte-3-pontuacao-e-comparacao/ranking.page');

/** Formata linhas para a mensagem de erro, no maximo 10. */
const resumir = (linhas) => linhas.slice(0, 10)
  .map((l) => `#${l.posicao} ${l.nome}: ${l.exercicios} exercicios, ${l.corretas} corretas, ${l.taxa}%`)
  .join('\n');

test.describe('/ranking - Ranking', () => {
  let ranking;
  let linhas;

  test.beforeEach(async ({ page }) => {
    ranking = new RankingPage(page);
    await ranking.abrir();
    linhas = await ranking.tabela();
  });

  // --------------------------------------------------------------------
  // Regra 9 -- minimo de 5 exercicios
  // --------------------------------------------------------------------

  test('so aparece quem completou pelo menos 5 exercicios', async () => {
    test.fail(true, 'Bug 010 em aberto: o ranking lista alunos com 0 a 4 exercicios');
    const abaixo = linhas.filter((l) => l.exercicios < 5);
    expect(abaixo.length, `Linhas com menos de 5 exercicios (${abaixo.length}):\n${resumir(abaixo)}`).toBe(0);
  });

  // --------------------------------------------------------------------
  // Regra 11 -- ordenacao
  // --------------------------------------------------------------------

  test('e ordenado por total de acertos, do maior para o menor', async () => {
    test.fail(true, 'Bug 011 em aberto: a tela ordena por taxa de acerto, nao por total de acertos');
    const foraDeOrdem = linhas.filter((l, i) => i > 0 && l.corretas > linhas[i - 1].corretas);
    expect(foraDeOrdem.length, `Linhas com mais acertos que a de cima:\n${resumir(foraDeOrdem)}`).toBe(0);
  });

  test('as posicoes vao de 1 ate o numero de linhas, sem pular', async () => {
    const esperadas = linhas.map((_, i) => i + 1);
    expect(linhas.map((l) => l.posicao)).toEqual(esperadas);
  });

  // --------------------------------------------------------------------
  // Regra 12 -- o que cada linha exibe
  // --------------------------------------------------------------------

  test('exibe nome e e-mail de cada participante', async () => {
    test.fail(true, 'Bug 012 em aberto: a tabela nao tem coluna de e-mail');
    const colunas = await ranking.nomesDasColunas();
    expect(colunas, 'Falta a coluna de nome').toContainEqual(expect.stringMatching(/nome/i));
    expect(colunas, 'Falta a coluna de e-mail').toContainEqual(expect.stringMatching(/e-?mail/i));
  });

  test('a taxa de cada linha e corretas divididas por exercicios', async () => {
    // 41 de 42 = 97,619...% e a tela mostra 97.6%. Uma casa decimal: tolerancia
    // de meio decimo para o arredondamento.
    const erradas = linhas.filter((l) => {
      const esperada = l.exercicios > 0 ? (l.corretas / l.exercicios) * 100 : 0;
      return Math.abs(esperada - l.taxa) > 0.051;
    });
    expect(erradas.length, `Linhas com a taxa errada:\n${resumir(erradas)}`).toBe(0);
  });

  test('nenhuma linha tem mais corretas do que exercicios', async () => {
    const impossiveis = linhas.filter((l) => l.corretas > l.exercicios);
    expect(impossiveis.length, `Linhas impossiveis:\n${resumir(impossiveis)}`).toBe(0);
  });

  // --------------------------------------------------------------------
  // Os cartoes do topo contam a mesma verdade que a tabela
  // --------------------------------------------------------------------

  test('o total de competidores e o numero de linhas', async () => {
    const { totalCompetidores } = await ranking.cartoes();
    expect(totalCompetidores).toBe(linhas.length);
  });

  test('o lider atual e quem esta na posicao 1', async () => {
    const { liderAtual } = await ranking.cartoes();
    expect(liderAtual).toBe(linhas[0].nome);
  });

  test('a maior precisao e a maior taxa da tabela', async () => {
    const { maiorPrecisao } = await ranking.cartoes();
    expect(maiorPrecisao).toBe(Math.max(...linhas.map((l) => l.taxa)));
  });
});
