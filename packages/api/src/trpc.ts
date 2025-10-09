import type { UserResponse } from "@arianne/supabase";
import { db } from "@arianne/db";
import { initTRPC, TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm/sql";
import superjson from "superjson";
import { ZodError } from "zod";

interface CreateContextOptions {
  headers: Headers;
  user: UserResponse;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    user: opts.user,
    db,
  };
};

export const createTRPCContext = (opts: {
  headers: Headers;
  user: UserResponse;
}) => {
  const source = opts.headers.get("x-trpc-source") ?? "unknown";
  const { data } = opts.user;
  console.log(">>> tRPC Request from", source, "by", data.user?.id);

  return createInnerTRPCContext({
    headers: opts.headers,
    user: opts.user,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

export const createCallerFactory = t.createCallerFactory;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
/**
 * check middleware @see https://trpc.io/docs/server/middleware
 */

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (ctx.user.error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      cause: ctx.user.error.cause,
      message:
        process.env.NODE_ENV === "production"
          ? "Unauthorized access."
          : ctx.user.error.message,
    });
  }

  if (!ctx.user.data.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      cause: "User not found",
      message:
        process.env.NODE_ENV === "production"
          ? "Unauthorized access."
          : "User not found.",
    });
  }

  const user = ctx.user.data.user;

  const profile = await ctx.db.query.profiles.findFirst({
    where: (t, { eq }) => eq(t.id, user.id),
    extras: (fields) => {
      return {
        name: sql<string>`concat(${fields.firstName}, ' ', ${fields.lastName})`.as(
          "full_name",
        ),
      };
    },
  });

  let currentUser;
  if (profile?.role === "therapist") {
    const therapist = await ctx.db.query.therapists.findFirst({
      where: (t, { eq }) => eq(t.profileId, profile.id),
    });

    if (therapist) {
      currentUser = { ...profile, id: therapist.id, profileId: profile.id };
    }
  }
  if (profile?.role === "patient") {
    const patient = await ctx.db.query.patients.findFirst({
      where: (t, { eq }) => eq(t.profileId, profile.id),
    });

    if (patient) {
      currentUser = { ...profile, id: patient.id, profileId: profile.id };
    }
  }

  if (!currentUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      cause: "User not found",
      message:
        process.env.NODE_ENV === "production"
          ? "Unauthorized access."
          : "User not found.",
    });
  }

  return next({
    ctx: {
      // infers the `user` as non-nullable
      user: currentUser,
    },
  });
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
//type RouterOutput = inferRouterOutputs<AppRouter>;
