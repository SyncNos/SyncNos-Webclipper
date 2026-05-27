import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { resolveRepoRoot, resolveWebclipperRoot, run } from './script-utils.mjs';

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf-8'));
}

const repoRoot = resolveRepoRoot(import.meta.url);
const webclipperRoot = resolveWebclipperRoot(repoRoot);

const outDir = join(webclipperRoot, '.output');
const wxtOut = join(outDir, 'firefox-mv3');
if (!existsSync(wxtOut)) {
  throw new Error(`[build] wxt output missing: ${wxtOut}`);
}

const manifestPath = join(wxtOut, 'manifest.json');
if (!existsSync(manifestPath)) {
  throw new Error(`[build] manifest missing: ${manifestPath}`);
}

const manifest = readJson(manifestPath);
const version = String(manifest?.version || '').trim();
if (!version) {
  throw new Error(`[build] failed to read manifest version from: ${manifestPath}`);
}

const xpiPath = join(outDir, `webclipper-${version}-zen.xpi`);

// Clean up zip artifacts created by `wxt zip` (older build:zen behavior).
rmSync(join(outDir, `webclipper-${version}-firefox.zip`), { force: true });
rmSync(join(outDir, `webclipper-${version}-sources.zip`), { force: true });

rmSync(xpiPath, { force: true });
run('zip', ['-r', '-q', xpiPath, '.'], wxtOut);

console.log(`[build] packaged: ${xpiPath}`);
