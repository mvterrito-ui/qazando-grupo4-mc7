# Guia do iniciante

Este guia é para quem nunca trabalhou num projeto de testes. Ele explica **o que a gente vai
fazer, com que palavras, e por quê**. Leia inteiro uma vez — depois volte quando bater dúvida.

---

## 1. O que é testar, afinal

Testar não é "usar o site para ver se está bom". Testar é **fazer uma pergunta específica ao
sistema e conferir se a resposta é a esperada**.

Compare:

> ❌ "Vou dar uma olhada no cadastro."
> ✅ "Se eu tentar me cadastrar com uma senha de 5 caracteres, o sistema deve me impedir,
>    porque a regra diz que a senha tem no mínimo 6."

A segunda frase tem tudo o que um teste precisa: uma **situação**, uma **ação** e um
**resultado esperado**. É isso que a gente vai escrever centenas de vezes neste projeto.

---

## 2. Regra de negócio: de onde vem o "esperado"

**Regra de negócio** é uma decisão sobre como o sistema deve se comportar. Não é opinião nossa,
é definição do produto. Exemplo, tirado da própria plataforma:

> *"Senha deve ter no mínimo 6 caracteres"*
> *"Lições desbloqueiam sequencialmente — complete a anterior para avançar"*
> *"Mínimo de 5 exercícios completados para aparecer no ranking"*

**Sem regra de negócio, não existe bug — existe reclamação.** Se você acha uma tela feia, isso
é gosto. Se a tela contraria uma regra escrita, isso é defeito, e ninguém discute.

**A sorte deste projeto:** a plataforma publica as regras dela numa página aberta, a
*Documentação* (`/docs` no menu lateral). Em projeto real, quase nunca temos isso — a gente
implora por especificação. Aqui está tudo escrito. **Leia essa página inteira antes de testar
qualquer coisa.** Cada regra que você lê ali é um teste esperando para ser escrito.

---

## 3. Cenário de teste

**Cenário** é uma situação de uso que a gente decide verificar. Um cenário responde a
"o que acontece SE...".

Exemplos de cenários para a tela de login:

- Entrar com e-mail e senha corretos
- Entrar com a senha errada
- Entrar com um e-mail que não existe
- Entrar com o campo de senha vazio
- Entrar com uma conta que ainda não confirmou o e-mail

Repare: **uma tela sozinha rende muitos cenários.** O caminho que dá certo é apenas um deles —
e normalmente é o menos interessante, porque é o que todo mundo já testou. O valor do QA está
nos outros.

**Como achar cenários**, na ordem:

1. **O caminho feliz** — o uso normal, tudo certo. Sempre o primeiro.
2. **Cada regra de negócio da `/docs`** — vire cada regra em pelo menos um cenário.
3. **Os limites** — se a regra diz "de 1 a 100", teste 1, teste 100, teste 0, teste 101.
   Bug mora na borda.
4. **O vazio e o errado** — campo em branco, texto onde se espera número, e-mail sem "@".
5. **O caminho torto** — sair no meio e voltar, apertar o botão duas vezes, abrir a tela
   pela URL sem ter permissão.

---

## 4. Gherkin: o jeito padrão de escrever um cenário

**Gherkin** é só um formato de escrita. Serve para que todo mundo — quem testa, quem programa,
quem gerencia — leia o mesmo cenário e entenda a mesma coisa. Tem três palavras principais:

| Palavra | Significa | Responde |
|---|---|---|
| **Dado** | a situação inicial, antes de qualquer ação | "como as coisas estavam?" |
| **Quando** | a ação que a pessoa faz | "o que foi feito?" |
| **Então** | o resultado que se espera | "o que deveria acontecer?" |

E mais duas de apoio:

| Palavra | Para quê |
|---|---|
| **E** | continua o passo anterior, sem repetir a palavra |
| **Mas** | continua o passo anterior indicando uma negação |

### Exemplo completo

```gherkin
Funcionalidade: Cadastro de usuário

  Cenário: Não permitir senha com menos de 6 caracteres
    Dado que estou na tela de cadastro
    Quando informo um e-mail válido
    E informo a senha "12345"
    E confirmo o cadastro
    Então o sistema deve recusar o cadastro
    E deve me avisar que a senha precisa ter no mínimo 6 caracteres
```

### As três regras de ouro do Gherkin

**1. Escreva na linguagem do negócio, não na da tela.**

> ❌ `Quando clico no elemento #btn-submit`
> ✅ `Quando confirmo o cadastro`

Por quê: se amanhã o botão mudar de nome, cor ou lugar, o cenário continua verdadeiro. O que
não muda é a *intenção* de quem usa.

**2. Um cenário verifica uma coisa só.**

> ❌ `Então o cadastro é recusado, e o e-mail não é enviado, e o contador não sobe`
> ✅ três cenários, um para cada verificação

Por quê: quando um cenário com cinco verificações falha, você não sabe qual delas quebrou.

**3. O "Então" precisa ser observável.**

> ❌ `Então o sistema processa corretamente`
> ✅ `Então a mensagem "Senha muito curta" aparece na tela`

Por quê: se você não consegue *ver* o resultado, não consegue provar que ele aconteceu.

---

## 5. Teste exploratório

**Teste exploratório** é sentar na frente do sistema **sem roteiro pronto** e ir descobrindo,
anotando tudo o que parecer estranho. É como a gente começa, antes de ter cenários escritos.

Como fazer bem:
- Reserve um tempo fechado (1 hora) e uma área só (a sua parte).
- Deixe a `/docs` aberta ao lado e vá conferindo regra por regra.
- Anote **tudo** que estranhar, mesmo sem certeza de que é bug.
- Tire print na hora. Depois você não reproduz mais.

---

## 6. Bug

**Bug** (ou defeito) é o sistema se comportando **diferente do que a regra diz**. Não é
"não gostei". Não é "eu faria diferente".

### O formato que o grupo usa — sempre este

```
CENÁRIO: <o que você tentou fazer>
DADO <como as coisas estavam>
QUANDO <o que você fez>
ENTÃO <o que deveria ter acontecido>

PROBLEMA IDENTIFICADO: <o que aconteceu de verdade, com evidência>
```

Repare que é o mesmo Dado/Quando/Então do Gherkin. Não é coincidência: **um bug é um cenário
que falhou.**

### Exemplo real, achado nesta plataforma

```
CENÁRIO: Gerar vocabulário com quantidade inválida
DADO que a documentação define "quantidade de palavras (1 a 100)"
QUANDO informo 101 no campo de quantidade
ENTÃO a tela deveria impedir o envio e avisar o limite

PROBLEMA IDENTIFICADO: o campo aceita 101 e o botão "Gerar Palavras com IA"
continua habilitado, contrariando a regra publicada na documentação.
```

Veja o que faz esse bug ser bom: ele **cita a regra**. Não dá para alguém responder "mas é
assim mesmo" — a própria plataforma diz que não é.

### Evidência

**Sem evidência não é bug, é opinião.** Evidência é a prova do que você viu:

- **Print da tela** — o mínimo. Mostre a tela inteira, não só o pedacinho.
- **Vídeo** — quando o problema só aparece em movimento (algo pisca, some, trava).
- **A URL** onde aconteceu e **qual conta** você usava.

### Severidade

**Severidade** é o tamanho do estrago. A gente usa três níveis:

| Nível | Quando usar | Exemplo |
|---|---|---|
| **Alta** | impede de usar, ou mostra informação errada | não consigo entrar; o ranking mostra pontuação errada |
| **Média** | atrapalha, mas dá para contornar | o progresso só atualiza depois de recarregar a página |
| **Baixa** | incomoda, não impede | erro de escrita no título da tela |

Na dúvida entre dois níveis, escolha o menor e explique o porquê. Exagerar severidade queima
a credibilidade do grupo inteiro.

---

## 7. Automação de teste

**Automação** é escrever um programa que faz o teste sozinho, sempre igual, quantas vezes você
quiser. A gente vai usar uma ferramenta chamada **Playwright**: ela abre um navegador de
verdade, clica, digita e confere as coisas no lugar da pessoa.

Duas coisas importantes para quem está começando:

**Automação não substitui você.** Ela repete o que você já sabe verificar. Quem descobre o que
precisa ser verificado é a pessoa. Por isso a ordem é sempre: explorar → escrever o cenário →
depois automatizar. Automatizar antes de entender é escrever código para conferir a coisa errada.

**A gente não automatiza tudo.** Automatiza o que dói se quebrar e o que é chato de repetir na
mão. O resto continua sendo teste manual, e isso não tem nada de errado.

Quando chegar a hora, **ninguém vai começar do zero**: o repositório terá um exemplo pronto,
comentado linha por linha, e a pessoa que doou a arquitetura vai fazer duas sessões de
programação em par com o grupo. Copiar o exemplo e adaptar é o caminho certo, não é trapaça.

---

## 8. O ciclo completo, do começo ao fim

É este o caminho que cada pessoa vai percorrer na sua parte:

```
1. Ler as regras da /docs        →  descobrir o que o sistema PROMETE
2. Testar explorando             →  ver o que ele FAZ de verdade
3. Escrever os cenários          →  registrar o que precisa ser verificado
4. Passar os cenários p/ Gherkin →  no formato Dado/Quando/Então
5. Reportar os bugs achados      →  com evidência e a regra citada
6. Automatizar o que vale        →  os cenários que doem se quebrarem
7. Retestar o que foi corrigido  →  confirmar que o conserto funcionou
```

O passo 7 é o mais esquecido e o mais importante. **Bug corrigido que ninguém conferiu não
está corrigido** — está apenas marcado como corrigido.

---

## 9. Dúvida travou você? Fale.

Ficar dois dias parado no mesmo ponto sem avisar é o único erro grave possível neste projeto.
Todo mundo aqui está aprendendo. Perguntar cedo é o comportamento esperado, não é fraqueza.

Se um termo apareceu e você não conhece, olhe o [Glossário](05-glossario.md).
