import { describe, expect, it } from 'vitest';
import { evaluate, flagsReadBy } from '../src/engine/conditions';
import { makeState } from './helpers';

describe('condition evaluation', () => {
  const s = makeState({ wealth: 'poor', parenting: 'strict', siblings: 'older' });
  s.traits.empathy = 70;
  s.flags = ['picky_eater'];
  s.history = [{ eventId: 'bath_time', ageMonths: 3 }];

  it('undefined is always true', () => expect(evaluate(undefined, s)).toBe(true));

  it('matches birth circumstances', () => {
    expect(evaluate({ wealth: ['poor'] }, s)).toBe(true);
    expect(evaluate({ wealth: ['rich', 'middle'] }, s)).toBe(false);
    expect(evaluate({ parenting: ['strict'] }, s)).toBe(true);
    expect(evaluate({ siblings: ['older', 'both'] }, s)).toBe(true);
    expect(evaluate({ gender: ['girl'] }, s)).toBe(true);
  });

  it('checks inclusive trait ranges with open bounds', () => {
    expect(evaluate({ trait: 'empathy', min: 70 }, s)).toBe(true);
    expect(evaluate({ trait: 'empathy', min: 71 }, s)).toBe(false);
    expect(evaluate({ trait: 'empathy', max: 70 }, s)).toBe(true);
    expect(evaluate({ trait: 'courage', min: 40, max: 60 }, s)).toBe(true);
    expect(evaluate({ stress: { max: 10 } }, s)).toBe(false);
  });

  it('checks flags and history', () => {
    expect(evaluate({ flag: 'picky_eater' }, s)).toBe(true);
    expect(evaluate({ flag: 'fell_from_bed' }, s)).toBe(false);
    expect(evaluate({ seen: 'bath_time' }, s)).toBe(true);
  });

  it('composes all / any / not', () => {
    expect(evaluate({ all: [{ wealth: ['poor'] }, { flag: 'picky_eater' }] }, s)).toBe(true);
    expect(evaluate({ all: [{ wealth: ['poor'] }, { flag: 'nope' }] }, s)).toBe(false);
    expect(evaluate({ any: [{ wealth: ['rich'] }, { flag: 'picky_eater' }] }, s)).toBe(true);
    expect(evaluate({ not: { any: [{ wealth: ['rich'] }, { env: ['farm'] }] } }, s)).toBe(true);
  });

  it('lists the flags a condition reads', () => {
    const flags = flagsReadBy({ all: [{ flag: 'a' }, { not: { any: [{ flag: 'b' }, { wealth: ['poor'] }] } }] });
    expect([...flags].sort()).toEqual(['a', 'b']);
  });
});
