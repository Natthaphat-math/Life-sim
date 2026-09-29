import type { Condition } from '../../../../engine/types';
import { defineEvent } from '../../../define';

const hasSibling: Condition = { not: { siblings: ['none'] } };

export default defineEvent({
  id: 'only_one_toy',
  stage: 'infancy',
  title: 'Only one toy',
  ageMonths: [24, 35],
  weight: 12,
  sensitivity: 'none',
  text: [
    { if: hasSibling, then: 'There is only one red truck in the house, and right now {sibling} has it.', else: 'There is only one red truck at the playground, and right now another child has it.' },
    'It was yours a second ago. You only put it down for a moment.',
    { if: { wealth: ['poor'] }, then: '{Caregiver} made the truck from a milk carton and bottle caps. There is no other one like it anywhere.' },
  ],
  choices: [
    {
      id: 'grab_back',
      text: 'Grab it back',
      outcome: {
        text: 'You pull. They pull. The truck is stronger than both of you, and someone starts to cry.',
        effects: { traits: { courage: 1, confidence: 1, empathy: -1 } },
        reaction: 'conflict_toy',
      },
    },
    {
      id: 'let_go',
      text: 'Let it go',
      subChoices: [
        {
          id: 'find_another',
          text: 'Find something else to play with',
          outcome: {
            text: 'You find a spoon and a box. The spoon becomes a person. The box becomes a house. The truck is not invited.',
            effects: { traits: { creativity: 2, sociability: -1 }, inclinations: { artsLanguage: 1 } },
          },
        },
        {
          id: 'sad_watch',
          text: 'Sit down and watch, sadly',
          outcome: {
            text: 'You sit down and watch the truck go round and round without you. Your lip wobbles, but you stay put.',
            effects: { traits: { discipline: 1, confidence: -1 }, stress: 1 },
            variants: [
              {
                if: { parenting: ['warmBalanced', 'indulgent'] },
                text: 'You sit down and watch the truck go round without you. {Caregiver} sits down next to you. "That is hard, huh?" It is. It is a little less hard now.',
                effects: { traits: { discipline: 1, trust: 1 } },
              },
            ],
          },
        },
      ],
    },
    {
      id: 'offer_share',
      text: 'Offer to take turns',
      showIf: { trait: 'empathy', min: 58 },
      outcome: {
        text: '"You go, then me?" The words come out a bit wrong, but the other face understands. You wait. It is the longest wait in the world. Then the truck comes back.',
        effects: { traits: { empathy: 2, sociability: 2, confidence: -1 }, inclinations: { peopleHelping: 1 }, setFlags: ['shares_easily'] },
        reaction: 'shared_well',
      },
    },
  ],
});
