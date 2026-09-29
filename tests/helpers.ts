import { content } from '../src/content';
import type { Content } from '../src/engine/content';
import { Game } from '../src/engine/game';
import type { BirthCircumstances, GameEvent, GameState } from '../src/engine/types';

export const baseBirth: BirthCircumstances = {
  wealth: 'middle',
  wealthTag: 'middle-comfortable',
  temperament: 'easy',
  parenting: 'warmBalanced',
  caregiver: 'bothParents',
  caregiverPerson: 'mom',
  siblings: 'none',
  environment: 'suburb',
  health: 'normal',
  parents: 'smooth',
};

/** A fresh state with neutral traits, for unit tests. */
export function makeState(overrides: Partial<BirthCircumstances> = {}, patch: Partial<GameState> = {}): GameState {
  const g = Game.create(content, { name: 'Alex', seed: 'test', birth: { ...baseBirth, ...overrides }, gender: 'girl' });
  const s = g.state;
  for (const k of Object.keys(s.traits) as Array<keyof typeof s.traits>) s.traits[k] = 50;
  s.stress = 20;
  return { ...s, ...patch };
}

/** Content with the given events replacing the real ones. */
export function withEvents(events: GameEvent[], extra: Partial<Content> = {}): Content {
  return { ...content, events, ...extra };
}

export { content };
