import { describe, it, expect } from 'vitest';
import {
  DEFAULT_READER_PREFS,
  DEFAULT_READER_TTS_PREFS,
  READER_PREFS_LIMITS,
  READER_PREFS_STORAGE_KEY,
  LEGACY_READING_PROFILE_STORAGE_KEY,
  READER_TYPOGRAPHY_PRESETS,
  normalizeReaderPrefs,
  readerPrefsFromLegacyProfile,
  resolveReaderPrefsFromStorage,
  buildReaderPrefsStoragePatch,
  readerPrefsToCssVars,
} from '@services/protocols/reader-prefs';

describe('normalizeReaderPrefs', () => {
  it('returns defaults for empty/invalid input', () => {
    expect(normalizeReaderPrefs(undefined)).toEqual(DEFAULT_READER_PREFS);
    expect(normalizeReaderPrefs(null)).toEqual(DEFAULT_READER_PREFS);
    expect(normalizeReaderPrefs('garbage')).toEqual(DEFAULT_READER_PREFS);
  });

  it('clamps out-of-range numbers to limits', () => {
    const high = normalizeReaderPrefs({
      fontSize: 999,
      lineHeight: 99,
      contentWidth: 9999,
      letterSpacing: 1,
    });
    expect(high.fontSize).toBe(READER_PREFS_LIMITS.fontSize.max);
    expect(high.lineHeight).toBe(READER_PREFS_LIMITS.lineHeight.max);
    expect(high.contentWidth).toBe(READER_PREFS_LIMITS.contentWidth.max);
    expect(high.letterSpacing).toBe(READER_PREFS_LIMITS.letterSpacing.max);

    const low = normalizeReaderPrefs({
      fontSize: 1,
      lineHeight: 0,
      contentWidth: 10,
      letterSpacing: -5,
    });
    expect(low.fontSize).toBe(READER_PREFS_LIMITS.fontSize.min);
    expect(low.lineHeight).toBe(READER_PREFS_LIMITS.lineHeight.min);
    expect(low.contentWidth).toBe(READER_PREFS_LIMITS.contentWidth.min);
    expect(low.letterSpacing).toBe(READER_PREFS_LIMITS.letterSpacing.min);
  });

  it('falls back enums on invalid values and clamps tts.rate', () => {
    const p = normalizeReaderPrefs({
      fontFamily: 'comic',
      textAlign: 'center',
      theme: 'neon',
      tts: { engine: 'magic', aiFormat: 'midi', rate: 99 },
    });
    expect(p.fontFamily).toBe(DEFAULT_READER_PREFS.fontFamily);
    expect(p.textAlign).toBe(DEFAULT_READER_PREFS.textAlign);
    expect(p.theme).toBe(DEFAULT_READER_PREFS.theme);
    expect(p.tts.engine).toBe(DEFAULT_READER_TTS_PREFS.engine);
    expect(p.tts.aiFormat).toBe(DEFAULT_READER_TTS_PREFS.aiFormat);
    expect(p.tts.rate).toBe(READER_PREFS_LIMITS.tts.rate.max);
  });

  it('preserves valid values', () => {
    const p = normalizeReaderPrefs({
      fontFamily: 'mono',
      fontSize: 22,
      lineHeight: 1.5,
      contentWidth: 800,
      letterSpacing: 0.05,
      textAlign: 'justify',
      theme: 'sepia',
      tts: { engine: 'ai', rate: 1.5, aiFormat: 'mp3', aiModel: 'kokoro', aiVoice: 'af_sky' },
    });
    expect(p.fontFamily).toBe('mono');
    expect(p.fontSize).toBe(22);
    expect(p.theme).toBe('sepia');
    expect(p.tts.engine).toBe('ai');
    expect(p.tts.rate).toBe(1.5);
    expect(p.tts.aiFormat).toBe('mp3');
  });
});

describe('readerPrefsFromLegacyProfile', () => {
  it('migrates medium/notion/book presets', () => {
    for (const id of ['medium', 'notion', 'book'] as const) {
      const p = readerPrefsFromLegacyProfile(id);
      const preset = READER_TYPOGRAPHY_PRESETS[id];
      expect(p.fontFamily).toBe(preset.fontFamily);
      expect(p.fontSize).toBe(preset.fontSize);
      expect(p.lineHeight).toBe(preset.lineHeight);
      expect(p.contentWidth).toBe(preset.contentWidth);
      expect(p.textAlign).toBe(preset.textAlign);
      // migration keeps default theme + tts
      expect(p.theme).toBe('system');
      expect(p.tts).toEqual(DEFAULT_READER_TTS_PREFS);
    }
  });

  it('falls back to medium for unknown legacy values', () => {
    expect(readerPrefsFromLegacyProfile('???')).toEqual(readerPrefsFromLegacyProfile('medium'));
  });
});

describe('resolveReaderPrefsFromStorage', () => {
  it('uses reader_prefs_v1 when present', () => {
    const p = resolveReaderPrefsFromStorage({
      [READER_PREFS_STORAGE_KEY]: { fontSize: 30, theme: 'black' },
    });
    expect(p.fontSize).toBe(30);
    expect(p.theme).toBe('black');
  });

  it('migrates legacy key when reader_prefs absent', () => {
    const p = resolveReaderPrefsFromStorage({
      [LEGACY_READING_PROFILE_STORAGE_KEY]: 'book',
    });
    expect(p).toEqual(readerPrefsFromLegacyProfile('book'));
  });

  it('prefers reader_prefs over legacy when both present', () => {
    const p = resolveReaderPrefsFromStorage({
      [READER_PREFS_STORAGE_KEY]: { fontFamily: 'mono' },
      [LEGACY_READING_PROFILE_STORAGE_KEY]: 'book',
    });
    expect(p.fontFamily).toBe('mono');
  });

  it('returns defaults for empty storage', () => {
    expect(resolveReaderPrefsFromStorage({})).toEqual(DEFAULT_READER_PREFS);
    expect(resolveReaderPrefsFromStorage(null)).toEqual(DEFAULT_READER_PREFS);
  });
});

describe('buildReaderPrefsStoragePatch', () => {
  it('wraps a normalized prefs under the storage key', () => {
    const patch = buildReaderPrefsStoragePatch({ fontSize: 999 });
    expect(Object.keys(patch)).toEqual([READER_PREFS_STORAGE_KEY]);
    expect(patch[READER_PREFS_STORAGE_KEY].fontSize).toBe(READER_PREFS_LIMITS.fontSize.max);
  });
});

describe('readerPrefsToCssVars', () => {
  it('emits reader CSS vars and never includes theme', () => {
    const vars = readerPrefsToCssVars({ fontSize: 20, lineHeight: 1.6, theme: 'sepia' });
    expect(vars['--reader-font-size']).toBe('20px');
    expect(vars['--reader-line-height']).toBe('1.6');
    expect(vars['--reader-text-align']).toBe(DEFAULT_READER_PREFS.textAlign);
    // P3 boundary: theme must NOT leak into CSS vars
    const keys = Object.keys(vars);
    expect(keys.some((k) => k.toLowerCase().includes('theme'))).toBe(false);
    expect(JSON.stringify(vars).toLowerCase().includes('sepia')).toBe(false);
  });
});
