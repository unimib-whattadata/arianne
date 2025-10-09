import {
  NoteCreateSchema,
  NoteDeleteSchema,
  NoteFindUniqueSchema,
  notes,
  NotesFindManySchema,
  NoteUpdateSchema,
} from "@arianne/db/schemas/notes";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notesRouter = createTRPCRouter({
  findMany: protectedProcedure
    .input(NotesFindManySchema)
    .query(async ({ input, ctx }) => {
      const { patientId } = input.where;
      if (!patientId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Patient ID is required",
        });
      }
      const notes = await ctx.db.query.notes.findMany({
        where: (t, { eq }) => eq(t.patientId, patientId),
      });

      return notes;
    }),

  findUnique: protectedProcedure
    .input(NoteFindUniqueSchema)
    .query(async ({ input, ctx }) => {
      const { id } = input.where;
      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Note ID is required",
        });
      }

      const note = await ctx.db.query.notes.findFirst({
        where: (t, { eq }) => eq(t.id, id),
      });
      if (!note) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Note not found" });
      }
      return note;
    }),

  create: protectedProcedure
    .input(NoteCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const therapistId = ctx.user.id;
      const note = await ctx.db
        .insert(notes)
        .values({ ...input, therapistId })
        .returning()
        .then((res) => res[0]!);

      return note;
    }),

  update: protectedProcedure
    .input(NoteUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const note = await ctx.db
        .update(notes)
        .set(input.data)
        .where(eq(notes.id, input.where.id))
        .returning()
        .then((res) => res[0]!);

      return note;
    }),

  delete: protectedProcedure
    .input(NoteDeleteSchema)
    .mutation(async ({ input, ctx }) => {
      const note = await ctx.db
        .delete(notes)
        .where(eq(notes.id, input.where.id))
        .returning()
        .then((res) => res[0]!);

      return note;
    }),
});
