import {
  events,
  EventsCreateSchema,
  EventsDeleteSchema,
  EventsUpdateSchema,
  participants,
} from "@arianne/db/schemas/events";
import { and, eq, inArray, sql } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(EventsCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const therapistId = ctx.user.id;

      console.log({ input });

      const event = await ctx.db
        .insert(events)
        .values({
          ...input,
          therapistId,
        })
        .returning({ id: events.id })
        .then((result) => result[0]!);

      if (input.participants && input.participants.length > 0) {
        await ctx.db.insert(participants).values(
          input.participants.map((patientId) => ({
            eventId: event.id,
            patientId,
          })),
        );
      }

      return event;
    }),

  update: protectedProcedure
    .input(EventsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const therapistId = ctx.user.id;

      const event = await ctx.db
        .update(events)
        .set({
          ...input,
          therapistId,
        })
        .where(eq(events.id, input.id))
        .returning()
        .then((result) => result[0]!);

      const currentParticipants = await ctx.db
        .select()
        .from(participants)
        .where(eq(participants.eventId, input.id));

      const currentParticipantIds = currentParticipants.map((p) => p.patientId);

      const newParticipantIds = input.participants || [];

      const participantsToAdd = newParticipantIds.filter(
        (id) => !currentParticipantIds.includes(id),
      );
      const participantsToRemove = currentParticipantIds.filter(
        (id) => !newParticipantIds.includes(id),
      );

      if (participantsToAdd.length > 0) {
        await ctx.db.insert(participants).values(
          participantsToAdd.map((patientId) => ({
            eventId: input.id,
            patientId,
          })),
        );
      }

      if (participantsToRemove.length > 0) {
        await ctx.db
          .delete(participants)
          .where(
            and(
              eq(participants.eventId, input.id),
              inArray(participants.patientId, participantsToRemove),
            ),
          );
      }

      return event;
    }),

  delete: protectedProcedure
    .input(EventsDeleteSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(participants)
        .where(eq(participants.eventId, input.id));

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
        },
      },
    });
  }),
});
