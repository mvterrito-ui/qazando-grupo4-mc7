// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

// Le o .env da pasta automacao/. Cada pessoa tem o seu, com a propria conta.
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * Onde a sessao autenticada fica guardada em disco.
 *
 * Por que isso existe: sem storageState, cada arquivo de teste refaria login e
 * ativacao de premium do zero -- uns 15 segundos por arquivo, gastos sempre no
 * mesmo caminho que ja sabemos que funciona. Com ele, o login acontece UMA vez
 * (no projeto "setup") e todo teste comeca ja logado e com premium ativo.
 */
const ARQUIVO_SESSAO = path.resolve(__dirname, '.auth/premium.json');

/**
 * Argumentos que fazem o navegador usar um microfone falso.
 *
 * Duas telas da Parte 4 dependem de microfone (Falar com Max e Treinar Fala).
 * Em automacao nao existe alguem falando, entao o Chromium recebe:
 *   --use-fake-ui-for-media-stream     concede a permissao sem mostrar o popup
 *   --use-fake-device-for-media-stream troca o microfone real por um sintetico
 * Para injetar audio de verdade, acrescente:
 *   --use-file-for-fake-audio-capture=/caminho/arquivo.wav
 * O arquivo precisa ser WAV mono 16 bits. Ver README, secao "Microfone".
 */
const ARGS_MICROFONE = [
  '--use-fake-ui-for-media-stream',
  '--use-fake-device-for-media-stream',
];

module.exports = defineConfig({
  testDir: './tests',

  // A IA da plataforma leva alguns segundos para responder. O padrao do
  // Playwright (5s por expect) e curto demais para esta aplicacao.
  timeout: 90 * 1000,
  expect: { timeout: 30 * 1000 },

  // Na pipeline, ninguem deve conseguir subir teste com .only esquecido.
  forbidOnly: !!process.env.CI,

  // Teste de IA e naturalmente instavel (rede, fila do modelo). Uma repeticao
  // na pipeline evita vermelho falso. Localmente, zero: queremos ver a falha.
  retries: process.env.CI ? 1 : 0,

  // Local usa varios processos; na pipeline, 1, para nao levar bloqueio por
  // excesso de requisicoes simultaneas a uma API de IA.
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://english.qazando.com.br',

    // Evidencia automatica. "Sem evidencia nao e bug, e opiniao" -- e o trace
    // do Playwright e a melhor evidencia que existe: reproduz a sessao inteira,
    // clique a clique. Anexe o trace no bug do Jira.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,
  },

  projects: [
    // 1) Roda primeiro e uma vez so: faz login, ativa o premium e salva a sessao.
    {
      name: 'setup',
      testDir: './setup',
      testMatch: /.*\.setup\.js/,
    },

    // 2) Os testes normais. Comecam ja logados, herdando a sessao do setup.
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: ARQUIVO_SESSAO,
      },
      // Os testes de microfone rodam no projeto proprio, abaixo.
      testIgnore: /.*-microfone(-negado)?\.spec\.js/,
    },

    // 3) Testes com microfone CONCEDIDO: dispositivo de audio falso.
    {
      name: 'microfone',
      dependencies: ['setup'],
      testMatch: /.*-microfone\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: ARQUIVO_SESSAO,
        permissions: ['microphone'],
        launchOptions: { args: ARGS_MICROFONE },
      },
    },

    // 4) Testes com microfone NEGADO.
    //
    // Precisa ser um projeto separado, e o motivo e sutil: a flag
    // --use-fake-ui-for-media-stream do projeto acima CONCEDE a permissao
    // automaticamente, no nivel do navegador. Com ela ligada,
    // context.clearPermissions() nao simula recusa nenhuma -- o navegador
    // aceita assim mesmo, e o teste de "neguei o microfone" na verdade testa
    // o caminho feliz sem ninguem perceber.
    //
    // Aqui, sem a flag e sem conceder permissao, o navegador headless recusa
    // o getUserMedia de verdade. E o unico jeito honesto de testar a recusa.
    {
      name: 'microfone-negado',
      dependencies: ['setup'],
      testMatch: /.*-microfone-negado\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: ARQUIVO_SESSAO,
        permissions: [],
      },
    },
  ],
});

module.exports.ARQUIVO_SESSAO = ARQUIVO_SESSAO;
