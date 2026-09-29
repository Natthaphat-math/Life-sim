import type { BirthTables } from '../engine/content';

/**
 * Birth weights and starting nudges. Weights are relative, not percentages.
 * Every circumstance has upsides and downsides: no combination decides a life.
 */
export const birthTables: BirthTables = {
  weights: {
    wealth: { poor: 30, middle: 50, rich: 20 },
    wealthTag: {
      poor: { 'poor-warm': 40, 'poor-stretched': 30, 'poor-resourceful': 30 },
      middle: { 'middle-comfortable': 40, 'middle-busy': 35, 'middle-careful': 25 },
      rich: { 'rich-busy': 40, 'rich-relaxed': 35, 'rich-proper': 25 },
    },
    temperament: { easy: 40, clingy: 15, sensitive: 15, slowToWarm: 15, active: 15 },
    parenting: { warmBalanced: 30, indulgent: 20, strict: 20, freeRange: 18, neglectful: 12 },
    caregiver: { bothParents: 65, singleMother: 15, singleFather: 4, grandparents: 11, relatives: 5 },
    caregiverPerson: {
      bothParents: { mom: 70, dad: 30 },
      singleMother: { mom: 1 },
      singleFather: { dad: 1 },
      grandparents: { grandma: 75, grandpa: 25 },
      relatives: { aunt: 70, uncle: 30 },
    },
    siblings: { none: 35, older: 30, younger: 22, both: 13 },
    environment: {
      poor: { city: 25, suburb: 15, rural: 25, market: 20, farm: 15 },
      middle: { city: 32, suburb: 35, rural: 13, market: 10, farm: 10 },
      rich: { city: 50, suburb: 38, rural: 5, market: 4, farm: 3 },
    },
    health: { good: 55, normal: 35, fragile: 10 },
    parents: { smooth: 65, strained: 35 },
  },
  jitter: 5,
  modifiers: [
    // Wealth: comfort and access vs. resourcefulness and closeness.
    { if: { wealth: ['poor'] }, effects: { traits: { creativity: 4, empathy: 3, discipline: 2, curiosity: -1 }, stress: 5 } },
    { if: { wealth: ['rich'] }, effects: { traits: { confidence: 3, curiosity: 3, discipline: -2, empathy: -1 }, stress: -2 } },
    { if: { wealthTag: ['poor-warm'] }, effects: { traits: { trust: 4, sociability: 2 }, stress: -3 } },
    { if: { wealthTag: ['poor-resourceful'] }, effects: { traits: { creativity: 3, courage: 2 } } },
    { if: { wealthTag: ['poor-stretched'] }, effects: { traits: { discipline: 2 }, stress: 4 } },
    { if: { wealthTag: ['middle-busy', 'rich-busy'] }, effects: { traits: { trust: -2, discipline: 2 } } },
    { if: { wealthTag: ['rich-proper'] }, effects: { traits: { discipline: 3, creativity: -2 } } },
    { if: { wealthTag: ['rich-relaxed', 'middle-comfortable'] }, effects: { traits: { trust: 2 }, stress: -2 } },

    // Temperament.
    { if: { temperament: ['easy'] }, effects: { traits: { trust: 3, sociability: 2 }, stress: -3 } },
    { if: { temperament: ['clingy'] }, effects: { traits: { empathy: 3, courage: -3, trust: 1 } } },
    { if: { temperament: ['sensitive'] }, effects: { traits: { empathy: 4, creativity: 2, courage: -2 }, stress: 4 } },
    { if: { temperament: ['slowToWarm'] }, effects: { traits: { sociability: -4, discipline: 2, curiosity: 1 } } },
    { if: { temperament: ['active'] }, effects: { traits: { courage: 4, curiosity: 3, discipline: -3 }, inclinations: { physicalSports: 2 } } },

    // Parenting style.
    { if: { parenting: ['warmBalanced'] }, effects: { traits: { trust: 6, confidence: 3 }, stress: -3 } },
    { if: { parenting: ['indulgent'] }, effects: { traits: { confidence: 4, trust: 3, discipline: -5 } } },
    { if: { parenting: ['strict'] }, effects: { traits: { discipline: 6, confidence: -3, creativity: -2 }, stress: 3 } },
    { if: { parenting: ['freeRange'] }, effects: { traits: { curiosity: 4, courage: 4, trust: -1, discipline: -2 } } },
    { if: { parenting: ['neglectful'] }, effects: { traits: { trust: -7, courage: 3, discipline: 1 }, stress: 8 } },

    // Who raises the child.
    { if: { caregiver: ['grandparents'] }, effects: { traits: { empathy: 2, discipline: 1 }, setFlags: ['raised_by_grandparents'] } },
    { if: { all: [{ caregiver: ['grandparents'] }, { not: { parenting: ['neglectful'] } }] }, effects: { setFlags: ['grandma_raised'] } },
    { if: { caregiver: ['relatives'] }, effects: { traits: { sociability: 2, trust: -2 }, setFlags: ['raised_by_relatives'] } },
    { if: { caregiver: ['singleMother', 'singleFather'] }, effects: { traits: { empathy: 2, discipline: 2 }, stress: 2 } },

    // Siblings.
    { if: { siblings: ['older', 'both'] }, effects: { traits: { sociability: 3, courage: 2 } } },
    { if: { siblings: ['younger', 'both'] }, effects: { traits: { empathy: 2 } } },
    { if: { siblings: ['none'] }, effects: { traits: { curiosity: 2, confidence: 1 } } },

    // Environment.
    { if: { env: ['city'] }, effects: { traits: { curiosity: 2 }, stress: 2 } },
    { if: { env: ['rural', 'farm'] }, effects: { traits: { courage: 2, trust: 1 }, stress: -2 } },
    { if: { env: ['farm'] }, effects: { inclinations: { handsOnBusiness: 1, physicalSports: 1 } } },
    { if: { env: ['market'] }, effects: { traits: { sociability: 3 }, inclinations: { handsOnBusiness: 2 } } },
    { if: { env: ['suburb'] }, effects: { traits: { trust: 1 } } },

    // Health and home atmosphere.
    { if: { health: ['fragile'] }, effects: { traits: { empathy: 2, courage: -2 }, stress: 4, setFlags: ['fragile_start'] } },
    { if: { health: ['good'] }, effects: { traits: { courage: 1 } } },
    { if: { parents: ['strained'] }, effects: { traits: { trust: -3, empathy: 2 }, stress: 5 } },
  ],
};
