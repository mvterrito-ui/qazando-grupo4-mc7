// Automatiza: cenarios/parte-4-conteudo-com-ia/entrevistas.feature
const { test, expect } = require('@playwright/test');
const { InterviewPage } = require('../../pages/interview.page');
const { esperarTextoNaoVazio, afirmarConteudoDiferente, esperarCarregamentoSumir,
        apareceu, pontuacaoIngles, pontuacaoPortugues } = require('../../support/ia');

test.describe('/interview - Entrevistas', () => {
  let entrevista;

  test.beforeEach(async ({ page }) => {
    entrevista = new InterviewPage(page);
    await entrevista.abrir();
  });

  test('gera uma pergunta de entrevista em ingles', async () => {
    // Regra 5. Assertamos o IDIOMA da pergunta, nao QUAL pergunta foi feita.
    const pergunta = await entrevista.gerarPergunta();
    expect(pergunta.length).toBeGreaterThan(10);
    expect(
      pontuacaoIngles(pergunta),
      `A pergunta nao parece estar em ingles:\n"${pergunta}"`
    ).toBeGreaterThan(pontuacaoPortugues(pergunta));
  });

  test('duas solicitacoes seguidas geram perguntas diferentes', async () => {
    const primeira = await entrevista.gerarPergunta();
    const segunda = await entrevista.gerarPergunta();
    afirmarConteudoDiferente(primeira, segunda);
  });

  test('responder a pergunta devolve feedback', async () => {
    // Regras 6 e 7. Nao lemos O QUE o feedback disse -- so que ele chegou.
    await entrevista.gerarPergunta();
    const feedback = await entrevista.responder(
      'I would start by reading the acceptance criteria and asking the product owner about edge cases.'
    );
    expect(feedback.length, 'O feedback veio vazio').toBeGreaterThan(20);
  });

  test('o carregamento aparece enquanto a IA avalia e some no fim', async ({ page }) => {
    // Um dos poucos comportamentos previsiveis numa tela de IA -- e onde se
    // esconde o bug do spinner que nunca para.
    await entrevista.gerarPergunta();
    await entrevista.campoResposta.fill('Exploratory testing finds what scripts miss.');
    await entrevista.botaoEnviar.click();

    await entrevista.feedback.waitFor({ state: 'visible', timeout: 90000 });
    await esperarCarregamentoSumir(page);

    await expect(
      page.getByText(/carregando|avaliando|analisando|aguarde/i).first(),
      'O indicador continuou na tela depois de o feedback aparecer'
    ).toBeHidden();
  });

  test('recusa o envio de resposta vazia', async () => {
    await entrevista.gerarPergunta();
    await entrevista.campoResposta.fill('');

    if (await entrevista.podeEnviar()) {
      await entrevista.botaoEnviar.click();
      // Se deixou clicar, nao pode ter gerado feedback a partir do nada.
      const gerouFeedback = await apareceu(entrevista.feedback, 15000);
      expect(gerouFeedback, 'A IA avaliou uma resposta vazia').toBe(false);
    } else {
      expect(await entrevista.podeEnviar()).toBe(false);
    }
  });

  test('aceita uma resposta de uma unica palavra', async () => {
    await entrevista.gerarPergunta();
    const feedback = await entrevista.responder('yes');
    expect(feedback.length).toBeGreaterThan(10);
  });

  test('aceita resposta em portugues a uma pergunta em ingles', async () => {
    await entrevista.gerarPergunta();
    const feedback = await entrevista.responder('eu começaria lendo os critérios de aceite');
    expect(feedback.length).toBeGreaterThan(10);
  });

  test('traduz o feedback para portugues', async () => {
    // Regra 8. A prova de que traduziu: o texto MUDOU e ficou mais portugues
    // que antes. Nao comparamos com uma traducao esperada -- ela muda toda vez.
    await entrevista.gerarPergunta();
    const original = await entrevista.responder('Testing is about reducing risk before release.');

    const traduzido = await entrevista.traduzirFeedback();

    // A traducao aparece em bloco proprio; o feedback original continua na tela
    // (e isso e bom -- da para comparar os dois). Entao NAO afirmamos que o
    // feedback mudou. Afirmamos que surgiu um texto novo, em portugues.
    expect(traduzido.length, 'O bloco de traducao veio vazio').toBeGreaterThan(20);
    expect(
      pontuacaoPortugues(traduzido),
      `A traducao nao parece portugues:\n"${traduzido.slice(0, 160)}"`
    ).toBeGreaterThan(pontuacaoPortugues(original));
  });

  test('o controle de traduzir some depois do primeiro uso', async () => {
    // O cenario original era "traduzir duas vezes seguidas". Ao rodar contra a
    // tela real descobrimos que isso NAO e executavel: o botao de traduzir
    // desaparece assim que a traducao chega. E a solucao certa -- resolve o
    // problema de traducao dupla na origem, em vez de tratar o efeito.
    //
    // O teste passa a afirmar esse comportamento, que e o que existe.
    await entrevista.gerarPergunta();
    await entrevista.responder('Automated tests should be fast and deterministic.');

    expect(
      await entrevista.podeTraduzir(),
      'O botao de traduzir deveria estar disponivel antes do primeiro uso'
    ).toBe(true);

    await entrevista.traduzirFeedback();

    expect(
      await entrevista.podeTraduzir(),
      'O botao de traduzir continuou na tela depois de traduzir'
    ).toBe(false);

    // E a tela segue util: da para pedir outra pergunta.
    await expect(entrevista.botaoNovaPergunta.or(
      entrevista.page.getByRole('button', { name: /gerar nova pergunta/i })
    ).first()).toBeEnabled();
  });

  test('gerar pergunta nova sem responder a anterior limpa o campo', async () => {
    await entrevista.gerarPergunta();
    await entrevista.campoResposta.fill('resposta que nao vou enviar');

    await entrevista.gerarPergunta();

    await esperarTextoNaoVazio(entrevista.pergunta, 10);
    await expect(
      entrevista.campoResposta,
      'O campo manteve a resposta da pergunta anterior'
    ).toHaveValue('');
  });
});
