import { contents } from '../content';
import type { Content } from '../engine/content';
import type { Locale } from '../engine/i18n';
import type { GameState } from '../engine/types';
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
    this.applyLanguage();
  }

  /** Content in the player's chosen language (all languages share the same rules). */
  get content(): Content<Strings> {
    return contents[this.settings.language];
  }

  /** UI strings in the player's chosen language. */
  get t(): Strings {
    return this.content.strings;
  }

  private newGame(state: GameState): Game {
    return new Game(this.content, state, { locales: Object.values(contents) });
  }

  start(): void {
    const res = this.saves.load();
    if (res.status === 'ok') this.game = this.newGame(res.state);
    this.goTitle();
    if (res.status === 'corrupt') {
      console.warn('Save could not be loaded:', res.reason);
      this.saves.clear();
      void showModal({ title: this.t.appTitle, body: [this.t.corruptSave], buttons: [{ label: this.t.close, value: 'ok', primary: true }], escapeValue: 'ok' });
    }
  }

  // --- Screen switching ----------------------------------------------------

  /** Rebuilds the current screen, e.g. after the language changes. */
  private rerender: () => void = () => this.goTitle();

  show(screen: HTMLElement, rerender?: () => void): void {
    if (rerender) this.rerender = rerender;
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
    this.show(renderTitle(this), () => this.goTitle());
  }

  hasActiveLife(): boolean {
    return this.game !== null;
  }

  newLife(): void {
    this.show(renderName(this), () => this.newLife());
  }

  /** Called from the name screen after the sensitive-content notice. */
  beginLife(name: string): void {
    // The same ?seed= always replays the same life (useful for debugging).
    const seed = this.seedParam ?? randomSeed();
    this.game = Game.create(this.content, { name, seed, locales: Object.values(contents) });
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
      addLife(this.storage, toRecord(g.state), this.content.rules.archiveLimit);
      g.state.archived = true;
      this.persist();
    }
    this.show(renderPhase(this, g), () => this.play());
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
    this.show(renderSettings(this, back), () => this.openSettings(back));
  }

  openCompare(back: () => void): void {
    this.show(renderCompare(this, back), () => this.openCompare(back));
  }

  updateSettings(next: Settings): void {
    this.settings = next;
    saveSettings(this.storage, next);
    this.applyTheme();
  }

  /** Switch language and redraw the current screen in place. */
  setLanguage(language: Locale): void {
    if (language === this.settings.language) return;
    this.updateSettings({ ...this.settings, language });
    this.applyLanguage();
    if (this.game) this.game = this.game.withContent(this.content);
    this.rerender();
  }

  private applyLanguage(): void {
    document.documentElement.lang = this.settings.language;
  }

  private applyTheme(): void {
    const el = document.documentElement;
    if (this.settings.theme === 'auto') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', this.settings.theme);
  }
}
