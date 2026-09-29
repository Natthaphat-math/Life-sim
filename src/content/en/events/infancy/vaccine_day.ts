import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'vaccine_day',
  stage: 'infancy',
  title: 'Vaccine day',
  ageMonths: [2, 6],
  weight: 10,
  sensitivity: 'mild',
  text: [
    'The clinic smells of alcohol and floor cleaner. There are posters of smiling teeth and a lot of other babies, some of them crying.',
    '{Caregiver} holds your leg still. The nurse says "just a little pinch" in a sing-song voice.',
    { if: { wealth: ['poor'] }, then: 'You waited two hours on a plastic bench for this, and {caregiver} sang to you the whole time.' },
  ],
  choices: [
    {
      id: 'scream',
      text: 'Scream with everything you have',
      outcome: {
        text: 'It is not a little pinch. You tell everyone so, at the top of your lungs, until you are hiccupping.',
        effects: { traits: { confidence: 1 }, stress: 1 },
        reaction: 'comfort_fear',
      },
    },
    {
      id: 'silent_red',
      text: 'Go red and silent',
      outcome: {
        text: 'Your mouth opens wide, but no sound comes out. Your face goes red, then redder. Then the cry arrives all at once, late, like thunder after lightning.',
        effects: { stress: 2 },
        reaction: 'comfort_fear',
      },
    },
    {
      id: 'stare_at_nurse',
      text: 'Stare at the nurse\'s earrings',
      outcome: {
        text: 'The nurse has little silver fish in her ears. You are watching them swim when the pinch comes, and you cry a short, surprised cry, and then you are back to the fish.',
        effects: { traits: { curiosity: 2, courage: 1, sociability: -1 } },
      },
    },
  ],
  skip: {
    text: 'You had your vaccines, like every baby does. There were tears, and then there was milk.',
    effects: { stress: 1 },
  },
});
