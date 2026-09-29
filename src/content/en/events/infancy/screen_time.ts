import { defineEvent } from '../../../define';

export default defineEvent({
  id: 'screen_time',
  stage: 'infancy',
  title: 'The bright screen',
  ageMonths: [6, 12],
  weight: 9,
  sensitivity: 'none',
  text: [
    '{Caregiver} has to cook, and you will not stop fussing.',
    {
      if: { wealth: ['rich'] },
      then: '{Cg_he} props a tablet in front of you. Colours bloom across it, and a song you have heard many times begins.',
      else: '{Cg_he} turns on the TV, or hands you {cg_his} phone with the cracked corner. Colours jump and sing.',
    },
    { if: { parenting: ['neglectful'] }, then: 'It is not the first time today. It has been a long week.' },
  ],
  choices: [
    {
      id: 'watch',
      text: 'Watch the colours',
      subChoices: [
        {
          id: 'stare_quietly',
          text: 'Stare quietly',
          outcome: {
            text: 'The colours pour into you. The fussing stops. The song ends and begins again, and you do not notice time passing at all.',
            effects: { traits: { curiosity: 1, sociability: -1 }, stress: -1 },
            variants: [
              {
                if: { parenting: ['neglectful', 'indulgent'] },
                text: 'The colours pour into you. The fussing stops. The screen becomes a regular friend after this, the one who is always there.',
                effects: { traits: { curiosity: 1, sociability: -1, courage: -1 }, stress: -1, setFlags: ['screen_baby'] },
              },
            ],
          },
        },
        {
          id: 'tap',
          text: 'Tap it and see what happens',
          outcome: {
            text: 'You smack the screen. Something changes. You smack it again. Something else changes. You are, for the first time, making the world do things.',
            effects: { traits: { curiosity: 2, sociability: -1 }, inclinations: { scienceMath: 1 } },
          },
        },
      ],
    },
    {
      id: 'look_for_caregiver',
      text: 'Look past it for {caregiver}',
      outcome: {
        text: 'The screen is bright, but {caregiver} is brighter. You twist around to find {cg_him}, and {cg_he} laughs and pulls your chair into the kitchen, where you can watch the real show: onions, steam, a sizzling pan.',
        effects: { traits: { trust: 1, sociability: 1, courage: -1 } },
        variants: [
          {
            if: { parenting: ['strict', 'neglectful'] },
            text: 'The screen is bright, but you want {caregiver}. You twist and fuss. {Caregiver} sighs and carries you on one hip while {cg_he} cooks. It is slower. It is also nicer, and {cg_he} half-hums while {cg_he} stirs.',
            effects: { traits: { trust: 1, courage: 1, discipline: -1 } },
          },
        ],
      },
    },
    {
      id: 'crawl_off',
      text: 'Get bored and crawl off',
      outcome: {
        text: 'The song is fine, but the floor is more interesting. You slide off to find out what lives under the sofa.',
        reaction: 'exploring',
      },
    },
  ],
});
