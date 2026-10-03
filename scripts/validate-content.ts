/**
 * Content validator. Usage: npm run validate
 * Checks every language build (same rules, different text) and reports any
 * text a language pack is missing. Exits with code 1 if there are errors.
 */
import { contents, missingTranslations } from '../src/content';
import { validateContent } from '../src/engine/validate';

let errorCount = 0;
let warningCount = 0;
for (const [locale, c] of Object.entries(contents)) {
  const { errors, warnings } = validateContent(c);
  const missing = missingTranslations[locale as keyof typeof missingTranslations];
  const all = [...errors, ...missing.map((m) => `missing translation: ${m}`)];
  console.log(`\n[${locale}]`);
  for (const w of warnings) console.log(`warn   ${w}`);
  for (const e of all) console.log(`ERROR  ${e}`);
  errorCount += all.length;
  warningCount += warnings.length;
}

const base = contents.en;
console.log(
  `\n${base.events.length} events, ${Object.keys(base.reactions).length} caregiver reactions, ${base.stubs.length} stubs, ${Object.keys(contents).length} languages.`,
);
console.log(`${errorCount} error(s), ${warningCount} warning(s).`);
process.exit(errorCount ? 1 : 0);
