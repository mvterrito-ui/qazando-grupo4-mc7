// ============================================================================
// PAGE OBJECT -- /quiz (Quiz de Ingles)
//
// Regra do projeto: page object descreve A TELA. Nao contem expect --
// afirmar e trabalho do teste.
//
// COMO A TELA FUNCIONA (conferido em 25/11/2026)
//   - Cada pergunta tem 3 botoes de opcao dentro do <main>, e so eles.
//   - Ao clicar, o quiz avanca SOZINHO para a proxima pergunta e atualiza os
//     contadores "Questao N/30", "Acertos" e "Erros". Nao mostra a correta.
//   - Depois da 30a resposta, a tela vira "Resultado Final", com os botoes
//     "Refazer Quiz" e "Voltar para Trilha".
//   - O estado fica salvo: sair e voltar continua na mesma pergunta.
//
// CUIDADO AO RESPONDER EM SEQUENCIA
//   Clicar antes de a pergunta seguinte aparecer registra a resposta DUAS
//   vezes -- e o bug 008. Por isso responder() espera o contador de questao
//   mudar antes de devolver. Sem essa espera, o proprio teste fabrica o bug.
// ============================================================================

class QuizPage {
  constructor(page) {
    this.page = page;
    this.principal = page.locator('main');
    this.opcoes = page.locator('main button');
    this.resultadoFinal = page.getByRole('heading', { name: /resultado final/i });
    this.botaoRefazer = page.getByRole('button', { name: /refazer quiz/i });
  }

  async abrir() {
    await this.page.goto('/quiz');
    await this.esperarCarregar();
  }

  /** Espera a tela mostrar uma pergunta OU o resultado final. */
  async esperarCarregar() {
    await this.principal.filter({ hasText: /Quest[aã]o|Resultado Final/i }).waitFor({ timeout: 30000 });
  }

  async estaNoFim() {
    return this.resultadoFinal.isVisible();
  }

  /**
   * Le o placar da tela. Durante o quiz devolve
   *   { fim: false, questao, total, acertos, erros, palavra }
   * e no resultado final
   *   { fim: true, acertos, erros, totalQuestoes, porcentagem }.
   */
  async placar() {
    const t = await this.principal.innerText();
    const num = (re) => { const m = t.match(re); return m ? parseInt(m[1], 10) : null; };

    if (/Resultado Final/i.test(t)) {
      return {
        fim: true,
        acertos: num(/(\d+)\s*\n\s*Acertos/i),
        erros: num(/(\d+)\s*\n\s*Erros/i),
        totalQuestoes: num(/Total de Quest[oõ]es\s*\n\s*(\d+)/i),
        porcentagem: num(/(\d+)%/),
      };
    }

    const q = t.match(/(\d+)\s*\/\s*(\d+)\s*\n?\s*Quest[aã]o/i);
    const palavra = t.match(/Qual a tradu[cç][aã]o de:\s*\n+\s*(.+)/i);
    return {
      fim: false,
      questao: q ? parseInt(q[1], 10) : null,
      total: q ? parseInt(q[2], 10) : null,
      acertos: num(/(\d+)\s*\n\s*Acertos/i),
      erros: num(/(\d+)\s*\n\s*Erros/i),
      palavra: palavra ? palavra[1].trim() : null,
    };
  }

  async quantidadeDeOpcoes() {
    return this.opcoes.count();
  }

  async textosDasOpcoes() {
    return this.opcoes.allInnerTexts();
  }

  /**
   * Responde a pergunta atual e so devolve quando a tela ja avancou --
   * para a pergunta seguinte ou para o resultado final.
   *
   * `opcao` pode ser o indice (0, 1, 2) ou o texto exato da opcao.
   */
  async responder(opcao = 0) {
    const antes = await this.placar();
    const botao = typeof opcao === 'number'
      ? this.opcoes.nth(opcao)
      : this.page.getByRole('button', { name: opcao, exact: true });
    await botao.click();
    await this.esperarAvancar(antes);
  }

  /** Duplo clique numa opcao -- usado so para reproduzir o bug 008. */
  async responderComDuploClique(indice = 0) {
    const antes = await this.placar();
    await this.opcoes.nth(indice).dblclick();
    await this.esperarAvancar(antes);
  }

  async esperarAvancar(antes) {
    await this.esperarAte(async () => {
      const agora = await this.placar();
      return agora.fim || agora.questao !== antes.questao;
    }, 'O quiz nao avancou depois da resposta');
  }

  /** Repete a condicao ate ela ser verdadeira, ou desiste com a mensagem. */
  async esperarAte(condicao, mensagem, timeout = 15000) {
    const limite = Date.now() + timeout;
    while (Date.now() < limite) {
      if (await condicao()) return;
      await this.page.waitForTimeout(250);
    }
    throw new Error(mensagem);
  }

  /** Responde perguntas ate chegar ao resultado final. */
  async responderAteOFim() {
    for (let i = 0; i < 31 && !(await this.estaNoFim()); i++) {
      await this.responder(0);
    }
  }

  /**
   * Deixa o quiz zerado, na pergunta 1 de 30. Como a tela so oferece
   * "Refazer Quiz" no resultado final, termina o quiz em andamento antes.
   *
   * ATENCAO: refazer o quiz tambem ZERA o bloco de palavras do Meu Progresso
   * e tira as palavras do Ranking. Comportamento observado, nao bug.
   */
  async reiniciar() {
    await this.responderAteOFim();
    await this.botaoRefazer.click();
    await this.esperarAte(async () => (await this.placar()).questao === 1, 'O quiz nao voltou para a pergunta 1');
  }
}

module.exports = { QuizPage };
