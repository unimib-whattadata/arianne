import { sql } from "drizzle-orm";
import z from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }).optional())
    .query(async ({ ctx, input }) => {
      const profileId = input?.id ?? ctx.user.id;
      const profile = await ctx.db.query.profiles.findFirst({
        where: (t, { eq }) => eq(t.id, profileId),
        extras: (fields) => {
          return {
            name: sql<string>`concat(${fields.firstName}, ' ', ${fields.lastName})`.as(
              "full_name",
            ),
          };
        },
      });
      return profile;
    }),
  role: protectedProcedure
    .input(z.object({ id: z.string().uuid() }).optional())
    .query(async ({ ctx, input }) => {
      const profileId = input?.id ?? ctx.user.id;
      const profile = await ctx.db.query.profiles.findFirst({
        where: (t, { eq }) => eq(t.id, profileId),
        columns: {
          role: true,
        },
      });

      return profile?.role;
    }),
});
