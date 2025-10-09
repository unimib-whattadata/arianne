import { relations } from "drizzle-orm";
import { index, pgEnum } from "drizzle-orm/pg-core";
import z from "zod";

import { patients } from "../schema";
import { createTable } from "../table";
import { mapEnumValues } from "../utils";

export const formPathEnum = pgEnum("form_path", [
  "individual",
  "couple",
  "family",
]);

export const formStepEnum = pgEnum("form_step", [
  "step1",
  "step2",
  "step3",
  "path",
  "final",
  "completed",
]);

export const formEnums = {
  Path: mapEnumValues(formPathEnum.enumValues),
  Step: mapEnumValues(formStepEnum.enumValues),
};

export const formFlows = createTable(
  "form_flows",
  (f) => ({
    id: f.uuid().primaryKey().defaultRandom().notNull(),

    patientId: f.uuid("patient_id").references(() => patients.profileId),

    // flow state
    currentStep: formStepEnum().default("step1").notNull(),
    path: formPathEnum(),

    // incremental json data
    step1: f.jsonb("step1").$type<{
      name?: string;
    }>(),

    step2: f.jsonb("step2").$type<{
      age?: number;
    }>(),

    step3: f.jsonb("step3").$type<{
      gender?: number;
    }>(),

    // Dynamic blocks (see better)
    individual: f.jsonb("individual").$type<{
      reasons?: number[];
      details?: Record<string, number[]>;
      detailText?: string;
    }>(),

    couple: f.jsonb("couple").$type<{
      reasons?: number[];
      details?: Record<string, number[]>;
      detailText?: string;
    }>(),

    family: f.jsonb("family").$type<{
      reasons?: number[];
      details?: Record<string, number[]>;
      detailText?: string;
      numberOfChildren?: number;
      childrenAge?: number[];
    }>(),

    // final steps
    final: f.jsonb("final").$type<{
      duration?: number;
      pastTherapy?: number;
      therapyExperience?: number;
      therapyLocation?: number;
      therapistOrientation?: number;
      therapyGoals?:
        | number[]
        | {
            other: string;
          };
      preferredApproach?: number;
      questionType?: number;
      preferredGender?: number;
      preferredAge?: number;
      preferredOrientation?: number;
      timePreference?: number[];
      otherInfo?: string;
    }>(),

    // tracking
    completed: f.boolean("completed").default(false),
    updatedAt: f.timestamp("updated_at").defaultNow().notNull(),
  }),
  (t) => [index("form_flow_id").on(t.id)],
).enableRLS();

// --- Relations ---
export const formFlowsRelations = relations(formFlows, ({ one }) => ({
  patient: one(patients, {
    fields: [formFlows.patientId],
    references: [patients.id],
  }),
}));

// --- Zod Schemas for API ---

export const FormFlowFindSchema = z.object({
  id: z.string(),
});

export const FormFlowCreateSchema = z.object({
  patientId: z.string().optional(),
  currentStep: z.enum(formStepEnum.enumValues).default("step1"),
  path: z.enum(formPathEnum.enumValues).optional(),
  step1: z.object({ name: z.string().optional() }).optional(),
  step2: z.object({ age: z.number().optional() }).optional(),
  step3: z.object({ gender: z.number().optional() }).optional(),
  individual: z
    .object({
      reasons: z.array(z.number()).optional(),
      details: z.record(z.string(), z.array(z.number())).optional(),
      detailText: z.string().optional(),
    })
    .optional(),
  couple: z
    .object({
      reasons: z.array(z.number()).optional(),
      details: z.record(z.string(), z.array(z.number())).optional(),
      detailText: z.string().optional(),
    })
    .optional(),
  family: z
    .object({
      reasons: z.array(z.number()).optional(),
      details: z.record(z.string(), z.array(z.number())).optional(),
      detailText: z.string().optional(),
      numberOfChildren: z.number().optional(),
      childrenAge: z.array(z.number()).optional(),
    })
    .optional(),
  final: z
    .object({
      duration: z.number().optional(),
      pastTherapy: z.number().optional(),
      therapyExperience: z.number().optional(),
      therapyLocation: z.number().optional(),
      therapistOrientation: z.number().optional(),
      therapyGoals: z
        .union([
          z.array(z.number()).optional(),
          z.object({ other: z.string().optional() }),
        ])
        .optional(),
      preferredApproach: z.number().optional(),
      questionType: z.number().optional(),
      preferredGender: z.number().optional(),
      preferredAge: z.number().optional(),
      preferredOrientation: z.number().optional(),
      timePreference: z.array(z.number()).optional(),
      otherInfo: z.string().optional(),
    })
    .optional(),
});

export const FormFlowUpdateSchema = z.object({
  id: z.string(),
  currentStep: z.enum(formStepEnum.enumValues).optional(),
  path: z.enum(formPathEnum.enumValues).optional(),
  step1: z.object({ name: z.string().optional() }).optional(),
  step2: z.object({ age: z.number().optional() }).optional(),
  step3: z.object({ gender: z.number().optional() }).optional(),
  individual: z.any().optional(),
  couple: z.any().optional(),
  family: z.any().optional(),
  final: z.any().optional(),
  completed: z.boolean().optional(),
});

export const FormFlowFindByPatientSchema = z.object({
  patientId: z.string(),
});
