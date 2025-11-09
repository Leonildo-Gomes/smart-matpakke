import { FastifyReply, FastifyRequest } from "fastify";
import { FamilyMemberInput } from "./members.schema";
import * as service from "./members.service";

export async function addMemberHandler(request: FastifyRequest<{Params: { familyId: string };Body: FamilyMemberInput; }>,reply: FastifyReply) {
  try {
    
    const member = await service.addMemberService(request.params.familyId, request.body);
    return reply.code(201).send(member);
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function updateMemberHandler(request: FastifyRequest<{ Params: { memberId: string }; Body: Partial<FamilyMemberInput>; }>,reply: FastifyReply) {
  try {
    const member = await service.updateMemberService(request.params.memberId, request.body);
    return reply.code(200).send(member);
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function removeMemberHandler(
  request: FastifyRequest<{
    Params: { memberId: string };
  }>,
  reply: FastifyReply
) {
  try {
    await service.removeMemberService(request.params.memberId);
    return reply.code(204).send();
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}
