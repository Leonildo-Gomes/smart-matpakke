
import prismaClient from '../../prisma';
import { MeInput } from './me.schema';

export async function getUserAcountService(userId: string) {
    const user = await prismaClient.user.findUnique({
        where: {
            id: userId,
        },
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
                    familyId: true
                }
            }
        }
    });
    return user;
}


export async function updateFamilyMemberService(userId: string, data: MeInput) {

    const user = await prismaClient.user.findUnique({
        where: {
            id: userId
        },
        include: {
            familyMember: true
        }
    })
    if (!user || !user.familyMember) {
        throw new Error('User not found');
    }
    const familyMember = await prismaClient.familyMember.update({
        where: {
           id: user.familyMember.id
        },
        data:{
            name: data.name,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            photoUrl: data.photoUrl
        },
        select: {
            id: true,
            name: true,
            status: true,
            dateOfBirth: true,
            gender: true,
            photoUrl: true,
            familyId: true,
        }
    })

    return familyMember;

}