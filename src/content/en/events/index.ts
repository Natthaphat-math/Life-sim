/**
 * Every event in the game. To add an event: create a file that default-exports
 * `defineEvent({...})` (or an array of them) and add it to this list.
 */
import type { GameEvent } from '../../../engine/types';
import adultsArguing from './infancy/adults_arguing';
import afraidOfTheDark from './infancy/afraid_of_the_dark';
import extras from './infancy/extras';
import fallFromBed from './infancy/fall_from_bed';
import marketDay from './infancy/market_day';
import middleOfTheNight from './infancy/middle_of_the_night';
import milestones from './infancy/milestones';
import nightFever from './infancy/night_fever';
import onlyOneToy from './infancy/only_one_toy';
import relativesVisit from './infancy/relatives_visit';
import sayingNo from './infancy/saying_no';
import screenTime from './infancy/screen_time';
import strangerAnxiety from './infancy/stranger_anxiety';
import vaccineDay from './infancy/vaccine_day';
import veggiesInRice from './infancy/veggies_in_rice';

export const events: GameEvent[] = [
  // Stage 1 core events
  veggiesInRice,
  middleOfTheNight,
  sayingNo,
  onlyOneToy,
  marketDay,
  relativesVisit,
  strangerAnxiety,
  fallFromBed,
  screenTime,
  vaccineDay,
  afraidOfTheDark,
  adultsArguing,
  // Follow-ups, milestones and extra starter events
  nightFever,
  ...milestones,
  ...extras,
];
