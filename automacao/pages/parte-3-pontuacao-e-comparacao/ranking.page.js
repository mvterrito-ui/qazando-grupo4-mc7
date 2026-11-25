// ============================================================================
// PAGE OBJECT -- /ranking (Ranking Alunos Qazando)
//
// O ranking e de TODOS os alunos da plataforma (mais de 150 linhas em
// 25/11/2026), e muda a qualquer momento. Por isso os testes nao conferem
// valores fixos: conferem regras que valem para qualquer linha.
//
// Tabela: Posicao | Nome | Exercicios | Corretas | Taxa de Acerto
// Cartoes: Total de Competidores | Lider Atual | Maior Precisao
// ============================================================================

class RankingPage {
  constructor(page) {
    this.page = page;
    this.principal = page.locator('main');
    this.cabecalhos = page.locator('thead th');
    this.linhas = page.locator('tbody tr');
  }

  async abrir() {
    await this.page.goto('/ranking');
    await this.linhas.first().waitFor({ timeout: 30000 });
  }

  async nomesDasColunas() {
    return (await this.cabecalhos.allInnerTexts()).map((t) => t.trim());
  }

  /** Todas as linhas como objetos: { posicao, nome, exercicios, corretas, taxa }. */
  async tabela() {
    const linhas = await this.linhas.evaluateAll((trs) =>
      trs.map((tr) => [...tr.querySelectorAll('td')].map((td) => td.innerText.trim()))
    );
    return linhas.map(([posicao, nome, exercicios, corretas, taxa]) => ({
      posicao: parseInt(posicao.replace('#', ''), 10),
      nome,
      exercicios: parseInt(exercicios, 10),
      corretas: parseInt(corretas, 10),
      taxa: parseFloat(taxa.replace('%', '')),
    }));
  }

  /** Os tres cartoes do topo. */
  async cartoes() {
    const t = await this.principal.innerText();
    const depois = (rotulo) => {
      const m = t.match(new RegExp(`${rotulo}\\s*\\n\\s*(.+)`, 'i'));
      return m ? m[1].trim() : null;
    };
    return {
      totalCompetidores: parseInt(depois('Total de Competidores'), 10),
      liderAtual: depois('L[ií]der Atual'),
      maiorPrecisao: parseFloat(depois('Maior Precis[aã]o')),
    };
  }
}

module.exports = { RankingPage };
