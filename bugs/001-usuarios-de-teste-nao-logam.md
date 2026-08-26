# 001 — Usuários de teste da documentação não conseguem logar

**Parte:** 1 — Acesso e Permissão
**Tela:** `/auth`
**Severidade:** Alta
**Encontrado por:** Grupo 4
**Data:** 26/08/2026
**Situação:** Aberto

## Descrição

```
CENÁRIO: Entrar com os usuários de teste publicados na documentação
DADO que a página /docs publica quatro contas de teste com a senha Teste@123
QUANDO faço login com ativo@teste.com / Teste@123
ENTÃO deveria entrar como usuário premium, conforme a documentação descreve

PROBLEMA IDENTIFICADO: a tela exibe "Erro ao fazer login — Email ou senha
incorretos" e a API de autenticação responde com erro 400. O mesmo acontece
com inativo@teste.com. As contas documentadas não existem, ou estão com
outra senha.
```

## Regra contrariada

A página `/docs` publica uma tabela chamada **Usuários de Teste** com quatro contas e a
descrição de cada perfil:

> `admin@teste.com` / `Teste@123` — Usuário administrador com acesso ao painel de gestão
> `ativo@teste.com` / `Teste@123` — Usuário com premium ativado, acesso total
> `inativo@teste.com` / `Teste@123` — Usuário sem premium, acesso limitado
> `semconfirmar@teste.com` / `Teste@123` — Conta criada mas email não verificado

## Evidência

Tela de login exibindo "Erro ao fazer login — Email ou senha incorretos" após informar
`ativo@teste.com` / `Teste@123`. A chamada de autenticação retorna **HTTP 400**.
Comportamento idêntico com `inativo@teste.com`.

## Por que é severidade Alta

Estas contas existem justamente para permitir testar os quatro perfis — administrador,
premium, comum e não confirmado — sem precisar criar conta. Sem elas:

- não há como testar o **Painel Admin**, que exige perfil de administrador
- não há como testar o cenário de **login com e-mail não confirmado** sem criar uma conta e
  deixá-la sem confirmar de propósito
- todo QA que abrir a documentação vai tropeçar nisso antes de qualquer outra coisa

## Observações

Ainda não foi testado se `admin@teste.com` e `semconfirmar@teste.com` apresentam o mesmo
comportamento. **Completar esse teste** e atualizar este arquivo.
