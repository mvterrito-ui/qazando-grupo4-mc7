# Parte 1 — Acesso e Permissão

**Responsável:** Marcos Vinicio Territo  
*(definido por sorteio — ver [docs/06-sorteio-das-partes.md](../../docs/06-sorteio-das-partes.md))*

**Telas:** `/auth` · `/activate-premium` · Painel Admin · regra de bloqueio premium em todas as rotas

---

## Regras da `/docs` que esta parte precisa cobrir

1. Cadastro exige e-mail válido e confirmação por e-mail obrigatória
2. Login só funciona após a confirmação do e-mail
3. "Esqueci minha senha" envia link de redefinição por e-mail
4. Senha deve ter no mínimo 6 caracteres
5. Códigos premium são reutilizáveis — vários usuários podem usar o mesmo
6. Sem premium: acesso apenas à Documentação e ao Ativar Premium
7. Com premium: acesso total às funcionalidades de aprendizado
8. Usuários admin acessam tudo, independente de premium
9. Apenas perfil `admin` acessa o Painel Admin
10. Admin pode criar (customizado ou aleatório), listar e apagar códigos

---

## Cenários-semente

Marque `[x]` conforme for escrevendo o `.feature` de cada um. **Aumente esta lista** conforme
for explorando — ela é ponto de partida, não teto.

### Cadastro
- [ ] Cadastrar com dados válidos e receber o pedido de confirmação por e-mail *(caminho feliz)*
- [ ] Cadastrar com e-mail sem "@" ou sem domínio
- [ ] Cadastrar com e-mail já usado por outra conta
- [ ] Cadastrar com senha de 5 caracteres *(regra 4 — deve recusar)*
- [ ] Cadastrar com senha de exatamente 6 caracteres *(regra 4 — deve aceitar)*
- [ ] Cadastrar com todos os campos em branco

### Login
- [ ] Entrar com e-mail e senha corretos *(caminho feliz)*
- [ ] Entrar com a senha errada
- [ ] Entrar com um e-mail que não existe
- [ ] Entrar com uma conta que ainda não confirmou o e-mail *(regra 2)*
- [ ] Entrar com os campos em branco

### Recuperação de senha
- [ ] Pedir redefinição para um e-mail cadastrado
- [ ] Pedir redefinição para um e-mail que não existe — e conferir se a mensagem entrega
      ou não a informação de que a conta não existe
- [ ] Redefinir a senha e entrar com a nova

### Ativação premium
- [ ] Ativar com o código correto e ver as telas liberarem *(caminho feliz)*
- [ ] Ativar com um código inválido
- [ ] Ativar com o campo em branco
- [ ] Ativar o **mesmo código numa segunda conta** *(regra 5 — deve funcionar)*
- [ ] Ativar um código que já está ativo na própria conta

### Permissão — o cenário mais importante desta parte
- [ ] Sem premium, tentar abrir **cada uma das 10 telas premium digitando o endereço na barra
      do navegador** *(regra 6)*. Não basta conferir que o menu bloqueia: o teste de verdade é
      entrar pela URL direta.
- [ ] Sem estar logado, tentar abrir uma tela premium pela URL
- [ ] Com premium, confirmar que as 10 telas abrem *(regra 7)*
- [ ] Usuário comum tentando abrir o Painel Admin pela URL *(regra 9)*

### Painel Admin
- [ ] Criar um código customizado e usá-lo numa conta
- [ ] Gerar um código aleatório
- [ ] Listar os códigos existentes
- [ ] Apagar um código e tentar usá-lo depois *(regra 10)*

---

## Exemplo pronto, para copiar

```gherkin
# Tela: /auth
# Regra da /docs: "Senha deve ter no mínimo 6 caracteres"

Funcionalidade: Cadastro de usuário

  Cenário: Recusar senha com menos de 6 caracteres
    Dado que estou na tela de cadastro
    Quando informo um e-mail válido ainda não cadastrado
    E informo a senha "12345"
    E confirmo o cadastro
    Então o cadastro não deve ser criado
    E devo ver um aviso de que a senha precisa ter no mínimo 6 caracteres

  Cenário: Aceitar senha com exatamente 6 caracteres
    Dado que estou na tela de cadastro
    Quando informo um e-mail válido ainda não cadastrado
    E informo a senha "123456"
    E confirmo o cadastro
    Então o cadastro deve ser criado
    E devo ser avisado de que preciso confirmar meu e-mail
```

Repare que os dois cenários testam a **mesma regra pelos dois lados**: o valor que deve ser
recusado e o valor que deve ser aceito. Sempre que uma regra tiver um número, teste os dois
lados dele.
