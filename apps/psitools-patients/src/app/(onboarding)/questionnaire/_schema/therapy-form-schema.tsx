import { z } from 'zod';

// --- Common Fields ---
const Step1 = z.object({
  name: z.string().min(1),
});

const Step2 = z.object({
  age: z.number().int().min(0).max(4),
});

const Step3 = z.object({
  gender: z.number().int().min(0).max(3),
});

// --- Final Steps (same across paths) ---
const FinalSteps = z.object({
  duration: z.number().int().min(0).max(4),
  pastTherapy: z.number().int().min(0).max(3),
  therapyExperience: z.number().int().min(0).max(3).optional(),
  therapyLocation: z.number().int().min(0).max(2).optional(),
  therapistOrientation: z.number().int().min(0).max(4).optional(),
  therapyGoals: z.union([
    z.array(z.number().int().min(0).max(2)).min(1),
    z.object({ other: z.string().min(1) }),
  ]),
  preferredApproach: z.number().int().min(0).max(3),
  questionType: z.number().int().min(0).max(3),
  preferredGender: z.number().int().min(0).max(2),
  preferredAge: z.number().int().min(0).max(2),
  preferredOrientation: z.number().int().min(0).max(3),
  timePreference: z.array(z.number().int().min(0).max(2)).min(1),
  otherInfo: z.string().min(1).optional(),
});

// --- Reusable ---
const detailMap = (maxPerReason: number) =>
  z.record(
    z.enum(['0', '1', '2', '3', '4', '5']),
    z
      .array(
        z
          .number()
          .int()
          .min(0)
          .max(maxPerReason - 1),
      )
      .min(1),
  );

// --- Individual Path ---
const IndividualSchema = z.object({
  path: z.literal('individual'),
  individual: z
    .object({
      reasons: z.array(z.number().int().min(0).max(6)).min(1),
      details: detailMap(6).optional(),
      detailText: z.string().min(1).optional(),
    })
    .superRefine((val, ctx) => {
      const selected = new Set(val.reasons);
      for (let i = 0; i <= 5; i++) {
        if (selected.has(i)) {
          const key = i.toString() as '0' | '1' | '2' | '3' | '4' | '5';
          if (!val.details?.[key]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['details', key],
              message: `Detail for individual reason ${i} is required`,
            });
          }
        }
      }
      if (selected.has(6) && !val.detailText) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['detailText'],
          message: "Detail text is required for 'Altro'",
        });
      }
    }),
});

// --- Couple Path ---
const CoupleSchema = z.object({
  path: z.literal('couple'),
  couple: z
    .object({
      reasons: z.array(z.number().int().min(0).max(6)).min(1),
      details: detailMap(5).optional(),
      detailText: z.string().min(1).optional(),
    })
    .superRefine((val, ctx) => {
      const selected = new Set(val.reasons);
      for (let i = 0; i <= 5; i++) {
        if (selected.has(i)) {
          const key = i.toString() as '0' | '1' | '2' | '3' | '4' | '5';
          if (!val.details?.[key]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['details', key],
              message: `Detail for couple reason ${i} is required`,
            });
          }
        }
      }
      if (selected.has(6) && !val.detailText) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['detailText'],
          message: "Detail text is required for 'Altro'",
        });
      }
    }),
});

// --- Family Path ---

const FamilySchema = z.object({
  path: z.literal('family'),
  family: z
    .object({
      reasons: z.array(z.number().int().min(0).max(6)).min(1),
      details: detailMap(5).optional(),
      detailText: z.string().min(1).optional(),
      numberOfChildren: z.number().int().min(0).max(4).optional(),
      childrenAge: z.array(z.number().int().min(0).max(5)).min(1),
    })
    .superRefine((val, ctx) => {
      const selected = new Set(val.reasons);

      for (let i = 0; i <= 5; i++) {
        if (selected.has(i)) {
          // Reason 2 = children logic
          if (i === 2) {
            if (val.numberOfChildren === undefined) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['numberOfChildren'],
                message: 'Number of children is required',
              });
            }
            if (!val.childrenAge || val.childrenAge.length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['children'],
                message: 'Children details are required',
              });
            }
          } else {
            const key = i.toString() as '0' | '1' | '2' | '3' | '4' | '5';
            if (!val.details?.[key]) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['details', key],
                message: `Detail for family reason ${i} is required`,
              });
            }
          }
        }
      }

      if (selected.has(6) && !val.detailText) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['detailText'],
          message: "Detail text is required for 'Altro'",
        });
      }
    }),
});

// --- Full Schema ---
const BaseSteps = Step1.merge(Step2).merge(Step3);

const FullSchema = BaseSteps.and(
  z.discriminatedUnion('path', [IndividualSchema, CoupleSchema, FamilySchema]),
).and(FinalSteps);

export default FullSchema;
export type FormValues = z.infer<typeof FullSchema>;
