import {
  patients,
  PatientsDeleteSchema,
  PatientsFindRecentSchema,
  PatientsFindUniqueSchema,
} from "@arianne/db/schemas/patients";
import { eq, sql } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const patientsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const patient = await ctx.db.query.patients.findFirst({
      where: (t, { eq }) => eq(t.profileId, ctx.user.id),
    });

    return patient;
  }),

  findUnique: protectedProcedure
    .input(PatientsFindUniqueSchema)
    .query(async ({ input, ctx }) => {
      const profileId = input.where.id;

      const patient = await ctx.db.query.patients.findFirst({
        where: (t, { eq }) => eq(t.profileId, profileId),
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
          medicalRecords: {
            with: {
              administrations: {
                orderBy: (a, { desc }) => desc(a.date),
              },
            },
          },
        },
      });

      return patient;
    }),

  findRecent: protectedProcedure
    .input(PatientsFindRecentSchema)
    .query(async ({ input, ctx }) => {
      const patients = await ctx.db.query.patients.findMany({
        where: (t, { inArray }) => inArray(t.profileId, input.recent),
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

  delete: protectedProcedure
    .input(PatientsDeleteSchema)
    .mutation(async ({ input, ctx }) => {
      const patient = await ctx.db
        .delete(patients)
        .where(eq(patients.profileId, input.where.id));

      return patient;
    }),
});
