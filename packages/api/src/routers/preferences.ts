import { preferences, preferenceValuesUpdateSchema } from "@arianne/db/schema";
import z from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const preferencesRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.user.id;

    const preferences = await ctx.db.query.preferences.findFirst({
      where: (t, { eq }) => eq(t.profileId, profileId),
    });

    if (!preferences) return null;

    return preferences.values;
  }),
  getByPatientId: protectedProcedure
    .input(
      z.object({
        patientId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const profileId = ctx.user.id;

      const preferences = await ctx.db.query.preferences.findFirst({
        where: (t, { eq }) => eq(t.profileId, profileId),
      });

      if (!preferences) return null;

      return preferences.values.patients.get(input.patientId);
    }),

  set: protectedProcedure
    .input(preferenceValuesUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const profileId = ctx.user.id;

      const currentPreferences = await ctx.db.query.preferences.findFirst({
        where: (t, { eq }) => eq(t.profileId, profileId),
      });

      if (!currentPreferences) return null;

      if (input?.type === "profile") {
        return await ctx.db.update(preferences).set({
          values: {
            ...currentPreferences.values,
            ...input,
          },
        });
      }

      const currentValue = currentPreferences.values.patients.get(
        input.patientId,
      );

      if (currentValue !== undefined) {
        const values = {
          ...currentValue,
          ...input.values,
        };
        const currentPatientPreferences =
          currentPreferences.values.patients.set(input.patientId, values);

        return await ctx.db.update(preferences).set({
          values: {
            ...currentPreferences.values,
            patients: currentPatientPreferences,
          },
        });
      }
    }),
});
