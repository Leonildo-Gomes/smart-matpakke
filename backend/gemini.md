# Guia de Colaboração com o Gemini

Este documento serve como um guia para garantir que a colaboração entre os desenvolvedores e o assistente de IA (Gemini) seja eficiente, consistente e siga as melhores práticas estabelecidas para o projeto **Smart Matpakke**.

## 1. Contexto do Projeto

Para que o Gemini possa ajudar de forma eficaz, é crucial ter sempre em mente o seguinte contexto:

-   **Nome do Projeto:** Smart Matpakke
-   **Objetivo:** Uma aplicação para gerar planos de refeições semanais (matpakke) de forma inteligente e personalizada para utilizadores individuais e famílias.
-   **Stack Tecnológica:**
    -   **Backend:** Node.js com Fastify e TypeScript
    -   **ORM:** Prisma
    -   **Base de Dados:** PostgreSQL

## 2. Convenções de Desenvolvimento

Aderir a estas convenções é fundamental para manter a qualidade e a consistência do código.

### Schema da Base de Dados (`prisma/schema.prisma`)

-   **Prefira ENUMs a Strings:** Para campos que possuem um conjunto finito de valores (ex: `status`, `tipo`, `unidade`), use sempre um `ENUM`.
-   **Mapeamento de Nomes:** Utilize `@@map` e `@map` para manter os nomes das tabelas e colunas em `snake_case` no PostgreSQL, enquanto os modelos no Prisma seguem a convenção `PascalCase`.
-   **Ações Referenciais:** Especifique sempre as ações `onDelete` e `onUpdate` nas relações para garantir a integridade referencial. A escolha (`Cascade`, `Restrict`, `SetNull`) deve ser baseada na regra de negócio.

### Estilo de Código

-   O projeto ainda não possui `ESLint` ou `Prettier` configurados. A sua adição é **altamente recomendada** para automatizar a formatação e a deteção de erros.
-   Até lá, siga o estilo de código existente nos ficheiros.

### Testes

-   O projeto ainda não possui uma framework de testes configurada (ex: `Jest`, `Vitest`). A sua adição é **crítica** para garantir a fiabilidade do código.
-   Qualquer nova funcionalidade ou correção de bug deve, idealmente, ser acompanhada por testes.

## 3. Interação com o Gemini

Para obter os melhores resultados ao trabalhar com o Gemini, siga estas dicas:

-   **Seja Específico:** Em vez de "arranja o código", diga "O campo 'unit' no modelo 'RecipeIngredient' deveria ser um ENUM. Por favor, altera o schema e explica os benefícios."
-   **Forneça Contexto:** Utilize a sintaxe `@` para referenciar ficheiros (`@/path/to/file.ts`). Isto dá ao Gemini o contexto exato para a sua tarefa.
-   **Explique o "Porquê":** Ao pedir uma alteração, explique o objetivo final. Isto ajuda o Gemini a sugerir soluções mais completas e alinhadas com a visão do projeto.
-   **Revise as Alterações:** Analise sempre as alterações de código sugeridas antes de as aprovar.

## 4. Comandos Úteis

Aqui está uma lista de comandos essenciais para o desenvolvimento deste projeto.

```bash
# Instalar/atualizar as dependências
npm install

# Iniciar o servidor em modo de desenvolvimento
npm run dev

# (Re)Gerar o Prisma Client após alterações no schema.prisma
npx prisma generate

# Criar uma nova migração da base de dados após alterações no schema.prisma
npx prisma migrate dev --name "nome-descritivo-da-migracao"

# Aplicar migrações pendentes
npx prisma migrate deploy

# Abrir o Prisma Studio para visualizar e editar os dados
npx prisma studio
```

---
*Este documento deve ser mantido atualizado à medida que o projeto evolui.*
