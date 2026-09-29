import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'relatives_visit',
  stage: 'infancy',
  title: 'Passed around',
  ageMonths: [1, 6],
  weight: 10,
  sensitivity: 'none',
  text: [
    'The house is full of voices. Aunties, uncles, cousins, a very old great-grandmother who smells of tiger balm. Everyone wants to hold you.',
    'You go from arms to arms to arms. Some are soft, some are bony, one smells of cigarettes and fried garlic.',
    { if: { siblings: ['older', 'both'] }, then: '{Older_sibling} follows you around the room announcing, "That is MY baby."' },
    { if: { wealth: ['poor'] }, then: 'Everyone brought something: a bag of oranges, a hand-knitted hat, a little envelope tucked under your blanket for luck.' },
  ],
  choices: [
    {
      id: 'smile',
      text: 'Stare at each new face',
      outcome: {
        text: 'Every face is a new world: moustaches, glasses, gold teeth. You stare so hard that people laugh, and when they laugh, you almost smile back.',
        effects: { traits: { sociability: 2, curiosity: 1, discipline: -1 } },
        variants: [
          {
            if: { temperament: ['slowToWarm', 'sensitive'] },
            text: 'Every face is a new world, and it is a lot of worlds. You stare and stare. By the end you are exhausted, but the old great-grandmother\'s face stays with you, the kindest map you have ever seen.',
            effects: { traits: { curiosity: 1, empathy: 1, sociability: -1 }, stress: 1 },
          },
        ],
      },
    },
    {
      id: 'cry_for_caregiver',
      text: 'Cry for {caregiver}',
      outcome: {
        text: 'None of these arms are the right arms. You cry until someone says "Give the baby back to {caregiver}."',
        effects: { traits: { sociability: -1, trust: 1 } },
        reaction: 'comfort_fear',
      },
    },
    {
      id: 'sleep',
      text: 'Fall asleep through all of it',
      outcome: {
        text: 'Somewhere around the fourth uncle, you give up and fall asleep. You sleep through photos, arguments about who you look like, and a very loud karaoke song. "Such an easy baby," everyone says.',
        effects: { traits: { trust: 1, curiosity: -1 }, stress: -1 },
      },
    },
  ],
});
