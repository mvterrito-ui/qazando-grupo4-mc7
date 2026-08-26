# Sorteio das partes

As quatro partes do projeto foram distribuídas por **sorteio aleatório**, em 26/08/2026.

Ninguém escolheu, ninguém foi escalado. Todo mundo é iniciante e nenhuma parte é prêmio ou
castigo — o sorteio evita a conversa chata de quem fica com o quê e faz todo mundo começar ao
mesmo tempo.

---

## Resultado

| Parte | Responsável |
|---|---|
| **Parte 1 — Acesso e Permissão** | Marcos Vinicio Territo |
| **Parte 2 — Prática Estruturada** | João Paulo |
| **Parte 3 — Pontuação e Comparação** | Denaide de Cassia Sónora Souza Costa |
| **Parte 4 — Conteúdo com IA** | Flavia |

---

## Como o sorteio foi feito

Para o sorteio ser confiável, ele precisa ser **repetível**: qualquer pessoa do grupo consegue
rodar o mesmo comando e chegar ao mesmo resultado. Se o resultado não bater, o sorteio foi
adulterado.

**Semente do sorteio:** `1578667448`

A semente é um número sorteado pelo sistema operacional. Ela é o que torna o resultado
verificável: com a mesma semente e a mesma lista de nomes, o embaralhamento dá sempre igual.

**Lista de entrada, em ordem alfabética** (a ordem importa para o resultado bater):

```
Denaide de Cassia Sónora Souza Costa
Flavia
João Paulo
Marcos Vinicio Territo
```

**Comando para conferir** — cole no terminal, ou peça para alguém rodar na reunião:

```bash
python3 -c "
import random
nomes = ['Denaide de Cassia Sónora Souza Costa', 'Flavia', 'João Paulo', 'Marcos Vinicio Territo']
partes = ['Parte 1 — Acesso e Permissão', 'Parte 2 — Prática Estruturada',
          'Parte 3 — Pontuação e Comparação', 'Parte 4 — Conteúdo com IA']
random.seed(1578667448)
random.shuffle(nomes)
for p, n in zip(partes, nomes):
    print(f'{p} -> {n}')
"
```

Se a saída for igual à tabela acima, o sorteio está confirmado.

---

## Trocas

O sorteio é o ponto de partida, não uma sentença. **Duas pessoas podem trocar de parte** se as
duas concordarem — basta avisar o grupo e atualizar este arquivo, o
[`02-divisao-em-4-partes.md`](02-divisao-em-4-partes.md) e o `README.md` da pasta em
[`cenarios/`](../cenarios/).

O que não vale é trocar sem registrar. Aí ninguém sabe mais quem responde pelo quê.

---

## Um recado para quem tirou cada parte

**Parte 1 — Acesso e Permissão.** Você tirou a parte de que o grupo inteiro depende: ninguém
testa nada sem conseguir entrar e ativar o premium. Comece por ela e avise no grupo assim que
conseguir confirmar que a ativação funciona. Em compensação, é a parte mais previsível do
projeto — mesma entrada, mesma saída, sempre. É a mais fácil de automatizar.

**Parte 2 — Prática Estruturada.** A sua pergunta ao sistema é sempre a mesma: *"você lembra do
que eu fiz?"*. Quase todo cenário seu vai ter um "sai e volta". Se você testar só o que
aparece na tela no momento do clique, não vai encontrar nada — o defeito desta parte aparece
na segunda visita.

**Parte 3 — Pontuação e Comparação.** As suas três telas contam a mesma verdade três vezes. Seu
trabalho é conferir se elas concordam entre si. Anote no papel quantas questões você acertou
antes de abrir as telas: esse número anotado é o seu resultado esperado. Você vai precisar
responder 5 exercícios antes de conseguir testar o ranking.

**Parte 4 — Conteúdo com IA.** Você tirou a parte com mais telas e a mais estranha de testar:
a resposta muda toda vez. Leia com atenção a "regra de ouro" no README da sua pasta antes de
escrever o primeiro cenário — ela evita que você escreva testes que acusam defeito onde não
há. Duas das suas telas usam microfone; quando chegar nelas, peça ajuda, já está previsto que
essa parte precisa de apoio técnico.
