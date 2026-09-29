import { z } from 'zod';
import { birthSchema } from '../engine/schema';
import { GENDERS, INCLINATIONS, STAGE_IDS, TRAITS, type GameState } from '../engine/types';
import type { SaveStorage } from './SaveStorage';

const KEY = 'lifesim.lives';

/** Compact record of a finished life (or finished milestone), for comparison. */
export interface LifeRecord {
  id: string;
  name: string;
  gender: (typeof GENDERS)[number];
  seed: string;
  finishedAt: string;
  stage: (typeof STAGE_IDS)[number];
  ageMonths: number;
  birth: GameState['birth'];
  traits: GameState['traits'];
  stress: number;
  inclinations: GameState['inclinations'];
}

const num = z.number();
const recordSchema = z.object({
  id: z.string(),
  name: z.string(),
  gender: z.enum(GENDERS),
  seed: z.string(),
  finishedAt: z.string(),
  stage: z.enum(STAGE_IDS),
  ageMonths: num,
  birth: birthSchema,
  traits: z.object(Object.fromEntries(TRAITS.map((t) => [t, num]))),
  stress: num,
  inclinations: z.object(Object.fromEntries(INCLINATIONS.map((t) => [t, num]))),
});

const round = (v: number) => Math.round(v);

export function toRecord(s: GameState): LifeRecord {
  return {
    id: `${s.seed}-${Date.now().toString(36)}`,
    name: s.character.name,
    gender: s.character.gender,
    seed: s.seed,
    finishedAt: new Date().toISOString(),
    stage: s.character.stage,
    ageMonths: s.character.ageMonths,
    birth: s.birth,
    traits: Object.fromEntries(TRAITS.map((t) => [t, round(s.traits[t])])) as LifeRecord['traits'],
    stress: round(s.stress),
    inclinations: Object.fromEntries(INCLINATIONS.map((t) => [t, round(s.inclinations[t])])) as LifeRecord['inclinations'],
  };
}

/** Newest first. Invalid entries are dropped silently. */
export function loadLives(storage: SaveStorage): LifeRecord[] {
  try {
    const raw = JSON.parse(storage.read(KEY) ?? '[]');
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((r) => {
      const p = recordSchema.safeParse(r);
      return p.success ? [p.data as LifeRecord] : [];
    });
  } catch {
    return [];
  }
}

export function addLife(storage: SaveStorage, record: LifeRecord, limit: number): LifeRecord[] {
  const lives = [record, ...loadLives(storage)].slice(0, limit);
  storage.write(KEY, JSON.stringify(lives));
  return lives;
}

export function clearLives(storage: SaveStorage): void {
  storage.remove(KEY);
}
