
import { Gender, NutrientUnit, PreferenceType } from "../../../generated/prisma/client";
import { CustomError } from "../../../lib/errors/custom.errors";
import { generateText } from "../../../lib/openai/agent";
import prismaClient from "../../../prisma";
import { PlanOutput, PlanOutputSchema } from "./plan.output.schema";
import { generatePlanSchema, WeeklyPlanResponseSchema } from "./plan.schema";
import { PlanGenerationContext } from "./plan.types";





 export async function generatePlanService(data: generatePlanSchema): Promise< PlanOutput> {
  const  { userId, planType, startDate } = data;
    const user= await prismaClient.user.findUnique({
        where: {
            id: userId
        },
        include: {
            usersPreferences: {
                include: {
                    preference: true,
                },
            },
        },
    })


    if (!user) {
        throw new CustomError('User not found', 404);
    }
    if (!user.dateOfBirth) {
      throw new CustomError('User date of birth is required for plan generation');
    }
    const age = calculateAge(user.dateOfBirth);

    const preferences: PlanGenerationContext['preferences'] = {
      matpakkeType: [],
      dietStyle: [],
      allergies: [],
      ingredientsToAvoid: [],
    };

    user.usersPreferences.forEach((preference) => {
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
        gender: user.gender || Gender.PREFER_NOT_TO_SAY,
      },
      family: {
        numberOfMembers: 1,
      },
      preferences,
      planType,
      startDate,
      
    };
    const aiResponse= await generateText(planGenerate);
    //console.log('AI raw response:', aiResponse); // Uncommented for debugging
    let aiResponseCleaned = aiResponse;
    const jsonStart = aiResponse.indexOf('```json');
    const jsonEnd = aiResponse.lastIndexOf('```');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
      aiResponseCleaned = aiResponse.substring(jsonStart + 7, jsonEnd).trim();
    }
    //console.log('AI cleaned response:', aiResponseCleaned);
    let parsedResponse: any;

    try {

      parsedResponse = JSON.parse(aiResponseCleaned);

    } catch (error) {

      console.error('Failed to parse AI response as JSON:', aiResponseCleaned);

      throw new CustomError('AI did not return a valid JSON response.', 500);


    }
    // Validate the parsed response against our Zod schema

    
    const validationResult = PlanOutputSchema.safeParse(parsedResponse);
   
    if (!validationResult.success) {

      console.error('AI response validation failed:', JSON.stringify(validationResult.error, null, 2)); // Log detailed Zod error

      throw new CustomError('AI response did not match the expected schema.', 500);

    }
    return validationResult.data;
   
  }

  function calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

/**
 * Helper function to map AI string units to our NutrientUnit enum.
 * This provides a safety layer against unexpected AI output.
 * @param unit The unit string from the AI (e.g., "grams", "kcal").
 * @returns The corresponding NutrientUnit enum value.
 */
function normalizeNutrientUnit(unit: string): NutrientUnit {
  const lowerUnit = unit.toLowerCase().trim();

  switch (lowerUnit) {
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return NutrientUnit.KILOGRAM;
    case 'g':
    case 'gram':
    case 'grams':
      return NutrientUnit.GRAM;
    case 'mg':
    case 'milligram':
    case 'milligrams':
      return NutrientUnit.MILLIGRAM;
    case 'kcal':
    case 'calorie':
    case 'calories':
      return NutrientUnit.KILOCALORIE;
    case 'ml':
    case 'milliliter':
    case 'milliliters':
      return NutrientUnit.MILLILITER;
    case 'l':
    case 'liter':
    case 'liters':
      return NutrientUnit.LITER;
    case 'tsp':
    case 'teaspoon':
    case 'teaspoons':
      return NutrientUnit.TEASPOON;
    case 'tbsp':
    case 'tablespoon':
    case 'tablespoons':
      return NutrientUnit.TABLESPOON;
    case 'unit':
    case 'units':
      return NutrientUnit.UNIT;
    default:
      // If the unit is unknown, log a warning and default to 'UNIT'.
      console.warn(`Unknown nutrient unit '${unit}', defaulting to 'UNIT'.`);
      return NutrientUnit.UNIT;
  }
}

export async function saveGeneratedPlanService(userId : string, plan : PlanOutput) {
    const user = await prismaClient.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            familyId: true
        }
    })
    if (!user) {
        throw new CustomError('User or family not found', 404);
    }

    return prismaClient.$transaction( async (prisma)=>{
      // 1. Create new weekly plan
      const weeklyPlan = await prisma.weeklyPlan.create({
        data: {
          startDate: new Date(plan.startDate),
          familyId: user.familyId,
        },
      });

      //process each daily pla from the Ai ouput
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

        // Map names to IDs for easy lookup
        const ingredientIdMap = new Map(createdIngredients.map((i) => [i.name, i.id]));
        const nutrientIdMap = new Map(createdNutrients.map((n) => [n.name, n.id]));

        // create recipe
        const newRecipe= await prisma.recipe.create({
          data: {
            title:recipeData.title,
            description: recipeData.description,
            instructions: recipeData.instructions,
            prepTimeMinutes: recipeData.prepTimeMinutes,
          }
        });
        // create recipe ingredients
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
        // create recipe nutrients
        const recipeNutrients = recipeData.nutrients?.map((nutrient) => ({
          value: nutrient.value,
          recipeId: newRecipe.id,
          nutrientId: nutrientIdMap.get(nutrient.name)!,
        }));
        await prisma.recipeNutrient.createMany({
          data: recipeNutrients || [],
        });
        // 5. Create new daily plan
        await prisma.dailyPlan.create({
          data: {
            dayOfWeek: dailyPlan.dayOfWeek,
            recipeId: newRecipe.id,
            weeklyPlanId: weeklyPlan.id,
          },
        });
      } 
      const newPlna=  await prisma.weeklyPlan.findUnique({
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
      console.log('newPlna::::',newPlna);
      const validationResult = WeeklyPlanResponseSchema.safeParse(newPlna);
      if (!validationResult.success) {
        // AQUI: O erro é lançado porque a validação falhou
        console.error('AI response validation failed:', JSON.stringify(validationResult.error, null, 2)); 
        throw new CustomError('AI response did not match the expected schema.', 500);
      }
      return validationResult;
    })
}
