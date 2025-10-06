import { personalData } from "@arianne/db/schema";
import {
  PatientsDeleteSchema,
  PatientsFindUniqueSchema,
} from "@arianne/db/schemas/patients";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const patientsPersonalRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const personalInfo = await ctx.db.query.personalData.findFirst({
      where: (t, { eq }) => eq(t.patientProfileId, ctx.user.id),
    });

    return personalInfo;
  }),

  findUnique: protectedProcedure
    .input(PatientsFindUniqueSchema)
    .query(async ({ input, ctx }) => {
      const id = input.where.id;

      const personalInfo = await ctx.db.query.personalData.findFirst({
        where: (t, { eq }) => eq(t.patientProfileId, id),
      });

      return personalInfo;
    }),

  delete: protectedProcedure
    .input(PatientsDeleteSchema)
    .mutation(async ({ input, ctx }) => {
      const patient = await ctx.db
        .delete(personalData)
        .where(eq(personalData.patientProfileId, input.where.id));

      return patient;
    }),
});
