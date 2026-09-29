/**
 * Content validator. Usage: npm run validate
 * Exits with code 1 if there are errors. Warnings are printed but do not fail.
 */
import { content } from '../src/content';
import { validateContent } from '../src/engine/validate';

const { errors, warnings } = validateContent(content);

for (const w of warnings) console.log(`warn   ${w}`);
for (const e of errors) console.log(`ERROR  ${e}`);

const written = content.events.length;
console.log(
  `\n${written} events, ${Object.keys(content.reactions).length} caregiver reactions, ${content.stubs.length} stubs.`,
);
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
