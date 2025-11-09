import { Status } from "../../../generated/prisma";
import prismaClient from "../../../prisma";
import { FamilyMemberInput } from "./members.schema";


export async function addMemberService(familyId: string, data: FamilyMemberInput) {
  const member = await prismaClient.familyMember.create({
    data: {
      name: data.name,
      dateOfBirth: data.dateOfBirth || null,
      gender: data.gender || null,
      familyId,
      status: Status.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      dateOfBirth: true,
      gender: true,
    },
  });
  return member;
}

export async function updateMemberService(memberId: string, data: Partial<FamilyMemberInput>) {
  const member = await prismaClient.familyMember.update({
    where: { id: memberId },
    data: {
      //name: data.name ,
      dateOfBirth: data.dateOfBirth || null,
      gender: data.gender || null,
     
    },
    select: {
      id: true,
      name: true,
      dateOfBirth: true,
      gender: true,

    },
  });
  return member;
}

export async function removeMemberService(memberId: string) {
  await prismaClient.familyMember.delete({
    where: { id: memberId },
  });
}
