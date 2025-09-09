import { $Enums } from "@arianne/db/enums";
import { administrations } from "@arianne/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON object.
 * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from.
 */
export type JsonObject = { [Key in string]?: JsonValue };

/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches a JSON array.
 */
export type JsonArray = JsonValue[];

/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches any valid JSON value.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | JsonObject
  | JsonArray
  | null;

const host = process.env.NEXT_PUBLIC_APP_URL;

export const exportsRouter = createTRPCRouter({
  getTValue: protectedProcedure
    .meta({ createResource: false, doLog: false })
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

  exportPDF: protectedProcedure
    .meta({ createResource: false, doLog: false })
    .input(
      z.object({
        patientId: z.string(),
        options: z.object({
          notes: z.boolean().optional(),
          scores: z.boolean().optional(),
          responses: z.boolean().optional(),
        }),
        questionnaires: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const therapist = ctx.user;

      const patient = await ctx.db.query.patients.findFirst({
        where: (t, { eq }) => eq(t.id, input.patientId),
        with: {
          medicalRecords: true,
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
      if (!patient?.profile) {
        throw new TRPCError({
          message: "Patient not found",
          code: "NOT_FOUND",
        });
      }

      const administrations = await ctx.db.query.administrations.findMany({
        where: (t, { and, eq, inArray }) =>
          and(
            inArray(t.id, input.questionnaires),
            eq(t.patientId, input.patientId),
          ),
      });

      const modalities = $Enums.AssignmentModality;

      const questionnaires = administrations.map((administration) => {
        return {
          type: administration.type,
          response: administration.records,
          T: administration.T,
          data: administration.date.toLocaleDateString("it"),
          notes: "", //TODO sostituire con "administration.notes"(?) quando verranno implementate le note delle somministrazioni
          mode: modalities[administration.modality],
        };
      });

      const data = {
        patient: {
          name: patient.profile.name,
          dateOfBirth:
            patient.medicalRecords?.birthDate?.toLocaleDateString("it"),
          Gender: patient.medicalRecords?.sex,
          ID: patient.profile.id,
        },
        therapist: {
          name: therapist.name,
          email: therapist.email,
          phone: therapist.phone,
        },
        questionnaires: questionnaires,
        options: {
          notes: false, //TODO sostituire con "input.options.notes" quando verranno implementate le note delle somministrazioni
          scores: input.options.scores,
          responses: input.options.responses,
        },
      };

      const response = await fetch(`${host}/api/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return (await response.json()) as JsonObject;
    }),

  exportCSV: protectedProcedure
    .meta({ createResource: false, doLog: false })
    .input(
      z.object({
        questionnaires: z.array(z.string()),
        exportable: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const administrations = await ctx.db.query.administrations.findMany({
        where: (t, { inArray }) => inArray(t.id, input.questionnaires),
      });

      interface QuestionnaireModule {
        generateCSV: (records: Record<string, unknown>) => string;
      }

      const questionnairesCSV = [];

      for (const administration of administrations) {
        try {
          const administrationTypeModule = (await import(
            `@/features/questionnaires/${administration.type}/export`
          )) as QuestionnaireModule;

          questionnairesCSV.push({
            type: administration.type,
            T: administration.T,
            csv: administrationTypeModule.generateCSV(administration.records),
          });
        } catch (error) {
          console.log(`Error processing type ${administration.type}:`, error);
        }
      }
      return questionnairesCSV;
    }),
});
