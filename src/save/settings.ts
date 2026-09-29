import type { WarningLevel } from '../engine/types';
import type { SaveStorage } from './SaveStorage';

export type Theme = 'auto' | 'light' | 'dark';
export interface Settings {
  warningLevel: WarningLevel;
  theme: Theme;
}

const KEY = 'lifesim.settings';
export const DEFAULT_SETTINGS: Settings = { warningLevel: 'heavyOnly', theme: 'auto' };

export function loadSettings(storage: SaveStorage): Settings {
  try {
    const raw = JSON.parse(storage.read(KEY) ?? '{}') as Partial<Settings>;
    return {
      warningLevel: ['every', 'heavyOnly', 'never'].includes(raw.warningLevel as string)
        ? (raw.warningLevel as WarningLevel)
        : DEFAULT_SETTINGS.warningLevel,
      theme: ['auto', 'light', 'dark'].includes(raw.theme as string) ? (raw.theme as Theme) : DEFAULT_SETTINGS.theme,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(storage: SaveStorage, s: Settings): void {
  storage.write(KEY, JSON.stringify(s));
}
