export const APP_THEME_MODE_STORAGE_KEY = 'app_theme_mode_v1';

export const APP_THEME_MODES = ['system', 'light', 'dark'] as const;
export type AppThemeMode = (typeof APP_THEME_MODES)[number];

const APP_THEME_MODE_SET = new Set<string>(APP_THEME_MODES);

export function isAppThemeMode(value: unknown): value is AppThemeMode {
  const raw = String(value ?? '')
    .trim()
    .toLowerCase();
  return APP_THEME_MODE_SET.has(raw);
}

export function normalizeAppThemeMode(value: unknown): AppThemeMode {
  const raw = String(value ?? '')
    .trim()
    .toLowerCase();
  return isAppThemeMode(raw) ? raw : 'system';
}

export function resolveAppThemeModeFromStorage(storage: Record<string, unknown> | null | undefined): AppThemeMode {
  return normalizeAppThemeMode(storage?.[APP_THEME_MODE_STORAGE_KEY]);
}

export function buildAppThemeModeStoragePatch(mode: unknown): { [APP_THEME_MODE_STORAGE_KEY]: AppThemeMode } {
  return { [APP_THEME_MODE_STORAGE_KEY]: normalizeAppThemeMode(mode) };
}
