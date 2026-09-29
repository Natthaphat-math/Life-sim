import type { Content, ContentIndex } from './content';
import { indexContent } from './content';
import { applyBirthModifiers, generateBirth, randomGender } from './birth';
import { evaluate } from './conditions';
import { applyEffects, eventMultiplier, resolveOutcome } from './effects';
import { Rng } from './rng';
import { planSegment, takeNext } from './selection';
import { joinParagraphs, renderText } from './text';
import {
  INCLINATIONS,
  TRAITS,
  type BirthCircumstances,
  type Choice,
  type GameEvent,
  type GameState,
  type Gender,
  type Sensitivity,
  type SubChoice,
  type WarningLevel,
} from './types';

/**
 * The game state machine. All functions mutate the given state in place; the
 * caller (UI or simulator) saves it afterwards.
 *
 *   birth ──advance──▶ event ──choose/skip──▶ outcome ──advance──▶ event …
 *                                             (segment done) ──▶ bridge ──▶ …
 *                                             (stage done)   ──▶ stageEnd
 */
export class Game {
  readonly idx: ContentIndex;

  constructor(
    readonly content: Content,
    readonly state: GameState,
  ) {
    this.idx = indexContent(content);
  }

  // -------------------------------------------------------------------------
  // Creation
  // -------------------------------------------------------------------------

  /**
   * Start a new life. `birth`/`gender` may be supplied (tests, a future
   * "choose your own" mode); otherwise they are rolled from the seed.
   */
  static create(
    content: Content,
    opts: { name: string; seed: string; birth?: BirthCircumstances; gender?: Gender },
  ): Game {
    const rng = Rng.fromSeed(opts.seed);
    const gender = opts.gender ?? randomGender(rng);
    const birth = opts.birth ?? generateBirth(rng, content.birth);
    const firstStage = content.stages[0];
    if (!firstStage) throw new Error('Content has no stages');
    const state: GameState = {
      seed: opts.seed,
      rng: rng.getState(),
      character: { name: opts.name, gender, ageMonths: 0, stage: firstStage.id },
      birth,
      traits: Object.fromEntries(TRAITS.map((t) => [t, 50])) as GameState['traits'],
      stress: 0,
      inclinations: Object.fromEntries(INCLINATIONS.map((i) => [i, 0])) as GameState['inclinations'],
      flags: [],
      history: [],
      followUps: [],
      progress: { segmentIndex: 0, slots: null },
      phase: { kind: 'birth' },
      archived: false,
    };
    applyBirthModifiers(state, rng, content);
    state.rng = rng.getState();
    return new Game(content, state);
  }

  // -------------------------------------------------------------------------
  // Queries for the UI
  // -------------------------------------------------------------------------

  get currentEvent(): GameEvent | undefined {
    const p = this.state.phase;
    return p.kind === 'event' || p.kind === 'outcome' ? this.idx.events.get(p.eventId) : undefined;
  }

  render(text: Parameters<typeof renderText>[0]): string {
    return renderText(text, this.state, this.content);
  }

  birthNarrative(): string {
    return this.render(this.content.narrative.birth);
  }

  /** Visible options for the current tier (hidden ones removed, locked ones flagged). */
  visibleChoices(): Array<{ id: string; text: string; locked: boolean; hint?: string }> {
    const p = this.state.phase;
    const ev = this.currentEvent;
    if (p.kind !== 'event' || !ev) return [];
    const list: Array<Choice | SubChoice> = p.tier1
      ? (this.findChoice(ev, p.tier1).subChoices ?? [])
      : ev.choices;
    return list
      .filter((c) => evaluate(c.showIf, this.state))
      .map((c) => {
        const locked = c.lockedIf ? evaluate(c.lockedIf.when, this.state) : false;
        return {
          id: c.id,
          text: this.render(c.text),
          locked,
          hint: locked && c.lockedIf ? this.render(c.lockedIf.hint) : undefined,
        };
      });
  }

  /** Whether the current event should show a sensitivity warning first. */
  needsWarning(level: WarningLevel): boolean {
    const p = this.state.phase;
    const ev = this.currentEvent;
    if (p.kind !== 'event' || !ev || p.gatePassed || p.tier1) return false;
    return shouldWarn(ev.sensitivity, level);
  }

  // -------------------------------------------------------------------------
  // Transitions
  // -------------------------------------------------------------------------

  /** Move on from birth, outcome or bridge screens. */
  advance(): void {
    const s = this.state;
    const k = s.phase.kind;
    if (k !== 'birth' && k !== 'outcome' && k !== 'bridge') {
      throw new Error(`advance() not allowed during "${k}"`);
    }
    const rng = new Rng(s.rng);
    const stage = this.content.stages.find((st) => st.id === s.character.stage);
    if (!stage) throw new Error(`Stage "${s.character.stage}" is not in this build`);

    for (;;) {
      const seg = stage.segments[s.progress.segmentIndex];
      if (!seg) {
        s.phase = { kind: 'stageEnd', stageId: stage.id };
        break;
      }
      if (s.progress.slots === null) s.progress.slots = planSegment(seg, s, rng, this.idx);

      const pick = takeNext(this.content, this.idx, seg, s, rng);
      if (pick) {
        s.character.ageMonths = pick.age;
        s.phase = { kind: 'event', eventId: pick.event.id, gatePassed: false };
        break;
      }

      // Segment exhausted: time skips to its end, stress settles a little,
      // then the bridge summary (if any) is shown.
      s.progress = { segmentIndex: s.progress.segmentIndex + 1, slots: null };
      s.character.ageMonths = Math.max(s.character.ageMonths, seg.ageMonths[1]);
      const r = this.content.rules;
      s.stress += (r.stressDefault - s.stress) * r.stressRecoveryBetweenSegments;
      if (seg.bridge) {
        const text = this.render(seg.bridge.text); // render before effects
        applyEffects(s, seg.bridge.effects, 1, this.content.rules);
        if (text) {
          s.phase = { kind: 'bridge', text };
          break;
        }
      }
    }
    s.rng = rng.getState();
  }

  /** Player passed the sensitivity warning. */
  readOn(): void {
    const p = this.state.phase;
    if (p.kind === 'event') p.gatePassed = true;
  }

  /**
   * Skip a sensitive event: show its non-detailed summary and apply its
   * (reduced) skip effects so the story stays consistent.
   */
  skipEvent(): void {
    const s = this.state;
    const ev = this.requireEventPhase();
    const text = this.render(ev.skip?.text);
    applyEffects(s, ev.skip?.effects, eventMultiplier(ev, s.character.ageMonths, this.content.rules), this.content.rules);
    s.history.push({ eventId: ev.id, ageMonths: s.character.ageMonths, skipped: true });
    s.phase = { kind: 'outcome', eventId: ev.id, text, skipped: true };
  }

  /**
   * Choose an option. On tier 1 with sub-choices this only records the tier-1
   * pick (it is final); otherwise the outcome resolves immediately.
   */
  choose(id: string): void {
    const s = this.state;
    const ev = this.requireEventPhase();
    const p = s.phase as Extract<GameState['phase'], { kind: 'event' }>;
    const available = this.visibleChoices().find((c) => c.id === id);
    if (!available || available.locked) throw new Error(`Choice "${id}" is not available`);

    if (!p.tier1) {
      const choice = this.findChoice(ev, id);
      if (choice.subChoices?.length) {
        p.tier1 = id;
        return;
      }
      this.resolve(ev, choice.id, undefined, choice.outcome!);
      return;
    }
    const tier1 = this.findChoice(ev, p.tier1);
    const sub = tier1.subChoices?.find((c) => c.id === id);
    if (!sub) throw new Error(`Sub-choice "${id}" not found`);
    this.resolve(ev, tier1.id, sub.id, sub.outcome);
  }

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  private resolve(ev: GameEvent, choiceId: string, subChoiceId: string | undefined, outcome: Choice['outcome'] & {}): void {
    const s = this.state;
    const res = resolveOutcome(outcome, s, this.content);
    // Render with the state *before* the effects land.
    const text = joinParagraphs(...res.texts.map((t) => this.render(t)));
    const mult = eventMultiplier(ev, s.character.ageMonths, this.content.rules);
    for (const e of res.effects) applyEffects(s, e, mult, this.content.rules);
    if (res.followUp) {
      s.followUps.push({
        eventId: res.followUp.event,
        dueMonths: s.character.ageMonths + (res.followUp.delayMonths ?? 0),
      });
    }
    s.history.push({ eventId: ev.id, ageMonths: s.character.ageMonths, choiceId, subChoiceId });
    s.phase = { kind: 'outcome', eventId: ev.id, text, skipped: false };
  }

  private requireEventPhase(): GameEvent {
    const ev = this.currentEvent;
    if (this.state.phase.kind !== 'event' || !ev) throw new Error('Not in an event');
    return ev;
  }

  private findChoice(ev: GameEvent, id: string): Choice {
    const c = ev.choices.find((ch) => ch.id === id);
    if (!c) throw new Error(`Choice "${id}" not found in "${ev.id}"`);
    return c;
  }
}

const SENSITIVITY_RANK: Record<Sensitivity, number> = { none: 0, mild: 1, moderate: 2, heavy: 3 };

export function shouldWarn(sensitivity: Sensitivity, level: WarningLevel): boolean {
  if (level === 'never') return false;
  const min = level === 'every' ? SENSITIVITY_RANK.mild : SENSITIVITY_RANK.heavy;
  return SENSITIVITY_RANK[sensitivity] >= min;
}
