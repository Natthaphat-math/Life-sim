/** Current save format version. Bump it when GameState changes shape. */
export const SAVE_VERSION = 2;

/**
 * Upgrade a raw save object, one version at a time, to SAVE_VERSION.
 * Add a step per bump, e.g.
 *   1: (s) => ({ ...s, state: { ...s.state, newField: default } }),
 * Returns null if the save is from the future or cannot be migrated.
 */
const steps: Record<number, (save: RawSave) => RawSave> = {
  // v1 → v2: stored outcome/bridge text became per-locale `texts` (TH/EN switch).
  // v1 was English-only, so the old string becomes the English entry.
  1: (save) => {
    const state = save.state as { phase?: { kind?: string; text?: unknown } } | null;
    const phase = state?.phase;
    if (phase && (phase.kind === 'outcome' || phase.kind === 'bridge') && typeof phase.text === 'string') {
      const { text, ...rest } = phase;
      return { ...save, version: 2, state: { ...state, phase: { ...rest, texts: { en: text } } } };
    }
    return { ...save, version: 2 };
  },
};

export interface RawSave {
  version: number;
  savedAt: string;
  state: unknown;
}

export function migrate(save: RawSave): RawSave | null {
  let s = save;
  while (s.version < SAVE_VERSION) {
    const step = steps[s.version];
    if (!step) return null;
    s = step(s);
  }
  return s.version === SAVE_VERSION ? s : null;
}
