# Documentação da API

## Rota de Cadastro do Usuário

A rota de cadastro de usuários conta com os seguintes parametros a serem enviados pelo sistema para ela:

- fullname: Representa o nome completo
- email: O email do usuário que será cadastrado (tem que ser um email válido)
- birthday: Data de nasciemnto do usuário, para gerar o cálculo de idade
- password: Senha do usuário que deve conter um número, um caractere especial, uma letra maiúscula e no mínimo 8 caracteres
- city: Cidade do usuário
- phoneNumber: Número de telefone do usuário

Após o envio a API retorna os mesmo dados enviados sem a senha

```
{
  "fullname": string,
  "email": string,
  "birthday": "yyyy-MM-dd",
  "city": string,
  "phoneNumber": "5599999999999"
}

```