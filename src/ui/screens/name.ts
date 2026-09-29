import type { App } from '../app';
import { confirmModal, showModal } from '../components/modal';
import { h } from '../dom';

const MAX_NAME = 24;

export function renderName(app: App): HTMLElement {
  const t = app.t;
  const input = h('input', {
    type: 'text',
    id: 'name-input',
    maxlength: MAX_NAME,
    autocomplete: 'off',
    autocapitalize: 'words',
    placeholder: t.namePlaceholder,
    required: true,
  });
  const submit = h('button', { class: 'btn btn-primary', type: 'submit', disabled: true }, t.begin);
  input.addEventListener('input', () => (submit.disabled = input.value.trim().length === 0));

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    const name = input.value.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
    if (!name) return;
    if (app.hasActiveLife() && !(await confirmModal(t.newGame, t.confirmNewGame, t.continue, t.back))) return;
    const answer = await showModal({
      title: t.noticeTitle,
      body: [t.noticeBody, t.noticeSettingsHint],
      buttons: [
        { label: t.noticeExit, value: 'exit' },
        { label: t.noticeContinue, value: 'continue', primary: true },
      ],
      escapeValue: 'exit',
    });
    if (answer === 'continue') app.beginLife(name);
    else app.goTitle();
  };

  const form = h(
    'form',
    { class: 'name-form', onsubmit: onSubmit as EventListener },
    h('label', { for: 'name-input' }, h('h1', {}, t.nameTitle)),
    input,
    h('p', { class: 'muted small' }, t.nameHint),
    h('div', { class: 'actions' }, h('button', { class: 'btn btn-quiet', type: 'button', onclick: () => app.goTitle() }, t.back), submit),
  );
  queueMicrotask(() => input.focus());
  return form;
}
