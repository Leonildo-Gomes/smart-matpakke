import { hash } from 'bcryptjs';
import { Status } from '../../../generated/prisma';
import prismaClient from '../../../prisma';
import type { RegisterInput } from './register.schema';
export async function registerService (input: RegisterInput) {

    const existingUser = await prismaClient.user.findUnique({
        where: {
            email: input.email
        }
    })

    if (existingUser) {
        throw new Error('User already exists')
    }

    const hashedPassword = await hash(input.password, 10)

    const user = await prismaClient.user.create({
        data: {
            email: input.email,
            passwordHash: hashedPassword,
            familyMember: {
                create: {
                    name: input.name,
                    status:Status.ACTIVE,
                    family: {
                        create: {
                            name: input.name
                        }
                    }
                },
            },
        },
        select: {
            id: true,
            email: true,
            familyMember: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    })
    return user;
}