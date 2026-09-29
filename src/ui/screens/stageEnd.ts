import { content } from '../../content';
import type { Game } from '../../engine/game';
import { summarize } from '../../engine/narrative';
import { INCLINATIONS, TRAITS } from '../../engine/types';
import type { App } from '../app';
import { barList, radarChart } from '../components/charts';
import { h } from '../dom';

/**
 * Stage-complete screen (used as the ending screen for this milestone):
 * narrative summary, the first reveal of the hidden traits, and replay.
 */
export function renderStageEnd(app: App, g: Game): HTMLElement {
  const t = app.t;
  const s = g.state;
  const stage = content.stages.find((st) => st.id === s.character.stage);
  const summary = summarize(s, content, s.character.stage);

  const axes = TRAITS.map((k) => t.traitNames[k]);
  const radar = radarChart(axes, [{ label: s.character.name, values: TRAITS.map((k) => s.traits[k]) }], t.chartTraits);

  // Inclinations are small early on, so they are scaled to the largest one
  // (the printed numbers stay exact).
  const incMax = Math.max(10, ...INCLINATIONS.map((k) => s.inclinations[k]));
  const bars = h(
    'div',
    { class: 'bar-groups' },
    barList([{ label: t.stressLabel, value: s.stress }], 100, t.chartOther),
    barList(
      INCLINATIONS.map((k) => ({ label: t.inclinationNames[k], value: s.inclinations[k] })),
      incMax,
      '',
    ),
  );

  const moments = s.history
    .map((entry) => {
      const ev = g.idx.events.get(entry.eventId);
      return ev ? h('li', {}, g.render(ev.title)) : null;
    })
    .filter(Boolean);

  const back = () => app.play();
  return h(
    'article',
    { class: 'card stage-end' },
    h('div', { class: 'card-body' }, h('h1', {}, stage ? g.render(stage.endCard.title) : t.stageCompleteTitle), summary.map((p) => h('p', {}, p))),
    h('h2', { class: 'section-title' }, t.chartTraits),
    radar,
    bars,
    h('details', { class: 'moments' }, h('summary', {}, t.moments), h('ol', {}, moments)),
    h(
      'div',
      { class: 'stack' },
      h('button', { class: 'btn', type: 'button', disabled: true }, t.continueSoon),
      h(
        'button',
        {
          class: 'btn btn-primary',
          type: 'button',
          onclick: () => {
            app.abandonLife();
            app.newLife();
          },
        },
        t.replay,
      ),
      h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => app.openCompare(back) }, t.compare),
      h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => app.goTitle() }, t.toTitle),
    ),
  );
}
