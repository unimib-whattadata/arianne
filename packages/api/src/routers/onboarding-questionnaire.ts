import type { FormFlowCreateSchema } from "@arianne/db/schemas/onboarding-questionnaire";
import { patients } from "@arianne/db/schema";
import {
  formFlows,
  FullSchema,
} from "@arianne/db/schemas/onboarding-questionnaire";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

type FullSchemaType = z.infer<typeof FullSchema>;
type FormFlowCreateSchemaType = z.infer<typeof FormFlowCreateSchema>;

const flowMapper = (input: FullSchemaType): FormFlowCreateSchemaType => {
  const response: FormFlowCreateSchemaType = {
    step1: { name: input.name },
    step2: { age: input.age },
    step3: { gender: input.gender },
    currentStep: "step1",
    final: {
      duration: input.duration,
      pastTherapy: input.pastTherapy,
      preferredAge: input.preferredAge,
      preferredApproach: input.preferredApproach,
      preferredGender: input.preferredGender,
      preferredOrientation: input.preferredOrientation,
      questionType: input.questionType,
      therapyExperience: input.therapyExperience,
      therapyGoals: input.therapyGoals,
      therapyLocation: input.therapyLocation,
      therapistOrientation: input.therapistOrientation,
      timePreference: input.timePreference,
      otherInfo: "",
    },
    couple: input.couple,
    family: input.family,
    individual: input.individual,
  };

  return response;
};

export const questionnaireOnboardingRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    // get flow schema by patient id
    const onboardingExisting = await ctx.db.query.formFlows.findFirst({
      where: (t, { eq }) => eq(t.patientId, ctx.user.profileId),
    });
    if (!onboardingExisting) return null;
    return onboardingExisting;
  }),

  save: protectedProcedure
    .input(
      z.object({
        questionnaire: FullSchema,
        currentStepIndex: z.number(),
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // search if record exists by using patiend id
      const mappedInput = flowMapper(input.questionnaire);
      const onboardingExisting = await ctx.db.query.formFlows.findFirst({
        where: (t, { eq }) => eq(t.patientId, ctx.user.profileId),
      });
      if (!onboardingExisting) {
        return await ctx.db.insert(formFlows).values({
          ...mappedInput,
          currentStepId: input.currentStepIndex,
          patientId: ctx.user.profileId,
          completed: input.completed,
        });
      }
      // if not exists create, otherwise update
      if (input.completed) {
        await ctx.db
          .update(patients)
          .set({ questionnaireInfoAdded: true })
          .where(eq(patients.profileId, ctx.user.profileId));
      }
      return await ctx.db
        .update(formFlows)
        .set({ ...mappedInput, currentStepId: input.currentStepIndex });
    }),
});
