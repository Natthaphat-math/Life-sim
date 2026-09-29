import { gameStateSchema } from '../engine/schema';
import type { GameState } from '../engine/types';
import { migrate, SAVE_VERSION, type RawSave } from './migrations';
import type { SaveStorage } from './SaveStorage';

const KEY = 'lifesim.save';

export type LoadResult =
  | { status: 'none' }
  | { status: 'ok'; state: GameState }
  | { status: 'corrupt'; reason: string };

/** Serialise a state into the versioned save format (also the export format). */
export function exportSave(state: GameState): string {
  const save: RawSave = { version: SAVE_VERSION, savedAt: new Date().toISOString(), state };
  return JSON.stringify(save);
}

/** Parse, migrate and validate a save string (also the import path). */
export function importSave(json: string): LoadResult {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { status: 'corrupt', reason: 'not JSON' };
  }
  if (!raw || typeof raw !== 'object' || typeof (raw as RawSave).version !== 'number') {
    return { status: 'corrupt', reason: 'missing version' };
  }
  const migrated = migrate(raw as RawSave);
  if (!migrated) return { status: 'corrupt', reason: `unsupported version ${(raw as RawSave).version}` };
  const parsed = gameStateSchema.safeParse(migrated.state);
  if (!parsed.success) return { status: 'corrupt', reason: parsed.error.issues[0]?.message ?? 'invalid' };
  return { status: 'ok', state: parsed.data as GameState };
}

export class SaveManager {
  constructor(private storage: SaveStorage) {}

  save(state: GameState): void {
    this.storage.write(KEY, exportSave(state));
  }

  load(): LoadResult {
    const json = this.storage.read(KEY);
    return json === null ? { status: 'none' } : importSave(json);
  }

  clear(): void {
    this.storage.remove(KEY);
  }
}
