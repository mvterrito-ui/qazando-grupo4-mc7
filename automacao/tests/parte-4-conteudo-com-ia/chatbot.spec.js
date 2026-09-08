// Automatiza: cenarios/parte-4-conteudo-com-ia/falar-com-max.feature
// (a parte por TEXTO -- os cenarios de voz ficam em chatbot-microfone.spec.js)
//
// Seletores conferidos na tela real em 07/09/2026.
const { test, expect } = require('@playwright/test');
const { ChatbotPage } = require('../../pages/chatbot.page');
const { esperarCarregamentoSumir, pontuacaoPortugues } = require('../../support/ia');

test.describe('/chatbot - Falar com Max', () => {
  let chat;

  test.beforeEach(async ({ page }) => {
    chat = new ChatbotPage(page);
    await chat.abrir();
  });

  test('enviar mensagem coloca a pergunta e a resposta na conversa', async ({ page }) => {
    // Regra 9. Nao lemos O QUE o Max respondeu -- so que a minha mensagem
    // entrou na conversa e que veio uma resposta nao vazia.
    const texto = 'Hello Max, how are you?';
    const antes = await chat.enviar(texto);

    await expect(
      page.getByText(texto).first(),
      'A minha mensagem nao apareceu na conversa'
    ).toBeVisible();

    expect(await chat.contarRespostasDoMax()).toBe(antes + 1);
    expect(
      (await chat.ultimaRespostaDoMax()).length,
      'O Max respondeu vazio'
    ).toBeGreaterThan(5);
  });

  test('o indicador de resposta some quando o Max termina', async ({ page }) => {
    await chat.enviar('What is regression testing?');
    await esperarCarregamentoSumir(page);
    await expect(page.getByText(/digitando|respondendo|typing/i).first()).toBeHidden();
  });

  test('a conversa mantem as mensagens anteriores', async ({ page }) => {
    await chat.enviar('First message about testing');
    await chat.enviar('Second message about automation');

    // As duas minhas continuam na tela, e ha duas respostas do Max.
    await expect(page.getByText('First message about testing').first()).toBeVisible();
    await expect(page.getByText('Second message about automation').first()).toBeVisible();
    expect(await chat.contarRespostasDoMax()).toBe(2);
  });

  test('recusa o envio de mensagem vazia', async () => {
    // Conferido na tela: com o campo vazio, o botao de enviar fica desabilitado.
    await chat.campoMensagem.fill('');
    expect(
      await chat.podeEnviar(),
      'O botao de enviar deveria estar desabilitado com o campo vazio'
    ).toBe(false);
  });

  test('aguenta uma mensagem muito longa sem travar', async ({ page }) => {
    await chat.campoMensagem.fill('testing '.repeat(250)); // ~2000 caracteres
    await chat.botaoEnviar.click();
    await esperarCarregamentoSumir(page);

    // "Nao travar" precisa ser verificavel: a tela ainda aceita digitacao.
    await expect(chat.campoMensagem, 'A tela travou apos mensagem longa').toBeEditable();
    expect(page.url()).toContain('/chatbot');
  });

  test('iniciar nova conversa limpa o historico', async ({ page }) => {
    await chat.enviar('Message before reset');
    expect(await chat.contarRespostasDoMax()).toBeGreaterThan(0);

    await chat.botaoNovaConversa.click();

    await expect(
      page.getByText('Message before reset').first(),
      'A conversa anterior continuou na tela'
    ).toBeHidden();
    expect(await chat.contarRespostasDoMax()).toBe(0);
  });

  test('traduzir uma mensagem da conversa', async () => {
    // Regra 11. A prova de que traduziu: o texto da bolha mudou e ficou mais
    // portugues. Nao comparamos com uma traducao esperada -- ela muda sempre.
    await chat.enviar('Testing reduces risk before release.');
    const { antes, depois } = await chat.traduzirUltimaResposta();

    expect(depois, 'A mensagem nao mudou apos pedir a traducao').not.toBe(antes);
    expect(
      pontuacaoPortugues(depois),
      `A traducao nao parece portugues:\n"${depois.slice(0, 160)}"`
    ).toBeGreaterThan(pontuacaoPortugues(antes));
  });

  test('o controle do avatar liga e desliga sem quebrar a conversa', async () => {
    // Regra 12: o avatar e OPCIONAL.
    //
    // POR QUE ESTE TESTE NAO AFIRMA QUE O AVATAR APARECEU:
    // ao ligar o avatar, o que surge na tela e um <img> SEM texto alternativo,
    // sem testid e sem classe identificavel. Nao ha como uma maquina afirmar
    // com honestidade que "o avatar apareceu" -- so que "surgiu mais uma
    // imagem anonima", que nao prova nada.
    //
    // Entao aqui automatizamos o que da para afirmar: o controle existe,
    // alterna nos dois sentidos e nao quebra o chat. A conferencia visual
    // virou cenario @manual no .feature. Isso nao e preguiça -- e a mesma
    // regra de ouro: nao invente asserção que o teste nao consegue sustentar.
    //
    // A falta de texto alternativo esta reportada em bugs/004.
    await expect(chat.botaoAvatar).toBeEnabled();

    await chat.botaoAvatar.click();
    await expect(chat.botaoAvatar, 'O controle sumiu depois de ligar').toBeEnabled();

    await chat.botaoAvatar.click();
    await expect(chat.botaoAvatar, 'O controle sumiu depois de desligar').toBeEnabled();

    // O que importa de verdade: a conversa continua funcionando depois disso.
    const antes = await chat.enviar('Does the chat still work?');
    expect(await chat.contarRespostasDoMax()).toBe(antes + 1);
  });

  test('a conversa funciona com o avatar desligado', async () => {
    const antes = await chat.enviar('Testing without avatar');
    expect(await chat.contarRespostasDoMax()).toBe(antes + 1);
  });
});
