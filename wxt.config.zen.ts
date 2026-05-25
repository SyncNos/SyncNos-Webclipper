import fs from 'node:fs';
import baseConfig from './wxt.config';
import { defineConfig } from 'wxt';

function firstExistingPath(candidates: string[]): string | undefined {
  for (const candidate of candidates) {
    try {
      if (candidate && fs.existsSync(candidate)) return candidate;
    } catch {
      // ignore
    }
  }
  return undefined;
}

function resolveZenBinary(): string | undefined {
  const configured = process.env.WXT_ZEN_BINARY?.trim();
  if (configured) return configured;

  if (process.platform !== 'darwin') return undefined;

  return firstExistingPath([
    '/Applications/Zen.app/Contents/MacOS/zen',
    '/Applications/Zen Browser.app/Contents/MacOS/zen',
  ]);
}

const zenBinary = resolveZenBinary();

export default defineConfig({
  ...baseConfig,
  webExt: zenBinary
    ? {
        ...(baseConfig.webExt ?? {}),
        binaries: {
          ...((baseConfig.webExt?.binaries as Record<string, string> | undefined) ?? {}),
          firefox: zenBinary,
        },
      }
    : baseConfig.webExt,
});
