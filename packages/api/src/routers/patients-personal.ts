import { personalData } from "@arianne/db/schema";
import {
  patients,
  PatientsDeleteSchema,
  PatientsFindUniqueSchema,
} from "@arianne/db/schemas/patients";
import { PersonalDataCreateSchema } from "@arianne/db/schemas/patients-personal";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const patientsPersonalRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const personalInfo = await ctx.db.query.personalData.findFirst({
      where: (t, { eq }) => eq(t.patientProfileId, ctx.user.profileId),
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

  save: protectedProcedure
    .input(PersonalDataCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const newPatientPersonalData = await ctx.db
        .insert(personalData)
        .values({
          ...input,
          patientProfileId: ctx.user.profileId,
        })
        .returning();

      if (newPatientPersonalData.length === 0) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const insertedPersonalData = newPatientPersonalData[0];
      if (
        insertedPersonalData &&
        insertedPersonalData.patientProfileId !== ctx.user.profileId
      ) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Data insertion verification failed",
        });
      }

      try {
        await ctx.db
          .update(patients)
          .set({
            personalInfoAdded: true,
          })
          .where(eq(patients.profileId, ctx.user.profileId));
      } catch (_) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return insertedPersonalData;
    }),

  delete: protectedProcedure
    .input(PatientsDeleteSchema)
    .mutation(async ({ input, ctx }) => {
      const patient = await ctx.db
        .delete(personalData)
        .where(eq(personalData.patientProfileId, input.where.id));

      return patient;
    }),
  update: protectedProcedure
    .input(PersonalDataCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const updatedPatientPersonalData = await ctx.db
        .update(personalData)
        .set({
          ...input,
        })
        .where(eq(personalData.patientProfileId, ctx.user.id))
        .returning();

      if (updatedPatientPersonalData.length === 0) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const updatedPersonalData = updatedPatientPersonalData[0];
      if (
        updatedPersonalData &&
        updatedPersonalData.patientProfileId !== ctx.user.id
      ) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Data update verification failed",
        });
      }

      return updatedPersonalData;
    }),
});
