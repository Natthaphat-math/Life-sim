import type { GameEvent } from '../engine/types';

/** Identity helper so event files get full type checking and autocompletion. */
export const defineEvent = (e: GameEvent): GameEvent => e;
