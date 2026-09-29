import { content } from '../content';
import type { Strings } from '../content/en/strings';
import { Game } from '../engine/game';
import { randomSeed } from '../engine/rng';
import { addLife, toRecord } from '../save/lifeArchive';
import { SaveManager } from '../save/saveManager';
import { LocalSaveStorage, type SaveStorage } from '../save/SaveStorage';
import { loadSettings, saveSettings, type Settings } from '../save/settings';
import { h } from './dom';
import { showModal } from './components/modal';
import { renderCompare } from './screens/compare';
import { renderName } from './screens/name';
import { renderPhase } from './screens/play';
import { renderSettings } from './screens/settings';
import { renderTitle } from './screens/title';

/**
 * UI controller. Owns the current Game and switches screens. There is no URL
 * routing: the browser Back button cannot undo a choice, because every
 * resolution is saved immediately and the screen is rebuilt from the save.
 */
export class App {
  readonly t: Strings = content.strings;
  readonly storage: SaveStorage = new LocalSaveStorage();
  readonly saves = new SaveManager(this.storage);
  settings: Settings = loadSettings(this.storage);
  game: Game | null = null;

  /** ?debug=1 shows hidden values; ?seed=abc makes new lives reproducible. */
  readonly debug: boolean;
  private readonly seedParam: string | null;

  constructor(private root: HTMLElement) {
    const params = new URLSearchParams(location.search);
    this.debug = params.get('debug') === '1';
    this.seedParam = params.get('seed');
    this.applyTheme();
  }

  start(): void {
    const res = this.saves.load();
    if (res.status === 'ok') this.game = new Game(content, res.state);
    this.goTitle();
    if (res.status === 'corrupt') {
      console.warn('Save could not be loaded:', res.reason);
      this.saves.clear();
      void showModal({ title: this.t.appTitle, body: [this.t.corruptSave], buttons: [{ label: this.t.close, value: 'ok', primary: true }], escapeValue: 'ok' });
    }
  }

  // --- Screen switching ----------------------------------------------------

  show(screen: HTMLElement): void {
    const main = h('main', { class: 'screen' }, screen);
    this.root.replaceChildren(main);
    // Move focus to the new screen's heading for keyboard and screen-reader users.
    const heading = main.querySelector<HTMLElement>('h1, h2');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }

  goTitle(): void {
    this.show(renderTitle(this));
  }

  hasActiveLife(): boolean {
    return this.game !== null;
  }

  newLife(): void {
    this.show(renderName(this));
  }

  /** Called from the name screen after the sensitive-content notice. */
  beginLife(name: string): void {
    // The same ?seed= always replays the same life (useful for debugging).
    const seed = this.seedParam ?? randomSeed();
    this.game = Game.create(content, { name, seed });
    this.persist();
    this.play();
  }

  continueLife(): void {
    if (this.game) this.play();
  }

  /** Render whatever the current phase is. */
  play(): void {
    if (!this.game) return this.goTitle();
    const g = this.game;
    if (g.state.phase.kind === 'stageEnd' && !g.state.archived) {
      addLife(this.storage, toRecord(g.state), content.rules.archiveLimit);
      g.state.archived = true;
      this.persist();
    }
    this.show(renderPhase(this, g));
  }

  /** Run a state transition, autosave, and re-render. */
  act(fn: (g: Game) => void): void {
    if (!this.game) return;
    try {
      fn(this.game);
    } catch (err) {
      console.error(err);
    }
    this.persist();
    this.play();
  }

  persist(): void {
    if (this.game) this.saves.save(this.game.state);
  }

  abandonLife(): void {
    this.game = null;
    this.saves.clear();
  }

  openSettings(back: () => void): void {
    this.show(renderSettings(this, back));
  }

  openCompare(back: () => void): void {
    this.show(renderCompare(this, back));
  }

  updateSettings(next: Settings): void {
    this.settings = next;
    saveSettings(this.storage, next);
    this.applyTheme();
  }

  private applyTheme(): void {
    const el = document.documentElement;
    if (this.settings.theme === 'auto') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', this.settings.theme);
  }
}
