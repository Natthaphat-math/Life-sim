import type { WarningLevel } from '../../engine/types';
import type { App } from '../app';
import { confirmModal } from '../components/modal';
import { h } from '../dom';
import type { Theme } from '../../save/settings';
import type { Locale } from '../../engine/i18n';

function radioGroup<T extends string>(
  name: string,
  legend: string,
  options: Record<T, string>,
  current: T,
  onChange: (v: T) => void,
): HTMLElement {
  return h(
    'fieldset',
    { class: 'radio-group' },
    h('legend', {}, legend),
    (Object.keys(options) as T[]).map((key) =>
      h(
        'label',
        { class: 'radio' },
        h('input', {
          type: 'radio',
          name,
          value: key,
          checked: key === current,
          onchange: () => onChange(key),
        }),
        h('span', {}, options[key]),
      ),
    ),
  );
}

export function renderSettings(app: App, back: () => void): HTMLElement {
  const t = app.t;
  return h(
    'section',
    { class: 'settings' },
    h('h1', {}, t.settingsTitle),
    radioGroup<Locale>('language', t.languageLabel, t.languages, app.settings.language, (v) => app.setLanguage(v)),
    radioGroup<WarningLevel>('warn', t.warningLevelLabel, t.warningLevels, app.settings.warningLevel, (v) =>
      app.updateSettings({ ...app.settings, warningLevel: v }),
    ),
    radioGroup<Theme>('theme', t.themeLabel, t.themes, app.settings.theme, (v) => app.updateSettings({ ...app.settings, theme: v })),
    app.hasActiveLife() &&
      h(
        'button',
        {
          class: 'btn btn-danger',
          type: 'button',
          onclick: async () => {
            if (await confirmModal(t.abandonLife, t.abandonConfirm, t.abandonLife, t.back)) {
              app.abandonLife();
              app.goTitle();
            }
          },
        },
        t.abandonLife,
      ),
    h('div', { class: 'actions' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: back }, t.back)),
  );
}
