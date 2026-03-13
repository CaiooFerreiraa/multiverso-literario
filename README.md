# 🌌 Multiverso Literário
 
 O **Multiverso Literário** é uma plataforma imersiva voltada para comunidades de leitura. Concebido inicialmente como uma API, o projeto evoluiu para um **Monolito robusto (Frontend + Backend)**, permitindo que os usuários participem de salas de áudio e vídeo, gerenciem cronogramas de leitura, respondam quizzes dinâmicos sobre obras literárias, além de acompanhar pontuações em um ranking global com uma estética *Cosmic Glassmorphism*.
 
 ---
 
 ## 📑 Sumário
 1. [Sobre o Projeto](#-sobre-o-projeto)
 2. [Arquitetura e Funcionalidades](#-arquitetura-e-funcionalidades)
 3. [Stack e Tecnologias](#-stack-e-tecnologias)
 4. [Configuração do Ambiente](#-configuração-do-ambiente)
 5. [Instalação e Execução](#-instalação-e-execução)
 6. [Documentação da API Original](#-documentação-da-api-original)
 7. [Deploy e Estrutura Docker](#-deploy-e-estrutura-docker)
 
 ---
 
 ## 🌟 Sobre o Projeto
 
 O coração do Multiverso Literário é a experiência de imersão e gamificação do leitor dentro de uma temática espacial/nebulosa:
 - **Comunidade (Salas de Reunião)**: Criação de salas interativas de áudio/vídeo (via Jitsi no domínio meet.jit.si) para discussões, com controle de presença e recompensas monetizadas em pontos.
 - **Gamificação (Quizzes e Desafios)**: Responda quizzes com tempo por questão, envie redações em PDF, ganhe bônus de presença e escale o Pódio Global.
 - **Gestão Literária**: Administrativo completo, permitindo o controle de livros, capas buscadas automaticamente na Google Books API e disponibilização de arquivos em PDF.
 - **Perfis e Planos**: Separação de visões entre perfis (Student vs Adult), com sistema completo de chat de suporte em tempo real (polling).
 
 ---
 
 ## 🏛️ Arquitetura e Funcionalidades
 
 O projeto unificou sua stack e agora adota um padrão arquitetural combinando o **App Router do Next.js 15** para interface de usuário e roteamento, mantendo internamente camadas da **Clean Architecture** (Domain, Application, Infrastructure) para a lógica de negócio, conectando via Next.js API Routes e banco de dados Neon Serverless (PostgreSQL).
 
 ### Destaques da UI/UX:
 - Design *Cosmic Glassmorphism* focado em roxo, indigo e dourado.
 - Componentização robusta com shadcn/ui.
 - Formulários e botões estlizados e acessíveis interagindo via Radix UI e Framer Motion.
 
 ---
 
 ## 🛠️ Stack e Tecnologias
 
 - **Runtime**: [Bun v1.3+](https://bun.sh/) - Performance extrema.
 - **Frontend Web**: [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
 - **Estilização**: Tailwind CSS (v4) + Shadcn/ui + Framer Motion + Lucide React
 - **Backend e Banco de Dados**: Next.js API Routes / Express + PostgreSQL (via Neon DB) + Zod
 - **Segurança e SEO**: Suporte total a transações interativas (`RepeatableRead`), integridade ON DELETE CASCADE gerenciada, e Next Auth.

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
