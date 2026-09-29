# Life Sim

A text-only life simulation for the browser. You live one randomly generated
life, making small choices at key moments. Choices shape hidden personality
traits, which change what happens later. There is no winning or losing; at the
end you see who this person became, and can compare them with previous lives.

**Current milestone:** engine, UI, save system and stage 1 (birth to age 3).

**Play it:** https://natthaphat-math.github.io/Life-sim/ (rebuilt automatically
on every push to `main` by `.github/workflows/deploy.yml`, after the tests and
content validator pass). Saves stay in your own browser's localStorage; nothing
is sent anywhere.

## Running it

```bash
npm install
npm run dev          # local dev server (open the printed URL, works on a phone on the same Wi-Fi with --host)
npm run build        # typecheck + static build into dist/ (relative paths, host anywhere)
npm run preview      # serve the built dist/

npm test             # unit tests (Vitest)
npm run validate     # content validator
npm run sim          # headless balance simulator (see below)
npm run typecheck
```

Debugging in the browser:

- `?debug=1` shows a panel with the hidden values under every event.
- `?seed=anything` makes new lives reproducible: the same seed plus the same
  choices always gives the same life.

## Project layout

```
src/
  engine/        game rules only, no player-facing text
    types.ts       all TypeScript types (state + content schema)
    schema.ts      Zod runtime schemas mirroring types.ts
    conditions.ts  all/any/not condition evaluator (pure)
    effects.ts     age multiplier, soft cap, caregiver reactions
    text.ts        {variables} and conditional text fragments
    selection.ts   segment planning, weighted draws, follow-ups
    birth.ts       random birth circumstances (separate from the start flow)
    game.ts        the state machine (create / advance / choose / skip)
    narrative.ts   stage-end and life summaries
    validate.ts    content checks (used by the validator script and tests)
    rng.ts         seedable PRNG with serialisable state
  save/          SaveStorage interface, localStorage backend, migrations,
                 settings, archive of finished lives
  content/       everything a writer edits
    rules.ts       balance numbers (multipliers, soft cap, stress recovery…)
    birth.ts       birth weights and starting nudges
    en/            all English text
      events/        one file per event (+ index.ts registry)
      stages/        stage definitions (segments, milestones, bridges)
      reactions.ts   caregiver reaction table
      narrative.ts   birth reveal, trait phrases, memory lines
      strings.ts     UI strings
      vars.ts        words behind {caregiver}, {sibling}, {he}…
      stubs.ts       ~40 event titles for later stages, to be written
    index.ts       content registry
  ui/            screens, modal, SVG charts, styles
scripts/         validate-content.ts, simulate.ts
tests/           unit tests
```

## How a life plays

1. Title → name entry (gender is random) → sensitive-content notice → birth reveal.
2. A **stage** is a list of **segments** (stage 1: 0–6 months, 6–12, 1–2 years,
   2–3 years). Each segment draws a few random events from the eligible pool,
   places one **milestone**, then shows a **bridge** summary.
3. Every choice is final and autosaved. Continue resumes the exact pending
   screen, including a half-made two-tier choice.
4. At the end of the stage, the hidden traits are revealed with a narrative
   summary and a radar chart, and the life is stored for comparison.

### Effects and balance

`effect applied = base delta × age multiplier` (0–3 years: ×3, 3–6: ×2.5,
6–12: ×1.5, 13–18: ×1, 19+: ×0.4). A `turningPoint` event supplies its own
multiplier at any age. Traits are clamped to 0–100.

`rules.softCap` (on by default) adds diminishing returns: a trait moving away
from 50 is slowed by how close it already is to the edge (at 75, gains are
halved). Moves back toward 50 are never slowed. Without it, early-childhood
multipliers push many traits to 100 by age 3.

Stress recovers 30% of the way back to its baseline between segments.

## Adding an event

1. Create `src/content/en/events/<stage>/<id>.ts`:

   ```ts
   import { defineEvent } from '../../../define';

   export default defineEvent({
     id: 'first_haircut',
     stage: 'infancy',
     title: 'The first haircut',
     ageMonths: [12, 24],
     weight: 8,
     sensitivity: 'none',
     text: [
       '{Caregiver} is holding a pair of scissors.',
       { if: { wealth: ['poor'] }, then: 'The barber is Uncle Lek, on a stool in the yard.' },
     ],
     choices: [
       { id: 'sit_still', text: 'Sit very still', outcome: { text: 'Snip.', effects: { traits: { discipline: 1, courage: -1 } }, reaction: 'complied' } },
       {
         id: 'wriggle',
         text: 'Wriggle',
         subChoices: [
           { id: 'cry', text: 'Cry', outcome: { text: '…', reaction: 'comfort_fear' } },
           { id: 'laugh', text: 'Laugh', outcome: { text: '…', effects: { traits: { courage: 1, discipline: -1 } } } },
         ],
       },
     ],
   });
   ```

2. Add it to `src/content/en/events/index.ts` (and remove its stub if it had one).
3. Run `npm run validate`, then `npm run sim` to see how often it appears.

Writing guidelines: short, concrete prose from the child's point of view in
the second person ("you"). No choice is right or wrong: give each option a
cost as well as a gain. Adults are tired, stressed, doing their best, never
villains. Poor families have warmth, creativity and pride.

## Schema reference

### Event

| Field | Type | Notes |
|---|---|---|
| `id` | `lower_snake_case` | unique |
| `stage` | `infancy` \| `kindergarten` \| `primary` \| `secondary` \| `university` \| `working` | |
| `title`, `text` | Text | see Text below |
| `ageMonths` | `[min, max]` | inclusive window for random draws |
| `weight` | number | relative draw weight (0 for milestones/follow-ups) |
| `conditions` | Condition | event only appears when this holds |
| `sensitivity` | `none` \| `mild` \| `moderate` \| `heavy` | stage 1 allows up to `moderate` |
| `skip` | `{ text, effects? }` | required unless `sensitivity: 'none'`; shown when the player skips; use small effects |
| `turningPoint` | `{ multiplier }` | replaces the age multiplier |
| `milestone` | boolean | placed by a segment, never drawn randomly |
| `followUpOnly` | boolean | only reachable through a `followUp` |
| `repeatable` | boolean | may happen more than once per life |
| `choices` | Choice[] (2–4) | |

### Choice (tier 1) and SubChoice (tier 2)

| Field | Notes |
|---|---|
| `id`, `text` | |
| `showIf` | Condition. The option is hidden unless it holds (e.g. `{ trait: 'empathy', min: 58 }`) |
| `lockedIf` | `{ when: Condition, hint: Text }`. The option is shown disabled with a gentle hint |
| `outcome` | leaf outcome |
| `subChoices` | 2–3 SubChoices (tier 1 only). A choice has exactly one of `outcome` / `subChoices` |

SubChoices cannot have `subChoices`: the schema and validator enforce the
two-tier maximum. Each tier must have at least one option with no
`showIf`/`lockedIf`, so the player can never be stuck.

### Outcome

| Field | Notes |
|---|---|
| `text` | outcome text (needs `text` or `reaction`) |
| `effects` | `{ traits?, stress?, inclinations?, setFlags?, clearFlags? }`; deltas are base values (±1…3) before the multiplier |
| `reaction` | key into `reactions.ts`, resolved by parenting style |
| `followUp` | `{ event, delayMonths? }` schedules another event; due follow-ups go first and replace one random draw |
| `variants` | `[{ if, text?, effects?, reaction?, followUp? }]`. The first match overrides the fields it defines |

Resolution order: base outcome → first matching variant (shallow override) →
caregiver reaction (its text is appended, its effects are added).

### Caregiver reaction table

`reactions.ts` maps a reaction id to five entries, one per parenting style
(`indulgent`, `strict`, `neglectful`, `freeRange`, `warmBalanced`), each
`{ text, effects? }`. Write a choice once with `reaction: 'defiance'` and it
resolves differently for each family.

### Condition

Composable with `{ all: [...] }`, `{ any: [...] }`, `{ not: ... }`. Leaves:

```
{ flag: 'picky_eater' }            { seen: 'event_id' }
{ trait: 'courage', min?, max? }   { stress: { min?, max? } }   { age: { min?, max? } }  // months
{ wealth: [...] }  { wealthTag: [...] }  { temperament: [...] }  { parenting: [...] }
{ caregiver: [...] }  { siblings: [...] }  { env: [...] }  { health: [...] }
{ parents: ['smooth' | 'strained'] }  { gender: ['boy' | 'girl'] }
```

### Text

A string, or a list of strings and `{ if, then, else? }` fragments joined with
spaces. `"\n\n"` starts a new paragraph. Variables (capitalise the first letter
for a capitalised word, e.g. `{Caregiver}`, `{He}`):

| Variable | Meaning |
|---|---|
| `{name}` | character name |
| `{he}` `{him}` `{his}` `{kid}` | he/she, him/her, his/her, boy/girl |
| `{caregiver}` | primary caregiver (Mom, Dad, Grandma, Auntie…) |
| `{cg_he}` `{cg_him}` `{cg_his}` | caregiver pronouns (`{cg_him}self` works) |
| `{caregivers}` | the people raising the child ("Mom and Dad") |
| `{sibling}` `{older_sibling}` `{younger_sibling}` | "your big sister", etc. |

### Stage

A stage (`src/content/en/stages/`) has `segments`: `ageMonths` (half-open
`[start, end)`), `draws: [min, max]`, `milestone` (an id or `{ oneOf: [...] }`)
and an optional `bridge: { text, effects? }`. To add a stage, write its file
and append it to `stages` in `src/content/index.ts`. The engine does not
change.

## Content validator

`npm run validate` checks every event against the schema and also checks:
two-tier maximum, unique ids, follow-up and reaction references, milestone
references, flags read by any condition are set somewhere, no dead-end choice
tiers, unknown `{variables}`, random events reachable by some segment, and no
`heavy` events in stage 1. It warns about thin segment pools, `followUpOnly`
events nothing schedules, and flags that are set but never read. Some flags are
deliberately kept for later stages. It exits with code 1 on errors.

## Simulator

```bash
npm run sim                              # 1000 lives, seed "sim"
npm run sim -- --lives 5000 --seed t2    # more lives, different seed
npm run sim -- --skip 0.3                # skip 30% of sensitive events
npm run sim -- --json sim.json           # write raw numbers too
```

It plays lives with random choices and reports trait, stress and inclination
distributions, events per life, the average trait level by parenting style
(these should overlap, not separate), how often each event appears, events and
options that never appeared, flag frequencies and runtime errors. Every step
is also run through a save/load round trip.

## Saves

- Autosave after every resolution to `localStorage` (`lifesim.save`), with a
  `version` and `migrate()` hook in `src/save/migrations.ts`.
- Storage goes through the `SaveStorage` interface. `exportSave(state)` and
  `importSave(json)` in `saveManager.ts` are already the export/import format,
  so a JSON import/export UI only needs buttons.
- A corrupted or unknown-version save is cleared with a short message
  instead of crashing the app.
- Finished lives are kept in `lifesim.lives` (newest 20) for "Previous lives".
