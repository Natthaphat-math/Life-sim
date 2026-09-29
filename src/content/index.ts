/** Content registry: the single place the app, scripts and tests load content from. */
import type { Content } from '../engine/content';
import { birthTables } from './birth';
import { events } from './en/events';
import { narrative } from './en/narrative';
import { reactions } from './en/reactions';
import { infancy } from './en/stages/infancy';
import { strings, type Strings } from './en/strings';
import { stubs } from './en/stubs';
import { vars } from './en/vars';
import { rules } from './rules';

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
