import { describe, expect, it } from 'vitest';
import { Game, shouldWarn } from '../src/engine/game';
import { Rng } from '../src/engine/rng';
import { content } from './helpers';

/** Play a whole stage with choices from a seeded RNG; returns the history. */
function playThrough(seed: string) {
  const g = Game.create(content, { name: 'Sam', seed });
  const pick = Rng.fromSeed(`${seed}-choices`);
  let steps = 0;
  while (g.state.phase.kind !== 'stageEnd') {
    if (++steps > 300) throw new Error('did not finish');
    if (g.state.phase.kind === 'event') {
      const opts = g.visibleChoices().filter((c) => !c.locked);
      g.choose(pick.pick(opts).id);
    } else g.advance();
  }
  return g;
}

describe('Game', () => {
  it('creates a life from a seed reproducibly', () => {
    const a = Game.create(content, { name: 'A', seed: 'same' }).state;
    const b = Game.create(content, { name: 'A', seed: 'same' }).state;
    expect(a).toEqual(b);
    expect(a.phase.kind).toBe('birth');
    expect(Game.create(content, { name: 'A', seed: 'other' }).state.birth).not.toEqual(a.birth);
  });

  it('plays birth to age 3 with 14–20 events, milestones included', () => {
    const g = playThrough('full');
    const ids = g.state.history.map((h) => h.eventId);
    expect(ids.length).toBeGreaterThanOrEqual(14);
    expect(ids.length).toBeLessThanOrEqual(20);
    for (const m of ['first_smile', 'first_sentence', 'ready_for_school']) expect(ids).toContain(m);
    expect(ids.some((i) => i === 'first_step' || i === 'first_word')).toBe(true);
    expect(g.state.character.ageMonths).toBe(36);
    // Ages never go backwards.
    const ages = g.state.history.map((h) => h.ageMonths);
    expect(ages).toEqual([...ages].sort((x, y) => x - y));
  });

  it('is fully deterministic for the same seed and choices', () => {
    expect(playThrough('det').state).toEqual(playThrough('det').state);
  });

  it('handles two-tier choices: tier 1 is recorded, the sub-choice resolves', () => {
    const g = Game.create(content, { name: 'T', seed: 'tier' });
    g.state.phase = { kind: 'event', eventId: 'veggies_in_rice', gatePassed: true };
    g.state.character.ageMonths = 8;
    g.choose('refuse');
    expect(g.state.phase).toMatchObject({ kind: 'event', tier1: 'refuse' });
    expect(g.visibleChoices().map((c) => c.id)).toEqual(['cry', 'push', 'spit']);
    g.choose('spit');
    expect(g.state.phase.kind).toBe('outcome');
    expect(g.state.history.at(-1)).toMatchObject({ eventId: 'veggies_in_rice', choiceId: 'refuse', subChoiceId: 'spit' });
    expect(g.state.followUps).toEqual([{ eventId: 'green_things_again', dueMonths: 16 }]);
  });

  it('hides options whose showIf fails and rejects them', () => {
    const g = Game.create(content, { name: 'T', seed: 'share' });
    g.state.phase = { kind: 'event', eventId: 'only_one_toy', gatePassed: true };
    g.state.traits.empathy = 40;
    expect(g.visibleChoices().map((c) => c.id)).not.toContain('offer_share');
    expect(() => g.choose('offer_share')).toThrow();
    g.state.traits.empathy = 70;
    expect(g.visibleChoices().map((c) => c.id)).toContain('offer_share');
  });

  it('skipping applies the skip summary and effects', () => {
    const g = Game.create(content, { name: 'S', seed: 'skip' });
    g.state.phase = { kind: 'event', eventId: 'fall_from_bed', gatePassed: false };
    g.state.character.ageMonths = 8;
    const stress = g.state.stress;
    g.skipEvent();
    expect(g.state.phase).toMatchObject({ kind: 'outcome', skipped: true });
    expect(g.state.flags).toContain('fell_from_bed');
    expect(g.state.stress).toBeCloseTo(Math.min(100, stress + 3));
    expect(g.state.history.at(-1)).toMatchObject({ skipped: true });
  });

  it('warns according to the setting', () => {
    expect(shouldWarn('mild', 'every')).toBe(true);
    expect(shouldWarn('none', 'every')).toBe(false);
    expect(shouldWarn('moderate', 'heavyOnly')).toBe(false);
    expect(shouldWarn('heavy', 'heavyOnly')).toBe(true);
    expect(shouldWarn('heavy', 'never')).toBe(false);
  });

  it('neglectful night crying sets learned_to_be_quiet and raises stress', () => {
    const g = Game.create(content, {
      name: 'N',
      seed: 'n',
      birth: { ...Game.create(content, { name: 'x', seed: 'n' }).state.birth, parenting: 'neglectful', health: 'good' },
    });
    g.state.phase = { kind: 'event', eventId: 'middle_of_the_night', gatePassed: true };
    const before = g.state.stress;
    g.choose('cry_loud');
    expect(g.state.flags).toContain('learned_to_be_quiet');
    expect(g.state.stress).toBeGreaterThan(before);
  });
});
