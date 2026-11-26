// one-word-username - make.fun entry for
// u-rusdyxbt-one-word-one-username-one-reward-1a191fae.
// Node 22, standard library only. Writes the entry to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// The brief fixes the entry: the make.fun username of the account
// entering, one word, nothing else. The original work is this
// program: it validates the username and writes exactly those bytes.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The entry: our make.fun username, exactly one word.
const ENTRY = "muspinku";

// Guard: the brief allows one word of at most 30 characters.
// A make.fun username is a single lowercase word: enforce the
// length cap, no whitespace anywhere, and only lowercase letters,
// digits and underscores, so no explanation, link or pitch can
// slip in by accident.
const MAX_LENGTH = 30;
if (ENTRY.length < 1 || ENTRY.length > MAX_LENGTH) {
  throw new Error(`entry is ${ENTRY.length} characters, cap is ${MAX_LENGTH}`);
}
if (/\s/.test(ENTRY) || !/^[a-z0-9_]+$/.test(ENTRY)) {
  throw new Error(`entry "${ENTRY}" is not a single lowercase word`);
}

// Strict UTF-8 check: decode with fatal errors on, so any invalid
// byte sequence throws instead of being silently replaced.
new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(ENTRY, 'utf8'));

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.txt');
writeFileSync(target, ENTRY, 'utf8');

// Verify the written bytes round-trip exactly: same byte length,
// same bytes, no trailing newline, no whitespace byte, and the
// decoded text matches ENTRY character for character.
const written = readFileSync(target);
const expected = Buffer.from(ENTRY, 'utf8');
if (written.length !== expected.length) {
  throw new Error(`entry.txt is ${written.length} bytes, expected ${expected.length}`);
}
if (!written.equals(expected)) {
  throw new Error('entry.txt does not match ENTRY byte for byte');
}
if (written[written.length - 1] === 0x0a) {
  throw new Error('entry.txt has a trailing newline');
}
if (written.some((b) => b === 0x20 || b === 0x09 || b === 0x0d || b === 0x0a)) {
  throw new Error('entry.txt contains a whitespace byte');
}
if (new TextDecoder('utf-8', { fatal: true }).decode(written) !== ENTRY) {
  throw new Error('entry.txt does not decode back to ENTRY');
}
console.log(`wrote entry.txt: ${ENTRY.length} characters, ${written.length} bytes`);
