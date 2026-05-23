/**
 * setup-safari-xcode.mjs
 *
 * Generates (or rebuilds) a Safari Web Extension Xcode project from the WXT
 * `safari-mv3` build output, then patches the auto-generated App Icons to
 * use a solid dark background (preventing the "white padding" issue caused
 * by the extension's transparent icon).
 *
 * Usage:
 *   node .github/scripts/webclipper/setup-safari-xcode.mjs [--open] [--ios]
 *
 * Prerequisites:
 *   - macOS with Xcode + command-line tools installed
 *   - `npm run build:safari` already executed (produces .output/safari-mv3/)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { resolveRepoRoot, resolveWebclipperRoot } from './script-utils.mjs';

// ── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flagOpen = args.includes('--open');
const flagIos = args.includes('--ios');
const flagForce = args.includes('--force') || true; // always force-rebuild
const flagNoOpen = !flagOpen;

// ── Paths ───────────────────────────────────────────────────────────────────

const repoRoot = resolveRepoRoot(import.meta.url);
const webclipperRoot = resolveWebclipperRoot(repoRoot);
const extensionDir = join(webclipperRoot, '.output', 'safari-mv3');
const xcodeProjectDir = join(webclipperRoot, '.safari-xcode');
const sourceIcon = join(webclipperRoot, 'public', 'icons', 'icon-128.png');

// ── Pre-checks ──────────────────────────────────────────────────────────────

if (!existsSync(join(extensionDir, 'manifest.json'))) {
  console.error('[setup:safari] .output/safari-mv3/manifest.json not found.\n' + '  Run `npm run build:safari` first.');
  process.exit(1);
}

// ── PNG helpers (pure Node.js, zero dependencies) ───────────────────────────

/**
 * Minimal PNG encoder — writes raw RGBA pixels as an uncompressed PNG.
 * Enough for generating App Icon assets; no filtering or optimisation.
 */
function encodePng(width, height, rgba) {
  // zlib compress the raw rows (filter byte 0 per row)
  const rowBytes = width * 4;
  const raw = Buffer.alloc(height * (1 + rowBytes));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + rowBytes)] = 0; // filter: none
    rgba.copy(raw, y * (1 + rowBytes) + 1, y * rowBytes, (y + 1) * rowBytes);
  }
  const compressed = deflateSync(raw);

  // Build PNG file
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([len, body, crcBuf]);
}

// Minimal CRC-32 (used by PNG)
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return c ^ 0xffffffff;
}

/**
 * Minimal PNG decoder — returns { width, height, data: Buffer (RGBA) }.
 * Supports uncompressed (filter 0) and zlib-compressed IDAT chunks.
 * Sufficient for reading the 128×128 extension icon.
 */
function decodePng(buf) {
  const sig = buf.slice(0, 8);
  if (!sig.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    throw new Error('Not a PNG file');
  }

  let width = 0,
    height = 0,
    colorType = 0;
  const idatParts = [];
  let pos = 8;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    pos += 4;
    const type = buf.slice(pos, pos + 4).toString('ascii');
    pos += 4;
    const data = buf.slice(pos, pos + len);
    pos += len;
    pos += 4; // skip CRC
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);

      colorType = data[9];
    } else if (type === 'IDAT') {
      idatParts.push(data);
    }
  }

  if (colorType !== 6) throw new Error(`Unsupported color type ${colorType}; expected RGBA (6)`);

  const compressed = Buffer.concat(idatParts);
  const raw = inflateSync(compressed);
  const rowBytes = 1 + width * 4;
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    raw.copy(rgba, y * width * 4, y * rowBytes + 1, (y + 1) * rowBytes);
  }
  return { width, height, data: rgba };
}

// ── App Icon generation ─────────────────────────────────────────────────────

const ICON_BG = { r: 11, g: 43, b: 43 }; // dark teal #0B2B2B

/**
 * Compose an App Icon by blending the (mostly transparent) extension icon
 * over a solid dark background, with boosted stroke opacity.
 */
function composeAppIcon(srcRgba, srcW, srcH, dstSize) {
  const out = Buffer.alloc(dstSize * dstSize * 4);
  for (let dy = 0; dy < dstSize; dy++) {
    for (let dx = 0; dx < dstSize; dx++) {
      // Nearest-neighbour sampling from source
      const sx = Math.min(Math.floor((dx * srcW) / dstSize), srcW - 1);
      const sy = Math.min(Math.floor((dy * srcH) / dstSize), srcH - 1);
      const si = (sy * srcW + sx) * 4;
      const sr = srcRgba[si],
        sg = srcRgba[si + 1],
        sb = srcRgba[si + 2],
        sa = srcRgba[si + 3];

      const di = (dy * dstSize + dx) * 4;
      if (sa > 10) {
        // Boost faint strokes, then alpha-blend over background
        const alpha = Math.min(255, sa * 2.5) / 255;
        out[di] = Math.round(sr * alpha + ICON_BG.r * (1 - alpha));
        out[di + 1] = Math.round(sg * alpha + ICON_BG.g * (1 - alpha));
        out[di + 2] = Math.round(sb * alpha + ICON_BG.b * (1 - alpha));
      } else {
        out[di] = ICON_BG.r;
        out[di + 1] = ICON_BG.g;
        out[di + 2] = ICON_BG.b;
      }
      out[di + 3] = 255;
    }
  }
  return out;
}

/** All macOS/iOS App Icon sizes required by the Xcode asset catalog. */
const APP_ICON_SIZES = [
  ['mac-icon-16@1x.png', 16],
  ['mac-icon-16@2x.png', 32],
  ['mac-icon-32@1x.png', 32],
  ['mac-icon-32@2x.png', 64],
  ['mac-icon-128@1x.png', 128],
  ['mac-icon-128@2x.png', 256],
  ['mac-icon-256@1x.png', 256],
  ['mac-icon-256@2x.png', 512],
  ['mac-icon-512@1x.png', 512],
  ['mac-icon-512@2x.png', 1024],
  ['universal-icon-1024@1x.png', 1024],
];

function patchAppIcons() {
  if (!existsSync(sourceIcon)) {
    console.warn('[setup:safari] Source icon not found, skipping App Icon patch');
    return;
  }

  const { width: srcW, height: srcH, data: srcRgba } = decodePng(readFileSync(sourceIcon));

  const appIconDir = join(xcodeProjectDir, 'SyncNos', 'Shared (App)', 'Assets.xcassets', 'AppIcon.appiconset');
  const largeIconDir = join(xcodeProjectDir, 'SyncNos', 'Shared (App)', 'Assets.xcassets', 'LargeIcon.imageset');
  const iconPng = join(xcodeProjectDir, 'SyncNos', 'Shared (App)', 'Resources', 'Icon.png');

  let patched = 0;
  for (const [name, size] of APP_ICON_SIZES) {
    const path = join(appIconDir, name);
    if (!existsSync(path)) continue;
    writeFileSync(path, encodePng(size, size, composeAppIcon(srcRgba, srcW, srcH, size)));
    patched++;
  }

  // Also patch LargeIcon imageset and standalone Icon.png
  for (const target of [join(largeIconDir, 'icon-128.png'), iconPng]) {
    if (!existsSync(target)) continue;
    writeFileSync(target, encodePng(128, 128, composeAppIcon(srcRgba, srcW, srcH, 128)));
    patched++;
  }

  console.log(`[setup:safari] Patched ${patched} App Icon files with dark background`);
}

// ── Version sync ────────────────────────────────────────────────────────────

/**
 * Reads the extension version from wxt.config.ts and patches
 * MARKETING_VERSION in the generated Xcode project so the two never drift.
 */
function syncVersion() {
  const wxtConfigPath = join(webclipperRoot, 'wxt.config.ts');
  const pbxprojPath = join(xcodeProjectDir, 'SyncNos', 'SyncNos.xcodeproj', 'project.pbxproj');

  if (!existsSync(wxtConfigPath)) {
    console.warn('[setup:safari] wxt.config.ts not found, skipping version sync');
    return;
  }
  if (!existsSync(pbxprojPath)) {
    console.warn('[setup:safari] project.pbxproj not found, skipping version sync');
    return;
  }

  const wxtSource = readFileSync(wxtConfigPath, 'utf-8');
  const match = wxtSource.match(/version:\s*['"]([^'"]+)['"]/);
  if (!match) {
    console.warn('[setup:safari] Could not extract version from wxt.config.ts, skipping version sync');
    return;
  }

  const version = match[1];
  const pbxproj = readFileSync(pbxprojPath, 'utf-8');
  const updated = pbxproj.replace(/MARKETING_VERSION = [^;]+;/g, 'MARKETING_VERSION = ' + version + ';');

  if (updated !== pbxproj) {
    writeFileSync(pbxprojPath, updated);
    console.log('[setup:safari] Synced MARKETING_VERSION to ' + version);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

// Build converter args
const converterArgs = [
  'safari-web-extension-converter',
  '--app-name',
  'SyncNos',
  '--bundle-identifier',
  'com.chiimagnus.SyncNos.Webclipper',
  '--swift',
  '--no-prompt',
  '--copy-resources',
];

if (flagNoOpen) converterArgs.push('--no-open');
if (flagIos) converterArgs.push('--ios-only');
if (flagForce && existsSync(xcodeProjectDir)) converterArgs.push('--force');
converterArgs.push('--project-location', xcodeProjectDir);
converterArgs.push(extensionDir);

// Run converter
console.log('[setup:safari] Generating Safari Web Extension Xcode project…');
console.log(`[setup:safari] xcrun ${converterArgs.join(' ')}`);

try {
  execFileSync('xcrun', converterArgs, { stdio: 'inherit', cwd: webclipperRoot });
} catch (err) {
  console.error('[setup:safari] xcrun safari-web-extension-converter failed.');
  process.exit(err.status ?? 1);
}

// Patch auto-generated App Icons with solid background
// (the converter's default icons have white padding because the source
//  extension icon is ~97% transparent)
patchAppIcons();
syncVersion();

console.log(`\n[setup:safari] Done. Xcode project at: ${xcodeProjectDir}/SyncNos`);
console.log(
  '[setup:safari] Next steps:\n' +
    '  1. Open the .xcodeproj in Xcode\n' +
    '  2. Set your Development Team in Signing & Capabilities\n' +
    '  3. Build & Run (⌘R) to test in Safari\n',
);
