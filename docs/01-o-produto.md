# O produto que vamos testar

**English QA** — https://english.qazando.com.br

É uma plataforma da Qazando para profissionais de QA aprenderem **inglês técnico**: vocabulário
de testes, simulação de entrevista em inglês, prática de conversação e de pronúncia. O uso é
gratuito, mas quase tudo fica trancado até você ativar um código premium.

*(Mapeamento feito com login em 26/08/2026. Se alguma tela mudar, atualize este arquivo.)*

---

## Cuidado: a página inicial mente sobre o tamanho do produto

A página inicial anuncia **6 funcionalidades**. O aplicativo, depois que você entra, tem
**13 telas**. Quem planejar o trabalho olhando só a página inicial vai dimensionar o projeto
pela metade.

---

## As 13 telas

Cada endereço abaixo vem depois de `https://english.qazando.com.br`.

### Telas abertas (não precisa de premium)

| Endereço | Tela | O que faz |
|---|---|---|
| `/auth` | Login e Cadastro | entrar, criar conta, recuperar senha, entrar com Google ou Apple |
| `/activate-premium` | Ativar Premium | digitar o código que libera o resto da plataforma |
| `/docs` | Documentação | **as regras de negócio de todas as funcionalidades** |

### Telas que exigem premium

| Endereço | Tela | O que faz |
|---|---|---|
| `/duolingo` | Trilha do Inglês | percurso com 4 unidades e lições que desbloqueiam em ordem, dando XP |
| `/exercises` | Exercícios | 30 questões de completar a frase em inglês |
| `/quiz` | Quiz | 30 perguntas de múltipla escolha sobre tradução de palavras |
| `/progress` | Meu Progresso | quantas respostas você deu, quantas acertou e sua taxa de acerto |
| `/ranking` | Ranking | comparação entre os alunos, por total de acertos |
| `/flashcards` | Flashcards QA | 40 cartões de vocabulário de QA, com repetição espaçada |
| `/stories` | Historinhas | a IA escreve uma história em inglês sobre o tema que você pedir |
| `/interview` | Entrevistas | a IA faz uma pergunta de entrevista e avalia sua resposta |
| `/chatbot` | Falar com Max | conversa livre em inglês com uma IA, por texto ou por voz |
| `/words` | Gerador de Palavras | a IA monta uma lista de vocabulário sobre um tema |
| `/pronunciation` | Treinar Fala | a IA gera uma frase, você grava sua voz e recebe uma comparação |

### Tela de administrador

| Tela | O que faz |
|---|---|
| Painel Admin | criar, listar e apagar os códigos premium. Só quem tem perfil de administrador entra. |

---

## O achado mais importante do projeto: a página `/docs`

A plataforma **publica as próprias regras de negócio** numa página aberta, chamada
*Documentação* no menu lateral. Lá dentro, cada funcionalidade tem um bloco explicando o que
ela faz e uma lista chamada **REGRAS DE NEGÓCIO**.

Alguns exemplos do que está escrito lá:

> *"Cadastro exige email válido e confirmação por email obrigatória"*
> *"Senha deve ter no mínimo 6 caracteres"*
> *"Lições desbloqueiam sequencialmente — complete a anterior para avançar"*
> *"30 perguntas de múltipla escolha — 3 opções por pergunta, apenas uma correta"*
> *"Mínimo de 5 exercícios completados para aparecer no ranking"*
> *"Usuário escolhe o tema e quantidade de palavras (1 a 100)"*
> *"Códigos premium são reutilizáveis — vários usuários podem usar o mesmo código"*

### Por que isso muda tudo para a gente

Em projeto real, o QA raramente recebe as regras escritas. A gente descobre perguntando,
adivinhando, ou testando e vendo no que dá. **Aqui está tudo publicado.**

Isso significa duas coisas na prática:

1. **Você não precisa inventar cenário.** Cada regra da `/docs` já é um cenário. Se está
   escrito "senha de no mínimo 6 caracteres", existe um teste para senha de 5 e outro para
   senha de 6.
2. **Bug que contraria a `/docs` é indiscutível.** Você não vai precisar convencer ninguém de
   que é defeito — a própria plataforma documentou o comportamento esperado. Sempre **cite a
   regra** dentro do bug.

**Antes de escrever qualquer cenário, leia a `/docs` inteira.** É a hora mais bem gasta do
projeto todo.

---

## Contas: como cada pessoa entra

### Os usuários de teste da documentação não funcionam

A `/docs` publica quatro contas de teste (`admin@teste.com`, `ativo@teste.com`,
`inativo@teste.com`, `semconfirmar@teste.com`, todas com a senha `Teste@123`).

**Nenhuma delas entra.** Testadas em 26/08/2026, retornam "Email ou senha incorretos". Isso já
virou o [bug 001](../bugs/001-usuarios-de-teste-nao-logam.md).

### Então, o que fazer

1. Cada pessoa cria a **própria conta** com o próprio e-mail.
2. Cada pessoa ativa o premium com o código `QAZANDOENGLISH2025`, em *Ativar Premium*.
   O código é reutilizável — todos podem usar o mesmo.

**Nunca compartilhem uma conta só.** Progresso, XP, ranking e flashcards são guardados por
usuário. Se duas pessoas usarem a mesma conta, uma vai alterar o estado da outra e o grupo vai
reportar bug que não existe — o pior tipo de trabalho perdido.
