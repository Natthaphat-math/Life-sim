import type { Content, ContentIndex } from './content';
import { evaluate } from './conditions';
import type { Rng } from './rng';
import type { GameEvent, GameState, Segment, Slot } from './types';

/**
 * Plan a segment: pick how many random draws it gets, give each a target age,
 * and place the milestone (if any) at an age inside its own window. Slots are
 * sorted by age so time only moves forward.
 */
export function planSegment(seg: Segment, s: GameState, rng: Rng, idx: ContentIndex): Slot[] {
  const [start, end] = seg.ageMonths;
  const slots: Slot[] = [];
  const count = rng.int(seg.draws[0], seg.draws[1]);
  for (let i = 0; i < count; i++) slots.push({ kind: 'random', age: rng.int(start, end - 1) });

  if (seg.milestone) {
    const id = typeof seg.milestone === 'string' ? seg.milestone : rng.pick(seg.milestone.oneOf);
    const ev = idx.events.get(id);
    if (ev) {
      const lo = Math.max(start, ev.ageMonths[0]);
      const hi = Math.min(end - 1, ev.ageMonths[1]);
      slots.push({ kind: 'milestone', eventId: id, age: lo <= hi ? rng.int(lo, hi) : start });
    }
  }
  // Stable sort by age; a milestone at the same age as a random slot goes last.
  return slots.sort((a, b) => a.age - b.age || (a.kind === 'milestone' ? 1 : 0) - (b.kind === 'milestone' ? 1 : 0));
}

/** Events that may be randomly drawn in this segment right now. */
export function eligibleEvents(content: Content, seg: Segment, s: GameState): GameEvent[] {
  const now = s.character.ageMonths;
  const [, end] = seg.ageMonths;
  const seen = new Set(s.history.map((h) => h.eventId));
  return content.events.filter(
    (e) =>
      e.stage === s.character.stage &&
      !e.milestone &&
      !e.followUpOnly &&
      (e.repeatable || !seen.has(e.id)) &&
      e.ageMonths[1] >= now && // window not already over
      e.ageMonths[0] < end && // window starts inside this segment
      evaluate(e.conditions, s),
  );
}

export interface Pick {
  event: GameEvent;
  age: number;
}

/**
 * Take the next event of the current segment, or null when it is exhausted.
 *
 * Order of priority:
 *   1. a scheduled follow-up due before the next slot (or before the segment
 *      ends). It replaces the next random slot, so follow-ups count toward the
 *      segment's draws.
 *   2. the next slot: a milestone, or a weighted random draw. Events whose age
 *      window contains the slot age get full weight; others get
 *      `offWindowWeight` so pools never run dry.
 * Mutates `s.progress.slots` and `s.followUps`.
 */
export function takeNext(content: Content, idx: ContentIndex, seg: Segment, s: GameState, rng: Rng): Pick | null {
  const slots = s.progress.slots ?? [];
  for (;;) {
    const next = slots[0];
    const horizon = next ? next.age : seg.ageMonths[1] - 1;
    s.followUps.sort((a, b) => a.dueMonths - b.dueMonths);
    const due = s.followUps[0];
    if (due && due.dueMonths <= horizon) {
      s.followUps.shift();
      const ev = idx.events.get(due.eventId);
      if (!ev || !evaluate(ev.conditions, s)) continue; // no longer fits this life: drop it
      const r = slots.findIndex((sl) => sl.kind === 'random');
      if (r >= 0) slots.splice(r, 1);
      return { event: ev, age: Math.max(s.character.ageMonths, due.dueMonths) };
    }

    if (!next) return null;
    slots.shift();

    if (next.kind === 'milestone') {
      const ev = idx.events.get(next.eventId);
      if (!ev || !evaluate(ev.conditions, s)) continue;
      return { event: ev, age: Math.max(s.character.ageMonths, next.age) };
    }

    const pool = eligibleEvents(content, seg, s);
    const factor = content.rules.offWindowWeight;
    const ev = rng.weighted(pool, (e) =>
      e.weight * (next.age >= e.ageMonths[0] && next.age <= e.ageMonths[1] ? 1 : factor),
    );
    if (!ev) continue; // empty pool: skip this slot
    const inWindow = Math.min(Math.max(next.age, ev.ageMonths[0]), ev.ageMonths[1]);
    return { event: ev, age: Math.max(s.character.ageMonths, inWindow) };
  }
}
