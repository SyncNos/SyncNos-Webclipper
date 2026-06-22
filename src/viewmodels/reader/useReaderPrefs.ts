import { useCallback, useEffect, useRef, useState } from 'react';
import {
  READER_PREFS_STORAGE_KEY,
  buildReaderPrefsStoragePatch,
  normalizeReaderPrefs,
  resolveReaderPrefsFromStorage,
  type ReaderPrefs,
} from '@services/protocols/reader-prefs';
import { storageGet, storageOnChanged, storageSet } from '@services/shared/storage';

export type UseReaderPrefsResult = {
  /** Current normalized reader preferences (always a valid, fully-populated object). */
  prefs: ReaderPrefs;
  /**
   * Shallow-merge a patch into the current prefs, persist it, and update local state.
   * `tts` is merged one level deep so callers can patch a single TTS field.
   */
  update: (patch: Partial<ReaderPrefs>) => Promise<void>;
};

/**
 * Reader-preference view-model hook.
 *
 * Single source of truth is `chrome.storage.local` under `reader_prefs_v1`; this
 * hook mirrors that store into React state and keeps every open surface in sync
 * via `storage.onChanged`. The settings scene also reads/writes the same key, so
 * changes made there propagate here (and vice-versa) without prop drilling.
 *
 * Framework-agnostic logic (model, normalize, migrate, css vars) lives in
 * `@services/protocols/reader-prefs`; this hook only owns React wiring.
 */
export function useReaderPrefs(): UseReaderPrefsResult {
  const [prefs, setPrefs] = useState<ReaderPrefs>(() => resolveReaderPrefsFromStorage(null));
  const prefsRef = useRef<ReaderPrefs>(prefs);
  prefsRef.current = prefs;

  // Initial hydrate from storage.
  useEffect(() => {
    let disposed = false;
    void (async () => {
      try {
        const stored = await storageGet([READER_PREFS_STORAGE_KEY]);
        if (disposed) return;
        setPrefs(resolveReaderPrefsFromStorage(stored));
      } catch (error) {
        console.warn('[reader] failed to load reader prefs', {
          error: error instanceof Error ? error.message : String(error || ''),
        });
      }
    })();
    return () => {
      disposed = true;
    };
  }, []);

  // Cross-surface sync: mirror external writes to the same storage key.
  useEffect(() => {
    const unsubscribe = storageOnChanged((changes, areaName) => {
      if (areaName && areaName !== 'local') return;
      const change = changes?.[READER_PREFS_STORAGE_KEY];
      if (!change) return;
      setPrefs(normalizeReaderPrefs((change as { newValue?: unknown }).newValue ?? null));
    });
    return unsubscribe;
  }, []);

  const update = useCallback(async (patch: Partial<ReaderPrefs>) => {
    const base = prefsRef.current;
    const merged = normalizeReaderPrefs({
      ...base,
      ...patch,
      tts: { ...base.tts, ...(patch.tts ?? {}) },
    });
    await storageSet(buildReaderPrefsStoragePatch(merged));
    setPrefs(merged);
  }, []);

  return { prefs, update };
}
