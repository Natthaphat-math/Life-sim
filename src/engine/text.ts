import type { Content } from './content';
import { evaluate } from './conditions';
import type { GameState, Text } from './types';

/** Resolve conditional fragments and variables into a plain string. */
export function renderText(text: Text | undefined, s: GameState, content: Content): string {
  if (text === undefined) return '';
  const raw =
    typeof text === 'string'
      ? text
      : text
          .map((part) => {
            if (typeof part === 'string') return part;
            return evaluate(part.if, s) ? part.then : (part.else ?? '');
          })
          .filter((p) => p.length > 0)
          .join(' ');
  return interpolate(raw, textVariables(s, content));
}

/** Join several rendered texts as separate paragraphs, dropping empty ones. */
export function joinParagraphs(...parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join('\n\n');
}

export function interpolate(str: string, vars: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (m, key: string) => (key in vars ? (vars[key] as string) : m));
}

/**
 * Variables available in every text:
 *   {name}
 *   {he} {him} {his} {kid}          – the character (he/she, him/her, his/her, boy/girl)
 *   {caregiver} {cg_he} {cg_him} {cg_his} – primary caregiver and their pronouns
 *   {caregivers}                    – the people raising the child
 *   {sibling} {older_sibling} {younger_sibling}
 * Capitalised forms ({He}, {Caregiver}, …) are generated automatically.
 */
export function textVariables(s: GameState, content: Content): Record<string, string> {
  const v = content.vars;
  const b = s.birth;
  const p = v.pronoun[s.character.gender];
  const cg = v.caregiverPerson[b.caregiverPerson];
  const older = b.olderSibling ? v.olderSibling[b.olderSibling] : undefined;
  const younger = b.youngerSibling ? v.youngerSibling[b.youngerSibling] : undefined;
  const base: Record<string, string> = {
    name: s.character.name,
    he: p.he,
    him: p.him,
    his: p.his,
    kid: p.kid,
    caregiver: cg.name,
    cg_he: cg.he,
    cg_him: cg.him,
    cg_his: cg.his,
    caregivers: v.caregivers[b.caregiver],
    sibling: older ?? younger ?? v.noSibling,
    older_sibling: older ?? v.noSibling,
    younger_sibling: younger ?? v.noSibling,
  };
  const out: Record<string, string> = { ...base };
  for (const [k, val] of Object.entries(base)) out[capitalize(k)] = capitalize(val);
  return out;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
