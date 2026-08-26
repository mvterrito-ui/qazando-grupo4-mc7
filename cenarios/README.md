# Cenários de teste

Uma pasta por parte do projeto. Trabalhe só na pasta da **sua** parte.

| Pasta | Parte | Responsável |
|---|---|---|
| [`parte-1-acesso-e-permissao/`](parte-1-acesso-e-permissao/) | Acesso e Permissão | Flavia |
| [`parte-2-pratica-estruturada/`](parte-2-pratica-estruturada/) | Prática Estruturada | João Paulo |
| [`parte-3-pontuacao-e-comparacao/`](parte-3-pontuacao-e-comparacao/) | Pontuação e Comparação | Denaide de Cassia Sónora Souza Costa |
| [`parte-4-conteudo-com-ia/`](parte-4-conteudo-com-ia/) | Conteúdo com IA | Marcos Vinicio Territo |

Os donos foram definidos por **sorteio** — ver [docs/06-sorteio-das-partes.md](../docs/06-sorteio-das-partes.md).

## Como trabalhar aqui

Dentro da pasta da sua parte tem um `README.md` com uma **lista de cenários-semente**: cenários
que já identificamos lendo as regras da plataforma. Eles são um ponto de partida, **não a lista
final**. Sua primeira tarefa é testar explorando e aumentar essa lista.

Depois, cada cenário vira um arquivo `.feature`, escrito em Gherkin. Um arquivo por tela ou por
assunto — não um arquivo por cenário, senão viram dezenas.

Exemplo de nome de arquivo: `cadastro.feature`, `login.feature`, `ativacao-premium.feature`.

## Modelo de arquivo `.feature`

Copie este modelo para começar:

```gherkin
# Tela: <endereço da tela, ex: /auth>
# Regra da /docs que este arquivo cobre: <cole a regra aqui>

Funcionalidade: <nome curto do que está sendo testado>

  Contexto:
    Dado que estou logado com uma conta premium

  Cenário: <o que este cenário verifica, em uma frase>
    Dado <a situação inicial>
    Quando <a ação que a pessoa faz>
    Então <o resultado que se espera>

  Cenário: <outro cenário>
    Dado <...>
    Quando <...>
    Então <...>
```

O bloco **Contexto** é opcional: use quando todos os cenários do arquivo partirem da mesma
situação inicial, para não repetir a mesma linha em todos.

## Lembretes rápidos

- Linguagem do negócio, não da tela: `Quando confirmo o cadastro`, não `Quando clico no #btn`.
- Um cenário verifica **uma coisa só**.
- O `Então` precisa ser algo que dá para **ver na tela**.

Tudo isso está explicado com calma no [Guia do iniciante](../docs/04-guia-do-iniciante.md).
