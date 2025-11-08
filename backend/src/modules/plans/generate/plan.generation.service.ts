import { Gender, PreferenceType } from "../../../generated/prisma/client";
import { CustomError } from "../../../lib/errors/custom.errors";
import { generateText } from "../../../lib/openai/agent";
import { calculateAge } from "../../../lib/utils/date.utils";
import { normalizeNutrientUnit } from "../../../lib/utils/nutrient.utils";
import prismaClient from "../../../prisma";
import { GeneratedPlan, GeneratedPlanSchema } from "./generated-plan.schema";
import { generatePlanSchema, WeeklyPlanResponseSchema } from "./plan.schema";
import { PlanGenerationContext } from "./plan.types";

 export async function generatePlanService(data: generatePlanSchema): Promise<GeneratedPlan> {
  const  { familyMemberId, planType, startDate } = data;
    const familyMember= await prismaClient.familyMember.findUnique({
        where: {
            id: familyMemberId
        },
        include: {
            familyMemberPreferences: {
                include: {
                    preference: true
                }
            }
        }
    })
    if (!familyMember) {
      throw new CustomError('Family member not found', 404);
    }
    if (!familyMember.dateOfBirth) {
      throw new CustomError('Family member date of birth is required for plan generation');
    }
    const age = calculateAge(familyMember.dateOfBirth);

    const preferences: PlanGenerationContext['preferences'] = {
      matpakkeType: [],
      dietStyle: [],
      allergies: [],
      ingredientsToAvoid: [],
    };

    familyMember.familyMemberPreferences.forEach((preference) => {
      if (preference.preference.type === PreferenceType.MATPAKKE_TYPE) {
        preferences.matpakkeType.push(preference.preference.value);
      } else if (preference.preference.type === PreferenceType.DIET_STYLE) {
        preferences.dietStyle.push(preference.preference.value);
      } else if (preference.preference.type === PreferenceType.ALLERGY) {
        preferences.allergies.push(preference.preference.value);
      } else if (preference.preference.type === PreferenceType.INGREDIENT_AVOID) {
        preferences.ingredientsToAvoid.push(preference.preference.value);
      }
    });
    const planGenerate: PlanGenerationContext = {
      user: {
        age: age,
        gender: familyMember.gender || Gender.PREFER_NOT_TO_SAY,
      },
      family: {
        numberOfMembers: 1,
      },
      preferences,
      planType,
      startDate,
    };
    const aiResponse= await generateText(planGenerate);
    let aiResponseCleaned = aiResponse;
    const jsonStart = aiResponse.indexOf('```json');
    const jsonEnd = aiResponse.lastIndexOf('```');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
      aiResponseCleaned = aiResponse.substring(jsonStart + 7, jsonEnd).trim();
    }
    let parsedResponse: any;

    try {
      parsedResponse = JSON.parse(aiResponseCleaned);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', aiResponseCleaned);
      throw new CustomError('AI did not return a valid JSON response.', 500);
    }
    
    const validationResult = GeneratedPlanSchema.safeParse(parsedResponse);
   
    if (!validationResult.success) {
      console.error('AI response validation failed:', JSON.stringify(validationResult.error, null, 2));
      throw new CustomError('AI response did not match the expected schema.', 500);
    }
    return validationResult.data;
  }

export async function saveGeneratedPlanService(familyMemberId: string, plan: GeneratedPlan) {
    const familyMember = await prismaClient.familyMember.findUnique({
        where: {
            id: familyMemberId
        },
        select: {
            id: true,
            familyId: true,
        }
    });

    if (!familyMember || !familyMember.familyId) {
        throw new CustomError('Family member or associated family not found', 404);
    }
    const { familyId } = familyMember;

    return prismaClient.$transaction( async (prisma)=>{
      const weeklyPlan = await prisma.weeklyPlan.create({
        data: {
          startDate: new Date(plan.startDate),
          familyId: familyId,
        },
      });

      for (const dailyPlan of plan.dailyPlans) {
        const {recipe: recipeData} = dailyPlan;
        const ingredientUpserts= recipeData.ingredients.map((ingredient) =>
          prisma.ingredient.upsert({
            where :{name: ingredient.name},
            update: {},
            create: {
              name: ingredient.name
            }
          }) 
        );
        const nutrientUpserts= recipeData.nutrients?.map((nutrient) =>
          prisma.nutrient.upsert({
            where :{name: nutrient.name},
            update: {},
            create: {
              name: nutrient.name,
              unit: normalizeNutrientUnit(nutrient.unit),
            }
          })
        )
        const createdIngredients = await Promise.all(ingredientUpserts);
        const createdNutrients = await Promise.all(nutrientUpserts || []); 

        const ingredientIdMap = new Map(createdIngredients.map((i) => [i.name, i.id]));
        const nutrientIdMap = new Map(createdNutrients.map((n) => [n.name, n.id]));

        const newRecipe= await prisma.recipe.create({
          data: {
            title:recipeData.title,
            description: recipeData.description,
            instructions: recipeData.instructions,
            prepTimeMinutes: recipeData.prepTimeMinutes,
          }
        });
        const recipeIngredients = recipeData.ingredients.map((ingredient) => ({
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          notes: ingredient.notes || null,
          recipeId: newRecipe.id,
          ingredientId: ingredientIdMap.get(ingredient.name)!,
        }));
        await prisma.recipeIngredient.createMany({
          data: recipeIngredients,
        });
        const recipeNutrients = recipeData.nutrients?.map((nutrient) => ({
          value: nutrient.value,
          recipeId: newRecipe.id,
          nutrientId: nutrientIdMap.get(nutrient.name)!,
        }));
        await prisma.recipeNutrient.createMany({
          data: recipeNutrients || [],
        });
        await prisma.dailyPlan.create({
          data: {
            dayOfWeek: dailyPlan.dayOfWeek,
            recipeId: newRecipe.id,
            weeklyPlanId: weeklyPlan.id,
            familyMemberId: familyMemberId // Correctly use familyMemberId
          },
        });
      } 
      const newPlan =  await prisma.weeklyPlan.findUnique({
        where: {
          id: weeklyPlan.id,
        },
        include: {
          dailyPlans: {
            include: {
              recipe: {
                include: {
                  recipeIngredients: { include: { ingredient: true } },
                  recipeNutrients: { include: { nutrient: true } },
                },
              },
            },
          },
        },
      });
      
      const validationResult = WeeklyPlanResponseSchema.safeParse(newPlan);
      if (!validationResult.success) {
        console.error('Saved plan validation failed:', JSON.stringify(validationResult.error, null, 2)); 
        throw new CustomError('Saved plan did not match the expected response schema.', 500);
      }
      return validationResult.data;
    })
}