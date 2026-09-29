import { defineEvent } from '../../../define';

const fever = { event: 'night_fever', delayMonths: 1 };

export default defineEvent({
  id: 'middle_of_the_night',
  stage: 'infancy',
  title: 'Middle of the night',
  ageMonths: [0, 6],
  weight: 12,
  sensitivity: 'mild',
  text: [
    'You wake up and everything is dark. Your tummy is empty and the room is too quiet.',
    { if: { siblings: ['older', 'both'] }, then: 'Somewhere nearby, {older_sibling} is breathing slowly in sleep.' },
    { if: { env: ['city'] }, then: 'Outside, a motorbike goes by and fades away.' },
    { if: { env: ['rural', 'farm'] }, then: 'Outside, the frogs are singing, but they do not know you are hungry.' },
  ],
  choices: [
    {
      id: 'cry_loud',
      text: 'Keep crying, louder',
      outcome: {
        text: 'You cry until your whole body is the cry. Your face is hot, your fists are tight, and the dark is very big.',
        effects: { traits: { confidence: 1, discipline: -1 } },
        reaction: 'cry_answered',
        variants: [{ if: { health: ['fragile'] }, followUp: fever }],
      },
    },
    {
      id: 'settle_alone',
      text: 'Find your fist and try to settle',
      outcome: {
        text: 'You find your fist, then your thumb. The crying gets smaller, and smaller, until it is only breathing.',
        effects: { traits: { discipline: 1, trust: -1 }, stress: 1 },
        reaction: 'quiet_settle',
        variants: [{ if: { health: ['fragile'] }, followUp: fever }],
      },
    },
  ],
  skip: {
    text: 'There were long nights in those first months, like there are for every baby. They passed.',
    effects: { stress: 1 },
  },
});
