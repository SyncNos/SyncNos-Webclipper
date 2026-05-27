import { copyFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { resolveRepoRoot, resolveWebclipperRoot } from './script-utils.mjs';

function findLatestFirefoxZip(outDir) {
  const entries = readdirSync(outDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => name.endsWith('-firefox.zip'));

  if (entries.length === 0) return null;

  const withMtime = entries
    .map((name) => {
      const p = join(outDir, name);
      return { name, p, mtimeMs: statSync(p).mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  return withMtime[0];
}

const repoRoot = resolveRepoRoot(import.meta.url);
const webclipperRoot = resolveWebclipperRoot(repoRoot);
const outDir = join(webclipperRoot, '.output');

const latest = findLatestFirefoxZip(outDir);
if (!latest) {
  throw new Error(`[build] missing firefox zip in ${outDir} (expected "*-firefox.zip")`);
}

const xpiName = latest.name.replace(/-firefox\.zip$/, '-zen.xpi');
const xpiPath = join(outDir, xpiName);

copyFileSync(latest.p, xpiPath);
console.log(`[build] packaged: ${xpiPath}`);

