import { describe, expect, it } from 'vitest';
import { validateContent } from '../src/engine/validate';
import type { GameEvent } from '../src/engine/types';
import { content, withEvents } from './helpers';

describe('content validator', () => {
  it('the shipped content has no errors', () => {
    expect(validateContent(content).errors).toEqual([]);
  });

  it('ships all 12 required stage-1 events', () => {
    const ids = content.events.map((e) => e.id);
    for (const id of [
      'veggies_in_rice', 'middle_of_the_night', 'saying_no', 'only_one_toy', 'market_day', 'relatives_visit',
      'stranger_anxiety', 'fall_from_bed', 'screen_time', 'vaccine_day', 'afraid_of_the_dark', 'adults_arguing',
    ]) expect(ids).toContain(id);
    expect(content.stubs.length).toBeGreaterThanOrEqual(40);
  });

  const base = content.events.find((e) => e.id === 'bath_time')!;
  const broken = (patch: Partial<GameEvent>) => validateContent(withEvents([...content.events, { ...base, id: 'broken', ...patch }])).errors;

  it('rejects a third choice tier', () => {
    const errs = broken({
      choices: [
        { id: 'a', text: 'a', outcome: { text: 'a' } },
        {
          id: 'b',
          text: 'b',
          subChoices: [
            { id: 'c', text: 'c', outcome: { text: 'c' }, subChoices: [] } as never,
            { id: 'd', text: 'd', outcome: { text: 'd' } },
          ],
        },
      ],
    });
    expect(errs.some((e) => e.includes('third choice tier') || e.includes('subChoices'))).toBe(true);
  });

  it('catches missing follow-ups, unknown reactions, unset flags and dead ends', () => {
    const errs = broken({
      conditions: { flag: 'never_set_anywhere' },
      choices: [
        { id: 'a', text: 'a', showIf: { trait: 'courage', min: 90 }, outcome: { text: 'a', followUp: { event: 'ghost' } } },
        { id: 'b', text: 'b', showIf: { trait: 'courage', max: 10 }, outcome: { text: 'b', reaction: 'ghost_reaction' } },
      ],
    });
    expect(errs.some((e) => e.includes('"ghost" does not exist'))).toBe(true);
    expect(errs.some((e) => e.includes('ghost_reaction'))).toBe(true);
    expect(errs.some((e) => e.includes('never_set_anywhere'))).toBe(true);
    expect(errs.some((e) => e.includes('dead end'))).toBe(true);
  });

  it('flags unknown text variables and duplicate ids', () => {
    const errs = validateContent(withEvents([...content.events, { ...base, text: 'Hi {nmae}' }])).errors;
    expect(errs.some((e) => e.includes('{nmae}'))).toBe(true);
    expect(errs.some((e) => e.includes('duplicate id'))).toBe(true);
  });
});
