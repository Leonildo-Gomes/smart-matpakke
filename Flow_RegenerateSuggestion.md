# Fluxo de Trabalho: Gerar Nova Sugestão de Receita

Este documento descreve o processo técnico e de experiência do utilizador para a funcionalidade de gerar uma nova sugestão para um dia específico dentro de um plano.

### Contexto

O utilizador solicitou um plano (ex: semanal) e a aplicação apresentou um conjunto de receitas em modo de "pré-visualização" (ainda não salvas na base de dados). O utilizador está satisfeito com a maioria das receitas, mas deseja uma alternativa para um dos dias (ex: Quarta-feira).

---

### Passos do Processo

1.  **Ação do Utilizador (Interface):**
    - Ao lado da receita sugerida para Quarta-feira, o utilizador clica num botão dedicado, como "Nova Sugestão" ou um ícone de "atualizar" (🔄).

2.  **Pedido à API (Frontend → Backend):**
    - O frontend executa uma chamada a um endpoint específico para esta ação, por exemplo: `POST /api/recipes/regenerate`.
    - O corpo (*payload*) deste pedido contém o contexto essencial:
        - As preferências completas do utilizador (dieta, alergias, etc.).
        - O dia da semana para o qual a nova sugestão é solicitada (ex: `"dayOfWeek": "WEDNESDAY"`).
        - Uma lista de exclusão com os títulos ou IDs temporários das outras receitas já em exibição, para evitar duplicados.

3.  **Lógica de Backend (Processamento e IA):**
    - O backend recebe o pedido.
    - Constrói um novo *prompt* para a IA, contendo uma instrução adicional de exclusão. O *prompt* será semelhante a:
      > "Gere UMA receita para Quarta-feira, para um utilizador com estas preferências [...]. A receita gerada **NÃO PODE SER** nenhuma das seguintes: [título da receita de Segunda], [título da receita de Terça], etc."
    - A IA processa o pedido e retorna uma única nova sugestão de receita, no formato JSON estruturado que definimos.

4.  **Resposta da API (Backend → Frontend):**
    - O backend envia a nova sugestão de receita de volta para o frontend.
    - **Nota Crítica:** Nenhuma operação de escrita é realizada na base de dados nesta fase. O processo inteiro ocorre em memória.

5.  **Atualização da Interface (Frontend):**
    - O frontend recebe a nova receita para Quarta-feira.
    - Na interface do utilizador, a "card" da receita antiga de Quarta-feira é dinamicamente substituída pela nova sugestão.

6.  **Passo Final (Salvar o Plano):**
    - O utilizador está agora satisfeito com a nova combinação de receitas.
    - Ele clica no botão principal "Salvar Plano".
    - Só neste momento o frontend envia a lista final de receitas aprovadas para um endpoint de salvamento (ex: `POST /api/plans/save`), e o backend executa as operações na base de dados para persistir o plano.

### Diagrama Simplificado do Fluxo

`Utilizador clica em "Nova Sugestão"` → `Frontend envia pedido com contexto` → `Backend pede à IA com restrições` → `Backend devolve nova receita (não salva)` → `Frontend atualiza o dia específico` → `Utilizador clica em "Salvar Plano"` → `Backend salva o plano final na BD`
