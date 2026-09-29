import type { RngState } from './types';

/**
 * Seedable PRNG (sfc32) with a serialisable state, so a save can resume the
 * exact random sequence and a seed always reproduces the same life.
 */
export class Rng {
  private s: RngState;

  constructor(state: RngState) {
    this.s = [...state] as RngState;
  }

  /** Build a generator from any string seed (hashed with cyrb128). */
  static fromSeed(seed: string): Rng {
    const rng = new Rng(cyrb128(seed));
    // Warm up: the first few sfc32 outputs are poorly mixed.
    for (let i = 0; i < 12; i++) rng.next();
    return rng;
  }

  getState(): RngState {
    return [...this.s] as RngState;
  }

  /** Float in [0, 1). */
  next(): number {
    let [a, b, c, d] = this.s;
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    this.s = [a >>> 0, b >>> 0, c >>> 0, d >>> 0];
    return (t >>> 0) / 4294967296;
  }

  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Uniform float in [min, max). */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('Rng.pick on empty list');
    return items[Math.floor(this.next() * items.length)] as T;
  }

  /** Weighted pick. Items with weight <= 0 are never picked. */
  weighted<T>(items: readonly T[], weightOf: (item: T) => number): T | undefined {
    let total = 0;
    for (const it of items) total += Math.max(0, weightOf(it));
    if (total <= 0) return undefined;
    let r = this.next() * total;
    for (const it of items) {
      const w = Math.max(0, weightOf(it));
      if (r < w) return it;
      r -= w;
    }
    return items[items.length - 1];
  }

  /** Weighted pick from a { key: weight } table. */
  table<K extends string>(weights: Partial<Record<K, number>>): K {
    const keys = Object.keys(weights) as K[];
    const k = this.weighted(keys, (key) => weights[key] ?? 0);
    if (k === undefined) throw new Error('Rng.table with no positive weights');
    return k;
  }
}

/** Random seed string for a new game. Uses Math.random only to pick the seed. */
export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

function cyrb128(str: string): RngState {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= h2 ^ h3 ^ h4;
  h2 ^= h1;
  h3 ^= h1;
  h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}
