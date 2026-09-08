// ============================================================================
// ESTE E O ARQUIVO DE EXEMPLO DO PROJETO.
//
// Se voce vai automatizar a SUA parte, leia este arquivo inteiro primeiro.
// Ele esta comentado linha a linha de proposito -- os outros specs nao estao.
//
// Cenarios em Gherkin que ele automatiza:
//   cenarios/parte-4-conteudo-com-ia/gerador-palavras.feature
//
// Repare: o spec NAO copia o .feature um-pra-um. O Gherkin e a especificacao
// completa, inclusive do que fica manual. A automacao cobre o que doi se
// quebrar. Cenarios marcados @manual no .feature nao aparecem aqui.
// ============================================================================

const { test, expect } = require('@playwright/test');
const { WordsPage } = require('../../pages/words.page');
const { esperarCarregamentoSumir } = require('../../support/ia');

// describe agrupa os testes de uma tela. O relatorio HTML usa este nome, entao
// escreva algo que voce entenderia lendo so o relatorio, sem abrir o codigo.
test.describe('/words - Gerador de Palavras', () => {

  let words;

  // beforeEach roda antes de CADA teste deste bloco.
  //
  // Nao ha login aqui: o projeto "setup" (setup/auth.setup.js) ja fez isso uma
  // vez e salvou a sessao. Cada teste comeca logado e com premium.
  test.beforeEach(async ({ page }) => {
    words = new WordsPage(page);
    await words.abrir();
  });

  // --------------------------------------------------------------------
  // CAMINHO FELIZ
  // --------------------------------------------------------------------

  test('gera a quantidade exata de palavras pedida', async () => {
    // Cenario: "Gerar a quantidade exata de palavras pedida"
    // Regra 13 da /docs: "usuario escolhe o tema e a quantidade (1 a 100)"

    await words.gerar('testes de software', 10);

    // AQUI ESTA A REGRA DE OURO EM UMA LINHA.
    //
    // Assertamos QUANTAS palavras vieram -- previsivel, pedimos 10.
    // Nao assertamos QUAIS palavras vieram -- muda toda vez, e a IA tem o
    // direito de mudar. Um teste que checasse as palavras falharia amanha
    // sem que houvesse bug nenhum, e o time pararia de confiar no vermelho.
    expect(await words.contarPalavras()).toBe(10);

    // Bonus descoberto ao ver a tela real: ela exibe o proprio contador "Total".
    // Conferimos que o numero que ela ANUNCIA bate com o que ela DESENHOU --
    // divergencia entre os dois e bug, e so aparece para quem confere os dois.
    expect(
      await words.totalAnunciado(),
      'O "Total" exibido nao bate com a quantidade de palavras na tela'
    ).toBe(10);
  });

  test('cada palavra vem com traducao e frase de exemplo', async () => {
    // Regra 14: "a IA gera palavras com traducao e frase de exemplo"
    await words.gerar('automação de testes', 5);

    // Contamos os tres marcadores separadamente. Se a IA devolver uma palavra
    // sem traducao, os numeros divergem e o teste acusa -- que e exatamente o
    // que a regra 14 exige: TODA palavra vem com traducao E frase de exemplo.
    await expect(words.botoesDeAudio, 'Nao vieram 5 palavras').toHaveCount(5);
    await expect(
      words.exemplosEmIngles,
      'Alguma palavra veio sem frase de exemplo (regra 14)'
    ).toHaveCount(5);
    await expect(
      words.traducoes,
      'Alguma palavra veio sem traducao (regra 14)'
    ).toHaveCount(5);
  });

  test('o carregamento aparece durante a geracao e some ao final', async ({ page }) => {
    // Um dos poucos comportamentos 100% previsiveis numa tela de IA -- e onde
    // bug se esconde: spinner que fica girando depois de a resposta chegar.
    await words.informarTema('qualidade de software');
    await words.informarQuantidade(3);
    await words.solicitarGeracao();

    await words.esperarPalavras();
    await esperarCarregamentoSumir(page);

    // O indicador precisa ter sumido de verdade, nao so ficado atras do resultado.
    await expect(
      page.getByText(/carregando|gerando|aguarde/i).first()
    ).toBeHidden();
  });

  // --------------------------------------------------------------------
  // LIMITES DA QUANTIDADE -- regra 13, "1 a 100"
  //
  // Este e o bloco que mais rende bug no projeto inteiro. A tecnica chama
  // ANALISE DE VALOR LIMITE: onde existe uma fronteira escrita, testa-se o
  // valor logo abaixo dela, o valor exato e o valor logo acima.
  //
  //        0        1                    100        101
  //     invalido  valido  ...  valido   valido    invalido
  //        ^        ^                     ^          ^
  //     testa    testa                  testa      testa
  //
  // Faca isso em TODO campo com limite escrito, na sua parte tambem.
  // --------------------------------------------------------------------

  test('aceita a quantidade minima valida (1)', async () => {
    await words.gerar('bug', 1);
    expect(await words.contarPalavras()).toBe(1);
  });

  test('aceita a quantidade maxima valida (100)', async () => {
    // 100 palavras demoram bem mais que 10. Damos folga so a este teste,
    // em vez de afrouxar o timeout global e mascarar lentidao nos outros.
    test.setTimeout(180 * 1000);
    await words.gerar('vocabulário de QA', 100);
    expect(await words.contarPalavras()).toBe(100);
  });

  // ------------------------------------------------------------------
  // Os tres testes abaixo cobrem o BUG 002, reportado e ainda em aberto.
  //
  // test.fail() diz ao Playwright: "eu SEI que isto falha hoje".
  // O teste roda, falha, e o resultado fica VERDE -- e no dia em que a
  // Qazando corrigir o bug, ele passa a dar VERMELHO avisando que o
  // comportamento mudou. E o jeito honesto de manter no repositorio um
  // teste de bug conhecido sem deixar a pipeline vermelha para sempre.
  //
  // Quando o bug 002 for corrigido e retestado: apague a linha test.fail().
  // ------------------------------------------------------------------

  test('recusa quantidade abaixo do minimo (0)', async () => {
    test.fail(true, 'Bug 002 em aberto: o campo aceita 0 e o botao segue habilitado');
    await words.informarTema('teste');
    await words.informarQuantidade(0);

    const podeGerar = await words.podeGerar();
    expect(podeGerar, 'O botao de gerar deveria estar desabilitado com quantidade 0').toBe(false);
  });

  test('recusa quantidade acima do maximo (101)', async () => {
    test.fail(true, 'Bug 002 em aberto: o campo aceita 101');
    await words.informarTema('teste');
    await words.informarQuantidade(101);

    expect(await words.podeGerar(), 'O botao deveria estar desabilitado com 101').toBe(false);
  });

  test('recusa quantidade negativa (-5)', async () => {
    test.fail(true, 'Bug 002 em aberto: o campo aceita -5');
    await words.informarTema('teste');
    await words.informarQuantidade(-5);

    expect(await words.podeGerar(), 'O botao deveria estar desabilitado com -5').toBe(false);
  });

  // ------------------------------------------------------------------
  // A observacao pendente do bug 002: o que o sistema faz DEPOIS do envio
  // com valor invalido -- recusa, corta para o limite, ou tenta gerar?
  //
  // Este teste nao afirma qual e o certo. Ele DESCOBRE e registra, porque
  // ninguem confirmou ainda. Depois de rodar, leia a saida, decida qual e
  // o comportamento esperado, troque por um expect de verdade e atualize
  // bugs/002. Teste que so imprime nao serve para sempre -- serve agora.
  // ------------------------------------------------------------------
  test('investiga o que acontece ao ENVIAR quantidade 101', async () => {
    // Espera limitada de proposito: se a tela nao gerar nada, precisamos chegar
    // ao console.log abaixo em vez de estourar o tempo do teste esperando algo
    // que nunca vem. Foi o que aconteceu na primeira execucao.
    test.setTimeout(180 * 1000);

    await words.informarTema('teste');
    await words.informarQuantidade(101);
    await words.solicitarGeracao();

    await words.esperarPalavras(45000).catch(() => { /* pode nao gerar nada, e ok */ });

    const quantas = await words.contarPalavras();
    const avisou = await words.mensagemDeErro.first().isVisible().catch(() => false);
    const textoAviso = avisou
      ? (await words.mensagemDeErro.first().innerText()).trim()
      : '(nenhum)';

    console.log(`\n  >>> ACHADO PARA O BUG 002`);
    console.log(`      pedimos 101 -> a tela devolveu ${quantas} palavras`);
    console.log(`      0 = recusou | 100 = cortou no limite | 101 = ignorou o limite`);
    console.log(`      avisou o usuario? ${avisou ? 'SIM' : 'NAO'} -- "${textoAviso}"`);
    console.log('      Atualize bugs/002 com este resultado.\n');
  });

  // --------------------------------------------------------------------
  // TEMA
  // --------------------------------------------------------------------

  test('recusa a geracao com o tema vazio', async () => {
    await words.campoTema.fill('');
    await words.informarQuantidade(10);

    // Duas saidas sao aceitaveis aqui: o botao desabilitado, OU o botao
    // clicavel que mostra aviso. Aceitamos as duas de proposito -- a /docs
    // nao diz qual, e um teste nao deve inventar regra que ninguem escreveu.
    if (await words.podeGerar()) {
      await words.solicitarGeracao();
      await expect(words.mensagemDeErro.first()).toBeVisible();
    } else {
      expect(await words.podeGerar()).toBe(false);
    }
  });

  // --------------------------------------------------------------------
  // AUDIO -- regra 15
  // --------------------------------------------------------------------

  test('cada palavra oferece o audio de pronuncia', async () => {
    // Regra 15. Conferimos que o CONTROLE de audio existe para cada palavra.
    // Se o audio toca a palavra certa e teste manual: maquina nao julga isso.
    await words.gerar('ferramentas de teste', 5);

    await expect(
      words.botoesDeAudio,
      'Alguma palavra ficou sem o botao de ouvir pronuncia (regra 15)'
    ).toHaveCount(5);

    // Todos precisam estar clicaveis, nao so presentes.
    for (let i = 0; i < 5; i++) {
      await expect(words.botoesDeAudio.nth(i)).toBeEnabled();
    }
  });
});
