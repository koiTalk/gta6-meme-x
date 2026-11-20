// Entry for make.fun bounty "Post a GTA 6 meme on X" (gta6-meme-x-01).
//
// The entry is the X post itself: the meme (meme.png) is posted on X from a
// public account, and this program hands the grader the post's address by
// copying POST.json from the repository root to the output directory, where
// the house reads it and fetches the post from X (first picture + text) for
// the judge. Before copying, it validates POST.json so a broken or wrong
// address fails loudly instead of silently entering a bad link. That
// validated copy is all this program does.
//
// Node 22, standard library only. No network, no clock, no files outside
// the repository: the same run always writes the same bytes.
//
// Local check, the way the grader runs it:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// out/POST.json is then byte for byte this directory's POST.json.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const POST_PATH = join(BOT_DIR, 'POST.json');

let post: unknown;
try {
  post = JSON.parse(readFileSync(POST_PATH, 'utf8'));
} catch (err) {
  console.error(`POST.json could not be parsed at ${POST_PATH}: ${(err as Error).message}`);
  process.exit(1);
}

const STATUS_URL = /^https:\/\/x\.com\/[^/]+\/status\/\d+(\?.*)?$/;

if (
  typeof post !== 'object' ||
  post === null ||
  typeof (post as { url?: unknown }).url !== 'string' ||
  !STATUS_URL.test((post as { url: string }).url)
) {
  console.error(
    `POST.json at ${POST_PATH} must name an X post address: {"url": "https://x.com/<handle>/status/<id>"}`
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(POST_PATH, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
