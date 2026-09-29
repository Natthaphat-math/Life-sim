import type { BirthTables, Content } from './content';
import { evaluate } from './conditions';
import { applyEffects, clamp } from './effects';
import type { Rng } from './rng';
import { INCLINATIONS, TRAITS, type BirthCircumstances, type GameState, type Gender } from './types';

/**
 * Random birth circumstances. Kept separate from the game-start flow so a
 * future "choose your own" mode can build a BirthCircumstances some other way
 * and pass it to Game.create().
 */
export function generateBirth(rng: Rng, tables: BirthTables): BirthCircumstances {
  const w = tables.weights;
  const wealth = rng.table(w.wealth);
  const caregiver = rng.table(w.caregiver);
  const siblings = rng.table(w.siblings);
  const sib = (): 'brother' | 'sister' => (rng.next() < 0.5 ? 'brother' : 'sister');
  return {
    wealth,
    wealthTag: rng.table(w.wealthTag[wealth]),
    temperament: rng.table(w.temperament),
    parenting: rng.table(w.parenting),
    caregiver,
    caregiverPerson: rng.table(w.caregiverPerson[caregiver]),
    siblings,
    olderSibling: siblings === 'older' || siblings === 'both' ? sib() : undefined,
    youngerSibling: siblings === 'younger' || siblings === 'both' ? sib() : undefined,
    environment: rng.table(w.environment[wealth]),
    health: rng.table(w.health),
    parents: rng.table(w.parents),
  };
}

export function randomGender(rng: Rng): Gender {
  return rng.next() < 0.5 ? 'boy' : 'girl';
}

/**
 * Starting traits, stress, inclinations and flags from the birth modifiers
 * plus a small random jitter per trait. Mutates `s`.
 */
export function applyBirthModifiers(s: GameState, rng: Rng, content: Content): void {
  const r = content.rules;
  for (const t of TRAITS) s.traits[t] = r.traitDefault;
  for (const i of INCLINATIONS) s.inclinations[i] = r.inclinationDefault;
  s.stress = r.stressDefault;
  for (const m of content.birth.modifiers) {
    if (evaluate(m.if, s)) applyEffects(s, m.effects, 1);
  }
  const j = content.birth.jitter;
  for (const t of TRAITS) s.traits[t] = clamp(s.traits[t] + rng.range(-j, j));
}
