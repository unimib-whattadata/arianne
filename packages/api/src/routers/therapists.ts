import { therapists } from "@arianne/db/schemas/therapists";
import { TRPCError } from "@trpc/server";
import { eq, or, sql } from "drizzle-orm";
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
      where: (t, { eq }) => eq(t.profileId, ctx.user.id),
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
      where: (p, { eq }) => eq(p.therapistId, ctx.user.id),
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
        where: (t, { eq }) => eq(t.profileId, ctx.user.id),
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

  getMatched: protectedProcedure.query(async () => {
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
