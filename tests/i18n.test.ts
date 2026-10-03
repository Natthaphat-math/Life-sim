import { describe, expect, it } from 'vitest';
import { contents, missingTranslations } from '../src/content';
import { Game } from '../src/engine/game';
import { localize } from '../src/engine/i18n';
import { Rng } from '../src/engine/rng';
import { validateContent } from '../src/engine/validate';
import { thPack } from '../src/content/th';

const locales = Object.values(contents);

/** Strip every text field, leaving only the game logic. */
function logicOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(logicOf);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !['text', 'title', 'hint', 'then', 'else'].includes(k))
        .map(([k, v]) => [k, logicOf(v)]),
    );
  }
  return value;
}

function play(locale: 'th' | 'en', seed: string) {
  const g = Game.create(contents[locale], { name: 'มะลิ', seed, locales });
  const pick = Rng.fromSeed(`${seed}-c`);
  while (g.state.phase.kind !== 'stageEnd') {
    if (g.state.phase.kind === 'event') g.choose(pick.pick(g.visibleChoices().filter((c) => !c.locked)).id);
    else g.advance();
  }
  return g;
}

describe('languages', () => {
  it('Thai is complete and valid', () => {
    expect(missingTranslations.th).toEqual([]);
    expect(validateContent(contents.th).errors).toEqual([]);
  });

  it('every language shares exactly the same game logic', () => {
    expect(logicOf(contents.th.events)).toEqual(logicOf(contents.en.events));
    expect(logicOf(contents.th.reactions)).toEqual(logicOf(contents.en.reactions));
    expect(logicOf(contents.th.stages)).toEqual(logicOf(contents.en.stages));
  });

  it('the same seed and choices give the same life in either language', () => {
    const th = play('th', 'lang');
    const en = play('en', 'lang');
    expect(th.state).toEqual(en.state);
  });

  it('stores seen text in every language, so switching mid-life works', () => {
    const g = Game.create(contents.th, { name: 'Mali', seed: 'switch', locales });
    g.advance();
    g.choose(g.visibleChoices()[0]!.id);
    const p = g.state.phase;
    if (p.kind !== 'outcome') throw new Error('expected outcome');
    expect(Object.keys(p.texts).sort()).toEqual(['en', 'th']);
    expect(p.texts.th).not.toEqual(p.texts.en);
    expect(g.storedText(p.texts)).toBe(p.texts.th);
    expect(g.withContent(contents.en).storedText(p.texts)).toBe(p.texts.en);
    // Live screens re-render in the new language.
    const en = g.withContent(contents.en);
    expect(en.render(en.currentEvent!.title)).toBe(contents.en.events.find((e) => e.id === p.eventId)!.title);
  });

  it('reports missing translations and falls back to English', () => {
    const { veggies_in_rice: _drop, ...rest } = thPack.events;
    const res = localize(contents.en, { ...thPack, events: rest });
    expect(res.missing).toContain('events.veggies_in_rice');
    expect(res.content.events.find((e) => e.id === 'veggies_in_rice')!.title).toBe('Veggies in the rice');
  });
});
