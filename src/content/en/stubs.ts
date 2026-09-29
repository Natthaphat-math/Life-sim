import type { EventStub } from '../../engine/types';

/**
 * Titles for events still to be written, grouped by the stage they belong to.
 * To write one: copy an event file from events/infancy/, keep the id, fill it
 * in, register it in events/index.ts, and remove it from this list.
 * Ages are in months.
 */
export const stubs: EventStub[] = [
  // Kindergarten (3–6)
  { id: 'first_day_drop_off', title: 'The first drop-off', stage: 'kindergarten', ageMonths: [36, 40] },
  { id: 'nap_time_rebellion', title: 'Nap time', stage: 'kindergarten', ageMonths: [36, 60] },
  { id: 'best_friend', title: 'A best friend', stage: 'kindergarten', ageMonths: [40, 66] },
  { id: 'show_and_tell', title: 'Show and tell', stage: 'kindergarten', ageMonths: [42, 70] },
  { id: 'lost_tooth', title: 'The first wobbly tooth', stage: 'kindergarten', ageMonths: [60, 71] },
  { id: 'new_sibling_jealousy', title: 'The new baby gets all the attention', stage: 'kindergarten', ageMonths: [36, 71] },
  { id: 'school_play', title: 'The school play', stage: 'kindergarten', ageMonths: [48, 71] },
  { id: 'pet_arrives', title: 'A pet comes home', stage: 'kindergarten', ageMonths: [36, 71] },

  // Primary school (6–12)
  { id: 'learning_to_read', title: 'Letters become words', stage: 'primary', ageMonths: [72, 84] },
  { id: 'bike_without_training_wheels', title: 'No more training wheels', stage: 'primary', ageMonths: [72, 108] },
  { id: 'caught_lying', title: 'The small lie', stage: 'primary', ageMonths: [78, 120] },
  { id: 'teacher_favourite', title: 'The teacher\'s favourite', stage: 'primary', ageMonths: [72, 143] },
  { id: 'bullied_or_bully', title: 'Trouble at break time', stage: 'primary', ageMonths: [84, 143] },
  { id: 'moving_house', title: 'Moving house', stage: 'primary', ageMonths: [72, 143] },
  { id: 'grandparent_illness', title: 'Grandma gets sick', stage: 'primary', ageMonths: [84, 143] },
  { id: 'first_competition', title: 'The first competition', stage: 'primary', ageMonths: [96, 143] },
  { id: 'pocket_money', title: 'Pocket money', stage: 'primary', ageMonths: [84, 132] },
  { id: 'math_test_fail', title: 'The red mark', stage: 'primary', ageMonths: [90, 143] },

  // Secondary school (12–18)
  { id: 'new_school_new_you', title: 'A new school', stage: 'secondary', ageMonths: [144, 150] },
  { id: 'first_crush', title: 'The first crush', stage: 'secondary', ageMonths: [144, 200] },
  { id: 'friend_group_split', title: 'The group splits', stage: 'secondary', ageMonths: [150, 210] },
  { id: 'phone_of_your_own', title: 'A phone of your own', stage: 'secondary', ageMonths: [144, 190] },
  { id: 'part_time_job', title: 'A part-time job', stage: 'secondary', ageMonths: [180, 215] },
  { id: 'parents_divorce', title: 'The family changes shape', stage: 'secondary', ageMonths: [144, 215] },
  { id: 'exam_pressure', title: 'The big exam', stage: 'secondary', ageMonths: [192, 215] },
  { id: 'discovering_a_passion', title: 'Something clicks', stage: 'secondary', ageMonths: [150, 215] },

  // University and career choice (18–22)
  { id: 'choosing_a_path', title: 'Choosing a path', stage: 'university', ageMonths: [216, 228] },
  { id: 'leaving_home', title: 'Leaving home', stage: 'university', ageMonths: [216, 240] },
  { id: 'roommate', title: 'The roommate', stage: 'university', ageMonths: [216, 264] },
  { id: 'first_heartbreak', title: 'The first heartbreak', stage: 'university', ageMonths: [216, 270] },
  { id: 'money_runs_out', title: 'The money runs out', stage: 'university', ageMonths: [220, 270] },
  { id: 'mentor', title: 'Someone believes in you', stage: 'university', ageMonths: [220, 270] },
  { id: 'dropout_temptation', title: 'Should I quit?', stage: 'university', ageMonths: [228, 270] },

  // Working life (22–45)
  { id: 'first_job_interview', title: 'The first interview', stage: 'working', ageMonths: [264, 300] },
  { id: 'difficult_boss', title: 'A difficult boss', stage: 'working', ageMonths: [270, 480] },
  { id: 'moving_in_together', title: 'Moving in together', stage: 'working', ageMonths: [276, 420] },
  { id: 'career_crossroads', title: 'Crossroads', stage: 'working', ageMonths: [336, 480] },
  { id: 'becoming_a_parent', title: 'A child of your own', stage: 'working', ageMonths: [300, 480] },
  { id: 'parent_grows_old', title: 'Looking after the ones who looked after you', stage: 'working', ageMonths: [384, 540] },
  { id: 'burnout', title: 'Running on empty', stage: 'working', ageMonths: [336, 540] },
  { id: 'starting_a_business', title: 'Your own thing', stage: 'working', ageMonths: [300, 540] },
  { id: 'old_friend_returns', title: 'An old friend', stage: 'working', ageMonths: [336, 540] },
];
