# Documento de Design do Backend - Smart Matpakke

Este documento detalha a arquitetura, requisitos e a especificação da API para o backend do projeto.

## 1. Requisitos

### 1.1. Requisitos Funcionais (O que o sistema faz)

-   **RF-01: Gestão de Utilizadores e Membros:**
    -   O sistema deve permitir que um novo utilizador crie uma **Conta** com email e password, e um **Perfil de Membro** associado com o seu nome.
    -   O sistema deve permitir que um utilizador existente faça login e receba um token de autenticação.
    -   O sistema deve permitir que um utilizador autenticado aceda aos seus próprios dados de conta e perfil.
    -   O sistema deve permitir que um utilizador adicione, edite e remova perfis de **Membros da Família** (ex: filhos), que não necessitam de uma conta de login.
-   **RF-02: Gestão de Preferências:**
    -   O sistema deve permitir que um utilizador defina e atualize as preferências alimentares para cada **Membro da Família**.
-   **RF-03: Geração de Planos Semanais via IA:**
    -   O sistema deve ser capaz de construir um *prompt* detalhado para a IA, contendo as preferências e restrições de **todos os Membros da Família**.
    -   O sistema deve gerar um plano de lanches **personalizado para cada membro**.
    -   O plano gerado deve ser persistido na base de dados.
-   **RF-04: Consulta de Planos e Receitas:**
    -   O sistema deve permitir que um utilizador autenticado consulte o plano semanal da sua família, com as lanches de cada membro.
-   **RF-05: Feedback:**
    -   O sistema deve permitir que um utilizador autenticado avalie uma receita em nome de um membro da família.

### 1.2. Requisitos Não-Funcionais (Como o sistema se comporta)

-   **RNF-01: Segurança:**
    -   Todas as passwords devem ser armazenadas de forma segura usando hashing (`bcrypt`).
    -   O acesso a endpoints sensíveis deve ser protegido por tokens JWT.
    -   Todos os dados de entrada na API devem ser rigorosamente validados (Zod).
-   **RNF-02: Desempenho:**
    -   As respostas da API para operações de leitura devem ter uma latência inferior a 500ms.
-   **RNF-03: Manutenibilidade:**
    -   O código-fonte será escrito em TypeScript, seguindo um guia de estilo consistente.
    -   A arquitetura será modular.

## 2. Estrutura do Projeto

(A estrutura de ficheiros permanece a mesma)

```
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── plugins/
│   ├── lib/
│   └── modules/
│       ├── auth/
│       ├── users/
│       └── plans/
├── .env
├── package.json
└── tsconfig.json
```

## 3. Especificação da API (MVP)

Prefixo de todas as rotas: `/api`

---
**NOTA DE ARQUITETURA IMPORTANTE:**

O sistema agora distingue entre uma **`User` (Conta)** e um **`FamilyMember` (Perfil)**.
-   **`User`**: Representa uma conta de login com `email` e `password`. É usado para autenticação.
-   **`FamilyMember`**: Representa o perfil de uma pessoa (ex: nome, idade, preferências) para quem as refeições são planeadas. Um `FamilyMember` pode ou não ter uma `User` (conta) associada.

---

### Autenticação (`/auth`)

-   **`POST /auth/register`**
    -   **Descrição:** Regista uma nova **Conta de Utilizador** e o seu **Perfil de Membro** associado.
    -   **Body:** `{ "name": "string", "email": "string", "password": "string" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "email": "string", "familyMember": { "id": "uuid", "name": "string" } }`

-   **`POST /auth/login`**
    -   **Descrição:** Autentica um utilizador e retorna um token JWT.
    -   **Body:** `{ "email": "string", "password": "string" }`
    -   **Resposta (Sucesso 200):** `{ "accessToken": "string" }`

---

### Utilizador Autenticado (`/me`)

-   **`GET /me`**
    -   **Descrição:** Retorna os dados da conta e do perfil do utilizador autenticado.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 200):** `{ "accountId": "uuid", "email": "string", "memberId": "uuid", "name": "string", "dateOfBirth": "date", "gender": "enum", "photoUrl": "string","familyId": "uuid" }`

-   **`PUT /me`**
    -   **Descrição:** Atualiza os dados do **perfil** do utilizador autenticado (nome, data de nascimento, etc.).
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "name"?: "string", "dateOfBirth"?: "date", "gender"?: "enum" }`
    -   **Resposta (Sucesso 200):** (O mesmo que `GET /me`)

-   **`PUT /me/preferences`**
    -   **Descrição:** Define ou atualiza as preferências do **perfil** do utilizador autenticado.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "preferenceIds": ["uuid", "uuid", ...] }`
    -   **Resposta (Sucesso 200):** `{ "status": "success" }`

---

### Famílias (`/families`)

-   **`POST /families`**
    -   **Descrição:** Cria uma nova família.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "name": "string" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "name": "string" }`

-   **`GET /families/:id`**
    -   **Descrição:** Retorna os detalhes de uma família, incluindo a lista de membros.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "name": "string", "members": [{ "id": "uuid", "name": "string", "accountId": "uuid|null" }] }`

-   **`PUT /families/:id`**
    -   **Descrição:** Atualiza os detalhes de uma família.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "name": "string" }`
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "name": "string" }`

---

### Membros da Família (`/families/:familyId/members`)

-   **`POST /families/:familyId/members`**
    -   **Descrição:** Adiciona um novo membro (perfil) a uma família. Não requer email/password.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "name": "string", "dateOfBirth"?: "date", "gender"?: "enum" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "name": "string", "dateOfBirth": "date", "gender": "enum" }`

-   **`PUT /families/:familyId/members/:memberId`**
    -   **Descrição:** Atualiza o perfil de um membro da família.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "name"?: "string", "dateOfBirth"?: "date", "gender"?: "enum" }`
    -   **Resposta (Sucesso 200):** (O mesmo que a resposta do `POST`)

-   **`DELETE /families/:familyId/members/:memberId`**
    -   **Descrição:** Remove um membro de uma família.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 204):** (No Content)

---

### Planos (`/plans`)

-   **`POST /plans/generate`**
    -   **Descrição:** Dispara a geração de um novo plano semanal personalizado para todos os membros da família do utilizador autenticado.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 201 - Created):** Um objeto `WeeklyPlan` completo, com `DailyPlan` aninhado, mostrando a refeição de cada membro para cada dia.

-   **`GET /plans/current`**
    -   **Descrição:** Retorna o plano semanal mais recente da família do utilizador.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 200):** Um objeto `WeeklyPlan` completo.

-   **`POST /plans/save`**
    -   **Descrição:** Guarda um plano gerado pela IA que foi aprovado pelo utilizador.
    -   **Autenticação:** Obrigatória.
    -   **Body:** (O JSON do plano gerado pela IA)
    -   **Resposta (Sucesso 201):** O objeto `WeeklyPlan` completo que foi guardado na base de dados.

---

### Planos Semanais (`/weekly-plans`)

-   **`GET /weekly-plans/:id`**
    -   **Descrição:** Retorna um plano semanal específico.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 200):** `{ "id", "startDate", "familyId", "dailyPlans": [{ "id", "dayOfWeek", "recipeId", "familyMemberId" }] }`

---
(As secções de `Preferences`, `Recipes`, `Ingredients`, `Nutrients`, e `Feedback` permanecem maioritariamente as mesmas, com a alteração de que `userId` em `RecipeFeedback` passa a ser `familyMemberId`).
