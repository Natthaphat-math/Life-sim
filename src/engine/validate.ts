import type { Content } from './content';
import { flagsReadBy } from './conditions';
import { eventSchema } from './schema';
import type { Condition, Effects, Outcome, Text } from './types';

export interface ValidationReport {
  errors: string[];
  warnings: string[];
}

/** Known {variables}; capitalised forms are also accepted. */
const VARS = new Set([
  'name', 'he', 'him', 'his', 'kid',
  'caregiver', 'cg_he', 'cg_him', 'cg_his', 'caregivers',
  'sibling', 'older_sibling', 'younger_sibling',
]);

/**
 * Static checks over the whole content bundle:
 *  - every event matches the schema (which also enforces max two choice tiers)
 *  - ids are unique; follow-up, reaction and milestone references exist
 *  - every flag read by a condition is set somewhere
 *  - no dead ends: each choice tier has at least one unconditional option
 *  - random events can actually be drawn by some segment
 *  - text only uses known {variables}
 */
export function validateContent(content: Content): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();
  const flagsRead = new Map<string, string>(); // flag -> where
  const flagsSet = new Set<string>();
  const followUpTargets = new Set<string>();

  const readCond = (c: Condition | undefined, where: string) => {
    for (const f of flagsReadBy(c)) if (!flagsRead.has(f)) flagsRead.set(f, where);
  };
  const readText = (t: Text | undefined, where: string) => {
    if (t === undefined) return;
    const parts = typeof t === 'string' ? [t] : t;
    for (const p of parts) {
      const strs = typeof p === 'string' ? [p] : [p.then, p.else ?? ''];
      if (typeof p !== 'string') readCond(p.if, where);
      for (const s of strs) {
        for (const m of s.matchAll(/\{(\w+)\}/g)) {
          const v = m[1] as string;
          if (!VARS.has(v) && !VARS.has(v.charAt(0).toLowerCase() + v.slice(1))) {
            errors.push(`${where}: unknown variable {${v}}`);
          }
        }
      }
    }
  };
  const setEffects = (e: Effects | undefined) => e?.setFlags?.forEach((f) => flagsSet.add(f));

  // --- Reactions ----------------------------------------------------------
  for (const [rid, table] of Object.entries(content.reactions)) {
    for (const [style, r] of Object.entries(table)) {
      readText(r.text, `reaction ${rid}.${style}`);
      setEffects(r.effects);
    }
  }

  // --- Events -------------------------------------------------------------
  const checkOutcome = (o: Outcome, where: string) => {
    const bodies = [o, ...(o.variants ?? [])];
    for (const b of bodies) {
      readText(b.text, where);
      setEffects(b.effects);
      if (b.reaction && !content.reactions[b.reaction]) errors.push(`${where}: unknown reaction "${b.reaction}"`);
      if (b.followUp) followUpTargets.add(b.followUp.event);
    }
    for (const v of o.variants ?? []) readCond(v.if, where);
  };

  const hasFreeOption = (list: Array<{ showIf?: Condition; lockedIf?: unknown }>) =>
    list.some((c) => !c.showIf && !c.lockedIf);

  for (const ev of content.events) {
    const where = `event ${ev.id}`;
    const parsed = eventSchema.safeParse(ev);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) errors.push(`${where}: ${issue.path.join('.')} ${issue.message}`);
    }
    if (ids.has(ev.id)) errors.push(`${where}: duplicate id`);
    ids.add(ev.id);

    readCond(ev.conditions, where);
    readText(ev.title, where);
    readText(ev.text, where);
    if (ev.skip) {
      readText(ev.skip.text, `${where} skip`);
      setEffects(ev.skip.effects);
    }
    if (!hasFreeOption(ev.choices)) errors.push(`${where}: every option is conditional (possible dead end)`);
    for (const ch of ev.choices) {
      const cw = `${where} > ${ch.id}`;
      readText(ch.text, cw);
      readCond(ch.showIf, cw);
      readCond(ch.lockedIf?.when, cw);
      if (ch.outcome) checkOutcome(ch.outcome, cw);
      if (ch.subChoices) {
        if (!hasFreeOption(ch.subChoices)) errors.push(`${cw}: every sub-option is conditional (possible dead end)`);
        for (const sc of ch.subChoices) {
          const sw = `${cw} > ${sc.id}`;
          readText(sc.text, sw);
          readCond(sc.showIf, sw);
          readCond(sc.lockedIf?.when, sw);
          if ((sc as { subChoices?: unknown }).subChoices) errors.push(`${sw}: third choice tier is not allowed`);
          checkOutcome(sc.outcome, sw);
        }
      }
    }
    if (ev.stage === 'infancy' && ev.sensitivity === 'heavy') {
      errors.push(`${where}: stage 1 may only use mild or moderate sensitivity`);
    }
  }

  for (const target of followUpTargets) {
    if (!ids.has(target)) errors.push(`follow-up target "${target}" does not exist`);
  }
  for (const ev of content.events) {
    if (ev.followUpOnly && !followUpTargets.has(ev.id)) warnings.push(`event ${ev.id}: followUpOnly but nothing schedules it`);
  }

  // --- Stages ------------------------------------------------------------
  const milestoneIds = new Set<string>();
  for (const st of content.stages) {
    readText(st.title, `stage ${st.id}`);
    let prevEnd = 0;
    for (const seg of st.segments) {
      const where = `stage ${st.id} segment ${seg.id}`;
      if (seg.ageMonths[0] !== prevEnd) warnings.push(`${where}: does not start where the previous segment ended`);
      prevEnd = seg.ageMonths[1];
      if (seg.draws[0] > seg.draws[1]) errors.push(`${where}: draws must be [min, max]`);
      const ms = seg.milestone === undefined ? [] : typeof seg.milestone === 'string' ? [seg.milestone] : seg.milestone.oneOf;
      for (const m of ms) {
        milestoneIds.add(m);
        const ev = content.events.find((e) => e.id === m);
        if (!ev) errors.push(`${where}: milestone "${m}" does not exist`);
        else if (!ev.milestone) errors.push(`${where}: "${m}" is not marked milestone: true`);
      }
      if (seg.bridge) {
        readText(seg.bridge.text, `${where} bridge`);
        setEffects(seg.bridge.effects);
      }
      // Pool size: random events whose window starts inside this segment.
      const pool = content.events.filter(
        (e) => e.stage === st.id && !e.milestone && !e.followUpOnly && e.ageMonths[0] < seg.ageMonths[1] && e.ageMonths[1] >= seg.ageMonths[0],
      );
      const unconditional = pool.filter((e) => !e.conditions);
      if (unconditional.length < seg.draws[1]) {
        warnings.push(`${where}: only ${unconditional.length} unconditional events for up to ${seg.draws[1]} draws`);
      }
    }
    // Random events that no segment can reach.
    for (const ev of content.events.filter((e) => e.stage === st.id && !e.milestone && !e.followUpOnly)) {
      const reachable = st.segments.some((seg) => ev.ageMonths[0] < seg.ageMonths[1] && ev.ageMonths[1] >= seg.ageMonths[0]);
      if (!reachable) errors.push(`event ${ev.id}: age window matches no segment of stage ${st.id}`);
    }
  }
  for (const ev of content.events) {
    if (ev.milestone && !milestoneIds.has(ev.id)) warnings.push(`event ${ev.id}: milestone not placed by any segment`);
  }

  // --- Birth modifiers and narrative ------------------------------------------
  content.birth.modifiers.forEach((m, i) => {
    readCond(m.if, `birth modifier #${i}`);
    setEffects(m.effects);
  });
  readText(content.narrative.birth, 'narrative.birth');
  for (const [k, t] of Object.entries(content.narrative.flagLines)) readText(t, `narrative.flagLines.${k}`);

  // --- Flags ----------------------------------------------------------------
  for (const [flag, where] of flagsRead) {
    if (!flagsSet.has(flag)) errors.push(`${where}: reads flag "${flag}" that is never set`);
  }
  const mentioned = new Set(Object.keys(content.narrative.flagLines));
  for (const flag of flagsSet) {
    if (!flagsRead.has(flag) && !mentioned.has(flag)) warnings.push(`flag "${flag}" is set but never read or mentioned`);
  }
  for (const flag of mentioned) {
    if (!flagsSet.has(flag)) warnings.push(`narrative.flagLines.${flag}: flag is never set`);
  }

  // --- Stubs ------------------------------------------------------------------
  for (const s of content.stubs) {
    if (ids.has(s.id)) warnings.push(`stub ${s.id}: an event with this id already exists (remove the stub)`);
  }

  return { errors, warnings };
}

