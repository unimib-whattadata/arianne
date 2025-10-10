import {
  onboardingTherapistExperience,
  OnboardingTherapistExperienceSchema,
  profiles,
  therapists,
} from "@arianne/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const onboardingTherapistExperienceRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const onboardingExperienceInfo =
      await ctx.db.query.onboardingTherapistExperience.findFirst({
        where: (t, { eq }) => eq(t.therapistId, ctx.user.profileId),
      });
    if (!onboardingExperienceInfo) return null;
    return onboardingExperienceInfo;
  }),

  create: protectedProcedure
    .input(OnboardingTherapistExperienceSchema)
    .mutation(async ({ input, ctx }) => {
      const newTherapistOnboardingExperienceInfo = await ctx.db
        .insert(onboardingTherapistExperience)
        .values({
          ...input,
          therapistId: ctx.user.profileId,
        })
        .returning();
      const addedTherapistExperienceInfo =
        newTherapistOnboardingExperienceInfo[0];
      if (!addedTherapistExperienceInfo)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await ctx.db
        .update(therapists)
        .set({ isOnboardingExperienceFinished: true })
        .where(eq(therapists.profileId, ctx.user.profileId));

      const currentTherapist = await ctx.db.query.therapists.findFirst({
        where: (t, { eq }) => eq(t.profileId, ctx.user.profileId),
      });
      if (
        currentTherapist?.isOnboardingExperienceFinished &&
        currentTherapist.isOnboardingPersonalFinished &&
        currentTherapist.isOnboardingPreliminaryFinished &&
        currentTherapist.isOnboardingTimeFinished
      ) {
        await ctx.db
          .update(profiles)
          .set({
            completedOnboarding: true,
          })
          .where(and(eq(profiles.id, ctx.user.profileId)))
          .returning();
      }

      return addedTherapistExperienceInfo;
    }),
});
