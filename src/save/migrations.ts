/** Current save format version. Bump it when GameState changes shape. */
export const SAVE_VERSION = 1;

/**
 * Upgrade a raw save object, one version at a time, to SAVE_VERSION.
 * Add a step per bump, e.g.
 *   1: (s) => ({ ...s, state: { ...s.state, newField: default } }),
 * Returns null if the save is from the future or cannot be migrated.
 */
const steps: Record<number, (save: RawSave) => RawSave> = {
  // 1: (save) => ({ ...save, version: 2, state: { ...save.state } }),
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
