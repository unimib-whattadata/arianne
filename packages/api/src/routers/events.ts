import {
  events,
  EventsCreateSchema,
  EventsDeleteSchema,
  EventsUpdateSchema,
} from "@arianne/db/schemas/events";
import { eq, sql } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(EventsCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const therapistId = ctx.user.id;

      const event = await ctx.db.insert(events).values({
        therapistId,
        ...input,
      });

      return event;
    }),

  update: protectedProcedure
    .input(EventsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const therapistId = ctx.user.id;

      const event = await ctx.db
        .update(events)
        .set({
          therapistId,
          ...input,
        })
        .where(eq(events.id, input.id))
        .returning()
        .then((result) => result[0]!);

      return event;
    }),

  delete: protectedProcedure
    .input(EventsDeleteSchema)
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.db
        .delete(events)
        .where(eq(events.id, input.id))
        .returning()
        .then((result) => result[0]!);

      return event;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    return await ctx.db.query.events.findMany({
      where: (t, { eq }) => eq(t.therapistId, userId),
      with: {
        participants: {
          with: {
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
              },
            },
          },
        },
      },
    });
  }),

  getAllForPatients: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    return await ctx.db.query.events.findMany({
      with: {
        therapist: {
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
        participants: {
          where: (fields, { eq }) => eq(fields.id, userId),
          with: {
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
              },
            },
          },
        },
      },
    });
  }),
});
