import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'afraid_of_the_dark',
  stage: 'infancy',
  title: 'Afraid of the dark',
  ageMonths: [26, 35],
  weight: 10,
  sensitivity: 'mild',
  text: [
    'The light goes off. The room changes. The chair is a crouching animal now, and the shirt on the door has long arms.',
    { if: { not: { siblings: ['none'] } }, then: '{Sibling} is asleep in the same room, breathing slow.' },
    { if: { wealth: ['poor'] }, then: 'Everyone sleeps close in your house, on mats side by side, but right now it feels like the dark is closer.' },
  ],
  choices: [
    {
      id: 'call',
      text: 'Call for {caregiver}',
      outcome: {
        text: '"{Caregiver}!" Your voice is small in the big dark.',
        effects: { traits: { trust: 1, courage: -1 } },
        reaction: 'comfort_fear',
      },
    },
    {
      id: 'story',
      text: 'Make up a story about the shadow',
      outcome: {
        text: 'The shadow animal is not scary. It is a sleepy dog. It is called Mr. Chair. It is guarding you. By the time you have decided what it eats (noodles), you are asleep.',
        effects: { traits: { creativity: 2, sociability: -1 }, inclinations: { artsLanguage: 2 }, setFlags: ['night_storyteller'] },
      },
    },
    {
      id: 'blanket',
      text: 'Pull the blanket over your head',
      subChoices: [
        {
          id: 'hum',
          text: 'Hum a song under there',
          outcome: {
            text: 'Under the blanket, you hum the song {caregiver} sings. It sounds bigger in there. The dark cannot hear it, but you can.',
            effects: { traits: { courage: 1, sociability: -1 }, inclinations: { artsLanguage: 1 } },
          },
        },
        {
          id: 'count_sounds',
          text: 'Listen and count the sounds',
          outcome: {
            text: 'A fan. A dog far away. A car. A drip. You count them on your fingers, and somewhere after "a lot", you fall asleep.',
            effects: { traits: { curiosity: 1, discipline: 1, sociability: -1 }, inclinations: { scienceMath: 1 } },
          },
        },
      ],
    },
    {
      id: 'wake_sibling',
      text: 'Wake up {sibling}',
      showIf: { not: { siblings: ['none'] } },
      outcome: {
        text: 'You poke {sibling} until {sibling} groans and lifts the blanket. You crawl in. The dark is still there, but now it is outside, and you are inside, together.',
        effects: { traits: { sociability: 1, trust: 1, courage: -1 } },
      },
    },
  ],
  skip: {
    text: 'For a while you were afraid of the dark, the way small children are. It passed, mostly.',
    effects: { stress: 1 },
  },
});
