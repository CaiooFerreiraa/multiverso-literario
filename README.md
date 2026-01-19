# Multiverso Literário

## Instalação e Execução

### Instalar dependências

```bash
bun install
```

### Executar o projeto

```bash
bun start
```

Este projeto foi criado utilizando `bun init` na versão **v1.3.5** do Bun.
O **Bun** é um runtime JavaScript moderno, rápido e completo.
Mais informações: [https://bun.com](https://bun.com)

---

# Documentação da API

## Cadastro de Usuário

Endpoint responsável por cadastrar um novo usuário no sistema.

### Parâmetros de entrada

* **fullname** *(string)*: Nome completo do usuário
* **email** *(string)*: E-mail válido do usuário
* **birthday** *(string | yyyy-MM-dd)*: Data de nascimento (utilizada para cálculo de idade)
* **password** *(string)*: Senha do usuário

  * Deve conter no mínimo 8 caracteres
  * Deve possuir pelo menos:

    * 1 letra maiúscula
    * 1 número
    * 1 caractere especial
* **city** *(string)*: Cidade do usuário
* **phoneNumber** *(string)*: Número de telefone no formato internacional

### Retorno

A API retorna os dados cadastrados, **sem a senha**.

```json
{
  "fullname": "string",
  "email": "string",
  "birthday": "yyyy-MM-dd",
  "city": "string",
  "phoneNumber": "5599999999999"
}
```

---

## Leitura de Usuário

Endpoint responsável por retornar os dados de um usuário.
Utilizado, por exemplo, quando o usuário acessa o próprio perfil.

### Parâmetros de entrada

* **id_user** *(number)*: Identificador do usuário

### Retorno

Retorna todos os dados do usuário, incluindo a senha.

```json
{
  "fullname": "string",
  "email": "string",
  "birthday": "yyyy-MM-dd",
  "city": "string",
  "phoneNumber": "5599999999999",
  "password": "string"
}
```

---

## Atualização de Usuário

Endpoint responsável por atualizar os dados de um usuário existente.

### Parâmetros de entrada

* **id_user** *(number)*: Identificador do usuário
* **fullname** *(string)*: Nome completo
* **email** *(string)*: E-mail válido
* **birthday** *(string | yyyy-MM-dd)*: Data de nascimento
* **password** *(string)*: Nova senha (seguindo as regras de segurança)
* **city** *(string)*: Cidade do usuário
* **phoneNumber** *(string)*: Número de telefone

### Retorno

A API retorna os dados atualizados, **sem a senha**, juntamente com o `id_user`.

```json
{
  "fullname": "string",
  "email": "string",
  "birthday": "yyyy-MM-dd",
  "city": "string",
  "phoneNumber": "5599999999999"
}
```

---

## Exclusão de Usuário

Endpoint responsável por remover definitivamente um usuário do sistema.
Utilizado quando o usuário seleciona a opção **Deletar Conta**.

### Parâmetros de entrada

* **id_user** *(number)*: Identificador do usuário

### Retorno

Retorna os dados do usuário que foram excluídos.

```json
{
  "fullname": "string",
  "email": "string",
  "birthday": "yyyy-MM-dd",
  "city": "string",
  "phoneNumber": "5599999999999"
}
```

---

📌 **Observações**

* Todas as rotas devem validar os dados de entrada
* Recomenda-se o uso de HTTPS
* Senhas devem ser armazenadas de forma criptografada
