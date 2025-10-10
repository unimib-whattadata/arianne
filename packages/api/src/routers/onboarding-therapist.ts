import { therapists } from "@arianne/db/schema";
import {
  onboardingTherapist,
  TherapistOnboardingCreateSchema,
} from "@arianne/db/schemas/onboarding-therapist";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const onboardingTherapistRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const onboardingPreliminaryInfo =
      await ctx.db.query.onboardingTherapist.findFirst({
        where: (t, { eq }) => eq(t.therapistId, ctx.user.profileId),
      });
    if (!onboardingPreliminaryInfo) return null;
    return onboardingPreliminaryInfo;
  }),

  create: protectedProcedure
    .input(TherapistOnboardingCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const newTherapistOnboardingInfo = await ctx.db
        .insert(onboardingTherapist)
        .values({ ...input, therapistId: ctx.user.profileId })
        .returning();
      const addedTherapistInfo = newTherapistOnboardingInfo[0];
      if (!addedTherapistInfo)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await ctx.db
        .update(therapists)
        .set({ isOnboardingPreliminaryFinished: true })
        .where(eq(therapists.profileId, ctx.user.profileId));
      return addedTherapistInfo;
    }),
});
