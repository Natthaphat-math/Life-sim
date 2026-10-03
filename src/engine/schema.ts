/**
 * Zod schemas mirroring types.ts. Used by the content validator, the tests
 * and the save loader (a corrupted save fails validation instead of crashing).
 */
import { z } from 'zod';
import {
  CAREGIVERS,
  CAREGIVER_PERSONS,
  ENVIRONMENTS,
  GENDERS,
  HEALTHS,
  INCLINATIONS,
  PARENTING_STYLES,
  PARENT_RELATIONSHIPS,
  SENSITIVITIES,
  SIBLINGS,
  STAGE_IDS,
  TEMPERAMENTS,
  TRAITS,
  WEALTHS,
  WEALTH_TAGS,
  type Condition,
} from './types';

const id = z.string().regex(/^[a-z0-9_]+$/, 'ids are lower_snake_case');
const pct = z.number().min(0).max(100);

export const conditionSchema: z.ZodType<Condition> = z.lazy(() =>
  z.union([
    z.strictObject({ all: z.array(conditionSchema).min(1) }),
    z.strictObject({ any: z.array(conditionSchema).min(1) }),
    z.strictObject({ not: conditionSchema }),
    z.strictObject({ flag: id }),
    z.strictObject({ seen: id }),
    z.strictObject({ trait: z.enum(TRAITS), min: pct.optional(), max: pct.optional() }),
    z.strictObject({ stress: z.strictObject({ min: pct.optional(), max: pct.optional() }) }),
    z.strictObject({ age: z.strictObject({ min: z.number().optional(), max: z.number().optional() }) }),
    z.strictObject({ wealth: z.array(z.enum(WEALTHS)).min(1) }),
    z.strictObject({ wealthTag: z.array(z.enum(WEALTH_TAGS)).min(1) }),
    z.strictObject({ temperament: z.array(z.enum(TEMPERAMENTS)).min(1) }),
    z.strictObject({ parenting: z.array(z.enum(PARENTING_STYLES)).min(1) }),
    z.strictObject({ caregiver: z.array(z.enum(CAREGIVERS)).min(1) }),
    z.strictObject({ siblings: z.array(z.enum(SIBLINGS)).min(1) }),
    z.strictObject({ env: z.array(z.enum(ENVIRONMENTS)).min(1) }),
    z.strictObject({ health: z.array(z.enum(HEALTHS)).min(1) }),
    z.strictObject({ parents: z.array(z.enum(PARENT_RELATIONSHIPS)).min(1) }),
    z.strictObject({ gender: z.array(z.enum(GENDERS)).min(1) }),
  ]),
);

export const textSchema = z.union([
  z.string().min(1),
  z.array(z.union([z.string(), z.strictObject({ if: conditionSchema, then: z.string(), else: z.string().optional() })])).min(1),
]);

const delta = z.number().min(-20).max(20);
export const effectsSchema = z.strictObject({
  traits: z.partialRecord(z.enum(TRAITS), delta).optional(),
  stress: delta.optional(),
  inclinations: z.partialRecord(z.enum(INCLINATIONS), delta).optional(),
  setFlags: z.array(id).optional(),
  clearFlags: z.array(id).optional(),
});

const followUpSchema = z.strictObject({ event: id, delayMonths: z.number().int().min(0).optional() });

const outcomeBody = {
  effects: effectsSchema.optional(),
  text: textSchema.optional(),
  reaction: id.optional(),
  followUp: followUpSchema.optional(),
};

export const outcomeSchema = z
  .strictObject({
    ...outcomeBody,
    variants: z.array(z.strictObject({ if: conditionSchema, ...outcomeBody })).optional(),
  })
  .refine((o) => o.text !== undefined || o.reaction !== undefined, 'outcome needs text or a reaction');

const lockSchema = z.strictObject({ when: conditionSchema, hint: textSchema });

// Sub-choices have no `subChoices` key at all: strictObject rejects a third tier.
export const subChoiceSchema = z.strictObject({
  id,
  text: textSchema,
  showIf: conditionSchema.optional(),
  lockedIf: lockSchema.optional(),
  outcome: outcomeSchema,
});

export const choiceSchema = z
  .strictObject({
    id,
    text: textSchema,
    showIf: conditionSchema.optional(),
    lockedIf: lockSchema.optional(),
    subChoices: z.array(subChoiceSchema).min(2).max(3).optional(),
    outcome: outcomeSchema.optional(),
  })
  .refine((c) => (c.subChoices === undefined) !== (c.outcome === undefined), {
    message: 'a choice needs exactly one of `subChoices` or `outcome`',
  });

export const eventSchema = z
  .strictObject({
    id,
    stage: z.enum(STAGE_IDS),
    title: textSchema,
    ageMonths: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
    weight: z.number().min(0),
    conditions: conditionSchema.optional(),
    sensitivity: z.enum(SENSITIVITIES),
    turningPoint: z.strictObject({ multiplier: z.number().min(0).max(5) }).optional(),
    milestone: z.boolean().optional(),
    followUpOnly: z.boolean().optional(),
    repeatable: z.boolean().optional(),
    text: textSchema,
    choices: z.array(choiceSchema).min(2).max(4),
    skip: z.strictObject({ text: textSchema, effects: effectsSchema.optional() }).optional(),
  })
  .refine((e) => e.ageMonths[0] <= e.ageMonths[1], 'ageMonths must be [min, max]')
  .refine((e) => e.sensitivity === 'none' || e.skip !== undefined, 'sensitive events need a `skip` summary');

// ---------------------------------------------------------------------------
// Save state
// ---------------------------------------------------------------------------

const traitRecord = z.strictObject(Object.fromEntries(TRAITS.map((t) => [t, pct])) as Record<(typeof TRAITS)[number], typeof pct>);
const inclinationRecord = z.strictObject(
  Object.fromEntries(INCLINATIONS.map((t) => [t, pct])) as Record<(typeof INCLINATIONS)[number], typeof pct>,
);
const sibKind = z.enum(['brother', 'sister']).optional();

export const birthSchema = z.strictObject({
  wealth: z.enum(WEALTHS),
  wealthTag: z.enum(WEALTH_TAGS),
  temperament: z.enum(TEMPERAMENTS),
  parenting: z.enum(PARENTING_STYLES),
  caregiver: z.enum(CAREGIVERS),
  caregiverPerson: z.enum(CAREGIVER_PERSONS),
  siblings: z.enum(SIBLINGS),
  olderSibling: sibKind,
  youngerSibling: sibKind,
  environment: z.enum(ENVIRONMENTS),
  health: z.enum(HEALTHS),
  parents: z.enum(PARENT_RELATIONSHIPS),
});

const u32 = z.number().int().min(0).max(0xffffffff);
const slotSchema = z.union([
  z.strictObject({ kind: z.literal('random'), age: z.number() }),
  z.strictObject({ kind: z.literal('milestone'), eventId: z.string(), age: z.number() }),
]);

export const phaseSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('birth') }),
  z.strictObject({ kind: z.literal('event'), eventId: z.string(), gatePassed: z.boolean(), tier1: z.string().optional() }),
  z.strictObject({ kind: z.literal('outcome'), eventId: z.string(), texts: z.record(z.string(), z.string()), skipped: z.boolean() }),
  z.strictObject({ kind: z.literal('bridge'), texts: z.record(z.string(), z.string()) }),
  z.strictObject({ kind: z.literal('stageEnd'), stageId: z.enum(STAGE_IDS) }),
]);

export const gameStateSchema = z.strictObject({
  seed: z.string(),
  rng: z.tuple([u32, u32, u32, u32]),
  character: z.strictObject({
    name: z.string().min(1).max(40),
    gender: z.enum(GENDERS),
    ageMonths: z.number().min(0),
    stage: z.enum(STAGE_IDS),
  }),
  birth: birthSchema,
  traits: traitRecord,
  stress: pct,
  inclinations: inclinationRecord,
  flags: z.array(z.string()),
  history: z.array(
    z.strictObject({
      eventId: z.string(),
      ageMonths: z.number(),
      choiceId: z.string().optional(),
      subChoiceId: z.string().optional(),
      skipped: z.boolean().optional(),
    }),
  ),
  followUps: z.array(z.strictObject({ eventId: z.string(), dueMonths: z.number() })),
  progress: z.strictObject({ segmentIndex: z.number().int().min(0), slots: z.array(slotSchema).nullable() }),
  phase: phaseSchema,
  archived: z.boolean(),
});
