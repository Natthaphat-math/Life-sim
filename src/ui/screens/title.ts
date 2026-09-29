import type { App } from '../app';
import { h } from '../dom';

export function renderTitle(app: App): HTMLElement {
  const t = app.t;
  const back = () => app.goTitle();
  return h(
    'section',
    { class: 'title-screen' },
    h('div', { class: 'title-block' }, h('h1', {}, t.appTitle), h('p', { class: 'muted' }, t.tagline)),
    h(
      'div',
      { class: 'stack' },
      app.hasActiveLife() && h('button', { class: 'btn btn-primary', type: 'button', onclick: () => app.continueLife() }, t.continue),
      h('button', { class: app.hasActiveLife() ? 'btn' : 'btn btn-primary', type: 'button', onclick: () => app.newLife() }, t.newGame),
      h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => app.openCompare(back) }, t.compare),
      h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => app.openSettings(back) }, t.settings),
    ),
  );
}
