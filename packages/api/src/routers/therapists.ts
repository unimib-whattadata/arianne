import { therapists } from "@arianne/db/schemas/therapists";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const therapistsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const therapist = await ctx.db.query.therapists.findFirst({
        where: (t, { eq }) => eq(t.id, input.id),
        with: {
          profile: {
            extras: (fields) => {
              return {
                name: sql<string>`concat(${fields.firstName}, ' ', ${fields.lastName})`.as(
                  "full_name",
                ),
              };
            },
          },
        },
      });

      if (!therapist?.profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Therapist not found",
        });
      }

      return therapist;
    }),

  findUnique: protectedProcedure.query(async ({ ctx }) => {
    const therapist = await ctx.db.query.therapists.findFirst({
      where: (t, { eq }) => eq(t.profileId, ctx.user.id),
      with: {
        profile: {
          extras: (fields) => {
            return {
              name: sql<string>`concat(${fields.firstName}, ' ', ${fields.lastName})`.as(
                "full_name",
              ),
            };
          },
        },
        notes: true,
        patients: {
          with: {
            profile: {
              extras: (fields) => {
                return {
                  name: sql<string>`concat(${fields.firstName}, ' ', ${fields.lastName})`.as(
                    "full_name",
                  ),
                };
              },
            },
            medicalRecords: true,
          },
        },
      },
    });

    return therapist;
  }),
  getAllPatients: protectedProcedure.query(async ({ ctx }) => {
    const patients = await ctx.db.query.patients.findMany({
      where: (p, { eq }) => eq(p.therapistId, ctx.user.id),
      with: {
        profile: {
          extras: (fields) => {
            return {
              name: sql<string>`concat(${fields.firstName}, ' ', ${fields.lastName})`.as(
                "full_name",
              ),
            };
          },
        },
        medicalRecords: true,
      },
    });

    return patients;
  }),
  updateRecentPatients: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const therapist = await ctx.db.query.therapists.findFirst({
        where: (t, { eq }) => eq(t.profileId, ctx.user.id),
        columns: {
          recentPatients: true,
        },
      });

      if (!therapist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Therapist not found",
        });
      }

      const { recentPatients } = therapist;

      recentPatients.unshift(input.patientId);

      const index = recentPatients.lastIndexOf(input.patientId);
      if (index !== 0) {
        recentPatients.splice(index, 1);
      } else if (recentPatients.length > 5) {
        recentPatients.pop();
      }

      // Update the therapist's recentPatients
      await ctx.db
        .update(therapists)
        .set({ recentPatients })
        .where(eq(therapists.profileId, ctx.user.id));
    }),
});
