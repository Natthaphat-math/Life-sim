import { h, s } from '../dom';

export interface RadarSeries {
  label: string;
  values: number[]; // 0..100, one per axis
}

/** Categorical slots 1–3 (validated for all-pairs use); see styles.css. */
const SERIES_VARS = ['--series-1', '--series-2', '--series-3'];
export const MAX_SERIES = SERIES_VARS.length;

/**
 * SVG radar chart. One polygon per series (max 3), a recessive grid, a
 * legend when there are 2+ series, a hover/tap tooltip per point and a
 * table view for exact values.
 */
export function radarChart(axes: string[], series: RadarSeries[], caption: string): HTMLElement {
  const W = 360;
  const H = 320;
  const cx = W / 2;
  const cy = H / 2;
  const R = 108;
  const n = axes.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, v: number) => {
    const r = (R * Math.max(0, Math.min(100, v))) / 100;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))] as const;
  };

  const tooltip = h('div', { class: 'chart-tooltip', role: 'status', hidden: true });
  const wrap = h('figure', { class: 'chart radar' });

  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': caption });

  // Grid rings at 25/50/75/100 and spokes.
  for (const ring of [25, 50, 75, 100]) {
    const d = axes.map((_, i) => pt(i, ring).join(',')).join(' ');
    svg.append(s('polygon', { points: d, class: ring === 50 ? 'grid grid-mid' : 'grid' }));
  }
  axes.forEach((label, i) => {
    const [x, y] = pt(i, 100);
    svg.append(s('line', { x1: cx, y1: cy, x2: x, y2: y, class: 'grid' }));
    const [lx, ly] = pt(i, 118);
    const anchor = Math.abs(lx - cx) < 4 ? 'middle' : lx > cx ? 'start' : 'end';
    svg.append(s('text', { x: lx, y: ly, 'text-anchor': anchor, 'dominant-baseline': 'middle', class: 'axis-label' }, label));
  });

  series.slice(0, MAX_SERIES).forEach((ser, si) => {
    const color = `var(${SERIES_VARS[si]})`;
    const points = ser.values.map((v, i) => pt(i, v).join(',')).join(' ');
    svg.append(s('polygon', { points, class: 'series-area', style: `fill:${color};stroke:${color}` }));
  });
  // Points drawn after all areas so they stay on top; each has a larger hit target.
  series.slice(0, MAX_SERIES).forEach((ser, si) => {
    const color = `var(${SERIES_VARS[si]})`;
    ser.values.forEach((v, i) => {
      const [x, y] = pt(i, v);
      const text = `${series.length > 1 ? `${ser.label} · ` : ''}${axes[i]}: ${Math.round(v)}`;
      const show = () => {
        tooltip.textContent = text;
        tooltip.hidden = false;
        tooltip.style.left = `${(x / W) * 100}%`;
        tooltip.style.top = `${(y / H) * 100}%`;
      };
      const hide = () => (tooltip.hidden = true);
      svg.append(s('circle', { cx: x, cy: y, r: 4, class: 'series-point', style: `fill:${color}` }));
      svg.append(
        s('circle', {
          cx: x,
          cy: y,
          r: 14,
          class: 'hit',
          tabindex: 0,
          'aria-label': text,
          onmouseenter: show,
          onmouseleave: hide,
          onfocus: show,
          onblur: hide,
          onclick: show,
        }),
      );
    });
  });

  wrap.append(h('div', { class: 'chart-plot' }, svg, tooltip));
  if (series.length > 1) wrap.append(legend(series.map((x) => x.label)));
  wrap.append(tableView(caption, axes, series));
  return wrap;
}

export function legend(labels: string[]): HTMLElement {
  return h(
    'ul',
    { class: 'legend' },
    labels.slice(0, MAX_SERIES).map((l, i) =>
      h('li', {}, h('span', { class: 'swatch', style: `background:var(${SERIES_VARS[i]})` }), l),
    ),
  );
}

function tableView(caption: string, axes: string[], series: RadarSeries[]): HTMLElement {
  return h(
    'details',
    { class: 'table-view' },
    h('summary', {}, 'Show as table'),
    h(
      'table',
      {},
      h('caption', {}, caption),
      h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, ''), series.map((x) => h('th', { scope: 'col' }, x.label)))),
      h(
        'tbody',
        {},
        axes.map((a, i) =>
          h('tr', {}, h('th', { scope: 'row' }, a), series.map((x) => h('td', {}, String(Math.round(x.values[i] ?? 0))))),
        ),
      ),
    ),
  );
}

/**
 * Horizontal bars in HTML. `max` sets the full-width value; every value is
 * printed next to its bar, so identity and magnitude never rely on colour.
 */
export function barList(rows: Array<{ label: string; value: number }>, max: number, caption: string): HTMLElement {
  return h(
    'figure',
    { class: 'chart bars' },
    h('figcaption', {}, caption),
    h(
      'ul',
      { class: 'bar-list' },
      rows.map((r) =>
        h(
          'li',
          { title: `${r.label}: ${Math.round(r.value)}` },
          h('span', { class: 'bar-label' }, r.label),
          h(
            'span',
            { class: 'bar-track' },
            h('span', { class: 'bar-fill', style: `width:${Math.max(0, Math.min(100, (r.value / max) * 100))}%` }),
          ),
          h('span', { class: 'bar-value' }, String(Math.round(r.value))),
        ),
      ),
    ),
  );
}
