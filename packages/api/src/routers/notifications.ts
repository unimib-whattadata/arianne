import {
  notifications,
  NotificationsCreateSchema,
  NotificationsMarkAsReadSchema,
} from "@arianne/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(NotificationsCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const therapistId = ctx.user.id;

      const notification = ctx.db
        .insert(notifications)
        .values({
          ...input,
          therapistId,
        })
        .returning()
        .then((res) => res[0]!);

      return notification;
    }),

  latest: protectedProcedure.query(async ({ ctx }) => {
    const therapistId = ctx.user.id;

    const notifications = ctx.db.query.notifications.findMany({
      where: (notifications, { eq }) =>
        eq(notifications.therapistId, therapistId),
      orderBy: (notifications, { desc }) => desc(notifications.createdAt),
      limit: 5,
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
    });

    return notifications;
  }),

  markAsRead: protectedProcedure
    .input(NotificationsMarkAsReadSchema)
    .mutation(async ({ input, ctx }) => {
      const notification = await ctx.db
        .update(notifications)
        .set({
          read: !input.currentRead,
        })
        .where(eq(notifications.id, input.id))
        .returning();

      return notification;
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(notifications)
      .set({
        read: true,
      })
      .where(eq(notifications.read, false));
  }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const notification = await ctx.db
        .delete(notifications)
        .where(eq(notifications.id, input))
        .returning()
        .then((res) => res[0]!);

      return notification;
    }),

  all: protectedProcedure.query(async ({ ctx }) => {
    const therapistId = ctx.user.id;

    return ctx.db.query.notifications.findMany({
      where: (t, { eq }) => eq(t.therapistId, therapistId),
      orderBy: (t, { desc }) => desc(t.createdAt),
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
    });
  }),
});
