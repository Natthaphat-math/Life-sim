import { h } from '../dom';

export interface ModalButton {
  label: string;
  primary?: boolean;
  value: string;
}

/**
 * Accessible modal dialog. Resolves with the value of the pressed button.
 * Escape resolves with `escapeValue` if given (otherwise Escape does nothing,
 * for dialogs that require an explicit answer).
 */
export function showModal(opts: {
  title: string;
  body: string[];
  buttons: ModalButton[];
  escapeValue?: string;
}): Promise<string> {
  return new Promise((resolve) => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const titleId = `modal-${Math.random().toString(36).slice(2)}`;
    const close = (value: string) => {
      document.removeEventListener('keydown', onKey);
      backdrop.remove();
      prevFocus?.focus?.();
      resolve(value);
    };
    const buttons = opts.buttons.map((b) =>
      h('button', { class: b.primary ? 'btn btn-primary' : 'btn', type: 'button', onclick: () => close(b.value) }, b.label),
    );
    const dialog = h(
      'div',
      { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId },
      h('h2', { id: titleId }, opts.title),
      opts.body.map((p) => h('p', {}, p)),
      h('div', { class: 'modal-actions' }, buttons),
    );
    const backdrop = h('div', { class: 'modal-backdrop' }, dialog);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && opts.escapeValue !== undefined) close(opts.escapeValue);
      if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.append(backdrop);
    (buttons.find((_, i) => opts.buttons[i]?.primary) ?? buttons[0])?.focus();
  });
}

export async function confirmModal(title: string, body: string, ok: string, cancel: string): Promise<boolean> {
  const v = await showModal({
    title,
    body: [body],
    buttons: [
      { label: cancel, value: 'no' },
      { label: ok, value: 'yes', primary: true },
    ],
    escapeValue: 'no',
  });
  return v === 'yes';
}
