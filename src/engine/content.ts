import type {
  Caregiver,
  CaregiverPerson,
  Condition,
  Effects,
  Environment,
  EventStub,
  GameEvent,
  Health,
  Inclination,
  ParentRelationship,
  ParentingStyle,
  ReactionTable,
  Siblings,
  StageDef,
  StageId,
  Temperament,
  Text,
  Trait,
  Wealth,
  WealthTag,
} from './types';

/** Balance numbers. Locale-independent; tune freely. */
export interface Rules {
  traitDefault: number;
  stressDefault: number;
  inclinationDefault: number;
  /** Checked in order; the first band whose `belowMonths` exceeds the age wins. */
  ageMultipliers: Array<{ belowMonths: number; multiplier: number }>;
  /** Used when no band matches (adulthood). */
  adultMultiplier: number;
  /**
   * Diminishing returns: a trait moving away from `traitDefault` is slowed in
   * proportion to how close it already is to 0 or 100 (at the default: full
   * effect; halfway to the edge: half effect). Moves back toward the default
   * are never slowed. Keeps 0 and 100 rare and meaningful.
   */
  softCap: boolean;
  /** Fraction of the distance back to `stressDefault` recovered between segments. */
  stressRecoveryBetweenSegments: number;
  /** Weight factor for events whose age window misses the planned slot age. */
  offWindowWeight: number;
  /** Max number of finished lives kept for comparison. */
  archiveLimit: number;
}

type Weights<K extends string> = Partial<Record<K, number>>;

/** Random birth tables. Locale-independent. */
export interface BirthTables {
  weights: {
    wealth: Weights<Wealth>;
    wealthTag: Record<Wealth, Weights<WealthTag>>;
    temperament: Weights<Temperament>;
    parenting: Weights<ParentingStyle>;
    caregiver: Weights<Caregiver>;
    caregiverPerson: Record<Caregiver, Weights<CaregiverPerson>>;
    siblings: Weights<Siblings>;
    /** Environment weights depend a little on wealth. */
    environment: Record<Wealth, Weights<Environment>>;
    health: Weights<Health>;
    parents: Weights<ParentRelationship>;
  };
  /**
   * Starting nudges. Every matching entry is applied once, without the age
   * multiplier. Keep them small: no combination should decide a life.
   */
  modifiers: Array<{ if: Condition; effects: Effects }>;
  /** Each trait also gets a uniform random nudge in [-jitter, +jitter]. */
  jitter: number;
}

export interface NarrativeContent {
  /** Paragraph revealing the birth circumstances (no numbers). */
  birth: Text;
  traitHigh: Record<Trait, Text>;
  traitLow: Record<Trait, Text>;
  stressHigh: Text;
  stressLow: Text;
  inclination: Record<Inclination, Text>;
  /** Short memory lines keyed by flag. Only flags listed here are mentioned. */
  flagLines: Record<string, Text>;
  stageEnd: Partial<Record<StageId, { intro: Text; outro: Text }>>;
}

export interface TextVars {
  pronoun: Record<'boy' | 'girl', { he: string; him: string; his: string; kid: string }>;
  caregiverPerson: Record<CaregiverPerson, { name: string; he: string; him: string; his: string }>;
  /** Phrase for "the people raising you" ({caregivers}). */
  caregivers: Record<Caregiver, string>;
  olderSibling: Record<'brother' | 'sister', string>;
  youngerSibling: Record<'brother' | 'sister', string>;
  /** Fallback when {sibling} is used without siblings (e.g. another child). */
  noSibling: string;
}

/** Everything the engine needs, bundled per locale. */
export interface Content<S = unknown> {
  locale: string;
  rules: Rules;
  birth: BirthTables;
  events: GameEvent[];
  reactions: ReactionTable;
  /** Stages playable in this build, in order. */
  stages: StageDef[];
  stubs: EventStub[];
  vars: TextVars;
  narrative: NarrativeContent;
  /** UI strings; shape owned by the UI layer. */
  strings: S;
}

/** Lookup helpers built once per content bundle. */
export interface ContentIndex {
  events: Map<string, GameEvent>;
}

export function indexContent(content: Content): ContentIndex {
  return { events: new Map(content.events.map((e) => [e.id, e])) };
}
