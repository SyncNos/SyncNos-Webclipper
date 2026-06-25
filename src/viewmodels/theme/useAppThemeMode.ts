import { useCallback, useEffect, useRef, useState } from 'react';
import {
  APP_THEME_MODE_STORAGE_KEY,
  buildAppThemeModeStoragePatch,
  normalizeAppThemeMode,
  resolveAppThemeModeFromStorage,
  type AppThemeMode,
} from '@services/protocols/app-theme';
import { storageGet, storageOnChanged, storageSet } from '@services/shared/storage';

export type UseAppThemeModeResult = {
  mode: AppThemeMode;
  update: (mode: AppThemeMode) => Promise<void>;
};

function applyAppThemeMode(mode: AppThemeMode) {
  const root = globalThis.document?.documentElement;
  if (!root) return;

  const normalized = normalizeAppThemeMode(mode);
  if (normalized === 'system') {
    root.removeAttribute('data-theme-mode');
    root.style.colorScheme = '';
    return;
  }

  root.setAttribute('data-theme-mode', normalized);
  root.style.colorScheme = normalized;
}

export function useAppThemeMode(): UseAppThemeModeResult {
  const [mode, setMode] = useState<AppThemeMode>('system');
  const modeRef = useRef<AppThemeMode>(mode);
  modeRef.current = mode;

  useEffect(() => {
    applyAppThemeMode(mode);
  }, [mode]);

  useEffect(() => {
    let disposed = false;
    void (async () => {
      try {
        const stored = await storageGet([APP_THEME_MODE_STORAGE_KEY]);
        if (disposed) return;
        setMode(resolveAppThemeModeFromStorage(stored));
      } catch (error) {
        console.warn('[theme] failed to load app theme mode', {
          error: error instanceof Error ? error.message : String(error || ''),
        });
      }
    })();
    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = storageOnChanged((changes, areaName) => {
      if (areaName && areaName !== 'local') return;
      const change = changes?.[APP_THEME_MODE_STORAGE_KEY];
      if (!change) return;
      setMode(normalizeAppThemeMode((change as { newValue?: unknown }).newValue));
    });
    return unsubscribe;
  }, []);

  const update = useCallback(async (nextMode: AppThemeMode) => {
    const normalized = normalizeAppThemeMode(nextMode);
    if (normalized === modeRef.current) return;
    await storageSet(buildAppThemeModeStoragePatch(normalized));
    setMode(normalized);
  }, []);

  return { mode, update };
}
