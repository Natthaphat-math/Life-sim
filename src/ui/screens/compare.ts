import { TRAITS } from '../../engine/types';
import { clearLives, loadLives, type LifeRecord } from '../../save/lifeArchive';
import type { App } from '../app';
import { MAX_SERIES, radarChart } from '../components/charts';
import { confirmModal } from '../components/modal';
import { h } from '../dom';

/** Lists finished lives and overlays up to three of them on one radar. */
export function renderCompare(app: App, back: () => void): HTMLElement {
  const t = app.t;
  const lives = loadLives(app.storage);
  const selected = new Set(lives.slice(0, 2).map((l) => l.id));
  const root = h('section', { class: 'compare' });

  const describe = (l: LifeRecord) => {
    const b = t.birthSummary;
    return [
      t.ageLabel(Math.floor(l.ageMonths)),
      b.wealth[l.birth.wealth],
      b.caregiver[l.birth.caregiver],
      b.parenting[l.birth.parenting],
      b.environment[l.birth.environment],
    ].join(' · ');
  };

  const draw = () => {
    const chosen = lives.filter((l) => selected.has(l.id)).slice(0, MAX_SERIES);
    const chart = chosen.length
      ? radarChart(
          TRAITS.map((k) => t.traitNames[k]),
          chosen.map((l) => ({ label: l.name, values: TRAITS.map((k) => l.traits[k]) })),
          t.chartTraits,
        )
      : null;

    const list = h(
      'ul',
      { class: 'life-list' },
      lives.map((l) => {
        const on = selected.has(l.id);
        const idx = chosen.findIndex((c) => c.id === l.id);
        return h(
          'li',
          {},
          h(
            'button',
            {
              type: 'button',
              class: `life ${on ? 'on' : ''}`,
              'aria-pressed': on ? 'true' : 'false',
              onclick: () => {
                if (on) selected.delete(l.id);
                else if (selected.size < MAX_SERIES) selected.add(l.id);
                draw();
              },
            },
            h('span', { class: 'swatch', style: idx >= 0 ? `background:var(--series-${idx + 1})` : 'visibility:hidden' }),
            h('span', { class: 'life-text' }, h('strong', {}, l.name), h('span', { class: 'muted small' }, describe(l))),
          ),
        );
      }),
    );

    root.replaceChildren(
      ...[
      h('h1', {}, t.compareTitle),
      lives.length === 0 ? h('p', { class: 'muted' }, t.compareEmpty) : h('p', { class: 'muted small' }, t.compareHint),
      chart,
      lives.length ? list : null,
      h(
        'div',
        { class: 'stack' },
        lives.length > 0 &&
          h(
            'button',
            {
              class: 'btn btn-quiet',
              type: 'button',
              onclick: async () => {
                if (await confirmModal(t.clearLives, t.clearLivesConfirm, t.clearLives, t.back)) {
                  clearLives(app.storage);
                  lives.length = 0;
                  selected.clear();
                  draw();
                }
              },
            },
            t.clearLives,
          ),
        h('button', { class: 'btn btn-primary', type: 'button', onclick: back }, t.back),
      ),
      ].filter((n): n is HTMLElement => n !== null),
    );
  };
  draw();
  return root;
}
