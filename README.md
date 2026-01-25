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

## Documentação da API

### 👤 Usuários (`/api/user`)

#### Criar Usuário
`POST` **/create**

Cadastra um novo usuário no sistema.

**Parâmetros de Entrada (Body)**

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `fullname` | `string` | Sim | Nome completo do usuário |
| `email` | `string` | Sim | E-mail válido |
| `birthday` | `string` | Sim | Data de nascimento (`yyyy-MM-dd`) |
| `password` | `string` | Sim | Senha (min. 8 caracteres, 1 maiúscula, 1 número, 1 especial) |
| `city` | `string` | Sim | Cidade |
| `phoneNumber` | `string` | Sim | Telefone formato internacional |

**Retorno (201 Created)**

```json
{
  "fullname": "Nome Usuário",
  "email": "email@exemplo.com",
  "birthday": "2000-01-01",
  "city": "Cidade",
  "phoneNumber": "5599999999999"
}
```

---

#### Ler Usuário
`GET` **/read**

Retorna os dados detalhados de um usuário.

**Parâmetros de Entrada (Body)**

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `email` | `string` | Sim | E-mail para identificação |

**Retorno (200 OK)**

```json
{
  "fullname": "Nome Usuário",
  "email": "email@exemplo.com",
  "birthday": "2000-01-01",
  "city": "Cidade",
  "phoneNumber": "5599999999999",
  "password": "hashed_password"
}
```

---

#### Atualizar Usuário
`PUT` **/update**

Atualiza os dados de um usuário existente.

**Parâmetros de Entrada (Body)**

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `id_user` | `number` | Sim | ID do usuário |
| `fullname` | `string` | Não | Nome completo |
| `email` | `string` | Não | E-mail válido |
| `birthday` | `string` | Não | Data de nascimento (`yyyy-MM-dd`) |
| `password` | `string` | Não | Nova senha |
| `city` | `string` | Não | Cidade |
| `phoneNumber` | `string` | Não | Telefone |

**Retorno (200 OK)**

```json
{
  "fullname": "Nome Atualizado",
  "email": "email@exemplo.com",
  "birthday": "2000-01-01",
  "city": "Nova Cidade",
  "phoneNumber": "5599999999999"
}
```

---

#### Deletar Usuário
`DELETE` **/delete**

Remove um usuário do sistema.

**Parâmetros de Entrada (Body)**

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `id_user` | `number` | Sim | ID do usuário |

**Retorno (200 OK)**

```json
{
  "fullname": "Nome Usuário",
  "email": "email@exemplo.com",
  "birthday": "2000-01-01",
  "city": "Cidade",
  "phoneNumber": "5599999999999"
}
```

---

### 📚 Timeline (`/api/timeline`)

#### Criar Timeline
`POST` **/create**

Adiciona um livro à timeline do usuário.

**Parâmetros de Entrada (Body)**

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `dateStart` | `string` | Sim | Início da leitura (`yyyy-MM-dd`) |
| `dateEnd` | `string` | Sim | Término da leitura (`yyyy-MM-dd`) |
| `nameBook` | `string` | Sim | Nome do livro |
| `authorBook` | `string` | Sim | Autor do livro |

**Retorno (201 Created)**

```json
{
  "dateStart": "2023-01-01",
  "dateEnd": "2023-01-10",
  "authorBook": "Autor Exemplo",
  "nameBook": "Livro Exemplo"
}
```

---

#### Ler Timeline por ID
`GET` **/read/:id_timeline**

Busca uma entrada específica na timeline.

**Parâmetros de Entrada (Path)**

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `id_timeline` | `string` | Sim | ID da timeline (via URL) |

**Retorno (200 OK)**

Objeto contendo os dados da entrada solicitada.

---

#### Atualizar Timeline
`PUT` **/update**

Atualiza uma entrada na timeline.

**Parâmetros de Entrada (Body)**

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `id_timeline` | `number` | Sim | ID da timeline |
| `dateStart` | `string` | Não | Início da leitura |
| `dateEnd` | `string` | Não | Término da leitura |
| `nameBook` | `string` | Não | Nome do livro |
| `authorBook` | `string` | Não | Autor do livro |

**Retorno (200 OK)**

```json
{
  "id_timeline": 1,
  "dateStart": "2023-01-05",
  "dateEnd": "2023-01-15",
  "nameBook": "Novo Titulo",
  "authorBook": "Novo Autor"
}
```

---

#### Deletar Timeline
`DELETE` **/delete/:id_timeline**

Remove uma entrada da timeline.

**Parâmetros de Entrada (Path)**

| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :---: | :--- |
| `id_timeline` | `string` | Sim | ID da timeline (via URL) |

**Retorno (200 OK)**

```json
{
  "id_timeline": "1"
}
```

---

### 📝 Notas Gerais

* **Segurança**: Senhas são armazenadas com criptografia.
* **Validação**: Todas as rotas possuem validação de dados via Zod.
* **Formato**: Todas as datas seguem o padrão `yyyy-MM-dd`.
