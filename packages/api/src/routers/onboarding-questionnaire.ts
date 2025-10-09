import {
  FormFlowCreateSchema,
  FormFlowFindSchema,
  formFlows,
} from "@arianne/db/schemas/onboarding-questionnaire";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const questionnaireOnboardingRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {}),

  save: protectedProcedure
    .input(FormFlowCreateSchema)
    .mutation(async ({ input, ctx }) => {
      // search if record exists
      // if not exists create, otherwise update
    }),

  delete: protectedProcedure
    .input(FormFlowFindSchema)
    .mutation(async ({ input, ctx }) => {}),
});
