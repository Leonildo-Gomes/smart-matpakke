import { Gender } from '../../generated/prisma';
import { CustomError } from '../../lib/errors/custom.errors'; // For error handling
import prismaClient from '../../prisma';
import { UpdateUserProfileInput } from './user.schema';

export async function getUserProfile(userId: string) {
    console.log(userId);
    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { // Select specific fields to return
            id: true,
            email: true,
            familyMember: {
                select: {
                    id: true,
                    name: true,
                    dateOfBirth: true,
                    gender: true,
                    photoUrl: true,
                },
            },
           
        },
    });

    if (!user) {
        throw new CustomError('Utilizador não encontrado', 404);
    }
    return user;
}

export async function updateUserProfile(userId: string, data: UpdateUserProfileInput) {
    const updateData: {
        name?: string;
        dateOfBirth?: Date | null;
        gender?: Gender;
        photoUrl?: string;
    } = {};

    if (data.name !== undefined) {
        updateData.name = data.name;
    }
    if (data.dateOfBirth !== undefined) {
        updateData.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    }
    if (data.gender !== undefined) {
        updateData.gender = data.gender;
    }
    if (data.photoUrl !== undefined) {
        updateData.photoUrl = data.photoUrl;
    }

    const user = await prismaClient.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            email: true,
            familyMember: {
                select: {
                    id: true,
                    name: true,
                    dateOfBirth: true,
                    gender: true,
                    photoUrl: true,
                },
            },
        },
    });
    if (!user) {
        throw new CustomError('User not found', 404);
    }
    return user;
}