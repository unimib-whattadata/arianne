import {
  administrations,
  AdministrationsCreateSchema,
  AdministrationsDeleteSchema,
  AdministrationsFindManySchema,
  AdministrationsFindUniqueSchema,
  AdministrationsUpdateSchema,
} from "@arianne/db/schemas/administrations";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const administrationsRouter = createTRPCRouter({
  findUnique: protectedProcedure
    .input(AdministrationsFindUniqueSchema)
    .query(async ({ input, ctx }) => {
      const administration = await ctx.db.query.administrations.findFirst({
        where: (administrations, { eq }) => eq(administrations.id, input.id),
        with: {
          patient: true,
          medicalRecord: true,
        },
      });
      if (!administration?.records) {
        throw new TRPCError({
          message: "Administration not found",
          code: "NOT_FOUND",
        });
      }

      return administration;
    }),

  findMany: protectedProcedure
    .input(AdministrationsFindManySchema)
    .query(async ({ input, ctx }) => {
      const { where, limit, offset } = input;

      const administrations = await ctx.db.query.administrations.findMany({
        where: (administrations, { eq, and, or }) => {
          const conditions = [];

          if (where.id) {
            conditions.push(
              or(
                eq(administrations.id, where.id.a),
                eq(administrations.id, where.id.b),
              ),
            );
          }

          if (where.patientId) {
            conditions.push(eq(administrations.patientId, where.patientId));
          }

          if (where.type) {
            conditions.push(eq(administrations.type, where.type));
          }

          return conditions.length > 0 ? and(...conditions) : undefined;
        },
        limit: limit,
        offset: offset,
        with: {
          patient: true,
          medicalRecord: true,
        },
        orderBy: (administrations, { asc, desc }) => {
          if (!input.orderBy) return [];
          return [
            input.orderBy.T === "asc"
              ? asc(administrations.T)
              : desc(administrations.T),
          ];
        },
      });

      return administrations;
    }),

  create: protectedProcedure
    .input(AdministrationsCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const { type, patientId } = input;

      const T = await ctx.db.$count(
        administrations,
        and(
          eq(administrations.patientId, patientId),
          eq(administrations.type, type),
        ),
      );

      const medicalRecordId = await ctx.db.query.medicalRecords.findFirst({
        where: (t, { eq }) => eq(t.patientId, patientId),
      });

      if (!medicalRecordId) {
        throw new TRPCError({
          message: "Medical record not found",
          code: "NOT_FOUND",
        });
      }

      const administration = await ctx.db
        .insert(administrations)
        .values({
          ...input,
          medicalRecordId: medicalRecordId.id,
          T,
        })
        .returning()
        .then((res) => res[0]!);

      // TODO: remove from assignments when is compileted?

      return administration;
    }),

  update: protectedProcedure
    .input(AdministrationsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const administration = await ctx.db
        .update(administrations)
        .set(input)
        .where(eq(administrations.id, input.id))
        .returning();

      return administration;
    }),

  delete: protectedProcedure
    .input(AdministrationsDeleteSchema)
    .mutation(async ({ input, ctx }) => {
      const administration = await ctx.db
        .delete(administrations)
        .where(eq(administrations.id, input.id))
        .returning();

      return administration;
    }),
  getTValue: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
        type: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { patientId, type } = input;

      const count = await ctx.db.$count(
        administrations,
        and(
          eq(administrations.patientId, patientId),
          eq(administrations.type, type),
        ),
      );

      return { T: count };
    }),
});
