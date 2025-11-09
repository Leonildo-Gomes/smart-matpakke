import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as controller from "./members.controller";
import {
  familyMemberSchema,
  updateFamilyMemberSchema,
  familyMemberParamsSchema,
  familyMemberResponseSchema,
  errorResponseSchema,
} from "./members.schema";
import { z } from "zod";

export async function memberRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/families/:familyId/members",
    {
      schema: {
        summary: "Add a new member to a family",
        tags: ["families", "members"],
        params: z.object({ familyId: z.string().uuid() }),
        body: familyMemberSchema,
        response: {
          201: familyMemberResponseSchema,
          401: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    controller.addMemberHandler
  );

  typedApp.put(
    "/families/:familyId/members/:memberId",
    {
      schema: {
        summary: "Update a family member's profile",
        tags: ["families", "members"],
        params: familyMemberParamsSchema,
        body: updateFamilyMemberSchema,
        response: {
          200: familyMemberResponseSchema,
          401: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    controller.updateMemberHandler
  );

  typedApp.delete(
    "/families/:familyId/members/:memberId",
    {
      schema: {
        summary: "Remove a member from a family",
        tags: ["families", "members"],
        params: familyMemberParamsSchema,
        response: {
          204: z.null(),
          401: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    controller.removeMemberHandler
  );
}
