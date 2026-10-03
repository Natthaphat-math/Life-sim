/**
 * Core types shared by the engine, content and UI.
 *
 * The engine never contains player-facing strings: everything the player reads
 * comes from `src/content/<locale>/`. Enumerations below are identifiers only.
 */

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export const TRAITS = [
  'confidence',
  'curiosity',
  'empathy',
  'discipline',
  'courage',
  'trust',
  'sociability',
  'creativity',
] as const;
export type Trait = (typeof TRAITS)[number];

export const INCLINATIONS = [
  'artsLanguage',
  'scienceMath',
  'physicalSports',
  'peopleHelping',
  'handsOnBusiness',
] as const;
export type Inclination = (typeof INCLINATIONS)[number];

export const WEALTHS = ['poor', 'middle', 'rich'] as const;
export type Wealth = (typeof WEALTHS)[number];

/** Sub-tag that colours a wealth level, e.g. "poor but warm". */
export const WEALTH_TAGS = [
  'poor-warm',
  'poor-stretched',
  'poor-resourceful',
  'middle-comfortable',
  'middle-busy',
  'middle-careful',
  'rich-busy',
  'rich-relaxed',
  'rich-proper',
] as const;
export type WealthTag = (typeof WEALTH_TAGS)[number];

export const TEMPERAMENTS = ['easy', 'clingy', 'sensitive', 'slowToWarm', 'active'] as const;
export type Temperament = (typeof TEMPERAMENTS)[number];

export const PARENTING_STYLES = ['indulgent', 'strict', 'neglectful', 'freeRange', 'warmBalanced'] as const;
export type ParentingStyle = (typeof PARENTING_STYLES)[number];

export const CAREGIVERS = ['bothParents', 'singleMother', 'singleFather', 'grandparents', 'relatives'] as const;
export type Caregiver = (typeof CAREGIVERS)[number];

export const SIBLINGS = ['none', 'older', 'younger', 'both'] as const;
export type Siblings = (typeof SIBLINGS)[number];

export const ENVIRONMENTS = ['city', 'rural', 'suburb', 'market', 'farm'] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

export const HEALTHS = ['good', 'normal', 'fragile'] as const;
export type Health = (typeof HEALTHS)[number];

export const PARENT_RELATIONSHIPS = ['smooth', 'strained'] as const;
export type ParentRelationship = (typeof PARENT_RELATIONSHIPS)[number];

export const GENDERS = ['boy', 'girl'] as const;
export type Gender = (typeof GENDERS)[number];

/** Who the text calls the primary caregiver ({caregiver}). Localised in strings. */
export const CAREGIVER_PERSONS = ['mom', 'dad', 'grandma', 'grandpa', 'aunt', 'uncle'] as const;
export type CaregiverPerson = (typeof CAREGIVER_PERSONS)[number];

export const SENSITIVITIES = ['none', 'mild', 'moderate', 'heavy'] as const;
export type Sensitivity = (typeof SENSITIVITIES)[number];

export const STAGE_IDS = ['infancy', 'kindergarten', 'primary', 'secondary', 'university', 'working'] as const;
export type StageId = (typeof STAGE_IDS)[number];

export type WarningLevel = 'every' | 'heavyOnly' | 'never';

// ---------------------------------------------------------------------------
// Birth circumstances
// ---------------------------------------------------------------------------

export interface BirthCircumstances {
  wealth: Wealth;
  wealthTag: WealthTag;
  temperament: Temperament;
  parenting: ParentingStyle;
  caregiver: Caregiver;
  /** The person the story means by {caregiver}. */
  caregiverPerson: CaregiverPerson;
  siblings: Siblings;
  olderSibling?: 'brother' | 'sister';
  youngerSibling?: 'brother' | 'sister';
  environment: Environment;
  health: Health;
  parents: ParentRelationship;
}

// ---------------------------------------------------------------------------
// Content schema
// ---------------------------------------------------------------------------

/**
 * Composable condition. Evaluation is pure (no randomness), so the same state
 * always gives the same answer.
 */
export type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | { flag: string }
  | { seen: string }
  | { trait: Trait; min?: number; max?: number }
  | { stress: { min?: number; max?: number } }
  | { age: { min?: number; max?: number } } // months
  | { wealth: Wealth[] }
  | { wealthTag: WealthTag[] }
  | { temperament: Temperament[] }
  | { parenting: ParentingStyle[] }
  | { caregiver: Caregiver[] }
  | { siblings: Siblings[] }
  | { env: Environment[] }
  | { health: Health[] }
  | { parents: ParentRelationship[] }
  | { gender: Gender[] };

/** A conditional text fragment. */
export interface TextFragment {
  if: Condition;
  then: string;
  else?: string;
}

/**
 * Player-facing text. A plain string, or a list of strings and conditional
 * fragments joined with single spaces. Use a blank line ("\n\n") inside a
 * string to start a new paragraph. Variables look like {name}.
 */
export type Text = string | Array<string | TextFragment>;

export interface Effects {
  traits?: Partial<Record<Trait, number>>;
  stress?: number;
  inclinations?: Partial<Record<Inclination, number>>;
  setFlags?: string[];
  clearFlags?: string[];
}

export interface FollowUp {
  event: string;
  /** Months after the current age. Default 0 (as soon as possible). */
  delayMonths?: number;
}

export interface OutcomeBody {
  effects?: Effects;
  text?: Text;
  /** Key into the caregiver reaction table; resolved by parenting style. */
  reaction?: string;
  followUp?: FollowUp;
}

/**
 * The result of a leaf choice. `variants` are checked in order; the first one
 * whose `if` matches overrides the fields it defines (shallow override).
 */
export interface Outcome extends OutcomeBody {
  variants?: Array<OutcomeBody & { if: Condition }>;
}

export interface Lock {
  when: Condition;
  /** Short, non-judgemental hint shown on the disabled option. */
  hint: Text;
}

export interface SubChoice {
  id: string;
  text: Text;
  /** Hidden entirely unless this holds. */
  showIf?: Condition;
  /** Shown but disabled while this holds. */
  lockedIf?: Lock;
  outcome: Outcome;
}

export interface Choice {
  id: string;
  text: Text;
  showIf?: Condition;
  lockedIf?: Lock;
  /** Exactly one of `subChoices` and `outcome` must be set. */
  subChoices?: SubChoice[];
  outcome?: Outcome;
}

export interface GameEvent {
  id: string;
  stage: StageId;
  title: Text;
  /** Inclusive month range where the event can be drawn. */
  ageMonths: [number, number];
  /** Base weight for the weighted draw. */
  weight: number;
  conditions?: Condition;
  sensitivity: Sensitivity;
  /** Custom multiplier that replaces the age multiplier. */
  turningPoint?: { multiplier: number };
  /** Placed by a stage segment, never drawn randomly. */
  milestone?: boolean;
  /** Only reachable through a follow-up, never drawn randomly. */
  followUpOnly?: boolean;
  /** Can happen more than once per life. Default false. */
  repeatable?: boolean;
  text: Text;
  choices: Choice[];
  /** Shown instead when the player skips the event. Required when sensitivity is not "none". */
  skip?: { text: Text; effects?: Effects };
}

export interface CaregiverReaction {
  text: Text;
  effects?: Effects;
}
export type ReactionTable = Record<string, Record<ParentingStyle, CaregiverReaction>>;

export interface Segment {
  id: string;
  /** Half-open month range [start, end). */
  ageMonths: [number, number];
  /** Inclusive range for how many random events to draw. */
  draws: [number, number];
  /** Fixed milestone: one id, or `oneOf` to pick one at random. */
  milestone?: string | { oneOf: string[] };
  /** Summary shown after the segment ends. */
  bridge?: { text: Text; effects?: Effects };
}

export interface StageDef {
  id: StageId;
  title: Text;
  segments: Segment[];
  /** Soft narrative card shown when the stage ends. */
  endCard: { title: Text };
}

/** A stubbed event title, to be written later. */
export interface EventStub {
  id: string;
  title: string;
  stage: StageId;
  ageMonths: [number, number];
}

// ---------------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------------

export type RngState = [number, number, number, number];

export interface HistoryEntry {
  eventId: string;
  ageMonths: number;
  choiceId?: string;
  subChoiceId?: string;
  skipped?: boolean;
}

export interface ScheduledFollowUp {
  eventId: string;
  dueMonths: number;
}

export type Slot = { kind: 'random'; age: number } | { kind: 'milestone'; eventId: string; age: number };

export type Phase =
  | { kind: 'birth' }
  | {
      kind: 'event';
      eventId: string;
      /** Player chose "Read on" at the sensitivity warning. */
      gatePassed: boolean;
      /** Tier-1 choice already made (final); waiting for a sub-choice. */
      tier1?: string;
    }
  /** `texts` holds the rendered text per locale, e.g. { th: '…', en: '…' }. */
  | { kind: 'outcome'; eventId: string; texts: Record<string, string>; skipped: boolean }
  | { kind: 'bridge'; texts: Record<string, string> }
  | { kind: 'stageEnd'; stageId: StageId };

export interface GameState {
  seed: string;
  rng: RngState;
  character: {
    name: string;
    gender: Gender;
    ageMonths: number;
    stage: StageId;
  };
  birth: BirthCircumstances;
  traits: Record<Trait, number>;
  stress: number;
  inclinations: Record<Inclination, number>;
  flags: string[];
  history: HistoryEntry[];
  followUps: ScheduledFollowUp[];
  progress: {
    segmentIndex: number;
    /** Remaining planned slots of the current segment; null = not planned yet. */
    slots: Slot[] | null;
  };
  phase: Phase;
  /** True once this life has been written to the life archive. */
  archived: boolean;
}
