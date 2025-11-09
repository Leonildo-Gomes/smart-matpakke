import prismaClient from "../../prisma";
import { FamilyInput } from "./family.schema";


export async function createFamilyService(data: FamilyInput) {
        const family= await prismaClient.family.create({
            data: {
                name: data.name,
            },
            select: {
                id: true,
                name: true,
                familyMembers:{
                    select: {
                        id: true,
                        name: true,
                        dateOfBirth: true,
                        gender: true,
                    }
                },
            },

        })
        return family;
}


export async function getFamilyService(familyId: string) {
    const family = await prismaClient.family.findUnique({
        where: {
            id: familyId,
        },
        select: {
            id: true,
            name: true,
            familyMembers:{
                select: {
                    id: true,
                    name: true,
                    dateOfBirth: true,
                    gender: true,
                }
            },
        },
    });
    return family;
}

export function getAllFamiliesService() {
    return prismaClient.family.findMany({
        select: {
            id: true,
            name: true,
            familyMembers:{
                select: {
                    id: true,
                    name: true,
                    dateOfBirth: true,
                    gender: true,
                }
            },
        },
    });
}


export async function deleteFamilyService(familyId: string) {
    const family = await prismaClient.family.delete({
        where: {
            id: familyId,
        },
        select: {
            id: true,
            name: true,
        },
    });
    return family;
}

export async function updateFamilyService(familyId: string, data: FamilyInput) {
    const family = await prismaClient.family.update({
        where: {
            id: familyId,
        },
        data: {
            name: data.name,
        },
        select: {
            id: true,
            name: true,
        },
    });
    return family;
}