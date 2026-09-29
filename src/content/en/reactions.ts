import type { ReactionTable } from '../../engine/types';

/**
 * Caregiver reaction table. An outcome sets `reaction: '<id>'` and the engine
 * adds the entry for the character's parenting style: its text follows the
 * outcome text, and its effects are added (then scaled by the age multiplier).
 *
 * Every style is written as someone doing their best with what they have:
 *   indulgent    – loving, gives in easily
 *   strict       – loving through rules and order
 *   neglectful   – overwhelmed, tired, often elsewhere (never cruel)
 *   freeRange    – trusts the child to figure things out
 *   warmBalanced – warm, steady, sets gentle limits
 */
export const reactions: ReactionTable = {
  cry_answered: {
    indulgent: {
      text: '{Caregiver} is there before the second breath, lifting you, kissing your wet cheeks. {Cg_he} keeps you in the big bed the rest of the night, and you both sleep curled like commas.',
      effects: { traits: { trust: 2, confidence: 1, discipline: -2, courage: -1 }, stress: -1 },
    },
    strict: {
      text: '{Caregiver} comes in with the light off, checks your diaper, gives you milk, and lays you back down with one firm pat. "Night is for sleeping." It is not warm, exactly. But it is the same every time, and you learn the shape of it.',
      effects: { traits: { discipline: 2, trust: -1, empathy: -1 } },
    },
    neglectful: {
      text: 'It takes a long time. When {caregiver} finally comes, {cg_his} eyes are half closed and {cg_his} phone is still glowing in {cg_his} hand. {Cg_he} feeds you, swaying, already somewhere else. It was a long day for {cg_him} too. Next time, you do not cry quite so long.',
      effects: { traits: { trust: -2, courage: 1 }, stress: 3, setFlags: ['learned_to_be_quiet'] },
    },
    freeRange: {
      text: '{Caregiver} waits a little, listening, to see if you will settle. When you do not, {cg_he} comes, feeds you without fuss, and goes back to bed. Not too fast, not too slow.',
      effects: { traits: { courage: 1, trust: -1 } },
    },
    warmBalanced: {
      text: '{Caregiver} comes with soft steps and a softer voice. "I know, I know." {Cg_he} feeds you, rocks you until your fists open, and puts you down while you are still a little awake. You drift off knowing where {cg_he} is.',
      effects: { traits: { trust: 2, courage: -1 }, stress: -1 },
    },
  },

  quiet_settle: {
    indulgent: {
      text: 'In the morning {caregiver} is almost sad you did not call. "You should wake me, baby." The next night {cg_he} checks on you anyway, three times.',
      effects: { traits: { trust: 1, courage: -1 } },
    },
    strict: {
      text: '"Good. A baby who sleeps." {Caregiver} is proud in the morning, and says so to everyone.',
      effects: { traits: { discipline: 2, sociability: -1 } },
    },
    neglectful: {
      text: 'Nobody notices, and nobody needs to. The house stays quiet. Quiet seems to be what makes things easier here.',
      effects: { traits: { trust: -1, courage: 1 }, stress: 1, setFlags: ['learned_to_be_quiet'] },
    },
    freeRange: {
      text: '{Caregiver} smiles when {cg_he} hears you made it through. "Look at you, figuring it out."',
      effects: { traits: { courage: 1, trust: -1 } },
    },
    warmBalanced: {
      text: 'In the morning {caregiver} scoops you up and says good morning like you have been away on a trip. You have, in a way.',
      effects: { traits: { trust: 1 } },
    },
  },

  food_refused: {
    indulgent: {
      text: '"Okay, okay, no green." {Caregiver} fishes every bit of it out and gives you plain rice with a little sugar on top. You win. It tastes like winning.',
      effects: { traits: { confidence: 1, discipline: -2 }, setFlags: ['picky_eater'] },
    },
    strict: {
      text: '{Caregiver} waits, spoon held still. "One more. Then you are done." It becomes a quiet contest. In the end, one small bite goes in, and the meal is over.',
      effects: { traits: { discipline: 2, confidence: -1, trust: -1 }, stress: 1 },
    },
    neglectful: {
      text: '{Caregiver} sighs, puts the bowl on the counter, and goes back to the other things waiting. Later you get crackers from the packet. Nobody makes the green rice again.',
      effects: { traits: { courage: 1 }, stress: 1, setFlags: ['picky_eater'] },
    },
    freeRange: {
      text: '{Caregiver} shrugs and puts a few bits of the green on your tray to play with. You squash them, smell them, and, when no one is looking, lick one.',
      effects: { traits: { curiosity: 2, discipline: -1 } },
    },
    warmBalanced: {
      text: '"Not today? That is okay." {Caregiver} eats a bite {cg_him}self, making a big happy face, and leaves one little piece on your tray. No one makes you. It stays there, being green, being possible.',
      effects: { traits: { trust: 1, discipline: -1 } },
    },
  },

  food_accepted: {
    indulgent: {
      text: '{Caregiver} claps like you have done something amazing. Maybe you have. {Cg_he} gives you a second bowl you did not ask for.',
      effects: { traits: { confidence: 2, discipline: -1 } },
    },
    strict: {
      text: '"Good. That is how we eat." {Caregiver} nods once, and the nod is enough.',
      effects: { traits: { discipline: 2, creativity: -1 } },
    },
    neglectful: {
      text: '{Caregiver} is feeding you with one hand and doing something else with the other. The bowl empties. Neither of you really notices.',
      effects: { traits: { discipline: 1 } },
    },
    freeRange: {
      text: '{Caregiver} lets you grab the spoon. More rice ends up on your head than in your mouth, and that seems fine with everyone.',
      effects: { traits: { curiosity: 1, discipline: -1 } },
    },
    warmBalanced: {
      text: '"Mm! Green is good, huh?" {Caregiver} smiles with {cg_his} whole face. You smile back with rice on yours.',
      effects: { traits: { trust: 1 } },
    },
  },

  defiance: {
    indulgent: {
      text: '"Okay, no shirt then!" {Caregiver} laughs, and you run around bare-bellied for the rest of the morning, feeling like a king of something.',
      effects: { traits: { confidence: 2, discipline: -3 } },
    },
    strict: {
      text: '"We do not say no to that." {Caregiver} puts the shirt on you anyway, firmly, buttons done up to the top. You cry. It does not change the shirt. After a while you stop, because the shirt is still there.',
      effects: { traits: { discipline: 3, confidence: -2, courage: -1 }, stress: 2 },
    },
    neglectful: {
      text: '{Caregiver} is on the phone and does not have it in {cg_him} today. "Fine. Whatever." The shirt stays on the floor. You are not sure if you won or if nobody was playing.',
      effects: { traits: { confidence: 1, trust: -1 }, stress: 1 },
    },
    freeRange: {
      text: '"Suit yourself." {Caregiver} opens the door. It is colder outside than you thought. A minute later you come back in and hold your arms up for the shirt, all by your own idea.',
      effects: { traits: { courage: 1, discipline: 1, trust: -1 } },
    },
    warmBalanced: {
      text: '{Caregiver} crouches to your height. "You do not want this one? Red or yellow, you pick." You pick yellow. It was never really about the shirt.',
      effects: { traits: { confidence: 1, discipline: 1, courage: -1 } },
    },
  },

  complied: {
    indulgent: {
      text: '"My good baby!" {Caregiver} squeezes you so hard you squeak, and there is a biscuit afterwards.',
      effects: { traits: { confidence: 1, courage: -1 } },
    },
    strict: {
      text: '"Good. Thank you." {Caregiver} does not make a fuss. You feel the quiet approval all the same.',
      effects: { traits: { discipline: 2, creativity: -1 } },
    },
    neglectful: {
      text: '{Caregiver} does not seem to notice either way. You did the thing. The day goes on.',
      effects: { traits: { discipline: 1, trust: -1 }, stress: 1 },
    },
    freeRange: {
      text: '{Caregiver} is already on to the next thing, and so are you.',
      effects: { traits: { discipline: 1, sociability: -1 } },
    },
    warmBalanced: {
      text: '"Thank you for helping me." {Caregiver} says it like you are a team. You are.',
      effects: { traits: { discipline: 1, confidence: -1, trust: 1 } },
    },
  },

  small_hurt: {
    indulgent: {
      text: '{Caregiver} is there in a heartbeat, lifting you, kissing the bump a hundred times, rocking and rocking. You cry longer than the bump needs, because the rocking is nice.',
      effects: { traits: { trust: 2, courage: -2 } },
    },
    strict: {
      text: '"Up you get. You are fine." {Caregiver} checks you over quickly and sets you back on your feet. "Next time, hold on."',
      effects: { traits: { courage: 1, discipline: 1, trust: -1 }, stress: 1 },
    },
    neglectful: {
      text: '{Caregiver} looks up from across the room. "You okay?" You stop crying on your own, eventually. The bump turns blue, then yellow. Nobody asks about it.',
      effects: { traits: { courage: 2, trust: -2 }, stress: 2 },
    },
    freeRange: {
      text: '{Caregiver} watches for a second to see how bad it is. "Oof. That was a big one." {Cg_he} rubs your back and lets you decide when you are ready to go again.',
      effects: { traits: { courage: 2, trust: -1 } },
    },
    warmBalanced: {
      text: '{Caregiver} holds you and names it: "You fell. That hurt. You are okay." The words make the hurt smaller, somehow.',
      effects: { traits: { trust: 2, courage: -1 } },
    },
  },

  comfort_fear: {
    indulgent: {
      text: '{Caregiver} holds you tight and does not let go for the rest of the day. Whatever it was, it cannot get you now.',
      effects: { traits: { trust: 2, courage: -1 } },
    },
    strict: {
      text: '"There is nothing to be afraid of." {Caregiver} says it plainly, like a fact. You are not sure you believe it, but you stop crying.',
      effects: { traits: { discipline: 1, courage: 1, trust: -1 }, stress: 1 },
    },
    neglectful: {
      text: '{Caregiver} is too tired to notice for a while. You make your fear smaller on your own, the way you can, by holding very still.',
      effects: { traits: { trust: -2, courage: 1 }, stress: 2 },
    },
    freeRange: {
      text: '"Scary, huh?" {Caregiver} stays close but does not rush you. Slowly, you peek out to see if the scary thing is still scary.',
      effects: { traits: { courage: 2, trust: -1 } },
    },
    warmBalanced: {
      text: '{Caregiver} holds you and waits with you until the scared feeling passes. "I am right here." It passes.',
      effects: { traits: { trust: 2, courage: -1 } },
    },
  },

  mess_made: {
    indulgent: {
      text: '{Caregiver} laughs and cleans it up. "Silly baby." You are not in trouble. You are almost never in trouble.',
      effects: { traits: { confidence: 1, discipline: -1 } },
    },
    strict: {
      text: '"Look what happened." {Caregiver} hands you a cloth. "Now we clean." Your part is small and clumsy, but it is your part.',
      effects: { traits: { discipline: 2, creativity: -1 }, stress: 1 },
    },
    neglectful: {
      text: '{Caregiver} sighs a long sigh and cleans it without a word. The sigh stays in the room after the mess is gone.',
      effects: { traits: { trust: -1 }, stress: 2, setFlags: ['learned_to_be_quiet'] },
    },
    freeRange: {
      text: '"Well. That happened." {Caregiver} lets you look at the mess for a while before cleaning it. You learn exactly what water does, and glass, and gravity.',
      effects: { traits: { curiosity: 2, discipline: -1 } },
    },
    warmBalanced: {
      text: '"Oops! Accidents happen. Let us fix it together." You hold the dustpan. It is heavy and important.',
      effects: { traits: { discipline: 1 } },
    },
  },

  exploring: {
    indulgent: {
      text: '{Caregiver} follows one step behind with arms out, catching you before anything can happen. Nothing does happen. You never quite find out what would have.',
      effects: { traits: { trust: 1, courage: -1 } },
    },
    strict: {
      text: '"That is far enough." {Caregiver} brings you back to the mat. You learn where the edge of the allowed world is.',
      effects: { traits: { discipline: 2, curiosity: -1 } },
    },
    neglectful: {
      text: 'No one stops you. You go further than any baby should, and come back with dust on your hands and a strange sense of how big the house is.',
      effects: { traits: { courage: 2, curiosity: 1, trust: -1 }, stress: 1 },
    },
    freeRange: {
      text: '{Caregiver} lets you go, watching from the doorway. You find a cupboard, a pot, a spoon, and the most wonderful noise in the world.',
      effects: { traits: { curiosity: 2, courage: 1, discipline: -2 } },
    },
    warmBalanced: {
      text: '{Caregiver} makes the room safe and lets you roam. When you look back, {cg_he} is there, nodding. Go on.',
      effects: { traits: { curiosity: 2, discipline: -1 } },
    },
  },

  shared_well: {
    indulgent: {
      text: '{Caregiver} tells the story to everyone for a week. "So generous!" You do not know that word, but you like how it sounds.',
      effects: { traits: { confidence: 1, empathy: 1, discipline: -1 } },
    },
    strict: {
      text: '"That is right. That is how we behave." {Caregiver} gives a short nod of approval.',
      effects: { traits: { discipline: 1, empathy: 1, creativity: -1 } },
    },
    neglectful: {
      text: 'No adult sees it happen. The other child sees it, though, and that turns out to be enough.',
      effects: { traits: { empathy: 1, sociability: 1 } },
    },
    freeRange: {
      text: '{Caregiver} smiles from the bench and does not interrupt. You worked it out without anyone.',
      effects: { traits: { confidence: 1, sociability: 1, trust: -1 } },
    },
    warmBalanced: {
      text: '"You saw that {sibling} wanted a turn. That was kind." {Caregiver} says it quietly, just to you.',
      effects: { traits: { empathy: 2, courage: -1 } },
    },
  },

  conflict_toy: {
    indulgent: {
      text: '{Caregiver} rushes in and gives you the toy, then finds another one for the other child. Everyone gets something. Nobody learns much.',
      effects: { traits: { confidence: 1, empathy: -1, discipline: -1 } },
    },
    strict: {
      text: '"No grabbing." {Caregiver} takes the toy away from both of you and puts it on a high shelf. The shelf wins.',
      effects: { traits: { discipline: 2, trust: -1 }, stress: 1 },
    },
    neglectful: {
      text: 'The adults are talking in the other room. You two sort it out yourselves, loudly, until someone gets bored.',
      effects: { traits: { courage: 1, sociability: -1 }, stress: 1 },
    },
    freeRange: {
      text: '{Caregiver} lets the two of you figure it out. It is loud for a while. Then, strangely, you are both playing with it.',
      effects: { traits: { sociability: 1, courage: 1, discipline: -1 } },
    },
    warmBalanced: {
      text: '{Caregiver} kneels between you. "You both want it. What can we do?" A timer, a turn, a deal. You do not love it. You understand it.',
      effects: { traits: { empathy: 1, discipline: 1, confidence: -1 } },
    },
  },
};
