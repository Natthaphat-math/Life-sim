import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'market_day',
  stage: 'infancy',
  title: 'Going to work with {caregiver}',
  ageMonths: [24, 35],
  weight: 14,
  conditions: { any: [{ wealth: ['poor'] }, { env: ['market'] }] },
  sensitivity: 'none',
  text: [
    {
      if: { env: ['market'] },
      then: 'Before the sun is fully up, you are sitting on a crate at {caregiver}\'s stall. Onions, limes, a mountain of garlic. The whole market smells like breakfast.',
      else: 'Today you go to work with {caregiver}: a folding table by the road, a cooler of drinks, a stack of snacks {cg_he} packed at home last night.',
    },
    'The neighbours at the next table wave at you. You are the youngest worker here, and everyone knows it.',
    { if: { wealth: ['poor'] }, then: 'Money is tight at home, but here {caregiver} is quick and funny and sure. Here {cg_he} is the boss.' },
  ],
  choices: [
    {
      id: 'hand_items',
      text: 'Hand things to {caregiver}',
      outcome: {
        text: 'You pass limes, one at a time, very seriously. {Caregiver} counts them out loud and you count with {cg_him}, mostly wrong. "My little helper," {cg_he} tells a customer, and you sit up straighter.',
        effects: { traits: { discipline: 1, confidence: 1, creativity: -1 }, inclinations: { handsOnBusiness: 2, scienceMath: 1 }, setFlags: ['market_kid'] },
        variants: [
          {
            if: { parenting: ['strict'] },
            text: 'You pass limes, one at a time, exactly the way {caregiver} shows you. Stack, do not throw. Count, do not guess. By noon you are doing it right, and {caregiver} lets you give a customer their change.',
            effects: { traits: { discipline: 2, creativity: -1 }, inclinations: { handsOnBusiness: 2, scienceMath: 1 }, setFlags: ['market_kid'] },
          },
        ],
      },
    },
    {
      id: 'play_alone',
      text: 'Play under the table',
      outcome: {
        text: 'Under the table is a whole country. Bottle caps are the people, a crate is a castle, and the feet going by are giants. You play there all morning, talking to yourself.',
        effects: { traits: { creativity: 2, curiosity: 1, sociability: -1 }, inclinations: { artsLanguage: 1, handsOnBusiness: 1 }, setFlags: ['market_kid'] },
        variants: [
          {
            if: { parenting: ['neglectful'] },
            text: 'Under the table is a whole country. {Caregiver} is busy and does not check on you much, so you build it big: bottle-cap people, a crate castle, a war with the ants. By the end of the day you know every ant by name.',
            effects: { traits: { creativity: 2, courage: 1, trust: -1 }, inclinations: { artsLanguage: 1, handsOnBusiness: 1 }, setFlags: ['market_kid'] },
          },
        ],
      },
    },
    {
      id: 'greet',
      text: 'Say hello to the customers',
      outcome: {
        text: '"Hello!" you say to everyone. "HELLO!" Some laugh, some pinch your cheek, one lady buys twice as much garlic as she meant to. {Caregiver} winks at you like you are in on a secret together.',
        effects: { traits: { sociability: 2, confidence: 1, discipline: -1 }, inclinations: { handsOnBusiness: 2, peopleHelping: 1 }, setFlags: ['market_kid'] },
        variants: [
          {
            if: { temperament: ['slowToWarm'] },
            text: 'You try. It comes out as a whisper, and then you hide behind {caregiver}\'s leg. But the next customer gets a small wave, and the one after that gets a real "hello". {Caregiver} squeezes your shoulder every time.',
            effects: { traits: { sociability: 2, courage: 1, confidence: -1 }, inclinations: { handsOnBusiness: 1, peopleHelping: 1 }, setFlags: ['market_kid'] },
          },
        ],
      },
    },
  ],
});
