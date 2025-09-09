import {
  medicalRecords,
  MedicalRecordsFindUniqueSchema,
  MedicalRecordsUpdateSchema,
} from "@arianne/db/schemas/medical-records";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const medicalRecordsRouter = createTRPCRouter({
  findUnique: protectedProcedure
    .input(MedicalRecordsFindUniqueSchema)
    .query(async ({ ctx, input }) => {
      const medicalRecords = await ctx.db.query.medicalRecords.findFirst({
        where: (administration, { eq }) =>
          eq(administration.id, input.where.id),
        columns: input.columns,
      });

      return medicalRecords;
    }),

  update: protectedProcedure
    .input(MedicalRecordsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(medicalRecords)
        .set(input.data)
        .where(eq(medicalRecords.id, input.where.patientId));
    }),
});
