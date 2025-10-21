# Projeto App de “Smart Matpakke”

A tradição do “matpakke” é forte na Noruega, mas muitas pessoas ficam sem ideias do que preparar.

# Objectivos:

- Sugere receitas saudáveis e equilibradas para lanches e almoços (matpakke).
- Baseado nas preferências  e restrições alimentares. Seguindo o conceito:”Diz-me o que gostas e eu digo-te o que comprar”

## Funcionalidades Principais

**Geração de ideias de lanches com IA**: O coração do seu aplicativo! Utilize algoritmos de IA para gerar sugestões de lanches com base em diversos parâmetros, como:

**✅Restrições dietéticas:** O aplicativo deve permitir que o usuário selecione restrições alimentares como vegano, vegetariano, sem glúten, etc.

✅  **Preferências de sabor**: O usuário pode indicar seus sabores preferidos (doce, salgado, etc.) para que o aplicativo sugira lanches de acordo.

✅ **Planejamento:**

    ✅ **Diaria**:  Usuários podem organizar sua matpakke diaramente.

    ✅ **Semanal:** Usuários podem organizar sua matpakke para a semana.

✅ **Lista de Compras Automática:** O app gera uma lista de ingredientes com a  quantidade necessaria para facilitar as compras.

✅ **Tempo de preparo**: Filtre lanches rápidos e fáceis ou opções mais elaboradas, dependendo da necessidade do usuário

✅ **Dicas Nutricionais:** Recomendações sobre equilíbrio de proteínas, carboidratos e gorduras.

✅ **Modo "Surpresa"** Sugere combinações inesperadas para variar o cardápio.

### 

### **Funcionalidades Essenciais do MVP**

✅ **Cadastro e Login** – Criar conta e salvar preferências alimentares.

✅ **Sugestão de Receitas** – IA recomenda receitas com base nas preferências.

✅ **Preferências alimentares e alergias**

- Ex: vegetariano, vegano, intolerância à lactose, alergia a nozes etc.

✅ Sugestão de *matpakker* com base nos ingredientes e restrições

✅ Visualização de receitas detalhadas

✅ **Histórico de Receitas** – Usuário pode ver receitas sugeridas anteriormente.

✅ **Avaliação das Sugestões** – Permite feedback para a IA aprender e melhorar.

   

## Stack Tecnológica do MVP

### Backend e API

- **Framework:** Fastify para uma API Node.js de alta performance.
- **Linguagem:** TypeScript.
- **IA:** OpenAI GPT para a geração inteligente dos planos de dieta.
- **Validação:** Zod para garantir a integridade e segurança dos dados de entrada e saída.
- **Comunicação:** CORS configurado para permitir a comunicação segura com o frontend.
- **Banco de dados**: PostgreSQL(hospedado em Supabase)
- **ORM**: Prisma


### Frontend

1. WEB:
    - **Framework:** Next.js 15 (com React 19) para renderização no servidor e interfaces reativas.
    - **Linguagem:** TypeScript.
    - **Estilização:** Tailwind CSS para um design rápido e responsivo (mobile-first).
    - **Componentes:** shadcn/ui sobre Radix UI para componentes de UI acessíveis e reutilizáveis.
    - **Ícones:** Lucide React para ícones leves e consistentes.
    - **Formulários:** React Hook Form com Zod para validação de formulários robusta e eficiente.
2. MOBILE:
    - **Flutter & Dart:** Framework e linguagem para desenvolvimento de aplicações multiplataforma.
    - **Riverpod:** Gerenciamento de estado e injeção de dependência.
    - **shared_preferences:** Armazenamento de preferências do usuário (tema, idioma).
    - **flutter_localizations & intl:** Para suporte a múltiplos idiomas.