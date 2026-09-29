import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'saying_no',
  stage: 'infancy',
  title: 'Saying "no!"',
  ageMonths: [15, 24],
  weight: 12,
  sensitivity: 'none',
  text: [
    '{Caregiver} holds up a shirt with a duck on it. Yesterday you loved the duck.',
    'Today you have found a new word, and the word is enormous. The word is: no.',
    {
      if: { all: [{ wealth: ['poor'] }, { siblings: ['older', 'both'] }] },
      then: 'It used to be the shirt of {older_sibling}, soft from a hundred washes.',
    },
  ],
  choices: [
    {
      id: 'refuse',
      text: 'Say it. "No!"',
      subChoices: [
        {
          id: 'run',
          text: 'Shout it and run',
          outcome: {
            text: '"NO!" You are off, bare-bellied, across the room, laughing and furious at the same time.',
            effects: { traits: { courage: 1, confidence: 1, discipline: -1 }, inclinations: { physicalSports: 1 } },
            reaction: 'defiance',
          },
        },
        {
          id: 'go_stiff',
          text: 'Go stiff as a plank',
          outcome: {
            text: 'You lock your arms by your sides and make yourself heavy and hard. The shirt cannot go on a plank.',
            effects: { traits: { confidence: 1, discipline: 1, sociability: -1 } },
            reaction: 'defiance',
          },
        },
      ],
    },
    {
      id: 'comply',
      text: 'Lift your arms up',
      outcome: {
        text: 'You think about the word. You hold it in your mouth. Then you lift your arms, and the duck goes over your head.',
        effects: { traits: { discipline: 1, empathy: 1, confidence: -1 } },
        reaction: 'complied',
      },
    },
  ],
});
