import {
  getPreferencesSchema,
  preferences,
  setPreferenceSchema,
} from "@arianne/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const preferencesRouter = createTRPCRouter({
  get: protectedProcedure
    .input(getPreferencesSchema)
    .query(async ({ input, ctx }) => {
      const profileId = ctx.user.profileId;

      const isPatientSpecific = "patientId" in input;
      if (isPatientSpecific && !input.patientId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Patient ID is required for this preference.",
        });
      }

      // If the preference is patient-specific, we need to include the patientId in the query
      if (isPatientSpecific) {
        const preferences = await ctx.db.query.preferences.findFirst({
          where: (t, { eq, and }) =>
            and(
              eq(t.profileId, profileId),
              eq(t.key, input.key),
              sql`${t.value} ->> 'patientId' = ${input.patientId}`,
            ),
        });

        return preferences;
      }

      const preferences = await ctx.db.query.preferences.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.profileId, profileId), eq(t.key, input.key)),
      });

      return preferences;
    }),

  set: protectedProcedure
    .input(setPreferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const profileId = ctx.user.id;

      const isPatientSpecific =
        typeof input.value === "object" && "patientId" in input.value;

      if (isPatientSpecific && !input.value.patientId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Patient ID is required for this preference.",
        });
      }

      // If the preference is patient-specific, we need to include the patientId in the query
      if (isPatientSpecific) {
        const existingPreference = await ctx.db.query.preferences.findFirst({
          where: (t, { eq, and }) =>
            and(
              eq(t.profileId, profileId),
              eq(t.key, input.key),
              sql`${t.value} ->> 'patientId' = ${input.value.patientId}`,
            ),
        });

        if (existingPreference) {
          const updatedPreference = await ctx.db
            .update(preferences)
            .set({ value: input.value })
            .where(eq(preferences.id, existingPreference.id))
            .returning();

          return updatedPreference;
        }

        const newPreference = await ctx.db
          .insert(preferences)
          .values({
            profileId,
            key: input.key,
            value: input.value,
          })
          .returning();

        return newPreference;
      }

      const existingPreference = await ctx.db.query.preferences.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.profileId, profileId), eq(t.key, input.key)),
      });

      if (existingPreference) {
        const updatedPreference = await ctx.db
          .update(preferences)
          .set({ value: input.value })
          .where(eq(preferences.id, existingPreference.id))
          .returning();

        return updatedPreference;
      }

      const newPreference = await ctx.db
        .insert(preferences)
        .values({
          profileId,
          key: input.key,
          value: input.value,
        })
        .returning();

      return newPreference;
    }),
});
