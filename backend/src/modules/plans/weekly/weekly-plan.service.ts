import { CustomError } from "../../../lib/errors/custom.errors";
import prismaClient from "../../../prisma";
import { CreateWeeklyPlanInput, UpdateWeeklyPlanInput } from "./weekly-plan.schema";



export async function createWeeklyPlanService(data: CreateWeeklyPlanInput, familyId: string) {

    const weeklyPlan= await prismaClient.weeklyPlan.create({
        data: {
            startDate: data.startDate,
            familyId: familyId, // Use the argument here
            dailyPlans: {
                create: data.dailyPlans.map((dailyPlan) => ({
                    dayOfWeek: dailyPlan.dayOfWeek,
                    recipeId: dailyPlan.recipeId,
                })),
            },
        },
        include: {
            dailyPlans: {
                include: {
                    recipe: true,
                },
            },
        },
    });
    return weeklyPlan;  
}

export async function updateWeeklyPlanService(weeklyPlanId: string, data: UpdateWeeklyPlanInput, familyId: string) {
    const { dailyPlans, startDate,...updateData } = data;

    if (!startDate) {
        throw new CustomError('startDate is required', 400);
        
    }

    // Note: This implementation does not handle updates to dailyPlans.
    const weeklyPlan = await prismaClient.weeklyPlan.update({
        where: {
            id: weeklyPlanId,
            familyId: familyId,
        },
        data: updateData, // Pass only the scalar fields, excluding dailyPlans
        include: {
            dailyPlans: {
                include: {
                    recipe: true,
                },
            },
        },
    });
    return weeklyPlan;
}

export async function deleteWeeklyPlanService(weeklyPlanId: string, familyId: string) {
    const weeklyPlan = await prismaClient.weeklyPlan.delete({
        where: {
            id: weeklyPlanId,
            familyId: familyId,
        },
    });
    return weeklyPlan;
}
 
export async function getWeeklyPlanService(weeklyPlanId: string, familyId: string) {
    const weeklyPlan = await prismaClient.weeklyPlan.findUnique({
        where: {
            id: weeklyPlanId,
            familyId: familyId,
        },
        include: {
            dailyPlans: {
                include: {
                    recipe: true,
                },
            },
        },
    });
    return weeklyPlan;
}

export async function getCurrentWeeklyPlanService(userId: string) {
    const currentWeeklyPlan = await prismaClient.weeklyPlan.findFirst({
        where: {
            familyId: userId,
        },
        orderBy: {
            startDate: "desc",
        },
        include: {
            dailyPlans: {
                include: {
                    recipe: true,
                },
            },
        },
    });
    return currentWeeklyPlan;
}
