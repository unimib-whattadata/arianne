import {
  assignments,
  AssignmentsCreateSchema,
  AssignmentsDeleteSchema,
  AssignmentsFindUniqueSchema,
  AssignmentsUpdateSchema,
  assignmentTypeEnum,
} from "@arianne/db/schemas/assignments";
import { eq, sql } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const assignmentsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(AssignmentsFindUniqueSchema)
    .query(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      const assignments = await ctx.db.query.assignments.findMany({
        where: (assignments, { eq }) => {
          if (input?.where.id) {
            return eq(assignments.patientId, input.where.id);
          }
          return eq(assignments.patientId, userId);
        },
        extras: (t, { sql }) => ({
          path: sql<string>`CASE
            WHEN ${t.type} = ${assignmentTypeEnum.enumValues[0]} THEN REPLACE(${t.name}, ' ', '-')
            WHEN ${t.type} = ${assignmentTypeEnum.enumValues[1]} THEN ${t.name}
            ELSE ''
          END`.as("path"),
        }),
      });

      return assignments;
    }),

  update: protectedProcedure
    .input(AssignmentsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const id = input.where.id;
      const data = input.data;
      const assignment = await ctx.db
        .update(assignments)
        .set(data)
        .where(eq(assignments.id, id))
        .returning()
        .then((res) => res[0]!);

      return assignment;
    }),

  delete: protectedProcedure
    .input(AssignmentsDeleteSchema)
    .mutation(async ({ input, ctx }) => {
      const assignment = await ctx.db
        .delete(assignments)
        .where(eq(assignments.id, input.where.id))
        .returning()
        .then((res) => res[0]!);

      return assignment;
    }),

  create: protectedProcedure
    .input(AssignmentsCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const therapistId = ctx.user.id;

      const assignment = await ctx.db
        .insert(assignments)
        .values({ ...input, therapistId })
        .returning()
        .then((res) => res[0]!);

      return assignment;
    }),

  latest: protectedProcedure.query(async ({ ctx }) => {
    const therapistId = ctx.user.id;

    const assignments = ctx.db.query.assignments.findMany({
      where: (t, { eq }) => eq(t.therapistId, therapistId),
      with: {
        patient: {
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
        },
      },
      limit: 5,
    });

    return assignments;
  }),
});
