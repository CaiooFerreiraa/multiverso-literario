# 🌌 Multiverso Literário - Backend

O **Multiverso Literário** é uma API robusta e escalável desenvolvida para gerenciar jornadas de leitura, permitindo que usuários registrem seu progresso literário através de uma timeline e testem seus conhecimentos por meio de quizzes personalizados vinculados aos livros lidos.

---

## 📑 Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Arquitetura](#-arquitetura)
3. [Tecnologias](#-tecnologias)
4. [Configuração do Ambiente](#-configuração-do-ambiente)
5. [Instalação e Execução](#-instalação-e-execução)
6. [Documentação da API](#-documentação-da-api)
    - [Usuários](#-usuários)
    - [Timeline](#-timeline)
    - [Quizzes](#-quizzes)
7. [Estrutura de Dados](#-estrutura-de-dados)
8. [Pasta de Documentação](#-pasta-de-documentação)

---

## 🌟 Sobre o Projeto

O coração do Multiverso Literário é a experiência do leitor. O sistema não apenas armazena nomes de livros, mas permite uma imersão completa:
- **Timeline dinâmica**: Acompanhe data de início e término de cada obra.
- **Interatividade**: Crie quizzes para desafiar outros leitores ou consolidar seu conhecimento.
- **Segurança**: Gestão de perfil com validação rigorosa de dados.

---

## 🏛️ Arquitetura

O projeto adota a **Clean Architecture (Arquitetura Limpa)**, o que garante que as regras de negócio sejam independentes de detalhes técnicos como bancos de dados ou frameworks web.

### Fluxo de Dependência
```mermaid
graph TD
    A[Interfaces / Rotas] --> B[Application / Use Cases]
    B --> C[Domain / Entities]
    D[Infrastructure / DB] --> B
    D --> E[External Services]
```

- **Entities (Domain)**: Objetos de negócio (User, Timeline, Quiz).
- **Use Cases (Application)**: Lógica específica da aplicação (RegisterUser, CreateQuiz).
- **Controllers/Routes (Interfaces)**: Adaptadores que recebem requisições HTTP e as convertem para comandos da aplicação.
- **Repositories (Infrastructure)**: Implementações reais de persistência no Neon (PostgreSQL).

---

---

## 🛠️ Tecnologias

O projeto utiliza o que há de mais moderno no ecossistema JavaScript/TypeScript:

- **Runtime**: [Bun v1.3.5+](https://bun.sh/) - Performance extrema para o engine.
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) - Tipagem estática para maior segurança.
- **Framework Web**: [Express (v5.0.0-beta)](https://expressjs.com/) - A próxima geração do Express.
- **Banco de Dados**: [PostgreSQL (Neon Serverless)](https://neon.tech/) - Escalonamento automático e performance.
- **Transações**: Suporte nativo a transações interativas com isolamento `RepeatableRead`.
- **Validação**: [Zod](https://zod.dev/) - Esquemas de dados rigorosos e seguros.

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database?sslmode=require"
```

---

## 🚀 Instalação e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/CaiooFerreiraa/multiverso-literario.git
cd multiverso-literario
```

### 2. Instalar dependências
```bash
bun install
```

### 3. Executar em modo desenvolvimento
```bash
bun start
```
*O servidor iniciará em `http://localhost:8080` (ou IP local configurado em `server.ts`).*

---

## 📖 Documentação da API

Todas as rotas retornam JSON. Falhas de validação retornam Status **400**.

### 👤 Usuários (`/api/user`)

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/create` | `POST` | Cadastro de novo usuário |
| `/read` | `GET` | Recupera dados (necessário enviar e-mail no body) |
| `/update` | `PUT` | Atualiza todos os campos do usuário |
| `/delete` | `DELETE` | Remove o usuário pelo ID |

#### Detalhes do Payload (Exemplo Create/Update):
```json
{
  "fullname": "Seu Nome Completo",
  "email": "exemplo@email.com",
  "birthday": "1995-05-20",
  "city": "Sua Cidade",
  "phoneNumber": "5511999998888",
  "password": "Senha@Forte123" 
}
```
*Regra de Senha: Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.*

---

### 📚 Timeline (`/api/timeline`)

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/create` | `POST` | Adicionar nova leitura |
| `/read/:id_timeline` | `GET` | Detalhes de uma entrada específica |
| `/update` | `PUT` | Editar dados da leitura |
| `/delete/:id_timeline` | `DELETE` | Deletar leitura da timeline |

**Exemplo de Objeto Timeline:**
```json
{
  "dateStart": "2023-10-01",
  "dateEnd": "2023-10-15",
  "authorBook": "J.R.R. Tolkien",
  "nameBook": "O Senhor dos Anéis"
}
```

---

### 📝 Quizzes (`/api/quiz`)

A joia da Interatividade. Cada quiz deve estar obrigatoriamente vinculado a um registro na Timeline.

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/create` | `POST` | Criação de quiz com múltiplas perguntas |
| `/read/:id_quiz` | `GET` | Busca quiz completo com alternativas |
| `/update` | `PUT` | Atualiza título, enunciado e questões |
| `/delete/:id_quiz` | `DELETE` | Remove quiz e suas relações |
| `/response` | `POST` | Registra a resposta de um usuário para uma pergunta |
| `/response/:id_user` | `GET` | Busca todas as respostas de um usuário |

**Payload de Criação (Complexo):**
```json
{
  "tittle": "Desafio Tolkien",
  "id_timeline_book": 1,
  "statement": "Nível Difícil",
  "questions": [
    {
      "question_tittle": "Qual o nome da montanha onde o Um Anel foi forjado?",
      "alternatives": [
        { "alternative": "Montanha da Perdição", "is_correct": true },
        { "alternative": "Erebor", "is_correct": false }
      ]
    }
  ]
}
```

**Payload de Resposta:**
```json
{
  "id_user": 1,
  "id_quiz": 1,
  "id_question": 1,
  "id_alternative": 1, // Opcional se for resposta de múltipla escolha
  "response_text": "" // Opcional se for resposta dissertativa
}
```

---

## 🗄️ Estrutura de Dados

O banco de dados é composto pelas seguintes entidades principais:
1. **Users**: Dados cadastrais e autenticação.
2. **Timeline_Book**: Registros de leitura vinculados ao usuário.
3. **Quizzes**: Cabeçalho do quiz vinculado ao livro.
4. **Questions**: Perguntas vinculadas a um quiz.
5. **Alternatives**: Opções para cada pergunta.
6. **Responses**: Respostas individuais (texto ou alternativa selecionada).
7. **Response_Quiz_User**: Vínculo entre usuário, quiz e suas respostas.

---

## 📂 Pasta de Documentação

Para informações ainda mais técnicas e diagramas originais, consulte a pasta raiz `documentação/`:
- `/Banco de Dados`: Scripts SQL e Esquemas Lógicos (`.brM`).
- `/Documentação Escrita`: Requisitos e especificações funcionais.

---

## 👨‍💻 Desenvolvedores

- **Caio Ferreira** - *Desenvolvedor Principal*

---
*Este projeto é parte integrante do ecossistema Multiverso Literário.*
