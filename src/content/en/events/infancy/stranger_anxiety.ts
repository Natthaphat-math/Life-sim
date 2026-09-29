import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'stranger_anxiety',
  stage: 'infancy',
  title: 'A stranger\'s arms',
  ageMonths: [7, 12],
  weight: 10,
  sensitivity: 'none',
  text: [
    'A woman leans in close, smiling with all her teeth. {Caregiver} says her name like you should know it. You do not know it.',
    'She holds out her arms for you.',
    { if: { wealth: ['rich'] }, then: 'She is the new nanny, and she has come to stay.' },
    { if: { caregiver: ['singleMother', 'singleFather'] }, then: 'She is going to watch you on the days {caregiver} works late.' },
  ],
  choices: [
    {
      id: 'cling',
      text: 'Hold on to {caregiver}',
      subChoices: [
        {
          id: 'bury_face',
          text: 'Bury your face',
          outcome: {
            text: 'You press your face into {caregiver}\'s shoulder so hard your nose flattens. If you cannot see her, maybe she is not there.',
            effects: { traits: { trust: 1, sociability: -1 } },
            reaction: 'comfort_fear',
          },
        },
        {
          id: 'scream',
          text: 'Scream',
          outcome: {
            text: 'You scream, a real scream, the kind that makes people in the next room look up. The woman steps back, hands up, still smiling, a little less.',
            effects: { traits: { courage: 1, sociability: -1 }, stress: 1 },
            reaction: 'comfort_fear',
          },
        },
      ],
    },
    {
      id: 'stare',
      text: 'Stare at her, very still',
      outcome: {
        text: 'You stare. She waits. Neither of you blinks. After a long time she makes a funny face with her cheeks puffed out, and something in you decides: maybe.',
        effects: { traits: { discipline: 1, sociability: 1, courage: -1 } },
      },
    },
    {
      id: 'reach',
      text: 'Reach for her earrings',
      outcome: {
        text: 'Her earrings are shiny and swinging. You lean toward them, and suddenly you are in her arms, and it is not so bad. She smells like soap.',
        effects: { traits: { courage: 1, curiosity: 1, trust: -1 } },
      },
    },
  ],
});
