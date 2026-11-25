// ============================================================================
// Testes automatizados do Quiz, do Meu Progresso e da coerencia entre eles
//
// Cenarios em Gherkin cobertos:
//   cenarios/parte-3-pontuacao-e-comparacao/quiz.feature          (menos o @manual)
//   cenarios/parte-3-pontuacao-e-comparacao/meu-progresso.feature (todos)
//   cenarios/parte-3-pontuacao-e-comparacao/coerencia.feature     (todos)
//
// POR QUE AS TRES TELAS ESTAO NUM ARQUIVO SO
//   Todos estes testes mexem no MESMO quiz da conta de teste: respondem,
//   terminam, refazem. Em arquivos separados, o Playwright os rodaria em
//   paralelo e um teste refaria o quiz no meio do outro. Num arquivo so, eles
//   rodam um depois do outro, no mesmo processo.
//
// O QUIZ E O ORACULO
//   Os acertos e erros que o quiz mostra sao o resultado esperado no Meu
//   Progresso e no Ranking. E o "anote no papel" do README da Parte 3, so que
//   quem anota e o teste.
//
// ATENCAO AO RODAR JUNTO COM A PARTE 2
//   Os testes de Exercicios da Parte 2 mudam o bloco de frases, que aparece no
//   Progresso e no Ranking. Na pipeline os testes rodam um de cada vez e nao
//   ha conflito. Localmente, para conferir so esta parte, use
//   `npx playwright test tests/parte-3-pontuacao-e-comparacao`.
// ============================================================================

const { test, expect } = require('@playwright/test');
const { QuizPage } = require('../../pages/parte-3-pontuacao-e-comparacao/quiz.page');
const { ProgressPage } = require('../../pages/parte-3-pontuacao-e-comparacao/progress.page');
const { RankingPage } = require('../../pages/parte-3-pontuacao-e-comparacao/ranking.page');
const { TrilhaPage } = require('../../pages/parte-2-pratica-estruturada/trilha.page');
const { respostasCorretas } = require('../../data/parte-3-pontuacao-e-comparacao/quiz.data.json');

/**
 * A taxa que a tela deveria mostrar: corretas / respondidas, em %.
 * A tela usa uma casa decimal ("33.3%"), entao aceitamos meio decimo de folga.
 */
function expectTaxa(taxaNaTela, corretas, respondidas) {
  const esperada = respondidas > 0 ? (corretas / respondidas) * 100 : 0;
  expect(
    Math.abs(taxaNaTela - esperada),
    `A tela mostra ${taxaNaTela}%, mas ${corretas} de ${respondidas} da ${esperada.toFixed(1)}%`
  ).toBeLessThanOrEqual(0.051);
}

// Reiniciar o quiz pode exigir responder ate 30 perguntas. 4 minutos por teste.
test.describe.configure({ timeout: 4 * 60 * 1000 });

/** XP Total exibido na Trilha -- o unico lugar da plataforma que mostra XP. */
async function lerXpTotal(page) {
  const trilha = new TrilhaPage(page);
  await page.goto('/duolingo');
  await expect(trilha.contadorXp.first()).toBeVisible({ timeout: 30000 });
  return trilha.obterXpTotal();
}

test.describe('/quiz - Quiz de Ingles', () => {
  let quiz;

  test.beforeEach(async ({ page }) => {
    quiz = new QuizPage(page);
    await quiz.abrir();
  });

  test('comeca na pergunta 1 de 30 com os contadores zerados', async () => {
    await quiz.reiniciar();
    const p = await quiz.placar();
    expect(p).toMatchObject({ questao: 1, total: 30, acertos: 0, erros: 0 });
  });

  test('cada pergunta oferece exatamente 3 opcoes', async () => {
    await quiz.reiniciar();
    for (let i = 0; i < 5; i++) {
      const { questao } = await quiz.placar();
      expect(await quiz.quantidadeDeOpcoes(), `Pergunta ${questao}`).toBe(3);
      await quiz.responder(0);
    }
  });

  test('responder avanca para a proxima pergunta', async () => {
    await quiz.reiniciar();
    await quiz.responder(0);
    expect((await quiz.placar()).questao).toBe(2);
  });

  test('cada resposta soma exatamente 1 entre acertos e erros', async () => {
    if ((await quiz.placar()).fim) await quiz.reiniciar();
    const antes = await quiz.placar();
    await quiz.responder(0);
    const depois = await quiz.placar();
    expect((depois.acertos + depois.erros) - (antes.acertos + antes.erros)).toBe(1);
  });

  test('acertar a opcao certa soma 1 acerto', async () => {
    // Garante que a tabela de respostas do data/ continua valendo -- o teste
    // de XP abaixo depende dela.
    await quiz.reiniciar();
    const { palavra } = await quiz.placar();
    await quiz.responder(respostasCorretas[palavra]);
    expect(await quiz.placar()).toMatchObject({ acertos: 1, erros: 0 });
  });

  test('um duplo clique numa opcao registra uma resposta so', async () => {
    test.fail(true, 'Bug 008 em aberto: o duplo clique soma 2 respostas para a mesma pergunta');
    await quiz.reiniciar();
    await quiz.responderComDuploClique(0);
    const p = await quiz.placar();
    expect(p.questao).toBe(2);
    expect(p.acertos + p.erros, 'Uma pergunta, mas a tela contou mais de uma resposta').toBe(1);
  });

  test('acertar uma pergunta credita XP', async ({ page }) => {
    test.fail(true, 'Bug 009 em aberto: o XP Total nao muda com acertos no quiz');
    const xpAntes = await lerXpTotal(page);
    await quiz.abrir();
    await quiz.reiniciar();
    const { palavra } = await quiz.placar();
    await quiz.responder(respostasCorretas[palavra]);
    expect(await lerXpTotal(page), 'Acertei e o XP Total nao subiu').toBeGreaterThan(xpAntes);
  });

  test('errar uma pergunta nao credita XP', async ({ page }) => {
    const xpAntes = await lerXpTotal(page);
    await quiz.abrir();
    await quiz.reiniciar();
    const { palavra } = await quiz.placar();
    const errada = (await quiz.textosDasOpcoes()).find((o) => o !== respostasCorretas[palavra]);
    await quiz.responder(errada);
    expect(await quiz.placar()).toMatchObject({ acertos: 0, erros: 1 });
    expect(await lerXpTotal(page)).toBe(xpAntes);
  });

  test('continua de onde parei depois de sair da tela', async ({ page }) => {
    await quiz.reiniciar();
    await quiz.responder(0);
    await quiz.responder(0);
    const antes = await quiz.placar();
    await page.goto('/progress');
    await quiz.abrir();
    expect(await quiz.placar()).toEqual(antes);
  });

  test('depois da 30a resposta aparece o resultado final', async () => {
    await quiz.reiniciar();
    await quiz.responderAteOFim();
    const r = await quiz.placar();
    expect(r.fim).toBe(true);
    expect(r.totalQuestoes).toBe(30);
    expect(r.acertos + r.erros).toBe(30);
    expect(r.porcentagem).toBe(Math.round((r.acertos / 30) * 100));
  });

  test('refazer o quiz volta a pergunta 1 com os contadores zerados', async () => {
    await quiz.responderAteOFim();
    await quiz.botaoRefazer.click();
    await expect.poll(async () => (await quiz.placar()).questao).toBe(1);
    expect(await quiz.placar()).toMatchObject({ acertos: 0, erros: 0 });
  });
});

test.describe('/progress - Meu Progresso', () => {
  let quiz;
  let progresso;

  test.beforeEach(async ({ page }) => {
    quiz = new QuizPage(page);
    progresso = new ProgressPage(page);
  });

  test('mostra os blocos de frases e de palavras separados', async () => {
    await progresso.abrir();
    await expect(progresso.blocoFrases).toBeVisible();
    await expect(progresso.blocoPalavras).toBeVisible();
    for (const bloco of [await progresso.frases(), await progresso.palavras()]) {
      expect(Object.values(bloco), 'Algum numero do bloco nao foi encontrado').not.toContain(null);
    }
  });

  test('o titulo da tela nao tem texto residual', async () => {
    test.fail(true, 'Bug 003 em aberto: o titulo e "Seu Progresso aqui"');
    await progresso.abrir();
    await expect(progresso.titulo).toContainText('Seu Progresso');
    await expect(progresso.titulo).not.toContainText(/aqui/i);
  });

  test('sem respostas no quiz, as palavras ficam em 0 e a taxa em 0%', async () => {
    await quiz.abrir();
    await quiz.reiniciar();
    await progresso.abrir();
    expect(await progresso.palavras()).toEqual({ respondidas: 0, corretas: 0, incorretas: 0, taxa: 0 });
  });

  test('as palavras batem com os acertos e erros do quiz', async () => {
    // Tambem cobre coerencia.feature: "O Meu Progresso mostra os mesmos
    // acertos e erros do quiz".
    await quiz.abrir();
    await quiz.reiniciar();
    for (let i = 0; i < 5; i++) await quiz.responder(i % 3);
    const { acertos, erros } = await quiz.placar();
    expect(acertos + erros, 'O proprio quiz nao contou 5 respostas').toBe(5);

    await progresso.abrir();
    expect(await progresso.palavras()).toMatchObject({ respondidas: 5, corretas: acertos, incorretas: erros });
  });

  test('a taxa de palavras e corretas divididas por respondidas', async () => {
    await progresso.abrir();
    let p = await progresso.palavras();
    if (p.respondidas === 0) {
      await quiz.abrir();
      await quiz.responder(0);
      await quiz.responder(1);
      await progresso.abrir();
      p = await progresso.palavras();
    }
    expectTaxa(p.taxa, p.corretas, p.respondidas);
  });

  test('a taxa de frases e corretas divididas por respondidas', async () => {
    await progresso.abrir();
    const f = await progresso.frases();
    expectTaxa(f.taxa, f.corretas, f.respondidas);
  });

  test('responder o quiz nao altera o bloco de frases', async () => {
    await progresso.abrir();
    const antes = await progresso.frases();
    await quiz.abrir();
    if ((await quiz.placar()).fim) await quiz.reiniciar();
    await quiz.responder(0);
    await progresso.abrir();
    expect(await progresso.frases()).toEqual(antes);
  });

  test('os numeros mudam sem recarregar a pagina', async () => {
    await quiz.abrir();
    if ((await quiz.placar()).fim) await quiz.reiniciar();
    await progresso.abrirPeloMenu();
    const antes = await progresso.palavras();

    // Do Progresso para o Quiz e de volta, sempre pelo menu: nenhum page.goto,
    // nenhuma recarga. Se o numero mudar, a tela atualizou sozinha.
    await quiz.page.getByRole('link', { name: 'Quiz', exact: true }).click();
    await quiz.esperarCarregar();
    await quiz.responder(0);
    await progresso.abrirPeloMenu();

    await expect.poll(async () => (await progresso.palavras()).respondidas).toBe(antes.respondidas + 1);
  });

  test('refazer o quiz zera as palavras e mantem as frases', async () => {
    // Comportamento observado, sem regra na /docs -- registrado no .feature.
    await quiz.abrir();
    if ((await quiz.placar()).fim) await quiz.reiniciar();
    await quiz.responder(0);
    await progresso.abrir();
    const frasesAntes = await progresso.frases();

    await quiz.abrir();
    await quiz.reiniciar();
    await progresso.abrir();
    expect(await progresso.palavras()).toMatchObject({ respondidas: 0, corretas: 0, incorretas: 0 });
    expect(await progresso.frases()).toEqual(frasesAntes);
  });
});

test.describe('Coerencia entre Quiz, Meu Progresso e Ranking', () => {
  test('o ranking soma frases e palavras do Meu Progresso', async ({ page }) => {
    const progresso = new ProgressPage(page);
    const ranking = new RankingPage(page);

    await progresso.abrir();
    const f = await progresso.frases();
    const p = await progresso.palavras();
    const esperado = { exercicios: f.respondidas + p.respondidas, corretas: f.corretas + p.corretas };

    await ranking.abrir();
    // O ranking identifica a pessoa so pelo nome, e nomes se repetem (bug 012).
    // Procuramos a linha pelos numeros; se QA_NOME estiver no .env, pelo nome
    // tambem, para nao confundir com outra conta de mesmos numeros.
    const nome = process.env.QA_NOME;
    const candidatas = (await ranking.tabela()).filter((l) =>
      l.exercicios === esperado.exercicios && l.corretas === esperado.corretas && (!nome || l.nome === nome)
    );
    expect(
      candidatas.length,
      `Nenhuma linha do ranking com ${esperado.exercicios} exercicios e ${esperado.corretas} corretas` +
      ` (frases ${f.respondidas}/${f.corretas} + palavras ${p.respondidas}/${p.corretas})`
    ).toBeGreaterThan(0);
  });

  test('um duplo clique no quiz nao faz as telas divergirem', async ({ page }) => {
    test.fail(true, 'Bug 008 em aberto: o Meu Progresso registra o duplo clique como 2 respostas');
    const quiz = new QuizPage(page);
    const progresso = new ProgressPage(page);

    await quiz.abrir();
    await quiz.reiniciar();
    await quiz.responderComDuploClique(0);

    // O quiz, depois de recarregado, guarda 1 resposta -- e o oraculo.
    await quiz.abrir();
    const { acertos, erros } = await quiz.placar();
    expect(acertos + erros).toBe(1);

    await progresso.abrir();
    expect((await progresso.palavras()).respondidas, 'O Progresso contou o duplo clique duas vezes').toBe(1);
  });
});
