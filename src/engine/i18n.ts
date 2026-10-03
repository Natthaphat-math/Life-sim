/**
 * Localisation overlay.
 *
 * Events are authored once, in English, with all their logic (conditions,
 * effects, follow-ups). Another language is a *text-only* pack that mirrors
 * the event structure by id. `localize()` merges a pack onto the base content,
 * so every language shares exactly the same rules and balance.
 */
import type { Content, NarrativeContent, TextVars } from './content';
import type { GameEvent, Outcome, ParentingStyle, StageDef, Text } from './types';

export const LOCALES = ['th', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'th';

export interface OutcomeText {
  text?: Text;
  /** By index, matching the base outcome's `variants`; only those with text need an entry. */
  variants?: Array<Text | undefined>;
}
export interface SubChoiceText {
  text: Text;
  hint?: Text;
  outcome: OutcomeText;
}
export interface ChoiceText {
  text: Text;
  hint?: Text;
  outcome?: OutcomeText;
  subChoices?: Record<string, SubChoiceText>;
}
export interface EventText {
  title: Text;
  text: Text;
  skip?: Text;
  choices: Record<string, ChoiceText>;
}
export interface StageText {
  title: Text;
  endCard: Text;
  bridges: Record<string, Text>;
}

export interface LocalePack<S> {
  locale: Locale;
  events: Record<string, EventText>;
  reactions: Record<string, Record<ParentingStyle, Text>>;
  stages: Record<string, StageText>;
  narrative: NarrativeContent;
  vars: TextVars;
  strings: S;
}

/**
 * Build a localised Content. Any text the pack does not provide falls back to
 * the base text and is listed in `missing` (the validator reports these).
 */
export function localize<S>(base: Content<S>, pack: LocalePack<S>): { content: Content<S>; missing: string[] } {
  const missing: string[] = [];
  const pick = (t: Text | undefined, baseText: Text | undefined, path: string): Text | undefined => {
    if (baseText === undefined) return t;
    if (t === undefined) {
      missing.push(path);
      return baseText;
    }
    return t;
  };

  const outcome = (o: Outcome, tr: OutcomeText | undefined, path: string): Outcome => ({
    ...o,
    text: pick(tr?.text, o.text, `${path}.text`),
    variants: o.variants?.map((v, i) => ({ ...v, text: pick(tr?.variants?.[i], v.text, `${path}.variants[${i}]`) })),
  });

  const events: GameEvent[] = base.events.map((ev) => {
    const tr = pack.events[ev.id];
    const p = `events.${ev.id}`;
    if (!tr) missing.push(p);
    return {
      ...ev,
      title: pick(tr?.title, ev.title, `${p}.title`)!,
      text: pick(tr?.text, ev.text, `${p}.text`)!,
      skip: ev.skip && { ...ev.skip, text: pick(tr?.skip, ev.skip.text, `${p}.skip`)! },
      choices: ev.choices.map((c) => {
        const ct = tr?.choices[c.id];
        const cp = `${p}.choices.${c.id}`;
        return {
          ...c,
          text: pick(ct?.text, c.text, `${cp}.text`)!,
          lockedIf: c.lockedIf && { ...c.lockedIf, hint: pick(ct?.hint, c.lockedIf.hint, `${cp}.hint`)! },
          outcome: c.outcome && outcome(c.outcome, ct?.outcome, `${cp}.outcome`),
          subChoices: c.subChoices?.map((sc) => {
            const st = ct?.subChoices?.[sc.id];
            const sp = `${cp}.subChoices.${sc.id}`;
            return {
              ...sc,
              text: pick(st?.text, sc.text, `${sp}.text`)!,
              lockedIf: sc.lockedIf && { ...sc.lockedIf, hint: pick(st?.hint, sc.lockedIf.hint, `${sp}.hint`)! },
              outcome: outcome(sc.outcome, st?.outcome, `${sp}.outcome`),
            };
          }),
        };
      }),
    };
  });

  const reactions = Object.fromEntries(
    Object.entries(base.reactions).map(([id, table]) => [
      id,
      Object.fromEntries(
        Object.entries(table).map(([style, r]) => [
          style,
          { ...r, text: pick(pack.reactions[id]?.[style as ParentingStyle], r.text, `reactions.${id}.${style}`)! },
        ]),
      ),
    ]),
  ) as Content['reactions'];

  const stages: StageDef[] = base.stages.map((st) => {
    const tr = pack.stages[st.id];
    const p = `stages.${st.id}`;
    return {
      ...st,
      title: pick(tr?.title, st.title, `${p}.title`)!,
      endCard: { title: pick(tr?.endCard, st.endCard.title, `${p}.endCard`)! },
      segments: st.segments.map((seg) => ({
        ...seg,
        bridge: seg.bridge && { ...seg.bridge, text: pick(tr?.bridges[seg.id], seg.bridge.text, `${p}.bridges.${seg.id}`)! },
      })),
    };
  });

  return {
    content: { ...base, locale: pack.locale, events, reactions, stages, narrative: pack.narrative, vars: pack.vars, strings: pack.strings },
    missing,
  };
}
