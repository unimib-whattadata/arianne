import { profiles } from "@arianne/db/schema";
import { HoursFormSchema, therapists } from "@arianne/db/schemas/therapists";
import { TRPCError } from "@trpc/server";
import { and, eq, or, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const therapistsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const therapist = await ctx.db.query.therapists.findFirst({
        where: (t, { eq }) => or(eq(t.id, input.id), eq(t.profileId, input.id)),
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
      });

      if (!therapist?.profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Therapist not found",
        });
      }

      return therapist;
    }),

  findUnique: protectedProcedure.query(async ({ ctx }) => {
    const therapist = await ctx.db.query.therapists.findFirst({
      where: (t, { eq }) => eq(t.profileId, ctx.user.profileId),
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
        notes: true,
        patients: {
          where: (p, { isNotNull }) => isNotNull(p.medicalRecordsId),
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
            medicalRecords: true,
          },
        },
      },
    });

    return therapist;
  }),
  getAllPatients: protectedProcedure.query(async ({ ctx }) => {
    const patients = await ctx.db.query.patients.findMany({
      where: (p, { and, eq, isNotNull }) =>
        and(eq(p.therapistId, ctx.user.id), isNotNull(p.medicalRecordsId)),
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
        medicalRecords: true,
      },
    });

    return patients;
  }),
  updateRecentPatients: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const therapist = await ctx.db.query.therapists.findFirst({
        where: (t, { eq }) => eq(t.profileId, ctx.user.profileId),
        columns: {
          recentPatients: true,
        },
      });

      if (!therapist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Therapist not found",
        });
      }

      const { recentPatients } = therapist;

      recentPatients.unshift(input.patientId);

      const index = recentPatients.lastIndexOf(input.patientId);
      if (index !== 0) {
        recentPatients.splice(index, 1);
      } else if (recentPatients.length > 5) {
        recentPatients.pop();
      }

      // Update the therapist's recentPatients
      await ctx.db
        .update(therapists)
        .set({ recentPatients })
        .where(eq(therapists.profileId, ctx.user.id));
    }),

  getInvitedPatients: protectedProcedure.query(async ({ ctx }) => {
    const supabase = ctx.supabase;
    if (!supabase) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Supabase client not found in context",
      });
    }

    const patients = await ctx.db.query.patients.findMany({
      where: (p, { and, eq, isNull }) =>
        and(eq(p.therapistId, ctx.user.id), isNull(p.medicalRecordsId)),
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
    });

    const patientsWithStatus = await Promise.all(
      patients.map(async (patient) => {
        const { data } = await supabase.auth.admin.getUserById(
          patient.profileId,
        );
        if (!data.user) return;
        const { invited_at, confirmed_at } = data.user;

        if (!invited_at) return;

        let status: "invited" | "confirmed" | "pending" = "invited";
        if (invited_at && !confirmed_at) status = "invited";
        if (invited_at && confirmed_at && !patient.profile.completedOnboarding)
          status = "pending";
        if (invited_at && confirmed_at && patient.profile.completedOnboarding)
          status = "confirmed";

        const { profile } = patient;

        return {
          ...profile,
          status,
          invitedAt: invited_at,
        };
      }),
    );

    return patientsWithStatus.filter((p) => !!p);
  }),
  updateAccount: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const supabase = ctx.supabase;
      if (!supabase) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Supabase client not found in context",
        });
      }

      const { error } = await supabase.auth.updateUser({
        email: input.email,
      });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),

  saveTimeSlot: protectedProcedure
    .input(HoursFormSchema)
    .mutation(async ({ input, ctx }) => {
      const newTimeSlot = await ctx.db
        .update(therapists)
        .set({
          availability: input.availability,
          isOnboardingTimeFinished: true,
        })
        .where(eq(therapists.profileId, ctx.user.profileId))
        .returning();
      const currentTherapist = await ctx.db.query.therapists.findFirst({
        where: (t, { eq }) => eq(t.profileId, ctx.user.profileId),
      });

      if (
        currentTherapist?.isOnboardingExperienceFinished &&
        currentTherapist.isOnboardingPersonalFinished &&
        currentTherapist.isOnboardingPreliminaryFinished &&
        currentTherapist.isOnboardingTimeFinished
      ) {
        await ctx.db
          .update(profiles)
          .set({
            completedOnboarding: true,
          })
          .where(and(eq(profiles.id, ctx.user.profileId)))
          .returning();
      }

      return newTimeSlot;
    }),
  getMatched: protectedProcedure.query(() => {
    const therapistList = [
      {
        id: "1",
        // picture: "",
        name: "Dott.ssa Maria Rossi",
        areasOfCompetence: ["Stress", "Ansia", "Mindfulness"],
        orientation: "Cognitivo-Comportamentale",
        availability: [
          {
            day: "Lunedì",
            time: ["10:00 - 12:00", "12:00 - 14:00", "18:00 - 20:00"],
          },
          {
            day: "Martedì",
            time: ["10:00 - 12:00", "12:00 - 14:00", "18:00 - 20:00"],
          },
          {
            day: "Mercoledì",
            time: ["10:00 - 12:00", "12:00 - 14:00", "18:00 - 20:00"],
          },
          {
            day: "Giovedì",
            time: ["10:00 - 12:00", "12:00 - 14:00", "18:00 - 20:00"],
          },
          { day: "Venerdì", time: ["14:00 - 16:00"] },
        ],
        feePerSession: 70,
        bio: "Esperta in terapia cognitivo-comportamentale e mindfulness.",
      },
      {
        id: "2",
        // picture: "",
        name: "Dott. Luca Bianchi",
        orientation: "Psicodinamico",
        areasOfCompetence: ["Depressione", "Ansia"],
        availability: [
          { day: "Martedì", time: ["09:00 - 11:00"] },
          { day: "Giovedì", time: ["15:00 - 17:00"] },
        ],
        feePerSession: 80,
        bio: "Specializzato in disturbi d'ansia e depressione.",
      },
      {
        id: "3",
        // picture: "",
        name: "Dott.ssa Anna Verdi",
        areasOfCompetence: ["Terapia Familiare", "Terapia di Coppia"],
        orientation: "Sistemico-Relazionale",
        availability: [
          { day: "Mercoledì", time: ["10:00 - 12:00"] },
          { day: "Venerdì", time: ["13:00 - 15:00"] },
        ],
        feePerSession: 50,
        bio: "Focus su terapia familiare e di coppia.",
      },
      {
        id: "4",
        // picture: "",
        name: "Dott. Marco Neri",
        areasOfCompetence: ["Disturbi dello Sviluppo", "ADHD"],

        orientation: "Mindfulness-Based",
        availability: [
          { day: "Lunedì", time: ["10:00 - 12:00"] },
          { day: "Mercoledì", time: ["14:00 - 16:00"] },
        ],
        feePerSession: 60,
        bio: "Esperto in disturbi dello sviluppo e ADHD.",
      },
      {
        id: "5",
        // picture: "",
        name: "Dott.ssa Elena Galli",
        areasOfCompetence: ["Disturbi d'Ansia", "Stress"],
        orientation: "Cognitivo-Comportamentale",
        availability: [
          { day: "Lunedì", time: ["10:00 - 12:00"] },
          { day: "Mercoledì", time: ["14:00 - 16:00"] },
        ],
        feePerSession: 55,
        bio: "Aiuto atleti a migliorare le loro performance mentali.",
      },
    ];
    return therapistList;
  }),
});
