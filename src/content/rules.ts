import type { Rules } from '../engine/content';

/** Balance numbers. Tune these with `npm run sim`. */
export const rules: Rules = {
  traitDefault: 50,
  stressDefault: 20,
  inclinationDefault: 0,
  // Effect applied = base delta × multiplier for the character's age.
  ageMultipliers: [
    { belowMonths: 36, multiplier: 3.0 }, // 0–3 years
    { belowMonths: 72, multiplier: 2.5 }, // 3–6
    { belowMonths: 156, multiplier: 1.5 }, // 6–12 (up to the 13th birthday)
    { belowMonths: 228, multiplier: 1.0 }, // 13–18
  ],
  adultMultiplier: 0.4, // 19+
  softCap: true,
  stressRecoveryBetweenSegments: 0.3,
  offWindowWeight: 0.35,
  archiveLimit: 20,
};
