import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'fall_from_bed',
  stage: 'infancy',
  title: 'The edge of the bed',
  ageMonths: [6, 12],
  weight: 9,
  sensitivity: 'mild',
  text: [
    'You are on the big bed. {Caregiver} has turned away for just one second, to fold something, to answer something.',
    'At the very edge of the bed is your rattle. It is so close.',
  ],
  choices: [
    {
      id: 'roll_for_it',
      text: 'Roll toward the rattle',
      outcome: {
        text: 'One roll. Two rolls. Then there is no more bed, only air, and then the floor comes up very fast. Thump. For a moment you are too surprised to cry. Then you are not.',
        effects: { traits: { courage: 1, curiosity: 1, trust: -1 }, stress: 2, setFlags: ['fell_from_bed'] },
        reaction: 'small_hurt',
        followUp: { event: 'sofa_again', delayMonths: 3 },
      },
    },
    {
      id: 'stay',
      text: 'Stay where you are',
      outcome: {
        text: 'You look at the rattle. You look at the edge. Something tells you to wait. When {caregiver} turns back, you are still there, and {cg_he} hands you the rattle, none the wiser.',
        effects: { traits: { discipline: 1, courage: -1 } },
      },
    },
    {
      id: 'call_out',
      text: 'Squawk at {caregiver}',
      outcome: {
        text: 'You make a loud, bossy noise and point. {Caregiver} turns around, sees the rattle, sees the edge, and moves you both to the middle.',
        effects: { traits: { confidence: 1, sociability: 1, courage: -1 } },
      },
    },
  ],
  skip: {
    text: 'Once, you rolled off the bed. It gave everyone a fright. You were fine.',
    effects: { stress: 1, setFlags: ['fell_from_bed'] },
  },
});
