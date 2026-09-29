import type { Condition, GameState } from './types';

/** Evaluate a condition against the current state. Pure and deterministic. */
export function evaluate(cond: Condition | undefined, s: GameState): boolean {
  if (cond === undefined) return true;
  const b = s.birth;
  if ('all' in cond) return cond.all.every((c) => evaluate(c, s));
  if ('any' in cond) return cond.any.some((c) => evaluate(c, s));
  if ('not' in cond) return !evaluate(cond.not, s);
  if ('flag' in cond) return s.flags.includes(cond.flag);
  if ('seen' in cond) return s.history.some((h) => h.eventId === cond.seen);
  if ('trait' in cond) return inRange(s.traits[cond.trait], cond.min, cond.max);
  if ('stress' in cond) return inRange(s.stress, cond.stress.min, cond.stress.max);
  if ('age' in cond) return inRange(s.character.ageMonths, cond.age.min, cond.age.max);
  if ('wealth' in cond) return cond.wealth.includes(b.wealth);
  if ('wealthTag' in cond) return cond.wealthTag.includes(b.wealthTag);
  if ('temperament' in cond) return cond.temperament.includes(b.temperament);
  if ('parenting' in cond) return cond.parenting.includes(b.parenting);
  if ('caregiver' in cond) return cond.caregiver.includes(b.caregiver);
  if ('siblings' in cond) return cond.siblings.includes(b.siblings);
  if ('env' in cond) return cond.env.includes(b.environment);
  if ('health' in cond) return cond.health.includes(b.health);
  if ('parents' in cond) return cond.parents.includes(b.parents);
  if ('gender' in cond) return cond.gender.includes(s.character.gender);
  const unknown: never = cond;
  throw new Error(`Unknown condition: ${JSON.stringify(unknown)}`);
}

/** Inclusive range check; missing bounds are open. */
function inRange(v: number, min?: number, max?: number): boolean {
  return (min === undefined || v >= min) && (max === undefined || v <= max);
}

/** Every flag a condition reads (used by the content validator). */
export function flagsReadBy(cond: Condition | undefined, out = new Set<string>()): Set<string> {
  if (!cond) return out;
  if ('all' in cond) cond.all.forEach((c) => flagsReadBy(c, out));
  else if ('any' in cond) cond.any.forEach((c) => flagsReadBy(c, out));
  else if ('not' in cond) flagsReadBy(cond.not, out);
  else if ('flag' in cond) out.add(cond.flag);
  return out;
}
