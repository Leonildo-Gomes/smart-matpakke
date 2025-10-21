import { CustomError } from '../../lib/errors/custom.errors'; // For error handling
import prismaClient from '../../prisma';

export async function getUserProfile(userId: string) {
    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { // Select specific fields to return
            id: true,
            name: true,
            email: true,
            dateOfBirth: true,
            familyId: true,
        },
    });

    if (!user) {
        // For a /me endpoint, if the user ID from the token doesn't exist, it's a serious issue
        // Could be a tampered token or deleted user.
        throw new CustomError('Utilizador não encontrado', 404);
    }

    return user;
}