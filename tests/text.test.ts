import { describe, expect, it } from 'vitest';
import { renderText } from '../src/engine/text';
import { content, makeState } from './helpers';

describe('text rendering', () => {
  it('fills variables, including capitalised forms', () => {
    const s = makeState({ caregiver: 'singleFather', caregiverPerson: 'dad' });
    expect(renderText('{Caregiver} lifts {name}. {Cg_he} smiles at {him}.', s, content)).toBe('Dad lifts Alex. He smiles at her.');
  });

  it('resolves conditional fragments and joins with spaces', () => {
    const s = makeState({ wealth: 'poor', siblings: 'older', olderSibling: 'sister' });
    const text = renderText(
      ['A.', { if: { wealth: ['poor'] }, then: 'Poor.', else: 'Not poor.' }, { if: { wealth: ['rich'] }, then: 'Rich.' }, '{Sibling} waves.'],
      s,
      content,
    );
    expect(text).toBe('A. Poor. Your big sister waves.');
  });

  it('leaves unknown variables untouched', () => {
    expect(renderText('{nope}', makeState(), content)).toBe('{nope}');
  });
});
