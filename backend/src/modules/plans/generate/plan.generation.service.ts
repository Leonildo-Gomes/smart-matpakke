
import { Gender, PreferenceType } from "../../../generated/prisma/client";
import { CustomError } from "../../../lib/errors/custom.errors";
import { generateText } from "../../../lib/openai/agent";
import prismaClient from "../../../prisma";
import { PlanOutput, PlanOutputSchema } from "./plan.output.schema";
import { generatePlanSchema } from "./plan.schema";
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

/*
export class PlanGenerationService {
  constructor(private prisma: typeof prismaClient) {}

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async getPlanGenerationContext(userId: string, planType: 'DAILY' | 'WEEKLY'): Promise<PlanGenerationContext> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        usersPreferences: {
          include: {
            preference: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.dateOfBirth) {
      throw new Error('User date of birth is required for plan generation');
    }
    const age = this.calculateAge(user.dateOfBirth);



    const preferences: PlanGenerationContext['preferences'] = {
      matpakkeType: [],
      dietStyle: [],
      allergies: [],
      ingredientsToAvoid: [],
    };

    user.usersPreferences.forEach((up: any) => {
      switch (up.preference.type) {
        case PreferenceType.MATPAKKE_TYPE:
          preferences.matpakkeType.push(up.preference.value);
          break;
        case PreferenceType.DIET_STYLE:
          preferences.dietStyle.push(up.preference.value);
          break;
        case PreferenceType.ALLERGY:
          preferences.allergies.push(up.preference.value);
          break;
        case PreferenceType.INGREDIENT_AVOID:
          preferences.ingredientsToAvoid.push(up.preference.value);
          break;
      }
    });

    return {
      user: {
        age,
        gender: user.gender || "P", // Default to Prefer_Not_To_Say if not set
      },
      family: {
        numberOfMembers: 1, // For now, always 1 as family feature is future
      },
      preferences,
      planType,
    };
  }

  async generatePlan(data:generatePlanSchema): Promise<any> {
    const context = await this.getPlanGenerationContext(data.userId, data.planType);
    // TODO: Build prompt using context and call AI
    console.log('Generated context:', context);
    return { message: 'Plan generation initiated (AI call pending)', context };
  }
}*/

 










/*import { PrismaClient } from '@prisma/client';

import { PlanGenerationContext } from './plan.types';

import { Gender, PreferenceType } from '../../../generated/prisma/client';

import { buildDocsSystemPrompt, buildSystemPrompt, buildUserPrompt } from './plan.prompts';

import { generateText } from '../../../lib/openai/agent';

import { PlanOutput, PlanOutputSchema } from './plan.output.schema';

import { CustomError } from '../../../lib/errors/custom.errors';

import * as fs from 'fs';

import * as path from 'path';



export class PlanGenerationService {

  constructor(private prisma: PrismaClient) {}



  private calculateAge(dateOfBirth: Date): number {

    const today = new Date();

    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();

    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {

      age--;

    }

    return age;

  }



  async getPlanGenerationContext(userId: string, planType: 'DAILY' | 'WEEKLY'): Promise<PlanGenerationContext> {

    const user = await this.prisma.user.findUnique({

      where: { id: userId },

      include: {

        usersPreferences: {

          include: {

            preference: true,

          },

        },

      },

    });



    if (!user) {

      throw new CustomError('User not found', 404);

    }



    if (!user.dateOfBirth) {

      throw new CustomError('User date of birth is required for plan generation', 400);

    }



    const age = this.calculateAge(user.dateOfBirth);



    const preferences: PlanGenerationContext['preferences'] = {

      matpakkeType: [],

      dietStyle: [],

      allergies: [],

      ingredientsToAvoid: [],

    };



    user.usersPreferences.forEach((up: any) => {

      switch (up.preference.type) {

        case PreferenceType.MATPAKKE_TYPE:

          preferences.matpakkeType.push(up.preference.value);

          break;

        case PreferenceType.DIET_STYLE:

          preferences.dietStyle.push(up.preference.value);

          break;

        case PreferenceType.ALLERGY:

          preferences.allergies.push(up.preference.value);

          break;

        case PreferenceType.INGREDIENT_AVOID:

          preferences.ingredientsToAvoid.push(up.preference.value);

          break;

      }

    });



    return {

      user: {

        age,

        gender: user.gender || Gender.PREFER_NOT_TO_SAY, // Default to Prefer_Not_To_Say if not set

      },

      family: {

        numberOfMembers: 1, // For now, always 1 as family feature is future

      },

      preferences,

      planType,

    };

  }



  async generatePlan(userId: string, planType: 'DAILY' | 'WEEKLY'): Promise<PlanOutput> {

    const context = await this.getPlanGenerationContext(userId, planType);



    // Read matpakke guidelines

    const matpakkeGuidelinesPath = path.join(__dirname, '..', '..', '..', 'knowledge', 'matpakke_guidelines.md');

    const matpakkeGuidelines = fs.readFileSync(matpakkeGuidelinesPath, 'utf-8');



    const systemPrompt = buildSystemPrompt();

    const docsSystemPrompt = buildDocsSystemPrompt(matpakkeGuidelines);

    const userPrompt = buildUserPrompt(context);



    const aiResponse = await generateText(context);



    // Attempt to parse the AI's response as JSON

    let parsedResponse: any;

    try {

      parsedResponse = JSON.parse(aiResponse);

    } catch (error) {

      console.error('Failed to parse AI response as JSON:', aiResponse);

      throw new CustomError('AI did not return a valid JSON response.', 500);

    }



    // Validate the parsed response against our Zod schema

    const validationResult = PlanOutputSchema.safeParse(parsedResponse);



    if (!validationResult.success) {

      console.error('AI response validation failed:', validationResult.error);

      throw new CustomError('AI response did not match the expected schema.', 500);

    }



    const planOutput = validationResult.data;



    // --- Save to Database --- //

    // This part will be complex and depends on whether it's a daily or weekly plan.

    // For now, we'll return the validated output.

    // TODO: Implement actual database saving logic here.



    console.log('Generated and validated plan output:', planOutput);

    return planOutput;

  }

}*/
