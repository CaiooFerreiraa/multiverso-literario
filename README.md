# Multiverso Literário

O **Multiverso Literário** é uma plataforma voltada para entusiastas de leitura, permitindo o gerenciamento de timelines de leitura, criação de quizzes personalizados e gestão de perfil de usuário.

## 🏗️ Estrutura do Projeto

O projeto segue os princípios da **Clean Architecture**, garantindo separação de responsabilidades e facilidade de manutenção.

```text
src/
├── domain/           # Camada de Domínio: Entidades e interfaces de repositórios (Regras de Negócio)
├── application/      # Camada de Aplicação: Casos de uso (Use Cases) e DTOs (Data Transfer Objects)
├── infrastructure/   # Camada de Infraestrutura: Implementações de banco de dados, adapters e drivers
└── interfaces/       # Camada de Interfaces: Controladores HTTP e definições de rotas
```

- **Domain**: Contém a lógica central da aplicação que não depende de frameworks externos.
- **Application**: Orquestra o fluxo de dados entre o domínio e as interfaces externas.
- **Infrastructure**: Onde residem os detalhes técnicos como o acesso ao banco de dados (Neon/PostgreSQL).
- **Interfaces**: Expõe a aplicação para o mundo externo através de APIs REST.

---

## 🚀 Instalação e Execução

### Pré-requisitos
- [Bun](https://bun.sh/) instalado.

### Instalar dependências
```bash
bun install
```

### Executar o projeto
```bash
bun start
```

Este projeto utiliza **Bun v1.3.5** para máxima performance.

---

## 📖 Documentação da API

### 👤 Usuários (`/api/user`)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/create` | Cadastra um novo usuário |
| `GET` | `/read` | Retorna dados do usuário (via e-mail no body) |
| `PUT` | `/update` | Atualiza dados cadastrais |
| `DELETE` | `/delete` | Remove um usuário do sistema |

#### Criar Usuário (`POST /create`)
**Body:**
```json
{
  "fullname": "Nome Usuário",
  "email": "email@exemplo.com",
  "birthday": "2000-01-01",
  "password": "SenhaSegura123!",
  "city": "Cidade",
  "phoneNumber": "5599999999999"
}
```

---

### 📚 Timeline (`/api/timeline`)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/create` | Adiciona um livro à timeline |
| `GET` | `/read/:id_timeline` | Busca uma entrada específica |
| `PUT` | `/update` | Atualiza dados de uma leitura |
| `DELETE` | `/delete/:id_timeline` | Remove uma entrada da timeline |

---

### 📝 Quizzes (`/api/quiz`)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/create` | Cria um novo quiz vinculado a um livro |
| `GET` | `/read/:id_quiz` | Busca detalhes de um quiz |
| `PUT` | `/update` | Atualiza perguntas e alternativas |
| `DELETE` | `/delete/:id_quiz` | Remove um quiz do sistema |

#### Criar Quiz (`POST /create`)
**Body:**
```json
{
  "tittle": "Quiz sobre O Hobbit",
  "id_timeline_book": 1,
  "statement": "Responda as questões abaixo",
  "questions": [
    {
      "question_tittle": "Quem é o protagonista?",
      "alternatives": [
        { "alternative": "Bilbo Bolseiro", "is_correct": true },
        { "alternative": "Gandalf", "is_correct": false }
      ]
    }
  ]
}
```

---

## 📂 Documentação Adicional

Informações detalhadas sobre o banco de dados e requisitos do projeto podem ser encontradas na pasta:
- `documentação/Banco de Dados/`
- `documentação/Documentação Escrita/`

---

## ⚙️ Tecnologias Utilizadas

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Express](https://expressjs.com/)
- **Banco de Dados**: [Neon (PostgreSQL)](https://neon.tech/)
- **Validação**: [Zod](https://zod.dev/)
- **Linguagem**: TypeScript

---

### 🛡️ Notas de Segurança e Padrões
* Senhas são armazenadas utilizando criptografia (hashing).
* Todas as rotas possuem validação rigorosa com Zod.
* O padrão de data utilizado em toda a API é `yyyy-MM-dd`.
