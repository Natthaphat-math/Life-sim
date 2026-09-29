/**
 * Stage 1 milestones. Placed by the stage segments (never drawn randomly).
 * Segment B picks one of first_step / first_word; the bridge mentions the other.
 */
import { defineEvent } from '../../../define';

export const firstSmile = defineEvent({
  id: 'first_smile',
  stage: 'infancy',
  title: 'First smile',
  ageMonths: [1, 3],
  weight: 0,
  milestone: true,
  sensitivity: 'none',
  text: [
    'A face comes close. It is making the silly noise again, the one with the lips.',
    'Something happens in your cheeks. It pulls. It spreads. You did not plan it.',
  ],
  choices: [
    {
      id: 'at_caregiver',
      text: 'Smile at {caregiver}',
      outcome: {
        text: '{Caregiver} gasps like you have given {cg_him} a present, then makes the silly noise again, and again, trying to make it happen twice.',
        effects: { traits: { trust: 1, sociability: 1, curiosity: -1 }, setFlags: ['first_smile'] },
        variants: [
          {
            if: { parenting: ['neglectful'] },
            text: '{Caregiver} is tired, so tired, but when {cg_he} sees your smile {cg_his} whole face changes. For a moment {cg_he} looks young. "Hey," {cg_he} whispers. "Hey, you."',
            effects: { traits: { trust: 2 }, setFlags: ['first_smile'] },
          },
        ],
      },
    },
    {
      id: 'at_fan',
      text: 'Smile at the ceiling fan',
      outcome: {
        text: 'Your first smile goes to the ceiling fan, turning and turning. Nobody minds. "Well, it IS a nice fan," {caregiver} says.',
        effects: { traits: { curiosity: 1, creativity: 1, sociability: -1 }, setFlags: ['first_smile'] },
      },
    },
    {
      id: 'at_sibling',
      text: 'Smile at {older_sibling}',
      showIf: { siblings: ['older', 'both'] },
      outcome: {
        text: '{Older_sibling} runs to tell everyone, shouting, "The baby likes ME best!" It is, for now, true.',
        effects: { traits: { sociability: 2, curiosity: -1 }, setFlags: ['first_smile', 'sibling_bond'] },
      },
    },
  ],
});

export const firstStep = defineEvent({
  id: 'first_step',
  stage: 'infancy',
  title: 'First step',
  ageMonths: [9, 12],
  weight: 0,
  milestone: true,
  sensitivity: 'none',
  text: [
    'You are standing, holding the edge of the low table. Your legs are wobbling but they are yours.',
    '{Caregiver} is crouched a few steps away, arms out.',
  ],
  choices: [
    {
      id: 'to_caregiver',
      text: 'Let go and step toward {caregiver}',
      outcome: {
        text: 'One step. Two. On the third you fall forward straight into {cg_his} arms, and {cg_he} laughs so loud the neighbours hear.',
        effects: { traits: { courage: 1, trust: 1, curiosity: -1 }, inclinations: { physicalSports: 1 }, setFlags: ['first_step'] },
      },
    },
    {
      id: 'to_door',
      text: 'Step toward the open door',
      outcome: {
        text: 'You turn away from the arms and toward the light of the open door. One step, two, three, toward the whole outside. {Caregiver} catches you at the step, half proud, half scared.',
        effects: { traits: { courage: 2, curiosity: 1, trust: -1 }, inclinations: { physicalSports: 1 }, setFlags: ['first_step'] },
      },
    },
    {
      id: 'sit_down',
      text: 'Sit down. Tomorrow.',
      outcome: {
        text: 'You think about it. You sit down, plop. Not today. Three days later you simply stand up and walk across the room as if you had always done it.',
        effects: { traits: { discipline: 1, confidence: 1, courage: -1 }, setFlags: ['first_step', 'careful_starter'] },
      },
    },
  ],
});

export const firstWord = defineEvent({
  id: 'first_word',
  stage: 'infancy',
  title: 'First word',
  ageMonths: [9, 12],
  weight: 0,
  milestone: true,
  sensitivity: 'none',
  text: 'Sounds have been living in your mouth for weeks: ba, da, ma, ga. Today one of them wants to come out as something real.',
  choices: [
    {
      id: 'caregiver_name',
      text: '"{Caregiver}!"',
      outcome: {
        text: '{Caregiver} freezes. "Say it again." You do. {Cg_he} calls everyone {cg_he} knows.',
        effects: { traits: { trust: 1, courage: -1 }, inclinations: { artsLanguage: 1 }, setFlags: ['first_word'] },
      },
    },
    {
      id: 'no',
      text: '"No!"',
      outcome: {
        text: 'Your first word is "no", said very clearly, to a spoon. Everyone laughs. You are not joking.',
        effects: { traits: { confidence: 2, empathy: -1 }, setFlags: ['first_word'] },
      },
    },
    {
      id: 'that',
      text: '"Dat!" (pointing)',
      outcome: {
        text: '"Dat!" You point at the bird. "Dat!" The lamp. "Dat!" Everything is a dat, and you want to know about all of them.',
        effects: { traits: { curiosity: 2, discipline: -1 }, inclinations: { scienceMath: 1 }, setFlags: ['first_word'] },
      },
    },
  ],
});

export const firstSentence = defineEvent({
  id: 'first_sentence',
  stage: 'infancy',
  title: 'First sentence',
  ageMonths: [18, 23],
  weight: 0,
  milestone: true,
  sensitivity: 'none',
  text: 'Words have been piling up inside you like blocks. Today, three of them stack.',
  choices: [
    {
      id: 'i_do_it',
      text: '"Me do it!"',
      outcome: {
        text: '"Me do it!" You take the spoon, the shoe, the door handle. You do it badly and completely by yourself.',
        effects: { traits: { confidence: 2, discipline: 1, trust: -1 }, setFlags: ['first_sentence'] },
      },
    },
    {
      id: 'where_caregiver',
      text: '"Where {caregiver} go?"',
      outcome: {
        text: '"Where {caregiver} go?" you ask the babysitter, the neighbour, the cat. {Caregiver} hears about it later and holds you a long time.',
        effects: { traits: { trust: 1, empathy: 1, courage: -1 }, inclinations: { peopleHelping: 1 }, setFlags: ['first_sentence'] },
      },
    },
    {
      id: 'look_bird',
      text: '"Look! Big bird sky!"',
      outcome: {
        text: '"Look! Big bird sky!" Everyone looks. It is a plane. Nobody corrects you. It is a big bird in the sky.',
        effects: { traits: { curiosity: 1, creativity: 1, discipline: -1 }, inclinations: { artsLanguage: 1 }, setFlags: ['first_sentence'] },
      },
    },
  ],
});

export const readyForSchool = defineEvent({
  id: 'ready_for_school',
  stage: 'infancy',
  title: 'Getting ready for school',
  ageMonths: [32, 35],
  weight: 0,
  milestone: true,
  sensitivity: 'none',
  text: [
    'There is a new bag with your name written inside it. Today {caregiver} takes you to see the kindergarten.',
    'It is loud and colourful. There is a sand pit, a row of tiny toilets, and a teacher with a whistle around her neck.',
    { if: { wealth: ['poor'] }, then: 'The bag was bought second-hand and scrubbed clean. {Caregiver} sewed your name on it in red thread.' },
    { if: { wealth: ['rich'] }, then: 'The school has a garden, a music room and a waiting list. {Caregiver} is more nervous than you are.' },
  ],
  choices: [
    {
      id: 'run_to_play',
      text: 'Run to the play corner',
      outcome: {
        text: 'You let go of {caregiver}\'s hand and go straight for the blocks. When it is time to leave, you are the one who does not want to go.',
        effects: { traits: { courage: 1, curiosity: 1, trust: -1 }, setFlags: ['school_eager'] },
      },
    },
    {
      id: 'hold_hand',
      text: 'Hold {caregiver}\'s hand tight',
      subChoices: [
        {
          id: 'hide',
          text: 'Hide behind {cg_his} legs',
          outcome: {
            text: 'You watch everything from behind {caregiver}\'s legs. By the end you have seen it all: the sand, the tiny toilets, the girl with the hat. Next time, maybe.',
            effects: { traits: { discipline: 1, trust: 1, courage: -1, sociability: -1 }, setFlags: ['school_hesitant'] },
            reaction: 'comfort_fear',
          },
        },
        {
          id: 'go_home',
          text: 'Ask to go home',
          outcome: {
            text: '"Home. Home now." {Caregiver} does not make you stay. On the way back, you ask about the sand pit four times.',
            effects: { traits: { trust: 1, curiosity: 1, courage: -1 }, setFlags: ['school_hesitant'] },
          },
        },
      ],
    },
    {
      id: 'talk_to_child',
      text: 'Say hi to another child',
      outcome: {
        text: 'There is a girl with a hat. You walk right up and show her your bag. She shows you her shoes, which light up. You are, instantly, friends.',
        effects: { traits: { sociability: 2, discipline: -1 }, inclinations: { peopleHelping: 1 }, setFlags: ['school_eager', 'first_friend'] },
      },
    },
  ],
});

export default [firstSmile, firstStep, firstWord, firstSentence, readyForSchool];
