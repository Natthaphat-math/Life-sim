/**
 * Storage backend for raw save data. Game logic only talks to this interface,
 * so JSON import/export (or any other backend) can be added without touching
 * the engine: implement it, or read/write through `exportSave`/`importSave`
 * in saveManager.ts.
 */
export interface SaveStorage {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
}

/** localStorage backend. Every call is guarded: storage can be missing or full. */
export class LocalSaveStorage implements SaveStorage {
  read(key: string): string | null {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
  write(key: string, value: string): void {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch (err) {
      console.warn('Could not save', err);
    }
  }
  remove(key: string): void {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

/** In-memory backend for tests and the simulator. */
export class MemorySaveStorage implements SaveStorage {
  private data = new Map<string, string>();
  read(key: string) {
    return this.data.get(key) ?? null;
  }
  write(key: string, value: string) {
    this.data.set(key, value);
  }
  remove(key: string) {
    this.data.delete(key);
  }
}
