// ============================================================================
// AJUDANTES PARA TESTAR CONTEUDO GERADO POR IA
//
// A regra de ouro da Parte 4: nao se asserta O QUE a IA escreveu -- isso muda a
// cada execucao e um teste assim acusa defeito onde nao ha. Asserta-se o que E
// estavel: veio texto? esta no idioma certo? o carregamento sumiu? duas
// solicitacoes deram resultados diferentes?
//
// Este arquivo reune essas verificacoes estaveis, para nao serem reescritas de
// jeito diferente em cada spec.
// ============================================================================

const { expect } = require('@playwright/test');

/**
 * Espera um elemento conter texto de verdade -- nao vazio, nao so espaco, e
 * com um tamanho minimo que descarta "..." ou "-" de placeholder.
 *
 * Substitui o expect(...).toBeVisible() cru, que passa com a caixa vazia
 * na tela e deixa passar o bug de "gerou nada".
 */
async function esperarTextoNaoVazio(locator, minimo = 10) {
  await expect(locator).toBeVisible();
  await expect
    .poll(async () => ((await locator.innerText()) || '').trim().length, {
      message: `Esperava texto com pelo menos ${minimo} caracteres`,
      timeout: 60000,
    })
    .toBeGreaterThanOrEqual(minimo);

  return (await locator.innerText()).trim();
}

/**
 * Espera todo indicador de carregamento sumir da tela.
 *
 * Cobre o cenario "o carregando apareceu e depois sumiu", que e um dos poucos
 * comportamentos 100% previsiveis numa tela de IA -- e onde bug se esconde:
 * spinner que fica girando para sempre depois de a resposta chegar.
 */
async function esperarCarregamentoSumir(page, timeout = 20000) {
  const carregando = page
    .getByText(/carregando|gerando|aguarde|processando|criando|loading/i)
    .or(page.locator('[role="progressbar"], .spinner, .loading, .animate-spin'));

  // Se nao ha indicador nenhum na tela, nao ha o que esperar. Sair cedo aqui
  // importa: sem isso, uma tela que exibe permanentemente algo parecido com
  // "carregando" faria esta funcao consumir o tempo INTEIRO do teste, e a
  // falha apareceria num expect la na frente, mascarando a causa. Foi
  // exatamente o que aconteceu em 07/09 no teste de carregamento do /stories.
  if ((await carregando.count()) === 0) return;

  await carregando
    .first()
    .waitFor({ state: 'hidden', timeout })
    .catch(() => { /* indicador teimoso: quem afirma isso e o teste, nao este ajudante */ });
}

/**
 * O texto parece portugues?
 *
 * Heuristica de proposito -- nao existe deteccao de idioma exata, e nao
 * precisamos de uma. Precisamos separar "a IA respondeu em ingles" de
 * "a IA respondeu em portugues", e para isso contar palavras funcionais e
 * acentos proprios do portugues basta.
 *
 * Um teste que usa isto deve assertar a DIFERENCA entre os dois blocos
 * (historia vs. traducao), nunca uma pontuacao absoluta.
 */
function pontuacaoPortugues(texto) {
  const t = ` ${texto.toLowerCase()} `;
  let pontos = 0;

  // Caracteres que praticamente nao existem em ingles
  pontos += (t.match(/[ãõçáéíóúâêôà]/g) || []).length * 2;

  // Palavras funcionais frequentes do portugues
  const palavras = ['que', 'nao', 'não', 'para', 'com', 'uma', 'dos', 'das',
                    'ele', 'ela', 'seu', 'sua', 'mais', 'como', 'por', 'foi'];
  for (const p of palavras) {
    pontos += (t.match(new RegExp(`\\s${p}\\s`, 'g')) || []).length;
  }
  return pontos;
}

/** O texto parece ingles? Mesma logica, do outro lado. */
function pontuacaoIngles(texto) {
  const t = ` ${texto.toLowerCase()} `;
  let pontos = 0;
  const palavras = ['the', 'and', 'is', 'was', 'to', 'of', 'in', 'it',
                    'that', 'with', 'for', 'you', 'he', 'she', 'they', 'his'];
  for (const p of palavras) {
    pontos += (t.match(new RegExp(`\\s${p}\\s`, 'g')) || []).length;
  }
  return pontos;
}

/**
 * Afirma que UM texto esta em ingles e OUTRO em portugues.
 *
 * Comparativo de proposito: uma nota absoluta (">= 5 palavras inglesas")
 * quebraria num texto curto sem que houvesse bug. Comparando os dois blocos
 * entre si, o teste continua valido para qualquer tamanho de texto.
 */
function afirmarIdiomas(textoIngles, textoPortugues) {
  const en = pontuacaoIngles(textoIngles);
  const ptDoIngles = pontuacaoPortugues(textoIngles);
  const pt = pontuacaoPortugues(textoPortugues);
  const enDoPortugues = pontuacaoIngles(textoPortugues);

  expect(en, `Esperava ingles, veio:\n"${recorte(textoIngles)}"`).toBeGreaterThan(ptDoIngles);
  expect(pt, `Esperava portugues, veio:\n"${recorte(textoPortugues)}"`).toBeGreaterThan(enDoPortugues);
}

/**
 * Afirma que duas geracoes com a mesma entrada deram resultados diferentes.
 *
 * E assim que se prova a regra 4 da /docs ("nova historia a cada solicitacao")
 * sem assertar conteudo: nao importa O QUE veio, importa que veio OUTRA coisa.
 */
function afirmarConteudoDiferente(primeiro, segundo) {
  expect(
    normalizar(primeiro),
    'As duas geracoes produziram o mesmo texto -- a regra pede conteudo novo a cada solicitacao'
  ).not.toBe(normalizar(segundo));
}

/**
 * O elemento apareceu dentro do prazo? Devolve true/false, sem falhar o teste.
 *
 * CUIDADO -- este ajudante existe por causa de um erro real cometido aqui:
 * locator.isVisible() NAO espera. Ele checa na hora e devolve na hora; passar
 * { timeout } para ele nao faz o Playwright aguardar. Escrever
 *
 *     await loc.isVisible({ timeout: 90000 })   // <- NAO espera
 *
 * faz o teste desistir instantaneamente e reportar falha onde nao ha nenhuma.
 * Quando o que voce quer e "espere ate aparecer, mas nao falhe se nao vier",
 * use esta funcao. Quando voce quer FALHAR se nao vier, use
 * expect(loc).toBeVisible().
 */
async function apareceu(locator, timeout = 90000) {
  return locator
    .waitFor({ state: 'visible', timeout })
    .then(() => true)
    .catch(() => false);
}

/**
 * O conteudo do bloco identificado por um rotulo, sem repetir o rotulo.
 *
 * Esta aplicacao rotula blocos com um cabecalho ou um texto curto ("Analise e
 * Feedback", "Traducao PT-BR") e poe o conteudo ao lado, no mesmo container.
 * So que a profundidade VARIA de bloco para bloco: uns tem uma <div> a mais
 * que outros. Fixar um nivel funciona num e devolve vazio no outro -- foi o
 * que aconteceu duas vezes em 07/09, no /interview e no /chatbot.
 *
 * Entao subimos nivel a nivel a partir do rotulo ate encontrar um ancestral
 * que contenha algo alem dele.
 */
async function textoDoBlocoDe(rotulo, minimo = 20) {
  const texto = ((await rotulo.innerText()) || '').trim();

  for (const nivel of ['..', '../..', '../../..', '../../../..']) {
    const tudo = ((await rotulo.locator(`xpath=${nivel}`).innerText()) || '').trim();
    const conteudo = tudo.startsWith(texto)
      ? tudo.slice(texto.length).trim()
      : tudo.replace(texto, '').trim();
    if (conteudo.length >= minimo) return conteudo;
  }
  return '';
}

const normalizar = (t) => (t || '').replace(/\s+/g, ' ').trim().toLowerCase();
const recorte = (t) => ((t || '').length > 160 ? `${t.slice(0, 160)}...` : t);

module.exports = {
  apareceu,
  textoDoBlocoDe,
  esperarTextoNaoVazio,
  esperarCarregamentoSumir,
  afirmarIdiomas,
  afirmarConteudoDiferente,
  pontuacaoIngles,
  pontuacaoPortugues,
};
