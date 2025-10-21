
import { compare } from 'bcryptjs';

import { InvalidCredentialsError } from '../../../lib/errors/custom.errors';
import prismaClient from '../../../prisma';
import type { LoginInput } from './login.schema';
export async function loginService (input: LoginInput) {
    const user = await prismaClient.user.findUnique({
        where: {
            email: input.email
        }
    })

    if (!user) {
        throw new InvalidCredentialsError();
    }

    const isPasswordValid = await compare(input.password, user.passwordHash)
    if (!isPasswordValid) {
        throw new InvalidCredentialsError();
    }
    return {
        userId: user.id,
        name: user.name,
        email: user.email
    }

}