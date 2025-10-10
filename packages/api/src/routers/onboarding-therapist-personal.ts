import {
  onboardingTherapistPersonal,
  OnboardingTherapistPersonalCreateSchema,
  therapists,
} from "@arianne/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const onboardingTherapistPersonalRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const onboardingPersonalInfo =
      await ctx.db.query.onboardingTherapistPersonal.findFirst({
        where: (t, { eq }) => eq(t.therapistId, ctx.user.profileId),
      });
    if (!onboardingPersonalInfo) return null;
    return onboardingPersonalInfo;
  }),

  create: protectedProcedure
    .input(OnboardingTherapistPersonalCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const newTherapistOnboardingPersonalInfo = await ctx.db
        .insert(onboardingTherapistPersonal)
        .values({
          ...input,
          therapistId: ctx.user.profileId,
        })
        .returning();
      const addedTherapistPersonalInfo = newTherapistOnboardingPersonalInfo[0];
      if (!addedTherapistPersonalInfo)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await ctx.db
        .update(therapists)
        .set({ isOnboardingPersonalFinished: true })
        .where(eq(therapists.profileId, ctx.user.profileId));
      return addedTherapistPersonalInfo;
    }),
});
