import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'veggies_in_rice',
  stage: 'infancy',
  title: 'Veggies in the rice',
  ageMonths: [6, 12],
  weight: 10,
  sensitivity: 'none',
  text: [
    'The spoon comes toward you again. Rice, soft and warm. But today something green is hiding in it, and you can smell it before it arrives.',
    { if: { wealth: ['poor'] }, then: '{Caregiver} grew these greens in a pot by the door and is proud of every leaf.' },
    { if: { wealth: ['rich'] }, then: 'The greens came from a little glass jar with a smiling baby on the label.' },
  ],
  choices: [
    {
      id: 'eat',
      text: 'Open your mouth',
      outcome: {
        text: 'It tastes like grass and rain. You chew slowly, thinking about it very hard.',
        effects: { traits: { curiosity: 1, confidence: -1 } },
        reaction: 'food_accepted',
      },
    },
    {
      id: 'refuse',
      text: 'No.',
      subChoices: [
        {
          id: 'cry',
          text: 'Cry',
          outcome: {
            text: 'Your face crumples before you decide it should. The spoon stops in the air.',
            effects: { stress: 1 },
            reaction: 'food_refused',
            followUp: { event: 'green_things_again', delayMonths: 8 },
          },
        },
        {
          id: 'push',
          text: 'Push the spoon away',
          outcome: {
            text: 'Your hand is small but very sure. The spoon swings, and a little rice lands on the floor.',
            effects: { traits: { confidence: 1, courage: 1, trust: -1 } },
            reaction: 'food_refused',
            followUp: { event: 'green_things_again', delayMonths: 8 },
          },
        },
        {
          id: 'spit',
          text: 'Spit it out',
          outcome: {
            text: 'It goes in. It comes back out, all of it, down your chin in a slow green line.',
            effects: { traits: { curiosity: 1, discipline: -1 } },
            reaction: 'food_refused',
            followUp: { event: 'green_things_again', delayMonths: 8 },
            variants: [
              {
                // Sensitive babies really do taste more: the refusal sticks.
                if: { temperament: ['sensitive'] },
                text: 'It goes in. It is too much: too bitter, too slimy, too green. It comes back out, and so do your tears.',
                effects: { traits: { curiosity: 1 }, stress: 1, setFlags: ['picky_eater'] },
              },
            ],
          },
        },
      ],
    },
  ],
});
