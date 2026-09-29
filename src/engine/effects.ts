import type { Content, Rules } from './content';
import { evaluate } from './conditions';
import {
  INCLINATIONS,
  TRAITS,
  type Effects,
  type FollowUp,
  type GameEvent,
  type GameState,
  type Outcome,
  type Text,
} from './types';

export const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));

/** Multiplier for the character's age, from the rules table. */
export function ageMultiplier(ageMonths: number, rules: Rules): number {
  for (const band of rules.ageMultipliers) {
    if (ageMonths < band.belowMonths) return band.multiplier;
  }
  return rules.adultMultiplier;
}

/** Turning points bring their own multiplier at any age. */
export function eventMultiplier(event: GameEvent | undefined, ageMonths: number, rules: Rules): number {
  return event?.turningPoint?.multiplier ?? ageMultiplier(ageMonths, rules);
}

/**
 * Apply effects in place. Trait, stress and inclination deltas are scaled by
 * `multiplier`, then clamped to 0..100. Flags are cleared before being set,
 * so an outcome can swap one flag for another.
 */
export function applyEffects(
  s: GameState,
  e: Effects | undefined,
  multiplier: number,
  rules?: Pick<Rules, 'softCap' | 'traitDefault'>,
): void {
  if (!e) return;
  for (const t of TRAITS) {
    const d = e.traits?.[t];
    if (d) s.traits[t] = clamp(s.traits[t] + softCapped(s.traits[t], d * multiplier, rules));
  }
  for (const i of INCLINATIONS) {
    const d = e.inclinations?.[i];
    if (d) s.inclinations[i] = clamp(s.inclinations[i] + d * multiplier);
  }
  if (e.stress) s.stress = clamp(s.stress + e.stress * multiplier);
  if (e.clearFlags) s.flags = s.flags.filter((f) => !e.clearFlags!.includes(f));
  for (const f of e.setFlags ?? []) if (!s.flags.includes(f)) s.flags.push(f);
}

/**
 * Scale a trait delta by the remaining room toward the edge it moves to,
 * relative to the room at the default value. See Rules.softCap.
 */
export function softCapped(value: number, delta: number, rules?: Pick<Rules, 'softCap' | 'traitDefault'>): number {
  if (!rules?.softCap) return delta;
  const def = rules.traitDefault;
  if (delta > 0 && value > def) return delta * ((100 - value) / (100 - def));
  if (delta < 0 && value < def) return delta * (value / def);
  return delta;
}

export interface ResolvedOutcome {
  texts: Text[];
  effects: Effects[];
  followUp?: FollowUp;
}

/**
 * Resolve an outcome for the current state:
 *   1. start from the outcome's own fields;
 *   2. the first variant whose `if` holds overrides the fields it defines;
 *   3. if a `reaction` is set, the caregiver reaction for the character's
 *      parenting style adds its text (after) and its effects (summed).
 */
export function resolveOutcome(outcome: Outcome, s: GameState, content: Content): ResolvedOutcome {
  const variant = outcome.variants?.find((v) => evaluate(v.if, s));
  const text = variant && 'text' in variant ? variant.text : outcome.text;
  const effects = variant && 'effects' in variant ? variant.effects : outcome.effects;
  const reactionId = variant && 'reaction' in variant ? variant.reaction : outcome.reaction;
  const followUp = variant && 'followUp' in variant ? variant.followUp : outcome.followUp;

  const texts: Text[] = [];
  const allEffects: Effects[] = [];
  if (text !== undefined) texts.push(text);
  if (effects) allEffects.push(effects);
  if (reactionId) {
    const reaction = content.reactions[reactionId]?.[s.birth.parenting];
    if (!reaction) throw new Error(`Unknown caregiver reaction "${reactionId}"`);
    texts.push(reaction.text);
    if (reaction.effects) allEffects.push(reaction.effects);
  }
  return { texts, effects: allEffects, followUp };
}
