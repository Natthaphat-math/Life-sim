import type { StageDef } from '../../../engine/types';

/**
 * Stage 1: birth to age 3. Four segments; each draws random events and
 * places one milestone. Bridges are the short summaries between segments.
 */
export const infancy: StageDef = {
  id: 'infancy',
  title: 'The first three years',
  endCard: { title: 'Three years old' },
  segments: [
    {
      id: 'A',
      ageMonths: [0, 6],
      draws: [3, 3],
      milestone: 'first_smile',
      bridge: {
        text: [
          'The first months go by in a blur of milk and sleep and faces.',
          { if: { trait: 'trust', min: 58 }, then: 'You learn that when you call, someone comes.' },
          { if: { trait: 'trust', max: 42 }, then: 'You learn to wait, and to watch the door.' },
          { if: { temperament: ['active'] }, then: 'You are always moving, even in your sleep.' },
          { if: { wealth: ['poor'] }, then: 'Money is short, but the house is never quiet, and there is always someone to hold you.' },
          'You grow heavier and stronger and louder.',
        ],
      },
    },
    {
      id: 'B',
      ageMonths: [6, 12],
      draws: [3, 4],
      // One of the two, at random; the bridge mentions the other.
      milestone: { oneOf: ['first_step', 'first_word'] },
      bridge: {
        text: [
          { if: { flag: 'first_step' }, then: 'Not long after your first steps, your first real word arrives too.', else: 'Not long after your first word, your legs figure out walking too.' },
          'Your first birthday comes with a small cake and a lot of photos.',
          { if: { wealth: ['poor'] }, then: 'The cake is homemade and a little lopsided. Everyone agrees it is the best cake.' },
          { if: { wealth: ['rich'] }, then: 'There are balloons and more guests than you can count.' },
          { if: { caregiver: ['grandparents'] }, then: '{Caregiver} tells everyone you have your grandfather\'s ears.' },
        ],
        effects: { setFlags: ['first_step', 'first_word'] },
      },
    },
    {
      id: 'C',
      ageMonths: [12, 24],
      draws: [3, 3],
      milestone: 'first_sentence',
      bridge: {
        text: [
          'The second year is all running and falling and getting up again.',
          { if: { trait: 'curiosity', min: 58 }, then: 'You open every cupboard and ask what everything is.' },
          { if: { trait: 'discipline', min: 58 }, then: 'You like things in their places, and you notice when they are not.' },
          { if: { trait: 'sociability', min: 58 }, then: 'You wave at every stranger in the street.' },
          { if: { siblings: ['younger', 'both'] }, then: 'Then {younger_sibling} arrives, tiny and red and loud, and the house rearranges itself around the new baby.' },
          'You turn two.',
        ],
      },
    },
    {
      id: 'D',
      ageMonths: [24, 36],
      draws: [3, 3],
      milestone: 'ready_for_school',
      bridge: {
        text: [
          'Your third birthday arrives. You hold up three fingers, mostly correctly.',
          { if: { flag: 'school_eager' }, then: 'Your new school bag waits by the door. You check on it every morning.' },
          { if: { flag: 'school_hesitant' }, then: 'Your new school bag waits by the door. You are not ready to look at it yet, and that is okay.' },
        ],
      },
    },
  ],
};
