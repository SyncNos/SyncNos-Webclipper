import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReaderTtsEngine,
  type ReaderTtsDeps,
  type ReaderTtsListeners,
  type ReaderTtsSentence,
  type ReaderTtsState,
} from '@services/reader/tts/reader-tts-engine';
import type { ReaderTtsPrefs } from '@services/protocols/reader-prefs';

export type UseReaderNarrationResult = {
  state: ReaderTtsState;
  /** Index of the selected/narrated sentence, or -1 when no cursor is positioned. */
  activeIndex: number;
  /** The selected/narrated sentence (with char offsets) for read-only DOM highlight, or null. */
  activeSentence: ReaderTtsSentence | null;
  /** Whether narration currently has a positioned cursor, even if playback is idle. */
  hasCursor: boolean;
  error: string | null;
  /** Whether the Web Speech engine is available in this environment. */
  webSpeechAvailable: boolean;
  isPlaying: boolean;
  play: (fromIndex?: number) => void;
  seek: (index: number) => void;
  pause: () => void;
  stop: () => void;
  toggle: (firstVisibleIndex?: number) => void;
};

type ReaderNarrationStats = {
  state: ReaderTtsState;
  isPlaying: boolean;
  hasCursor: boolean;
  stateChanges: number;
  errorCount: number;
  lastError: string | null;
  activeIndex: number;
  updatedAt: number;
};

/**
 * Publish a privacy-safe narration snapshot to a global debug hook
 * (`globalThis.__syncnosReaderNarration`). Only counters / state flags are
 * exposed — never article text, TTS prefs, or the AI endpoint API key.
 * Best-effort: failures are swallowed so observability never breaks narration.
 */
function publishNarrationStats(stats: ReaderNarrationStats): void {
  try {
    (globalThis as Record<string, unknown>).__syncnosReaderNarration = { ...stats };
  } catch {
    // Ignore — observability must never break narration.
  }
}

/**
 * React glue around the framework-agnostic {@link ReaderTtsEngine}.
 *
 * The engine instance is created once and survives re-renders so in-flight
 * playback is not interrupted; TTS preferences are applied imperatively, and the
 * narration text is (re)loaded whenever `source` changes. The engine is disposed
 * on unmount so no speech / audio leaks past the reader view.
 *
 * Playback controls (`play/pause/stop/toggle`) are returned for the P4 toolbar;
 * `activeIndex` / `activeSentence` drive the read-only sentence highlight.
 */
export function useReaderNarration(
  source: string,
  ttsPrefs: ReaderTtsPrefs,
  deps?: ReaderTtsDeps,
): UseReaderNarrationResult {
  const [state, setState] = useState<ReaderTtsState>('idle');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeSentence, setActiveSentence] = useState<ReaderTtsSentence | null>(null);
  const [hasCursor, setHasCursor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // P4-T3 observability: counters only — never article text, prefs, or API keys.
  const statsRef = useRef<ReaderNarrationStats>({
    state: 'idle',
    isPlaying: false,
    hasCursor: false,
    stateChanges: 0,
    errorCount: 0,
    lastError: null,
    activeIndex: -1,
    updatedAt: 0,
  });

  // Created once; identity is preserved across renders via the ref guard.
  const engineRef = useRef<ReaderTtsEngine | null>(null);
  if (engineRef.current === null) {
    const listeners: ReaderTtsListeners = {
      onState: (next) => {
        setState(next);
        const s = statsRef.current;
        s.state = next;
        s.isPlaying = next === 'playing' || next === 'loading';
        s.stateChanges += 1;
        s.updatedAt = Date.now();
        publishNarrationStats(s);
      },
      onSentence: (index, sentence) => {
        setActiveIndex(index);
        setActiveSentence(sentence);
        setHasCursor(index >= 0);
        const s = statsRef.current;
        s.activeIndex = index;
        s.hasCursor = index >= 0;
        s.updatedAt = Date.now();
        publishNarrationStats(s);
      },
      onError: (err) => {
        setError(err.message);
        const s = statsRef.current;
        s.errorCount += 1;
        s.lastError = err.message;
        s.updatedAt = Date.now();
        publishNarrationStats(s);
      },
    };
    engineRef.current = new ReaderTtsEngine(ttsPrefs, listeners, deps);
  }

  // Dispose exactly once on unmount (stops speech, cancels in-flight audio).
  useEffect(
    () => () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    },
    [],
  );

  // Keep engine TTS prefs in sync; the engine reads them at speak time.
  useEffect(() => {
    engineRef.current?.updatePrefs(ttsPrefs);
  }, [ttsPrefs]);

  // Reload narration text when the source changes. load() stops playback, so we
  // also clear the highlight to avoid a stale active sentence lingering.
  useEffect(() => {
    engineRef.current?.load(source);
    setActiveIndex(-1);
    setActiveSentence(null);
    setHasCursor(false);
    setError(null);
    const s = statsRef.current;
    s.activeIndex = -1;
    s.hasCursor = false;
    s.lastError = null;
    s.updatedAt = Date.now();
    publishNarrationStats(s);
  }, [source]);

  const clearNarrationError = useCallback(() => {
    setError(null);
    const s = statsRef.current;
    if (s.lastError !== null) {
      s.lastError = null;
      s.updatedAt = Date.now();
      publishNarrationStats(s);
    }
  }, []);

  const clearNarrationCursor = useCallback(() => {
    setActiveIndex(-1);
    setActiveSentence(null);
    setHasCursor(false);
    const s = statsRef.current;
    s.activeIndex = -1;
    s.hasCursor = false;
    s.updatedAt = Date.now();
    publishNarrationStats(s);
  }, []);

  const play = useCallback(
    (fromIndex?: number) => {
      clearNarrationError();
      void engineRef.current?.play(fromIndex);
    },
    [clearNarrationError],
  );
  const seek = useCallback(
    (index: number) => {
      clearNarrationError();
      engineRef.current?.seek(index);
    },
    [clearNarrationError],
  );
  const pause = useCallback(() => {
    engineRef.current?.pause();
  }, []);
  const stop = useCallback(() => {
    clearNarrationError();
    engineRef.current?.stop();
    clearNarrationCursor();
  }, [clearNarrationCursor, clearNarrationError]);
  const toggle = useCallback(
    (firstVisibleIndex?: number) => {
      const engine = engineRef.current;
      if (!engine) return;
      const state = engine.getState();
      if (state === 'playing' || state === 'loading') {
        clearNarrationError();
        engine.pause();
        return;
      }
      if (state === 'paused') {
        clearNarrationError();
        engine.resume();
        return;
      }
      clearNarrationError();
      if (engine.getHasCursor()) {
        void engine.play(engine.getActiveIndex());
        return;
      }
      const fallback = Number.isFinite(firstVisibleIndex) ? Math.max(0, Math.trunc(firstVisibleIndex ?? 0)) : 0;
      void engine.play(fallback);
    },
    [clearNarrationError],
  );

  // Web Speech availability gates the engine picker / fallback affordance in the UI.
  const webSpeechAvailable = useMemo(() => {
    try {
      const synth = deps?.getSynth ? deps.getSynth() : globalThis.speechSynthesis;
      return synth != null;
    } catch {
      return false;
    }
  }, [deps]);

  return useMemo(
    () => ({
      state,
      activeIndex,
      activeSentence,
      hasCursor,
      error,
      webSpeechAvailable,
      isPlaying: state === 'playing' || state === 'loading',
      play,
      seek,
      pause,
      stop,
      toggle,
    }),
    [state, activeIndex, activeSentence, hasCursor, error, webSpeechAvailable, play, seek, pause, stop, toggle],
  );
}
