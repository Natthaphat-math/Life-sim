import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'adults_arguing',
  stage: 'infancy',
  title: 'Loud voices',
  ageMonths: [12, 24],
  weight: 12,
  conditions: { parents: ['strained'] },
  sensitivity: 'mild',
  text: [
    {
      if: { caregiver: ['bothParents'] },
      then: 'Mom and Dad are in the kitchen. Their voices started out normal. Now they are not normal.',
      else: '{Caregiver} is on the phone in the kitchen, and the voice on the other end is loud enough to hear from here.',
    },
    'You do not know the words. You know the sound: tired, worried, stretched thin like a rubber band.',
    { if: { wealth: ['poor'] }, then: 'It is the end of the month. It is often like this at the end of the month.' },
    { if: { wealth: ['rich'] }, then: 'Someone is always working. Someone is always away. Tonight they are both here, and it is loud.' },
  ],
  choices: [
    {
      id: 'cover_ears',
      text: 'Cover your ears',
      outcome: {
        text: 'You press your hands over your ears. It makes the voices into ocean sounds. You stay very still until they stop.',
        effects: { traits: { discipline: 1, trust: -1 }, stress: 2, setFlags: ['heard_arguing'] },
        variants: [
          {
            if: { parenting: ['neglectful'] },
            text: 'You press your hands over your ears and stay still. No one comes to check. You get very good at being still.',
            effects: { traits: { discipline: 1, trust: -1 }, stress: 3, setFlags: ['heard_arguing', 'learned_to_be_quiet'] },
          },
        ],
      },
    },
    {
      id: 'doorway',
      text: 'Go and stand in the doorway',
      outcome: {
        text: 'You toddle to the doorway and stand there, holding the frame. The voices stop. Everyone looks at you. "Oh, sweetheart," someone says, in a completely different voice.',
        effects: { traits: { courage: 1, empathy: 1, discipline: -1 }, stress: 1, setFlags: ['heard_arguing'] },
        variants: [
          {
            if: { parenting: ['warmBalanced'] },
            text: 'You stand in the doorway, holding the frame. The voices stop. {Caregiver} comes and kneels down. "We were loud. Grown-ups get upset sometimes. It is not because of you." You do not understand all of it. You understand the kneeling.',
            effects: { traits: { courage: 1, empathy: 1, discipline: -1 }, setFlags: ['heard_arguing'] },
          },
        ],
      },
    },
    {
      id: 'bring_toy',
      text: 'Bring them your favourite toy',
      outcome: {
        text: 'You bring your best thing, the soft rabbit, and hold it up. It worked for you once. Maybe it will work for them. There is a surprised silence, and then a laugh that sounds a bit like crying.',
        effects: { traits: { empathy: 2, confidence: -1 }, inclinations: { peopleHelping: 1 }, stress: 1, setFlags: ['heard_arguing', 'little_peacemaker'] },
      },
    },
    {
      id: 'play_loud',
      text: 'Play louder',
      outcome: {
        text: 'You bang your blocks together, louder, louder, until your noise is bigger than their noise. It works, sort of.',
        effects: { traits: { courage: 1, creativity: 1, empathy: -1 }, stress: 1, setFlags: ['heard_arguing'] },
      },
    },
  ],
  skip: {
    text: 'Sometimes the grown-ups argued. They were tired and worried, and it was loud.',
    effects: { stress: 1, setFlags: ['heard_arguing'] },
  },
});
