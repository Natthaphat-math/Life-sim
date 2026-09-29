/**
 * Additional starter events that keep each segment's pool large enough for
 * 3–4 random draws, plus the follow-ups referenced by the core events.
 */
import { defineEvent } from '../../../define';

// --- Segment A: 0–6 months -------------------------------------------------

export const bathTime = defineEvent({
  id: 'bath_time',
  stage: 'infancy',
  title: 'Bath time',
  ageMonths: [0, 6],
  weight: 9,
  sensitivity: 'none',
  text: [
    {
      if: { wealth: ['poor'] },
      then: 'The bath is a big plastic basin in the yard, warmed in the sun all afternoon.',
      else: 'The bath is a little tub with a sloped back, and the water is exactly warm.',
    },
    '{Caregiver} lowers you in, one hand under your head.',
  ],
  choices: [
    {
      id: 'kick',
      text: 'Kick and splash',
      outcome: {
        text: 'Your legs discover the water. Kick! Splash! {Caregiver} is soaked to the elbows and laughing.',
        effects: { traits: { curiosity: 1, courage: 1, discipline: -1 }, inclinations: { physicalSports: 1 } },
      },
    },
    {
      id: 'cry_cold',
      text: 'Cry at the strangeness',
      outcome: {
        text: 'The water is too much, everywhere at once. You cry, a thin shocked cry.',
        reaction: 'comfort_fear',
      },
    },
    {
      id: 'float',
      text: 'Go still and float',
      outcome: {
        text: 'You go still. The water holds you, and {caregiver} holds you, and for a while you are only floating, eyes wide.',
        effects: { traits: { trust: 1, curiosity: -1 }, stress: -1 },
      },
    },
  ],
});

export const tummyTime = defineEvent({
  id: 'tummy_time',
  stage: 'infancy',
  title: 'Tummy time',
  ageMonths: [2, 6],
  weight: 8,
  sensitivity: 'none',
  text: 'You are on your tummy on a blanket. The floor is right there in your face. Your head is very heavy.',
  choices: [
    {
      id: 'lift_head',
      text: 'Push up and lift your head',
      outcome: {
        text: 'You push, and push, and your head comes up, wobbling. The whole room appears. Then you face-plant, satisfied.',
        effects: { traits: { courage: 1, discipline: 1, sociability: -1 }, inclinations: { physicalSports: 1 } },
      },
    },
    {
      id: 'roll',
      text: 'Rock until something happens',
      outcome: {
        text: 'You rock left, rock right, and suddenly you are on your back looking at the ceiling. How did that happen? You want to do it again.',
        reaction: 'exploring',
      },
    },
    {
      id: 'protest',
      text: 'Complain loudly',
      outcome: {
        text: 'You complain into the blanket until someone turns you over. You were very clear about it.',
        effects: { traits: { confidence: 1, trust: -1 } },
        reaction: 'cry_answered',
      },
    },
  ],
});

// --- Segment B: 6–12 months ------------------------------------------------

export const peekaboo = defineEvent({
  id: 'peekaboo',
  stage: 'infancy',
  title: 'Peekaboo',
  ageMonths: [6, 12],
  weight: 8,
  sensitivity: 'none',
  text: '{Caregiver}\'s face disappears behind a cloth. It is gone. It is really gone.',
  choices: [
    {
      id: 'wait_laugh',
      text: 'Wait for it',
      outcome: {
        text: '"Boo!" It comes back! You laugh so hard you fall over. Again. Again. Again.',
        effects: { traits: { trust: 1, sociability: 1, curiosity: -1 } },
      },
    },
    {
      id: 'pull_cloth',
      text: 'Pull the cloth away yourself',
      outcome: {
        text: 'You grab the cloth and pull. There is the face, surprised. You have solved it. Now you hide behind the cloth, and it is {caregiver}\'s turn to find you.',
        effects: { traits: { curiosity: 1, creativity: 1, trust: -1 } },
      },
    },
    {
      id: 'worry',
      text: 'Start to worry',
      outcome: {
        text: 'Your lip goes out. Where did it go? "Boo!" It is back, but you are not laughing yet. You hold on to {caregiver}\'s sleeve for a while, just in case.',
        effects: { traits: { empathy: 1, courage: -1 }, stress: 1 },
        reaction: 'comfort_fear',
      },
    },
  ],
});

export const teething = defineEvent({
  id: 'teething',
  stage: 'infancy',
  title: 'Teeth coming',
  ageMonths: [6, 12],
  weight: 8,
  sensitivity: 'none',
  text: 'Something is pushing up through your gums. Everything aches, and everything must be bitten.',
  choices: [
    {
      id: 'chew_finger',
      text: 'Chew {caregiver}\'s finger',
      outcome: {
        text: 'You bite down on {caregiver}\'s knuckle. "Ow! Okay. Okay, that is fine." {Cg_he} lets you, for a while.',
        effects: { traits: { trust: 1, discipline: -1 } },
      },
    },
    {
      id: 'chew_anything',
      text: 'Chew anything you can find',
      outcome: {
        text: 'The corner of a book. A shoe. A wooden spoon. The table. You conduct a thorough survey of how things taste.',
        reaction: 'exploring',
      },
    },
    {
      id: 'wail',
      text: 'Wail all night',
      outcome: {
        text: 'Nothing helps, so you tell the world about it, all night long.',
        effects: { stress: 1 },
        reaction: 'cry_answered',
      },
    },
  ],
});

export const sofaAgain = defineEvent({
  id: 'sofa_again',
  stage: 'infancy',
  title: 'The sofa, again',
  ageMonths: [9, 18],
  weight: 0,
  followUpOnly: true,
  conditions: { flag: 'fell_from_bed' },
  sensitivity: 'none',
  text: 'You want to get down from the sofa. Down is far. You remember the last time you went down too fast.',
  choices: [
    {
      id: 'backwards',
      text: 'Slide down backwards, feet first',
      outcome: {
        text: 'Tummy on the cushion, feet first, slow, slow, then floor. You did it. You will do it this way for years.',
        effects: { traits: { discipline: 2, courage: -1 }, setFlags: ['careful_climber'] },
      },
    },
    {
      id: 'just_go',
      text: 'Just go for it',
      outcome: {
        text: 'You go head first again, and this time your hands are ready. Thump, but a smaller thump. You get up grinning.',
        effects: { traits: { courage: 2, discipline: -1 }, inclinations: { physicalSports: 1 } },
      },
    },
    {
      id: 'ask_help',
      text: 'Hold your arms out for help',
      outcome: {
        text: 'You hold your arms out and make the "up" noise, which is also the "down" noise. {Caregiver} lifts you down.',
        effects: { traits: { trust: 1, sociability: 1, confidence: -1 } },
      },
    },
  ],
});

// --- Segment C: 1–2 years --------------------------------------------------

export const bigPuddle = defineEvent({
  id: 'big_puddle',
  stage: 'infancy',
  title: 'The big puddle',
  ageMonths: [13, 24],
  weight: 9,
  sensitivity: 'none',
  text: [
    'It rained all night. Now there is a puddle on the path, and it is the biggest puddle there has ever been.',
    { if: { env: ['farm', 'rural'] }, then: 'It is brown and deep, and a frog is sitting at its edge.' },
    { if: { env: ['city'] }, then: 'It has a rainbow in it from the motorbike oil.' },
  ],
  choices: [
    {
      id: 'jump',
      text: 'Jump in',
      outcome: {
        text: 'SPLASH. Water goes up, and then down, all over you. It is the best thing that has ever happened.',
        effects: { traits: { courage: 1, confidence: 1, discipline: -1 }, inclinations: { physicalSports: 1 } },
        reaction: 'mess_made',
      },
    },
    {
      id: 'poke',
      text: 'Squat down and poke it',
      outcome: {
        text: 'You squat and poke it with a stick. Circles go out. You poke it again. Circles. You could do this forever.',
        effects: { traits: { curiosity: 2, sociability: -1 }, inclinations: { scienceMath: 1 } },
      },
    },
    {
      id: 'go_around',
      text: 'Hold hands and go around',
      outcome: {
        text: 'You hold {caregiver}\'s hand and step around it, carefully, looking back at it the whole time.',
        effects: { traits: { discipline: 1, trust: 1, curiosity: -1 } },
      },
    },
  ],
});

export const bedtimeStory = defineEvent({
  id: 'bedtime_story',
  stage: 'infancy',
  title: 'The bedtime story',
  ageMonths: [12, 24],
  weight: 9,
  sensitivity: 'none',
  text: [
    {
      if: { wealth: ['poor'] },
      then: 'There are not many books in your house, so {caregiver} tells stories instead: about when {cg_he} was little, about the river, about a clever monkey who tricked a crocodile.',
      else: '{Caregiver} reads to you from a book with thick cardboard pages, chewed at one corner.',
    },
  ],
  choices: [
    {
      id: 'point',
      text: 'Point at everything',
      outcome: {
        text: '"Dat? Dat?" You want the name of every single thing. The story takes an hour. Nobody minds.',
        effects: { traits: { curiosity: 1, discipline: -1 }, inclinations: { artsLanguage: 1, scienceMath: 1 } },
      },
    },
    {
      id: 'again',
      text: 'Ask for the same one again',
      outcome: {
        text: '"Again." And again. You know the words before they come, and you say them first, and that is the best part.',
        effects: { traits: { discipline: 1, trust: 1, curiosity: -1 }, inclinations: { artsLanguage: 1 } },
      },
    },
    {
      id: 'own_words',
      text: 'Tell it your own way',
      outcome: {
        text: 'You take over. In your version the crocodile is a cat and the river is made of milk. {Caregiver} listens very seriously.',
        effects: { traits: { creativity: 2, discipline: -1 }, inclinations: { artsLanguage: 2 }, setFlags: ['little_storyteller'] },
      },
    },
  ],
});

export const brokenCup = defineEvent({
  id: 'broken_cup',
  stage: 'infancy',
  title: 'The broken cup',
  ageMonths: [15, 24],
  weight: 8,
  sensitivity: 'none',
  text: 'You pull on the tablecloth to see what is up there. What is up there is a cup. It comes down. It breaks into many pieces.',
  choices: [
    {
      id: 'hide',
      text: 'Hide under the table',
      outcome: {
        text: 'You go under the table and make yourself small. Maybe if you are small enough, it did not happen.',
        effects: { stress: 1 },
        reaction: 'mess_made',
      },
    },
    {
      id: 'uh_oh',
      text: 'Point and say "uh oh"',
      outcome: {
        text: '"Uh oh." You point at it, so everyone knows. It is important that everyone knows.',
        effects: { traits: { confidence: 1, discipline: 1, creativity: -1 } },
        reaction: 'mess_made',
      },
    },
    {
      id: 'look_closer',
      text: 'Reach for the shiny pieces',
      outcome: {
        text: 'The pieces are shiny, like treasure. Your hand goes out, and a bigger hand catches it just in time.',
        effects: { traits: { curiosity: 1, discipline: -1 } },
        reaction: 'mess_made',
      },
    },
  ],
});

export const greenThingsAgain = defineEvent({
  id: 'green_things_again',
  stage: 'infancy',
  title: 'The green standoff',
  ageMonths: [14, 24],
  weight: 0,
  followUpOnly: true,
  conditions: { flag: 'picky_eater' },
  sensitivity: 'none',
  text: 'Dinner. On your plate, among the good things, there are green things again. You know about green things.',
  choices: [
    {
      id: 'one_bite',
      text: 'Eat one tiny bite',
      outcome: {
        text: 'You pick up the smallest piece in the history of food and put it in your mouth. It is not as bad as you remember. It is not good either.',
        effects: { traits: { courage: 1, discipline: 1, confidence: -1 } },
        reaction: 'food_accepted',
      },
    },
    {
      id: 'refuse_again',
      text: 'Push the plate away',
      outcome: {
        text: 'You push the green things to the edge of the plate, then off it.',
        effects: { traits: { confidence: 1, empathy: -1 } },
        reaction: 'food_refused',
      },
    },
    {
      id: 'deal',
      text: 'Hide them under the rice',
      outcome: {
        text: 'You build a small rice wall over the green things. Out of sight. {Caregiver} sees, of course, but decides the wall is clever enough to let go.',
        effects: { traits: { creativity: 2, discipline: -1 }, clearFlags: ['picky_eater'], setFlags: ['food_negotiator'] },
      },
    },
  ],
});

// --- Segment D: 2–3 years --------------------------------------------------

export const pottyTraining = defineEvent({
  id: 'potty_training',
  stage: 'infancy',
  title: 'The potty',
  ageMonths: [24, 35],
  weight: 11,
  sensitivity: 'none',
  text: [
    'There is a new plastic chair in the bathroom, with a hole in the middle. It is apparently for you.',
    { if: { siblings: ['older', 'both'] }, then: '{Older_sibling} says only babies wear diapers. You are not a baby.' },
  ],
  choices: [
    {
      id: 'sit_proudly',
      text: 'Sit on it like a throne',
      outcome: {
        text: 'You sit on it with great dignity. Nothing happens for a long time. Then something happens, and everyone cheers like you won a race.',
        effects: { traits: { confidence: 1, discipline: 1, creativity: -1 } },
        reaction: 'complied',
      },
    },
    {
      id: 'refuse',
      text: 'Refuse the potty',
      subChoices: [
        {
          id: 'run_off',
          text: 'Run away, bare-bottomed',
          outcome: {
            text: 'You run off with no pants on, laughing, through the kitchen, through the living room, out onto the step.',
            effects: { traits: { confidence: 1, courage: 1, discipline: -2 } },
            reaction: 'defiance',
          },
        },
        {
          id: 'cry',
          text: 'Cry. It is scary.',
          outcome: {
            text: 'The hole is too big and you are too small, and what if you fall in? You cry. It is a real fear, even if it looks funny to grown-ups.',
            effects: { stress: 1 },
            reaction: 'comfort_fear',
          },
        },
      ],
    },
    {
      id: 'myself',
      text: '"Me do it myself!"',
      outcome: {
        text: 'You push every hand away and do the whole thing yourself: pants down, sit, wait, pants up, backwards. It is a mess. It is YOUR mess.',
        effects: { traits: { confidence: 2, trust: -1 } },
        reaction: 'mess_made',
      },
    },
  ],
});

export const playgroundSlide = defineEvent({
  id: 'playground_slide',
  stage: 'infancy',
  title: 'The big slide',
  ageMonths: [24, 35],
  weight: 9,
  sensitivity: 'none',
  text: [
    'There is a small slide and a big slide. The big children are on the big slide, screaming happily.',
    { if: { wealth: ['poor'] }, then: 'The paint is peeling and the metal gets hot at noon, but the whole street comes here in the evenings.' },
  ],
  choices: [
    {
      id: 'climb_big',
      text: 'Climb the big slide',
      outcome: {
        text: 'Up, up, up the ladder. At the top the world is very far down. You go anyway, and the wind makes your eyes water, and you land in the sand, shocked and thrilled.',
        effects: { traits: { courage: 2, discipline: -1 }, inclinations: { physicalSports: 2 } },
        reaction: 'exploring',
      },
    },
    {
      id: 'watch_first',
      text: 'Watch the big kids first',
      outcome: {
        text: 'You watch how they do it: sit, hold, push. You watch for a long time. Then you do the small slide exactly right, ten times.',
        effects: { traits: { discipline: 1, curiosity: 1, courage: -1 } },
      },
    },
    {
      id: 'with_caregiver',
      text: 'Go down on {caregiver}\'s lap',
      outcome: {
        text: '{Caregiver} squeezes onto the slide with you. It is much too small for {cg_him}. You go down together, slow and bumpy, laughing.',
        effects: { traits: { trust: 1, sociability: 1, courage: -1 } },
      },
    },
  ],
});

export const pretendKitchen = defineEvent({
  id: 'pretend_kitchen',
  stage: 'infancy',
  title: 'Pretend kitchen',
  ageMonths: [24, 35],
  weight: 9,
  sensitivity: 'none',
  text: [
    'You have pots. You have a spoon. You have leaves and sand and a little water. You are, clearly, a cook.',
    { if: { wealth: ['poor'] }, then: 'Your stove is a brick, your pan is a coconut shell, and it is the best kitchen in the neighbourhood.' },
    { if: { wealth: ['rich'] }, then: 'You have a toy kitchen with a pretend oven that beeps, but you like the real pots better.' },
  ],
  choices: [
    {
      id: 'feed_everyone',
      text: 'Make soup for everyone',
      outcome: {
        text: 'You make soup for {caregiver}, for the cat, for the teddy bear, for a man walking past. Everyone must eat. Everyone must say "mmm".',
        effects: { traits: { empathy: 1, creativity: 1, confidence: -1 }, inclinations: { peopleHelping: 1 } },
      },
    },
    {
      id: 'sell_food',
      text: 'Open a restaurant',
      outcome: {
        text: 'You set up a shop. Leaves are money. Sand is noodles. "Ten leaves!" You drive a hard bargain.',
        effects: { traits: { creativity: 1, sociability: 1, empathy: -1 }, inclinations: { handsOnBusiness: 2 } },
      },
    },
    {
      id: 'tower',
      text: 'Build a tower of pots',
      outcome: {
        text: 'Forget cooking. The pots go on top of each other: big, medium, small. It falls. You try biggest-at-bottom. It stands.',
        effects: { traits: { curiosity: 1, discipline: 1, sociability: -1 }, inclinations: { scienceMath: 2 } },
      },
    },
  ],
});

export default [
  bathTime,
  tummyTime,
  peekaboo,
  teething,
  sofaAgain,
  bigPuddle,
  bedtimeStory,
  brokenCup,
  greenThingsAgain,
  pottyTraining,
  playgroundSlide,
  pretendKitchen,
];
