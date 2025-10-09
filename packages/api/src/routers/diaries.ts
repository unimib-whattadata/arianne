import {
  diaries,
  DiariesCreateSchema,
  DiariesFindByIdSchema,
  DiariesFindSchema,
  DiariesGetAllSchema,
  DiariesUpdateSchema,
} from "@arianne/db/schemas/diaries";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const diariesRouter = createTRPCRouter({
  find: protectedProcedure
    .input(DiariesFindSchema)
    .query(async ({ input, ctx }) => {
      const { id, date, type } = input;
      const patientId = input.patientId ?? ctx.user.id;

      if (id) {
        const diary = await ctx.db.query.diaries.findFirst({
          where: (t, { eq }) => eq(t.id, id),
        });
        return diary;
      }

      // const dateObject = date ? new Date(date) : new Date();
      // const formattedDate = `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`;

      const diaries = await ctx.db.query.diaries.findMany({
        where: (t, { eq, and }) =>
          and(
            eq(t.date, date ?? new Date()),
            eq(t.type, type),
            eq(t.patientId, patientId),
          ),
        orderBy: (t, { desc }) => desc(t.updatedAt),
      });

      return diaries.length > 0 ? diaries[0] : null;
    }),

  getAll: protectedProcedure
    .input(DiariesGetAllSchema)
    .query(async ({ input, ctx }) => {
      const patientId = input.patientId ?? ctx.user.id;

      const diaries = await ctx.db.query.diaries.findMany({
        where: (t, { eq, and }) =>
          and(eq(t.type, input.type), eq(t.patientId, patientId)),
        orderBy: (t, { desc }) => desc(t.updatedAt),
      });

      return diaries;
    }),

  create: protectedProcedure
    .input(DiariesCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const patientId = input.patientId ?? ctx.user.id;

      const medicalRecord = await ctx.db.query.medicalRecords.findFirst({
        where: (t, { eq }) => eq(t.patientId, patientId),
      });
      const medicalRecordId = medicalRecord?.id;

      if (!medicalRecordId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Medical record not found",
        });
      }

      const { type, content } = input;

      const diary = await ctx.db
        .insert(diaries)
        .values({
          date: new Date(),
          type,
          content,
          patientId,
          medicalRecordId,
        })
        .returning()
        .then((result) => result[0]!);

      return diary;
    }),

  update: protectedProcedure
    .input(DiariesUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, content, state } = input;

      const diary = await ctx.db
        .update(diaries)
        .set({
          content,
          ...(state !== undefined && { state }),
        })
        .where(eq(diaries.id, id))
        .returning()
        .then((result) => result[0]!);

      return diary;
    }),

  findById: protectedProcedure
    .input(DiariesFindByIdSchema)
    .query(async ({ input, ctx }) => {
      const diary = await ctx.db.query.diaries.findFirst({
        where: (t, { eq }) => eq(t.id, input.id),
      });

      return diary;
    }),
});
