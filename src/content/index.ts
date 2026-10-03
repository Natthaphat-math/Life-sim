/** Content registry: the single place the app, scripts and tests load content from. */
import type { Content } from '../engine/content';
import { localize, type Locale } from '../engine/i18n';
import { birthTables } from './birth';
import { events } from './en/events';
import { narrative } from './en/narrative';
import { reactions } from './en/reactions';
import { infancy } from './en/stages/infancy';
import { strings, type Strings } from './en/strings';
import { stubs } from './en/stubs';
import { vars } from './en/vars';
import { rules } from './rules';
import { thPack } from './th';

/** English base content: events are authored here, with all their logic. */
export const content: Content<Strings> = {
  locale: 'en',
  rules,
  birth: birthTables,
  events,
  reactions,
  // Later stages are appended here as they are written.
  stages: [infancy],
  stubs,
  vars,
  narrative,
  strings,
};

const th = localize(content, thPack);

/** Every playable language, built from the same rules. */
export const contents: Record<Locale, Content<Strings>> = { th: th.content, en: content };

/** Texts the Thai pack does not provide yet (the validator reports these as errors). */
export const missingTranslations: Record<Locale, string[]> = { th: th.missing, en: [] };
