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
│       │   ├── auth.routes.ts  # Ponto de entrada para rotas de autenticação
│       │   ├── auth.service.ts
│       │   ├── auth.schema.ts
│       │   ├── login/
│       │   │   ├── login.controller.ts
│       │   │   └── login.routes.ts
│       │   └── register/
│       │       ├── register.controller.ts
│       │       └── register.routes.ts
│       │
│       ├── users/              # Módulo de utilizadores
│       │   ├── user.routes.ts  # Ponto de entrada para rotas de utilizador
│       │   ├── user.service.ts
│       │   ├── user.schema.ts
│       │   ├── me/
│       │   │   ├── me.controller.ts
│       │   │   ├── get.routes.ts
│       │   │   └── put.routes.ts
│       │   └── preferences/
│       │       ├── preferences.controller.ts
│       │       └── put.routes.ts
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

-   **`PUT /users/me`**
    -   **Descrição:** Atualiza os dados do utilizador autenticado (nome, data de nascimento, género).
    -   **Autenticação:** Obrigatória (Bearer Token).
    -   **Body:** `{ "name"?: "string", "dateOfBirth"?: "date", "gender"?: "enum" }`
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "name": "string", "email": "string", "dateOfBirth": "date", "familyId": "uuid", "gender": "enum" }`

---

### Famílias (`/families`)

-   **`POST /families`**
    -   **Descrição:** Cria uma nova família.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "name": "string" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "name": "string" }`

-   **`GET /families/:id`**
    -   **Descrição:** Retorna os detalhes de uma família específica.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "name": "string", "users": [...] }`

-   **`PUT /families/:id`**
    -   **Descrição:** Atualiza os detalhes de uma família.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "name": "string" }`
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "name": "string" }`

-   **`DELETE /families/:id`**
    -   **Descrição:** Elimina uma família.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 204):** (No Content)

---

### Preferências (`/preferences`)

-   **`GET /preferences`**
    -   **Descrição:** Lista todas as preferências disponíveis.
    -   **Autenticação:** Opcional (pode ser pública para mostrar opções).
    -   **Resposta (Sucesso 200):** `[{ "id": "uuid", "type": "enum", "value": "string" }]`

-   **`GET /preferences/:id`**
    -   **Descrição:** Retorna os detalhes de uma preferência específica.
    -   **Autenticação:** Opcional.
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "type": "enum", "value": "string" }`

-   **`POST /preferences`**
    -   **Descrição:** Cria uma nova preferência.
    -   **Autenticação:** Obrigatória (Admin/Internal).
    -   **Body:** `{ "type": "enum", "value": "string" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "type": "enum", "value": "string" }`

-   **`PUT /preferences/:id`**
    -   **Descrição:** Atualiza uma preferência existente.
    -   **Autenticação:** Obrigatória (Admin/Internal).
    -   **Body:** `{ "type": "enum", "value": "string" }`
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "type": "enum", "value": "string" }`

-   **`DELETE /preferences/:id`**
    -   **Descrição:** Elimina uma preferência.
    -   **Autenticação:** Obrigatória (Admin/Internal).
    -   **Resposta (Sucesso 204):** (No Content)

---

### Receitas (`/recipes`)

-   **`POST /recipes`**
    -   **Descrição:** Cria uma nova receita.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "title": "string", "description": "string", "instructions": "string", "prepTimeMinutes": "number", "ingredients": [{ "ingredientId": "uuid", "quantity": "number", "unit": "string", "notes": "string" }], "nutrients": [{ "nutrientId": "uuid", "value": "number" }] }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "title": "string", ... }`

-   **`GET /recipes`**
    -   **Descrição:** Lista todas as receitas (com filtros e paginação opcionais).
    -   **Autenticação:** Opcional.
    -   **Query Params:** `?page=number&limit=number&search=string&preferenceId=uuid`
    -   **Resposta (Sucesso 200):** `[{ "id": "uuid", "title": "string", ... }]`

-   **`GET /recipes/:id`**
    -   **Descrição:** Retorna os detalhes de uma receita específica.
    -   **Autenticação:** Opcional.
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "title": "string", "description": "string", "instructions": "string", "prepTimeMinutes": "number", "ingredients": [...], "nutrients": [...] }`

-   **`PUT /recipes/:id`**
    -   **Descrição:** Atualiza os detalhes de uma receita.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "title": "string", "description": "string", "instructions": "string", "prepTimeMinutes": "number", "ingredients": [...], "nutrients": [...] }`
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "title": "string", ... }`

-   **`DELETE /recipes/:id`**
    -   **Descrição:** Elimina uma receita.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 204):** (No Content)

---

### Ingredientes (`/ingredients`)

-   **`POST /ingredients`**
    -   **Descrição:** Cria um novo ingrediente.
    -   **Autenticação:** Obrigatória (Admin/Internal).
    -   **Body:** `{ "name": "string" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "name": "string" }`

-   **`GET /ingredients`**
    -   **Descrição:** Lista todos os ingredientes.
    -   **Autenticação:** Opcional.
    -   **Resposta (Sucesso 200):** `[{ "id": "uuid", "name": "string" }]`

-   **`GET /ingredients/:id`**
    -   **Descrição:** Retorna os detalhes de um ingrediente específico.
    -   **Autenticação:** Opcional.
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "name": "string" }`

-   **`PUT /ingredients/:id`**
    -   **Descrição:** Atualiza um ingrediente existente.
    -   **Autenticação:** Obrigatória (Admin/Internal).
    -   **Body:** `{ "name": "string" }`
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "name": "string" }`

-   **`DELETE /ingredients/:id`**
    -   **Descrição:** Elimina um ingrediente.
    -   **Autenticação:** Obrigatória (Admin/Internal).
    -   **Resposta (Sucesso 204):** (No Content)

---

### Nutrientes (`/nutrients`)

-   **`POST /nutrients`**
    -   **Descrição:** Cria um novo nutriente.
    -   **Autenticação:** Obrigatória (Admin/Internal).
    -   **Body:** `{ "name": "string", "unit": "enum" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "name": "string", "unit": "enum" }`

-   **`GET /nutrients`**
    -   **Descrição:** Lista todos os nutrientes.
    -   **Autenticação:** Opcional.
    -   **Resposta (Sucesso 200):** `[{ "id": "uuid", "name": "string", "unit": "enum" }]`

-   **`GET /nutrients/:id`**
    -   **Descrição:** Retorna os detalhes de um nutriente específico.
    -   **Autenticação:** Opcional.
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "name": "string", "unit": "enum" }`

-   **`PUT /nutrients/:id`**
    -   **Descrição:** Atualiza um nutriente existente.
    -   **Autenticação:** Obrigatória (Admin/Internal).
    -   **Body:** `{ "name": "string", "unit": "enum" }`
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "name": "string", "unit": "enum" }`

-   **`DELETE /nutrients/:id`**
    -   **Descrição:** Elimina um nutriente.
    -   **Autenticação:** Obrigatória (Admin/Internal).
    -   **Resposta (Sucesso 204):** (No Content)

---

### Feedback de Receitas (`/recipe-feedback`)

-   **`POST /recipes/:recipeId/feedback`**
    -   **Descrição:** Submete feedback (avaliação e comentário) para uma receita.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "rating": "number", "comment": "string" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "rating": "number", "comment": "string", "userId": "uuid", "recipeId": "uuid" }`

-   **`GET /recipes/:recipeId/feedback`**
    -   **Descrição:** Lista o feedback para uma receita específica.
    -   **Autenticação:** Opcional.
    -   **Resposta (Sucesso 200):** `[{ "id": "uuid", "rating": "number", "comment": "string", "userId": "uuid", "recipeId": "uuid" }]`

-   **`GET /recipes/:recipeId/feedback/:feedbackId`**
    -   **Descrição:** Retorna os detalhes de um feedback específico.
    -   **Autenticação:** Opcional.
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "rating": "number", "comment": "string", "userId": "uuid", "recipeId": "uuid" }`

-   **`PUT /recipes/:recipeId/feedback/:feedbackId`**
    -   **Descrição:** Atualiza um feedback existente.
    -   **Autenticação:** Obrigatória (apenas o autor do feedback).
    -   **Body:** `{ "rating": "number", "comment": "string" }`
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "rating": "number", "comment": "string", "userId": "uuid", "recipeId": "uuid" }`

-   **`DELETE /recipes/:recipeId/feedback/:feedbackId`**
    -   **Descrição:** Elimina um feedback.
    -   **Autenticação:** Obrigatória (apenas o autor do feedback ou Admin).
    -   **Resposta (Sucesso 204):** (No Content)

---

### Planos Semanais (`/weekly-plans`)

-   **`GET /weekly-plans/:id`**
    -   **Descrição:** Retorna um plano semanal específico.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 200):** Um objeto `WeeklyPlan` completo, com `DailyPlan` e `Recipe` aninhados.

-   **`PUT /weekly-plans/:id`**
    -   **Descrição:** Atualiza um plano semanal existente.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "startDate": "date", "dailyPlans": [...] }`
    -   **Resposta (Sucesso 200):** Um objeto `WeeklyPlan` completo.

-   **`DELETE /weekly-plans/:id`**
    -   **Descrição:** Elimina um plano semanal.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 204):** (No Content)

---

### Planos Diários (`/daily-plans`)

-   **`POST /weekly-plans/:weeklyPlanId/daily-plans`**
    -   **Descrição:** Adiciona um plano diário a um plano semanal.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "dayOfWeek": "enum", "recipeId": "uuid" }`
    -   **Resposta (Sucesso 201):** `{ "id": "uuid", "dayOfWeek": "enum", "recipeId": "uuid", "weeklyPlanId": "uuid" }`

-   **`GET /daily-plans/:id`**
    -   **Descrição:** Retorna um plano diário específico.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "dayOfWeek": "enum", "recipe": {...}, "weeklyPlanId": "uuid" }`

-   **`PUT /daily-plans/:id`**
    -   **Descrição:** Atualiza um plano diário existente.
    -   **Autenticação:** Obrigatória.
    -   **Body:** `{ "dayOfWeek": "enum", "recipeId": "uuid" }`
    -   **Resposta (Sucesso 200):** `{ "id": "uuid", "dayOfWeek": "enum", "recipeId": "uuid", "weeklyPlanId": "uuid" }`

-   **`DELETE /daily-plans/:id`**
    -   **Descrição:** Elimina um plano diário.
    -   **Autenticação:** Obrigatória.
    -   **Resposta (Sucesso 204):** (No Content)

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
