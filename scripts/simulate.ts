/**
 * Headless simulator: plays N lives with random choices and reports balance.
 *
 *   npm run sim                      # 1000 lives
 *   npm run sim -- --lives 5000 --seed tune1
 *   npm run sim -- --skip 0.2        # skip 20% of sensitive events
 *   npm run sim -- --json out.json   # also write raw numbers
 *   npm run sim -- --locale en       # play in English (default: th)
 *
 * Reports trait/stress/inclination distributions, events per life, event and
 * option coverage (what never appears), flag frequency and runtime errors.
 */
import { writeFileSync } from 'node:fs';
import { contents } from '../src/content';
import type { Locale } from '../src/engine/i18n';
import { Game } from '../src/engine/game';
import { Rng } from '../src/engine/rng';
import { INCLINATIONS, TRAITS } from '../src/engine/types';
import { exportSave, importSave } from '../src/save/saveManager';

const args = process.argv.slice(2);
const arg = (name: string, def: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? (args[i + 1] as string) : def;
};
const LIVES = Number(arg('lives', '1000'));
const SEED = arg('seed', 'sim');
const SKIP_RATE = Number(arg('skip', '0.1'));
const JSON_OUT = arg('json', '');
const LOCALE = arg('locale', 'th') as Locale;
const content = contents[LOCALE];
if (!content) throw new Error(`Unknown locale ${LOCALE}`);
const MAX_STEPS = 500;

const traitValues: Record<string, number[]> = {};
const eventCount = new Map<string, number>();
const optionSeen = new Map<string, number>();
const flagCount = new Map<string, number>();
const eventsPerLife: number[] = [];
const errors: string[] = [];
const byStyle = new Map<string, number[]>();

const push = (k: string, v: number) => (traitValues[k] ??= []).push(v);
const inc = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);

const decide = Rng.fromSeed(`${SEED}-choices`);

for (let i = 0; i < LIVES; i++) {
  const seed = `${SEED}-${i}`;
  try {
    const game = Game.create(content, { name: 'Sim', seed, locales: Object.values(contents) });
    const s = game.state;
    let steps = 0;
    while (s.phase.kind !== 'stageEnd') {
      if (++steps > MAX_STEPS) throw new Error('step limit reached (infinite loop?)');
      const p = s.phase;
      if (p.kind === 'event') {
        if (!p.tier1 && game.needsWarning('every') && decide.next() < SKIP_RATE) {
          game.skipEvent();
        } else {
          const opts = game.visibleChoices().filter((c) => !c.locked);
          if (opts.length === 0) throw new Error(`dead end in ${p.eventId}${p.tier1 ? ` > ${p.tier1}` : ''}`);
          const pick = decide.pick(opts);
          inc(optionSeen, `${p.eventId} > ${p.tier1 ? `${p.tier1} > ` : ''}${pick.id}`);
          game.choose(pick.id);
        }
      } else {
        game.advance();
      }
      // Every step must survive a save round trip.
      const back = importSave(exportSave(s));
      if (back.status !== 'ok') throw new Error(`save round trip failed: ${back.status === 'corrupt' ? back.reason : ''}`);
    }
    const evs = s.history.map((h) => h.eventId);
    eventsPerLife.push(evs.length);
    for (const e of evs) inc(eventCount, e);
    for (const f of s.flags) inc(flagCount, f);
    for (const t of TRAITS) push(t, s.traits[t]);
    push('stress', s.stress);
    for (const inc2 of INCLINATIONS) push(`inc:${inc2}`, s.inclinations[inc2]);
    const avg = TRAITS.reduce((a, t) => a + s.traits[t], 0) / TRAITS.length;
    const list = byStyle.get(s.birth.parenting) ?? [];
    list.push(avg);
    byStyle.set(s.birth.parenting, list);
  } catch (err) {
    errors.push(`${seed}: ${(err as Error).message}`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const stats = (xs: number[]) => {
  const a = [...xs].sort((x, y) => x - y);
  const q = (p: number) => a[Math.min(a.length - 1, Math.floor(p * a.length))] ?? 0;
  const mean = a.reduce((x, y) => x + y, 0) / (a.length || 1);
  const sd = Math.sqrt(a.reduce((x, y) => x + (y - mean) ** 2, 0) / (a.length || 1));
  return { mean, sd, min: a[0] ?? 0, p10: q(0.1), p50: q(0.5), p90: q(0.9), max: a[a.length - 1] ?? 0 };
};
const f = (n: number) => n.toFixed(1).padStart(6);

console.log(`\nLife Sim — ${LIVES} simulated lives (seed "${SEED}", skip rate ${SKIP_RATE}, locale ${LOCALE})\n`);
console.log('Distribution          mean     sd    min    p10    p50    p90    max');
for (const [k, xs] of Object.entries(traitValues)) {
  const s = stats(xs);
  console.log(`${k.padEnd(20)} ${f(s.mean)} ${f(s.sd)} ${f(s.min)} ${f(s.p10)} ${f(s.p50)} ${f(s.p90)} ${f(s.max)}`);
}

const epl = stats(eventsPerLife);
console.log(`\nEvents per life: mean ${epl.mean.toFixed(1)}, min ${epl.min}, max ${epl.max}`);

console.log('\nAverage trait by parenting style (should overlap, not separate):');
for (const [style, xs] of byStyle) {
  const s = stats(xs);
  console.log(`  ${style.padEnd(14)} n=${String(xs.length).padStart(5)}  mean ${f(s.mean)}  p10 ${f(s.p10)}  p90 ${f(s.p90)}`);
}

console.log('\nEvent coverage (share of lives):');
const playable = content.events.filter((e) => content.stages.some((st) => st.id === e.stage));
for (const ev of [...playable].sort((a, b) => (eventCount.get(b.id) ?? 0) - (eventCount.get(a.id) ?? 0))) {
  const n = eventCount.get(ev.id) ?? 0;
  const tag = ev.milestone ? ' (milestone)' : ev.followUpOnly ? ' (follow-up)' : ev.conditions ? ' (conditional)' : '';
  console.log(`  ${((100 * n) / LIVES).toFixed(1).padStart(5)}%  ${ev.id}${tag}`);
}
const never = playable.filter((e) => !eventCount.has(e.id)).map((e) => e.id);
console.log(never.length ? `\nNEVER APPEARED: ${never.join(', ')}` : '\nEvery event appeared at least once.');

const allOptions: string[] = [];
for (const ev of playable) {
  for (const c of ev.choices) {
    if (c.subChoices) for (const sc of c.subChoices) allOptions.push(`${ev.id} > ${c.id} > ${sc.id}`);
    else allOptions.push(`${ev.id} > ${c.id}`);
  }
}
const unpicked = allOptions.filter((o) => ![...optionSeen.keys()].some((k) => k === o));
console.log(unpicked.length ? `Options never chosen: ${unpicked.join('; ')}` : 'Every option was chosen at least once.');

console.log('\nFlags (share of lives):');
for (const [flag, n] of [...flagCount].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${((100 * n) / LIVES).toFixed(1).padStart(5)}%  ${flag}`);
}

console.log(errors.length ? `\n${errors.length} RUNTIME ERROR(S):\n  ${errors.slice(0, 20).join('\n  ')}` : '\nNo runtime errors.');

if (JSON_OUT) {
  writeFileSync(
    JSON_OUT,
    JSON.stringify(
      {
        lives: LIVES,
        seed: SEED,
        distributions: Object.fromEntries(Object.entries(traitValues).map(([k, xs]) => [k, stats(xs)])),
        eventCoverage: Object.fromEntries(eventCount),
        flags: Object.fromEntries(flagCount),
        errors,
      },
      null,
      2,
    ),
  );
  console.log(`Wrote ${JSON_OUT}`);
}
process.exit(errors.length ? 1 : 0);
