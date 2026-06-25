import { describe, expect, it } from 'vitest';
import {
  APP_THEME_MODE_STORAGE_KEY,
  buildAppThemeModeStoragePatch,
  normalizeAppThemeMode,
  resolveAppThemeModeFromStorage,
} from '@services/protocols/app-theme';

describe('app theme mode protocol', () => {
  it('normalizes invalid values to system', () => {
    expect(normalizeAppThemeMode(undefined)).toBe('system');
    expect(normalizeAppThemeMode(null)).toBe('system');
    expect(normalizeAppThemeMode('neon')).toBe('system');
  });

  it('preserves supported global modes', () => {
    expect(normalizeAppThemeMode('SYSTEM')).toBe('system');
    expect(normalizeAppThemeMode(' light ')).toBe('light');
    expect(normalizeAppThemeMode('sepia')).toBe('sepia');
    expect(normalizeAppThemeMode('dark')).toBe('dark');
    expect(normalizeAppThemeMode('BLACK')).toBe('black');
  });

  it('reads and writes the storage contract', () => {
    expect(resolveAppThemeModeFromStorage({ [APP_THEME_MODE_STORAGE_KEY]: 'black' })).toBe('black');
    expect(resolveAppThemeModeFromStorage({})).toBe('system');
    expect(buildAppThemeModeStoragePatch('sepia')).toEqual({ [APP_THEME_MODE_STORAGE_KEY]: 'sepia' });
  });
});
