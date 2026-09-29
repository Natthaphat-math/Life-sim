import { describe, expect, it } from 'vitest';
import { indexContent } from '../src/engine/content';
import { Rng } from '../src/engine/rng';
import { eligibleEvents, planSegment, takeNext } from '../src/engine/selection';
import type { GameEvent, Segment } from '../src/engine/types';
import { makeState, withEvents } from './helpers';

const ev = (id: string, extra: Partial<GameEvent> = {}): GameEvent => ({
  id,
  stage: 'infancy',
  title: id,
  ageMonths: [0, 5],
  weight: 1,
  sensitivity: 'none',
  text: 'x',
  choices: [
    { id: 'a', text: 'a', outcome: { text: 'a' } },
    { id: 'b', text: 'b', outcome: { text: 'b' } },
  ],
  ...extra,
});

const seg: Segment = { id: 'A', ageMonths: [0, 6], draws: [3, 3], milestone: 'ms' };
const events = [
  ev('e1'),
  ev('e2'),
  ev('e3'),
  ev('poor_only', { conditions: { wealth: ['poor'] } }),
  ev('late', { ageMonths: [7, 12] }),
  ev('ms', { milestone: true, ageMonths: [2, 3] }),
  ev('fu', { followUpOnly: true }),
];
const content = withEvents(events);
const idx = indexContent(content);

describe('planSegment', () => {
  it('plans the draw count plus the milestone, sorted by age and inside the segment', () => {
    const slots = planSegment(seg, makeState(), Rng.fromSeed('p'), idx);
    expect(slots).toHaveLength(4);
    expect(slots.filter((s) => s.kind === 'milestone')).toEqual([expect.objectContaining({ eventId: 'ms' })]);
    const ages = slots.map((s) => s.age);
    expect(ages).toEqual([...ages].sort((a, b) => a - b));
    for (const a of ages) expect(a >= 0 && a < 6).toBe(true);
    const m = slots.find((s) => s.kind === 'milestone')!;
    expect(m.age >= 2 && m.age <= 3).toBe(true);
  });

  it('picks one of a oneOf milestone', () => {
    const picks = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const slots = planSegment({ ...seg, milestone: { oneOf: ['e1', 'e2'] } }, makeState(), Rng.fromSeed(`o${i}`), idx);
      picks.add((slots.find((s) => s.kind === 'milestone') as { eventId: string }).eventId);
    }
    expect([...picks].sort()).toEqual(['e1', 'e2']);
  });
});

describe('eligibleEvents', () => {
  it('excludes milestones, follow-up-only, seen, out-of-window and failing conditions', () => {
    const s = makeState();
    s.history = [{ eventId: 'e3', ageMonths: 1 }];
    expect(eligibleEvents(content, seg, s).map((e) => e.id).sort()).toEqual(['e1', 'e2']);
    const poor = makeState({ wealth: 'poor' });
    expect(eligibleEvents(content, seg, poor).map((e) => e.id)).toContain('poor_only');
  });

  it('drops events whose window has passed', () => {
    const s = makeState();
    s.character.ageMonths = 6;
    expect(eligibleEvents(content, { ...seg, ageMonths: [6, 12] }, s).map((e) => e.id)).toEqual(['late']);
  });
});

describe('takeNext', () => {
  it('draws weighted random events, never repeating, then the milestone', () => {
    const s = makeState();
    const rng = Rng.fromSeed('t');
    s.progress.slots = planSegment(seg, s, rng, idx);
    const seen: string[] = [];
    for (let pick = takeNext(content, idx, seg, s, rng); pick; pick = takeNext(content, idx, seg, s, rng)) {
      seen.push(pick.event.id);
      s.history.push({ eventId: pick.event.id, ageMonths: pick.age });
      s.character.ageMonths = pick.age;
    }
    expect(seen).toHaveLength(4);
    expect(new Set(seen).size).toBe(4);
    expect(seen).toContain('ms');
  });

  it('gives a due follow-up priority and lets it replace a random slot', () => {
    const s = makeState();
    const rng = Rng.fromSeed('f');
    s.progress.slots = [
      { kind: 'random', age: 3 },
      { kind: 'random', age: 4 },
    ];
    s.followUps = [{ eventId: 'fu', dueMonths: 2 }];
    const first = takeNext(content, idx, seg, s, rng)!;
    expect(first.event.id).toBe('fu');
    expect(first.age).toBe(2);
    expect(s.progress.slots).toHaveLength(1);
    expect(s.followUps).toHaveLength(0);
  });

  it('waits for a follow-up that is not due yet', () => {
    const s = makeState();
    s.progress.slots = [{ kind: 'random', age: 1 }];
    s.followUps = [{ eventId: 'fu', dueMonths: 20 }];
    expect(takeNext(content, idx, seg, s, Rng.fromSeed('w'))!.event.id).not.toBe('fu');
    expect(s.followUps).toHaveLength(1);
  });

  it('drops a follow-up whose conditions no longer hold', () => {
    const c2 = withEvents([...events.filter((e) => e.id !== 'fu'), ev('fu', { followUpOnly: true, conditions: { flag: 'x' } })]);
    const s = makeState();
    s.progress.slots = [];
    s.followUps = [{ eventId: 'fu', dueMonths: 1 }];
    expect(takeNext(c2, indexContent(c2), seg, s, Rng.fromSeed('d'))).toBeNull();
    expect(s.followUps).toHaveLength(0);
  });
});
