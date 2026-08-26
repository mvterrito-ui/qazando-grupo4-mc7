# Como o trabalho foi dividido

O produto tem 13 telas e nós somos 4 pessoas. Este arquivo explica **como as telas foram
agrupadas** e **o que cada pessoa recebe**.

---

## O critério da divisão

A gente **não** dividiu na ordem do menu. Dividiu por **tipo de teste que cada tela exige**.

Por quê? Porque testar uma tela de cadastro e testar uma tela de inteligência artificial são
habilidades diferentes. Se cada pessoa pular de assunto o tempo todo, ninguém aprende nada
direito. Agrupando por semelhança, **o que você aprender na primeira tela da sua parte serve
nas outras** — você vira especialista naquele tipo de problema.

As partes foram distribuídas por **sorteio aleatório e verificável** — ninguém escolheu e
ninguém foi escalado. O resultado, o método e o comando para conferir estão em
[06-sorteio-das-partes.md](06-sorteio-das-partes.md).

## O que significa "ser dono de uma parte"

Quem pega uma parte faz ela **do começo ao fim**, sozinho:

1. lê as regras da `/docs` referentes à sua parte
2. testa explorando, sem roteiro, e anota o que estranhar
3. escreve os cenários de teste
4. passa os cenários para Gherkin (Dado/Quando/Então)
5. reporta os bugs que achou, com evidência
6. automatiza os cenários que valem a pena
7. reteste os bugs quando forem corrigidos

Ninguém depende de ninguém para começar. Cada pessoa tem sua área e toca ela.

---

# Parte 1 — Acesso e Permissão

**Responsável:** Flavia

### Telas
`/auth` (login, cadastro, esqueci minha senha, entrar com Google, entrar com Apple) ·
`/activate-premium` · Painel Admin · e a regra de bloqueio premium, que vale para todas as rotas

### Que tipo de teste é este
Testar **formulário, entrada e permissão**. Ou seja: o sistema aceita o que deveria aceitar,
recusa o que deveria recusar, e só deixa entrar quem tem direito.

### Regras que a `/docs` define
- Cadastro exige e-mail válido e confirmação por e-mail obrigatória
- Login só funciona depois da confirmação do e-mail
- "Esqueci minha senha" envia link de redefinição por e-mail
- Senha deve ter no mínimo 6 caracteres
- Códigos premium são reutilizáveis — vários usuários podem usar o mesmo
- Sem premium: acesso apenas à Documentação e ao Ativar Premium
- Com premium: acesso total às funcionalidades de aprendizado
- Usuários admin acessam tudo, independente de premium
- Só quem tem perfil `admin` entra no painel
- Admin pode criar códigos (customizados ou aleatórios), listar e apagar

### Por que essa parte é a mais importante
**As outras três partes não existem sem ela.** Ninguém consegue testar trilha, quiz ou IA sem
uma conta com premium ativo. Quem pegar esta parte entrega antes dos outros.

### O lado bom
É a **única parte sem nenhuma inteligência artificial**. Tudo aqui é previsível: mesma entrada,
mesma saída, sempre. É a parte mais fácil de automatizar e a melhor para quem está começando.

---

# Parte 2 — Prática Estruturada

**Responsável:** João Paulo

### Telas
`/duolingo` (Trilha do Inglês) · `/exercises` (Exercícios) · `/flashcards` (Flashcards QA)

### Que tipo de teste é este
Testar **progresso e memória do sistema**. Estas três telas guardam onde você parou. O teste
central não é "funcionou agora", é "**continuou funcionando depois que eu saí e voltei**".

### Regras que a `/docs` define
- 4 unidades progressivas, com lições dentro de cada uma
- Lições desbloqueiam em sequência — só avança quem concluiu a anterior
- Cada lição concluída dá XP
- Progresso é salvo automaticamente no banco de dados
- Exercícios: 30 questões de preenchimento de frase
- Progresso é salvo — pode sair e voltar
- Pode recomeçar a qualquer momento
- Histórico completo de respostas fica visível
- 40 flashcards iniciais de vocabulário de QA
- Usuário avalia cada cartão como Difícil, Médio ou Fácil
- Um algoritmo (SM-2 simplificado) decide quando o cartão volta a aparecer
- Estatísticas: fila do dia, revisados hoje, dominados

### O nó desta parte
Quase toda regra aqui **só se prova saindo e voltando**. Um teste que só olha a tela agora não
enxerga nada. É a parte com mais cenário de duas etapas — e é exatamente onde se escondem os
bugs de "o sistema esqueceu o que eu fiz".

### Ponto de partida do ambiente
Numa conta nova: 0 XP, 0 lições completadas, só a Lição 1 da Unidade 1 liberada, e 40 cartões
na fila dos flashcards. Anote esse estado inicial — é a base de comparação de todos os testes.

---

# Parte 3 — Pontuação e Comparação

**Responsável:** Denaide de Cassia Sónora Souza Costa

### Telas
`/quiz` · `/progress` (Meu Progresso) · `/ranking`

### Que tipo de teste é este
Testar **conta**. Literalmente: conferir se os números que o sistema mostra estão certos.
É a parte mais "matemática" do projeto — e você não precisa saber matemática, só precisa
conferir soma e porcentagem.

### Regras que a `/docs` define
- Quiz: 30 perguntas de múltipla escolha, 3 opções cada, apenas uma correta
- Ganha XP a cada acerto
- Pode reiniciar para tentar melhorar a pontuação
- Progresso mostra frases respondidas, corretas e erradas (vindas dos Exercícios)
- Progresso mostra palavras respondidas, corretas e erradas (vindas do Quiz)
- Taxa de acerto calculada **separadamente** para cada tipo
- Dados atualizados em tempo real
- Ranking: mínimo de 5 exercícios completados para aparecer
- Ranking combina acertos de Quiz + Exercícios no total
- Ordenado por total de acertos, do maior para o menor
- Exibe nome, e-mail e estatísticas de cada participante

### O nó desta parte
As três telas são **a mesma verdade contada três vezes**. Se o quiz disse que você acertou 7,
o Meu Progresso tem que dizer 7, e o Ranking tem que somar 7. Qualquer diferença entre elas
é bug.

E é um bug que **só aparece para quem testa as três juntas**. Quem olhar uma tela isolada vai
achar que está tudo certo. Esse é o valor da sua parte.

### Atenção à massa de dados
Hoje o ranking está vazio: 0 competidores, líder "N/A". Para conseguir testar o ranking você
precisa **primeiro responder pelo menos 5 exercícios**, senão não aparece ninguém — nem você.
Isso não é bug, é a regra dos 5 exercícios funcionando.

---

# Parte 4 — Conteúdo com IA

**Responsável:** Marcos Vinicio Territo

### Telas
`/stories` (Historinhas) · `/interview` (Entrevistas) · `/chatbot` (Falar com Max) ·
`/words` (Gerador de Palavras) · `/pronunciation` (Treinar Fala)

### Que tipo de teste é este
Testar coisa que **muda toda vez**. A IA nunca responde exatamente igual duas vezes — e isso
quebra a forma normal de testar.

### Regras que a `/docs` define
- **Historinhas:** usuário digita o tema; a IA gera a história em inglês com tradução em
  português; história nova a cada solicitação
- **Entrevistas:** a IA gera pergunta técnica de QA em inglês; o usuário responde livremente
  por texto; a IA avalia e dá feedback; existe opção de traduzir o feedback
- **Falar com Max:** chat livre com IA; aceita entrada por voz (microfone); mensagens podem ser
  traduzidas sob demanda; avatar animado opcional
- **Gerador de Palavras:** usuário escolhe tema e **quantidade de 1 a 100**; a IA gera palavras
  com tradução e frase de exemplo; há áudio de pronúncia por palavra
- **Treinar Fala:** a IA gera uma frase em inglês; o usuário ouve a pronúncia correta; grava a
  própria voz; o feedback compara o que foi reconhecido com o que era esperado

### A regra de ouro desta parte

**Não teste o conteúdo que a IA gerou. Teste o comportamento em volta dele.**

Se você escrever "Então a história deve falar sobre um dragão que voa sobre a montanha", seu
teste vai falhar amanhã sem que exista bug nenhum — porque a IA escreveu outra história, e ela
tinha o direito de escrever.

O que você verifica, em vez disso:

| ❌ Não verifique | ✅ Verifique |
|---|---|
| o texto exato que a IA escreveu | que veio algum texto, e que não veio vazio |
| se a história é boa | que a história está em inglês e a tradução em português |
| a resposta específica do Max | que a mensagem apareceu na conversa |
| as palavras que a IA escolheu | que vieram **exatamente** as 10 palavras pedidas |
| — | que o "carregando" apareceu e depois sumiu |
| — | que a tela mudou de estado depois da ação |

A qualidade do texto em si fica no teste manual, feito com o olho humano — e isso está certo.

### O que mais rende bug aqui
Os **limites de entrada**. É a parte mais fácil de quebrar do projeto: campo de quantidade,
tema vazio, texto gigante. **Um bug já foi achado assim em cinco minutos** — veja o
[bug 002](../bugs/002-gerador-palavras-aceita-quantidade-invalida.md).

### O ponto mais técnico do projeto
Duas telas usam **microfone** (Falar com Max e Treinar Fala). Testar áudio no navegador é a
tarefa mais difícil deste projeto. Na automação existe um jeito de simular: o navegador aceita
um arquivo de áudio no lugar do microfone real. Quem pegar esta parte vai precisar de ajuda
nesse ponto específico — e isso está previsto.

---

## Resumo

| Parte | Telas | Tipo de teste | Tem IA? | Dificuldade |
|---|---|---|---|---|
| 1 — Acesso e Permissão | 3 + regra de bloqueio | formulário e permissão | não | mais acessível |
| 2 — Prática Estruturada | 3 | progresso e memória | não | média |
| 3 — Pontuação e Comparação | 3 | conferência de números | não | média |
| 4 — Conteúdo com IA | 5 | comportamento e mídia | sim | mais técnica |

**Uma única dependência entre as partes:** a Parte 1 destrava as outras três. Quem pegar ela
entrega primeiro, porque o resto do grupo está esperando conseguir entrar na plataforma.

Duas pessoas podem **trocar de parte** se as duas concordarem — basta avisar o grupo e
atualizar este arquivo, o [06-sorteio-das-partes.md](06-sorteio-das-partes.md) e o `README.md`
da pasta correspondente em [`cenarios/`](../cenarios/). O que não vale é trocar sem registrar.
