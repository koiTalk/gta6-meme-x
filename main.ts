// Entry for make.fun bounty "Post a GTA 6 meme on X" (gta6-meme-x-01).
//
// The entry is the X post itself: the meme (meme.png) is posted on X from a
// public account, and this program hands the grader the post's address by
// copying POST.json from the repository root to the output directory, where
// the house reads it and fetches the post from X (first picture + text) for
// the judge. That copy is all this program does.
//
// Node 22, standard library only. No network, no clock, no files outside
// the repository: the same run always writes the same bytes.
//
// Local check, the way the grader runs it:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// out/POST.json is then byte for byte this directory's POST.json.

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
