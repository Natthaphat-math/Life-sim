import type { Game } from '../../engine/game';
import { INCLINATIONS, TRAITS } from '../../engine/types';
import type { App } from '../app';
import { showModal } from '../components/modal';
import { h, paragraphs } from '../dom';
import { renderStageEnd } from './stageEnd';

/** Builds the screen for the game's current phase. */
export function renderPhase(app: App, g: Game): HTMLElement {
  const p = g.state.phase;
  switch (p.kind) {
    case 'birth':
      return card(app, g, app.t.birthTitle, paragraphs(g.birthNarrative()), continueButton(app));
    case 'bridge':
      return card(app, g, app.t.bridgeTitle, paragraphs(g.storedText(p.texts)), continueButton(app));
    case 'outcome': {
      const ev = g.currentEvent;
      const body = [
        ...(p.skipped ? [h('p', { class: 'tag' }, app.t.skipped)] : []),
        ...paragraphs(g.storedText(p.texts)),
      ];
      return card(app, g, ev ? g.render(ev.title) : '', body, continueButton(app));
    }
    case 'event':
      return renderEvent(app, g);
    case 'stageEnd':
      return renderStageEnd(app, g);
  }
}

function renderEvent(app: App, g: Game): HTMLElement {
  const t = app.t;
  const ev = g.currentEvent;
  const p = g.state.phase;
  if (!ev || p.kind !== 'event') return h('p', {}, '…');

  // Sensitivity gate: show only the header until the player decides.
  if (g.needsWarning(app.settings.warningLevel)) {
    queueMicrotask(async () => {
      const level = ev.sensitivity === 'none' ? 'mild' : ev.sensitivity;
      const answer = await showModal({
        title: t.warnTitle,
        body: [t.warnBody[level]],
        buttons: [
          { label: t.skipEvent, value: 'skip' },
          { label: t.readOn, value: 'read', primary: true },
        ],
      });
      app.act((game) => (answer === 'read' ? game.readOn() : game.skipEvent()));
    });
    return card(app, g, '', [], null);
  }

  const choices = g.visibleChoices();
  const buttons = choices.map((c) =>
    h(
      'button',
      {
        class: 'btn choice',
        type: 'button',
        disabled: c.locked,
        'aria-describedby': c.locked ? `hint-${c.id}` : undefined,
        onclick: (e: Event) => {
          // Guard against double taps: choices are final.
          (e.currentTarget as HTMLElement).closest('.choices')?.querySelectorAll('button').forEach((b) => (b.disabled = true));
          app.act((game) => game.choose(c.id));
        },
      },
      h('span', {}, c.text),
      c.locked && h('span', { class: 'hint', id: `hint-${c.id}` }, c.hint ?? t.lockedLabel),
    ),
  );

  const body: Node[] = [...paragraphs(g.render(ev.text))];
  if (p.tier1) {
    const first = ev.choices.find((c) => c.id === p.tier1);
    if (first) body.push(h('p', { class: 'chosen' }, g.render(first.text)));
  }
  return card(app, g, g.render(ev.title), body, h('div', { class: 'choices' }, buttons));
}

function continueButton(app: App): HTMLElement {
  return h(
    'div',
    { class: 'choices' },
    h(
      'button',
      {
        class: 'btn btn-primary',
        type: 'button',
        onclick: (e: Event) => {
          (e.currentTarget as HTMLButtonElement).disabled = true;
          app.act((game) => game.advance());
        },
      },
      app.t.next,
    ),
  );
}

/**
 * Common layout: header (age, settings), an optional illustration slot,
 * title, body text, and actions pinned to the bottom on phones.
 */
function card(app: App, g: Game, title: string, body: Node[], actions: HTMLElement | null): HTMLElement {
  const t = app.t;
  const header = h(
    'header',
    { class: 'topbar' },
    h('span', { class: 'who' }, `${g.state.character.name} · ${t.ageLabel(Math.floor(g.state.character.ageMonths))}`),
    h(
      'button',
      { class: 'icon-btn', type: 'button', 'aria-label': t.settings, onclick: () => app.openSettings(() => app.play()) },
      '⚙',
    ),
  );
  return h(
    'article',
    { class: 'card' },
    header,
    // Reserved for optional illustrations later (content can add an image id).
    h('div', { class: 'illustration', hidden: true }),
    h('div', { class: 'card-body' }, title ? h('h1', {}, title) : null, body),
    actions,
    app.debug ? debugPanel(app, g) : null,
  );
}

function debugPanel(app: App, g: Game): HTMLElement {
  const s = g.state;
  const row = (k: string, v: number) => `${k} ${Math.round(v)}`;
  return h(
    'details',
    { class: 'debug' },
    h('summary', {}, app.t.debugTitle),
    h('p', {}, `seed ${s.seed} · ${s.character.gender} · ${JSON.stringify(s.birth)}`),
    h('p', {}, TRAITS.map((k) => row(k, s.traits[k])).join(' · ')),
    h('p', {}, [row('stress', s.stress), ...INCLINATIONS.map((k) => row(k, s.inclinations[k]))].join(' · ')),
    h('p', {}, `flags: ${s.flags.join(', ') || '—'}`),
    h('p', {}, `segment ${s.progress.segmentIndex} · follow-ups ${JSON.stringify(s.followUps)}`),
  );
}
