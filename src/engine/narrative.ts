import type { Content } from './content';
import { renderText } from './text';
import { INCLINATIONS, TRAITS, type GameState, type StageId, type Trait } from './types';

/** Thresholds for turning numbers into soft words. Never shown to the player. */
const HIGH = 57;
const LOW = 43;
const STRESS_HIGH = 50;
const STRESS_LOW = 22;
const INCLINATION_MIN = 6;
const MAX_FLAG_LINES = 3;

/**
 * Stage-end / life-summary paragraphs, generated from the strongest and
 * softest traits, stress, the leading inclination and memorable flags.
 * The text itself comes from content; this only decides what to say.
 */
export function summarize(s: GameState, content: Content, stageId: StageId): string[] {
  const n = content.narrative;
  const r = (t: Parameters<typeof renderText>[0]) => renderText(t, s, content);
  const out: string[] = [];

  const stageText = n.stageEnd[stageId];
  if (stageText) out.push(r(stageText.intro));

  const ranked = [...TRAITS].sort((a, b) => s.traits[b] - s.traits[a]);
  const highs = ranked.filter((t) => s.traits[t] >= HIGH).slice(0, 2);
  const lows = ranked.filter((t) => s.traits[t] <= LOW).slice(-1);
  // Always say something, even for a very even profile.
  if (highs.length === 0) highs.push(ranked[0] as Trait);

  const traitLines = [...highs.map((t) => r(n.traitHigh[t])), ...lows.map((t) => r(n.traitLow[t]))];
  out.push(traitLines.join(' '));

  if (s.stress >= STRESS_HIGH) out.push(r(n.stressHigh));
  else if (s.stress <= STRESS_LOW) out.push(r(n.stressLow));

  const topInc = [...INCLINATIONS].sort((a, b) => s.inclinations[b] - s.inclinations[a])[0];
  if (topInc && s.inclinations[topInc] >= INCLINATION_MIN) out.push(r(n.inclination[topInc]));

  const memories = s.flags.filter((f) => f in n.flagLines).slice(-MAX_FLAG_LINES);
  if (memories.length) out.push(memories.map((f) => r(n.flagLines[f])).join(' '));

  if (stageText) out.push(r(stageText.outro));
  return out.filter(Boolean);
}
