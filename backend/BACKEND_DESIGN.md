# Documento de Design do Backend - Smart Matpakke

Este documento detalha a arquitetura, requisitos e a especificação da API para o backend do projeto.

## 1. Requisitos

### 1.1. Requisitos Funcionais (O que o sistema faz)

-   **RF-01: Gestão de Utilizadores:**
    -   O sistema deve permitir que um novo utilizador se registe com nome, email e password.
    -   O sistema deve permitir que um utilizador existente faça login e receba um token de autenticação.
    -   O sistema deve permitir que um utilizador autenticado aceda aos seus próprios dados.
-   **RF-02: Gestão de Preferências:**
    -   O sistema deve permitir que um utilizador autenticado defina e atualize as suas preferências alimentares (ex: vegetariano, alergias).
-   **RF-03: Geração de Planos Semanais via IA:**
    -   O sistema deve ser capaz de construir um *prompt* detalhado para a API da OpenAI, contendo as preferências e restrições do utilizador.
    -   O sistema deve enviar este *prompt* para o serviço da OpenAI e solicitar uma resposta em formato JSON estruturado.
    -   O sistema deve ser capaz de analisar (parse) a resposta JSON da IA.
    -   O sistema deve validar e higienizar os dados recebidos da IA antes de os guardar na base de dados, para garantir a integridade dos dados.
    -   O plano gerado (receitas, ingredientes, informação nutricional) deve ser persistido nas tabelas correspondentes da base de dados.
-   **RF-04: Consulta de Planos e Receitas:**
    -   O sistema deve permitir que um utilizador autenticado consulte o seu plano semanal mais recente.
    -   O sistema deve permitir que um utilizador autenticado visualize os detalhes de uma receita específica.
-   **RF-05: Feedback:**
    -   O sistema deve permitir que um utilizador autenticado avalie (rating 1-5) uma receita.

### 1.2. Requisitos Não-Funcionais (Como o sistema se comporta)

-   **RNF-01: Segurança:**
    -   Todas as passwords devem ser armazenadas de forma segura usando hashing (`bcrypt`).
    -   A comunicação entre cliente e servidor deve ser protegida (HTTPS).
    -   O acesso a endpoints sensíveis deve ser protegido por tokens JWT (JSON Web Tokens).
    -   Todas as chaves de API (ex: OpenAI, Supabase) devem ser geridas através de variáveis de ambiente e nunca expostas no código.
    -   Todos os dados de entrada na API devem ser rigorosamente validados (Zod).
    -   A API deve ter uma política de CORS restritiva.
-   **RNF-02: Desempenho:**
    -   As respostas da API para operações de leitura devem ter uma latência inferior a 500ms.
    -   A geração de um novo plano (que envolve uma chamada externa à IA) deve ser concluída num tempo razoável (timeout de 30 segundos). Para o MVP, esta operação será síncrona.
-   **RNF-03: Manutenibilidade:**
    -   O código-fonte será escrito em TypeScript, seguindo um guia de estilo consistente.
    -   A arquitetura será modular, separando claramente rotas, lógica de negócio (serviços) e acesso a dados.

## 2. Estrutura do Projeto

```
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app.ts                  # Ponto central que constrói e configura a app Fastify
│   ├── server.ts               # Ponto de entrada que inicia o servidor
│   │
│   ├── config/                 # Gestão de configuração e variáveis de ambiente
│   │   └── index.ts
│   │
│   ├── plugins/                # Plugins reutilizáveis do Fastify
│   │   ├── auth.plugin.ts      # Plugin que regista decorators e hooks de autenticação
│   │   └── db.plugin.ts        # Plugin para gerir a ligação à base de dados
│   │
│   ├── lib/                      # <-- Adicionado para clientes de serviços externos
│   │   └── openai/
│   │       └── agent.ts          # (O seu 'Agent') Cliente para a API da OpenAI
│   │
│   └── modules/                # --- ARQUITETURA POR FUNCIONALIDADES ---
│       ├── auth/               # Módulo de autenticação
│       │   ├── auth.routes.ts
│       │   ├── auth.service.ts
│       │   └── auth.schema.ts
│       │
│       ├── users/              # Módulo de utilizadores
│       │   ├── user.routes.ts
│       │   ├── user.service.ts
│       │   └── user.schema.ts
│       │
│       └── plans/              # Módulo de planos de refeição
│           ├── plan.routes.ts
│           ├── plan.service.ts
│           ├── plan.schema.ts
│           ├── plan.prompts.ts   # (O seu 'Prompts') Templates de prompts
│           └── plan.generation.service.ts # Orquestrador que usa os prompts e o agent
│
├── .env
├── package.json
└── tsconfig.json
```

## 3. Especificação da API (MVP)

Prefixo de todas as rotas: `/api`

---

### Autenticação (`/auth`)

-   **`POST /auth/register`**
    -   **Descrição:** Regista um novo utilizador.
    -   **Body:** `{ "name": "string", "email": "string", "password": "string" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "name": "string", "email": "string" }`

-   **`POST /auth/login`**
    -   **Descrição:** Autentica um utilizador e retorna um token JWT.
    -   **Body:** `{ "email": "string", "password": "string" }`
    -   **Resposta (Sucesso 200):** `{ "accessToken": "string" }`

---

### Utilizadores (`/users`)

-   **`GET /users/me`**
    -   **Descrição:** Retorna os dados do utilizador autenticado.
    -   **Autenticação:** Obrigatória (Bearer Token).
    -   **Resposta (Sucesso 200):** `{ "id", "email", "name", "dateOfBirth", "familyId" }`

-   **`PUT /users/me/preferences`**
    -   **Descrição:** Define ou atualiza as preferências do utilizador.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "preferenceIds": ["uuid", "uuid", ...] }`
    -   **Resposta (Sucesso 200):** `{ "status": "success" }`

---

### Planos (`/plans`)

-   **`POST /plans/generate`**
    -   **Descrição:** Dispara a geração de um novo plano semanal para o utilizador autenticado e retorna o plano gerado.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 201 - Created):** Um objeto `WeeklyPlan` completo, com `DailyPlan` e `Recipe` aninhados.

-   **`GET /plans/current`**
    -   **Descrição:** Retorna o plano semanal mais recente do utilizador.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 200):** Um objeto `WeeklyPlan` completo.

---
