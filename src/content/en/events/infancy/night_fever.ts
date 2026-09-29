import { defineEvent } from '../../../define';

/** Follow-up of middle_of_the_night for babies with fragile health. */
export default defineEvent({
  id: 'night_fever',
  stage: 'infancy',
  title: 'A hot night',
  ageMonths: [0, 12],
  weight: 0,
  followUpOnly: true,
  conditions: { health: ['fragile'] },
  sensitivity: 'moderate',
  text: 'This waking is different. Your skin is too hot, your head feels far away, and even crying takes more strength than you have.',
  choices: [
    {
      id: 'cry_weakly',
      text: 'Make a small, thin cry',
      outcome: {
        text: 'The sound is small, but it is enough.',
        effects: { stress: 2, setFlags: ['fever_night'] },
        variants: [
          {
            if: { parenting: ['neglectful'] },
            text: 'The sound is small. It takes {caregiver} a long while to hear it. When {cg_he} touches your forehead, {cg_his} face goes pale, and suddenly {cg_he} is wide awake, wrapping you up, whispering sorry, sorry, into your hair all the way to the clinic.',
            effects: { traits: { trust: -1 }, stress: 3, setFlags: ['fever_night'] },
          },
          {
            if: { parenting: ['strict'] },
            text: 'The sound is small, but {caregiver} hears it. {Cg_he} is calm and quick: a cool cloth, medicine measured exactly, a thermometer checked every hour until morning. {Cg_he} does not sleep at all.',
            effects: { traits: { trust: 2, courage: -1 }, stress: 1, setFlags: ['fever_night'] },
          },
          {
            if: { parenting: ['indulgent', 'warmBalanced'] },
            text: 'The sound is small, but {caregiver} hears it at once. Cool cloths, gentle medicine, and {cg_his} voice all night long, until the heat finally breaks near dawn and you both fall asleep on the floor.',
            effects: { traits: { trust: 2, courage: -1 }, stress: 1, setFlags: ['fever_night'] },
          },
          {
            if: { parenting: ['freeRange'] },
            text: 'The sound is small, and {caregiver} almost sleeps through it, but then {cg_he} is up, hand on your forehead. {Cg_he} does not panic. {Cg_he} does everything right, and stays by you until the fever breaks.',
            effects: { traits: { trust: 2 }, stress: 2, setFlags: ['fever_night'] },
          },
        ],
      },
    },
    {
      id: 'lie_still',
      text: 'Lie very still',
      outcome: {
        text: 'You lie still and wait for the hot to go away. In the morning {caregiver} finds you pink and damp and gasps, and the day becomes a day of clinics and medicine and being held.',
        effects: { traits: { courage: 1, trust: -1 }, stress: 3, setFlags: ['fever_night', 'learned_to_be_quiet'] },
      },
    },
  ],
  skip: {
    text: 'One night you had a fever. It was frightening for everyone. By the next day, it had broken.',
    effects: { stress: 1, setFlags: ['fever_night'] },
  },
});
