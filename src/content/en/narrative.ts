import type { NarrativeContent } from '../../engine/content';

/**
 * Soft, non-numeric phrases for the birth reveal and the stage-end / life
 * summaries. Never judge: every tendency is described as a way of being.
 */
export const narrative: NarrativeContent = {
  birth: [
    'You are born',
    { if: { env: ['city'] }, then: 'in a big city, where the traffic never really stops,' },
    { if: { env: ['suburb'] }, then: 'in a quiet suburb of look-alike houses and small gardens,' },
    { if: { env: ['rural'] }, then: 'in a village where everyone knows everyone,' },
    { if: { env: ['market'] }, then: 'above a busy market, where the day starts before dawn,' },
    { if: { env: ['farm'] }, then: 'on a farm, among fields and animals and weather,' },
    'on an ordinary day that does not feel ordinary to anyone in your family.',

    { if: { wealthTag: ['poor-warm'] }, then: 'There is not much money, but there is a lot of laughing, and a lot of people who love you.' },
    { if: { wealthTag: ['poor-stretched'] }, then: 'Money is tight and everyone works hard, and they are already working a little harder for you.' },
    { if: { wealthTag: ['poor-resourceful'] }, then: 'There is not much money, but your family can fix anything, grow anything, and make something out of nearly nothing.' },
    { if: { wealthTag: ['middle-comfortable'] }, then: 'Your family is comfortable: not rich, never hungry, with a little saved for a rainy day.' },
    { if: { wealthTag: ['middle-busy'] }, then: 'Your family has enough, and they work long hours to keep it that way.' },
    { if: { wealthTag: ['middle-careful'] }, then: 'Your family has enough, and they count it carefully.' },
    { if: { wealthTag: ['rich-busy'] }, then: 'Your family has plenty. What they are short of is time.' },
    { if: { wealthTag: ['rich-relaxed'] }, then: 'Your family has plenty, and they are in no hurry about anything.' },
    { if: { wealthTag: ['rich-proper'] }, then: 'Your family has plenty, and a long list of how things are done.' },

    '\n\n',
    { if: { caregiver: ['bothParents'] }, then: 'Mom and Dad take you home together.' },
    { if: { caregiver: ['singleMother'] }, then: 'Mom brings you home on her own. She has already decided it will be enough.' },
    { if: { caregiver: ['singleFather'] }, then: 'Dad brings you home on his own, holding you like you might break, then a little less carefully each day.' },
    { if: { caregiver: ['grandparents'] }, then: 'Your parents have to work far away, so {caregivers} will raise you. They have done this before, and they are glad to do it again.' },
    { if: { caregiver: ['relatives'] }, then: 'Your parents cannot keep you with them for now, so {caregivers} take you in. Their house is crowded. They make room.' },

    { if: { parenting: ['indulgent'] }, then: 'You will be spoiled a little, and loved a lot.' },
    { if: { parenting: ['strict'] }, then: 'There will be rules in this house, and routines, and love that shows itself through both.' },
    { if: { parenting: ['neglectful'] }, then: 'The grown-ups in your life are stretched very thin. They love you in the moments they have left.' },
    { if: { parenting: ['freeRange'] }, then: 'The grown-ups in your life believe children should find their own way, mostly.' },
    { if: { parenting: ['warmBalanced'] }, then: 'The grown-ups in your life are patient, mostly, and warm, nearly always.' },

    { if: { parents: ['strained'], }, then: 'Not everything between the adults is easy.' },

    { if: { siblings: ['older'] }, then: '{Older_sibling} peers into your crib, unsure yet what to make of you.' },
    { if: { siblings: ['both'] }, then: '{Older_sibling} peers into your crib, unsure yet what to make of you. Later, there will be a younger one too.' },
    { if: { siblings: ['younger'] }, then: 'For now, you are the only child. It will not stay that way.' },
    { if: { siblings: ['none'] }, then: 'You are the only child, the whole centre of this small world.' },

    '\n\n',
    { if: { temperament: ['easy'] }, then: 'You are an easy baby, everyone says. You sleep, you eat, you look around.' },
    { if: { temperament: ['clingy'] }, then: 'You want to be held, always. Put down, you protest.' },
    { if: { temperament: ['sensitive'] }, then: 'You notice everything: every noise, every light, every change in a voice.' },
    { if: { temperament: ['slowToWarm'] }, then: 'You take your time with new things. You watch first.' },
    { if: { temperament: ['active'] }, then: 'You kick and wriggle and never seem to stop moving.' },
    { if: { health: ['fragile'] }, then: 'You are small, and the doctors want to keep an eye on you for a while.' },
    { if: { health: ['good'] }, then: 'You are strong and loud and healthy.' },
  ],

  traitHigh: {
    confidence: '{Name} seems sure of {him}self, and says what {he} wants without much worry.',
    curiosity: '{Name} wants to touch, open, taste and ask about everything.',
    empathy: '{Name} notices when someone is sad, and tries, in small ways, to help.',
    discipline: '{Name} likes routines and finishes what {he} starts.',
    courage: '{Name} goes toward new and scary things more often than away from them.',
    trust: '{Name} expects the world to be kind, most of the time.',
    sociability: '{Name} lights up around other people.',
    creativity: '{Name} turns boxes into houses and spoons into people.',
  },
  traitLow: {
    confidence: '{He} sometimes checks the faces around {him} before deciding what {he} thinks.',
    curiosity: '{He} likes the familiar, and is happy with what {he} knows.',
    empathy: '{He} is still learning that other people feel things as big as {he} does.',
    discipline: '{He} follows {his} moods more than any plan.',
    courage: '{He} watches carefully before trying anything new.',
    trust: '{He} keeps a small part of {him}self in reserve, just in case.',
    sociability: '{He} is happiest with just one or two people, or alone.',
    creativity: '{He} prefers things to be what they are.',
  },
  stressHigh: 'There is a watchfulness in {him}, a readiness for things to go wrong.',
  stressLow: 'Mostly, {he} seems at ease in {his} own small world.',
  inclination: {
    artsLanguage: '{He} loves words, songs and stories.',
    scienceMath: '{He} is always testing how things work.',
    physicalSports: '{His} body always wants to run, climb and jump.',
    peopleHelping: '{He} is drawn to looking after others.',
    handsOnBusiness: '{He} likes making, trading and being useful.',
  },
  flagLines: {
    picky_eater: 'Green things remain, for now, the enemy.',
    food_negotiator: '{He} has learned that a meal can be negotiated.',
    learned_to_be_quiet: '{He} has learned to be very quiet when things get hard.',
    fell_from_bed: 'Everyone still remembers the day {he} rolled off the bed.',
    careful_climber: '{He} still climbs down from everything feet first.',
    fever_night: 'There was a night with a fever that nobody in the family has forgotten.',
    grandma_raised: 'Grandma\'s songs are the first songs {he} knows by heart.',
    market_kid: 'The market stall feels like a second home.',
    shares_easily: '{He} shares more easily than most children {his} age.',
    little_peacemaker: 'When the grown-ups are upset, {he} tries to fix it.',
    heard_arguing: 'Loud voices make {him} go still and listen.',
    night_storyteller: 'The shadows in {his} room all have names now.',
    little_storyteller: 'At bedtime, {he} tells the stories as often as {he} hears them.',
    screen_baby: 'The bright screen is an old friend.',
    school_eager: 'The new school bag has been packed for weeks.',
    school_hesitant: 'School is still a big, uncertain word.',
    first_friend: 'There is a girl with a hat, and she is {his} friend.',
    sibling_bond: '{Older_sibling} was {his} first favourite person.',
  },
  stageEnd: {
    infancy: {
      intro: '{Name} is three years old now.',
      outro: 'Nobody knows yet who {name} will become. But some small shapes are already there, like pencil lines under a painting.',
    },
  },
};
