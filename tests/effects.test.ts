import { describe, expect, it } from 'vitest';
import { ageMultiplier, applyEffects, eventMultiplier, resolveOutcome, softCapped } from '../src/engine/effects';
import type { GameEvent, Outcome } from '../src/engine/types';
import { content, makeState } from './helpers';

const rules = content.rules;

describe('age multiplier', () => {
  it.each([
    [0, 3.0],
    [35, 3.0],
    [36, 2.5],
    [71, 2.5],
    [72, 1.5],
    [155, 1.5],
    [156, 1.0],
    [227, 1.0],
    [228, 0.4],
    [600, 0.4],
  ])('age %i months -> %f', (months, mult) => expect(ageMultiplier(months, rules)).toBe(mult));

  it('turning points override the age multiplier', () => {
    const ev = { turningPoint: { multiplier: 2 } } as GameEvent;
    expect(eventMultiplier(ev, 400, rules)).toBe(2);
    expect(eventMultiplier({} as GameEvent, 400, rules)).toBe(0.4);
  });
});

describe('applyEffects', () => {
  it('scales trait, stress and inclination deltas by the multiplier', () => {
    const s = makeState();
    applyEffects(s, { traits: { courage: 2, trust: -1 }, stress: 3, inclinations: { scienceMath: 1 } }, 3);
    expect(s.traits.courage).toBe(56);
    expect(s.traits.trust).toBe(47);
    expect(s.stress).toBe(29);
    expect(s.inclinations.scienceMath).toBe(3);
  });

  it('clamps to 0..100', () => {
    const s = makeState();
    applyEffects(s, { traits: { courage: 20 }, stress: -20 }, 5);
    expect(s.traits.courage).toBe(100);
    expect(s.stress).toBe(0);
  });

  it('clears flags before setting them, without duplicates', () => {
    const s = makeState();
    s.flags = ['a', 'b'];
    applyEffects(s, { clearFlags: ['a'], setFlags: ['b', 'c'] }, 1);
    expect(s.flags).toEqual(['b', 'c']);
  });

  it('soft cap slows moves toward the edges but not back to the default', () => {
    const r = { softCap: true, traitDefault: 50 };
    expect(softCapped(50, 6, r)).toBe(6);
    expect(softCapped(75, 6, r)).toBe(3);
    expect(softCapped(25, -6, r)).toBe(-3);
    expect(softCapped(75, -6, r)).toBe(-6);
    expect(softCapped(75, 6, { softCap: false, traitDefault: 50 })).toBe(6);
  });
});

describe('resolveOutcome', () => {
  const outcome: Outcome = {
    text: 'base',
    effects: { traits: { courage: 1 } },
    reaction: 'defiance',
    variants: [{ if: { wealth: ['poor'] }, text: 'poor text' }],
  };

  it('adds the caregiver reaction for the parenting style', () => {
    const strict = resolveOutcome(outcome, makeState({ parenting: 'strict' }), content);
    const warm = resolveOutcome(outcome, makeState({ parenting: 'warmBalanced' }), content);
    expect(strict.texts[0]).toBe('base');
    expect(strict.texts[1]).toBe(content.reactions.defiance!.strict.text);
    expect(warm.texts[1]).toBe(content.reactions.defiance!.warmBalanced.text);
    expect(strict.effects).toHaveLength(2);
  });

  it('first matching variant overrides only the fields it defines', () => {
    const r = resolveOutcome(outcome, makeState({ wealth: 'poor' }), content);
    expect(r.texts[0]).toBe('poor text');
    expect(r.effects[0]).toEqual({ traits: { courage: 1 } });
  });

  it('throws on an unknown reaction', () => {
    expect(() => resolveOutcome({ text: 'x', reaction: 'nope' }, makeState(), content)).toThrow(/nope/);
  });
});
