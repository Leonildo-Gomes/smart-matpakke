import { CustomError } from '../../lib/errors/custom.errors';
import prismaClient from '../../prisma';
import { PreferenceInput } from "./preference.schema";




export async function getAllPreferencesService() {
    const preferences = await prismaClient.preference.findMany({
        select: {
            id: true,
            type: true,
            value: true,
        },
    });
    return preferences;
}

export async function getPreferenceByIdService(preferenceId: string) {
    const preference = await prismaClient.preference.findUnique({
        where: {
            id: preferenceId,
        },
        select: {
            id: true,
            type: true,
            value: true,
        },
    })
    if (!preference) {
        throw new CustomError('Preference not found', 404);
    }
    return preference;
}
export async function createPreferenceService(data: PreferenceInput) {
    const preference = await prismaClient.preference.create({
        data: {
            type: data.type,
            value: data.value,
        },
        select: {
            id: true,
            type: true,
            value: true,
        },
    });
    return preference;    
}

export async function updatePreferenceService( preferenceId: string, data: PreferenceInput) {
    const preference = await prismaClient.preference.update({
        where: {
            id: preferenceId,
        },
        data: {
            type: data.type,
            value: data.value,
        },
        select: {
            id: true,
            type: true,
            value: true,
        },
    });
    if (!preference) {
        throw new CustomError('Preference not found', 404);
    }
    return preference;
}