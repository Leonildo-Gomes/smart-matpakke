import { Gender } from '../../../generated/prisma/client';
import { PlanOutputSchema } from './plan.output.schema';
import type { PlanGenerationContext } from './plan.types';

/**
 * Instrucoes para a IA
 * */
export function buildSystemPrompt(){
    return [
        `Você é um nutricionista e chef de cozinha experiente na Noruega, especializado em criar planos de refeições saudáveis e personalizados, com foco em "matpakke" (marmitas/lanches embalados).`,
        `Sua tarefa é gerar um plano de refeições (diário ou semanal) e receitas detalhadas, adaptadas às necessidades e preferências de um utilizador específico.`,
        `Você deve considerar a idade, género, estilo de dieta, tipo de matpakke preferido, alergias e ingredientes a evitar do utilizador.`,
        `A sua resposta DEVE ser um objeto JSON válido, estritamente formatado de acordo com o schema que lhe será fornecido. Não inclua texto adicional antes ou depois do JSON.`,
        `As receitas devem ser práticas para o dia-a-dia e adequadas para serem transportadas como matpakke.`,
        `Priorize ingredientes frescos e sazonais, e forneça instruções claras e concisas.`,
        `Certifique-se de que o plano de refeições é nutricionalmente equilibrado e variado.`,
    ].join("\n");
}

export function buildUserPrompt(context: PlanGenerationContext){
    const { user, preferences, planType } = context;

    const promptParts: string[] = [
        `Por favor, gera um plano de lanches ${planType === 'DAILY' ? 'diário' : 'semanal'} para mim.`,
        `Aqui estão os meus detalhes e preferências:`,
        `- Idade: ${user.age} anos`,
        `- Género: ${user.gender === Gender.MALE ? 'Masculino' : user.gender === Gender.FEMALE ? 'Feminino' : 'Não especificado'} `,
    ];

    if (preferences.dietStyle.length > 0) {
        promptParts.push(`- Estilo de Dieta: ${preferences.dietStyle.join(', ')}`);
    }
    if (preferences.matpakkeType.length > 0) {
        promptParts.push(`- Tipo de Matpakke Preferido: ${preferences.matpakkeType.join(', ')}`);
    }
    if (preferences.allergies.length > 0) {
        promptParts.push(`- Alergias: ${preferences.allergies.join(', ')}`);
    }
    if (preferences.ingredientsToAvoid.length > 0) {
        promptParts.push(`- Ingredientes a Evitar: ${preferences.ingredientsToAvoid.join(', ')}`);
    }

    promptParts.push(
        `\nPor favor, retorna o plano de refeições e as receitas num formato JSON estrito, seguindo o seguinte schema:`,
        `'''json
{
  "planType": "DAILY" | "WEEKLY",
  "dayOfWeek"?: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY", // Apenas para DAILY
  "startDate"?: "YYYY-MM-DD", // Apenas para WEEKLY
  "recipe"?: { // Apenas para DAILY
    "title": "string",
    "description": "string",
    "instructions": "string",
    "prepTimeMinutes": "number",
    "ingredients": [
      {
        "name": "string",
        "quantity": "number",
        "unit": "kg" | "g" | "mg" | "ml" | "l" | "tsp" | "tbsp" | "unit",
        "notes"?: "string"
      }
    ],
    "nutrients"?: [
      {
        "name": "string",
        "value": "number",
        "unit": "kcal" | "g" | "mg"
      }
    ]
  },
  "dailyPlans"?: [ // Apenas para WEEKLY
    {
      "dayOfWeek": "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY",
      "recipe": {
        "title": "string",
        "description": "string",
        "instructions": "string",
        "prepTimeMinutes": "number",
        "ingredients": [
          {
            "name": "string",
            "quantity": "number",
            "unit": "kg" | "g" | "mg" | "ml" | "l" | "tsp" | "tbsp" | "unit",
            "notes"?: "string"
          }
        ],
        "nutrients"?: [
          {
            "name": "string",
            "value": "number",
            "unit": "kcal" | "g" | "mg"
          }
        ]
      }
    }
  ]
}
'''`
    );

    return promptParts.join("\n");
}

export function buildDocsSystemPrompt( doc: string) {
    return [`Documentos base de conhecimentos para ajudar na geração de lanches:${doc}`].join("\n");
}