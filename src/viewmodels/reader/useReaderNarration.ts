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
  /** Index of the sentence currently being narrated, or -1 when idle/stopped. */
  activeIndex: number;
  /** The active sentence (with char offsets) for read-only DOM highlight, or null. */
  activeSentence: ReaderTtsSentence | null;
  error: string | null;
  /** Whether the Web Speech engine is available in this environment. */
  webSpeechAvailable: boolean;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggle: () => void;
};

/**
 * React glue around the framework-agnostic {@link ReaderTtsEngine}.
 *
 * The engine instance is created once and survives re-renders so in-flight
 * playback is not interrupted; TTS preferences are applied imperatively, and the
 * narration text is (re)loaded whenever `source` changes. The engine is disposed
 * on unmount so no speech / audio leaks past the reader view.
 *
 * Playback controls (`play/pause/stop/toggle`) are returned for the P6 toolbar;
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
  const [error, setError] = useState<string | null>(null);

  // Created once; identity is preserved across renders via the ref guard.
  const engineRef = useRef<ReaderTtsEngine | null>(null);
  if (engineRef.current === null) {
    const listeners: ReaderTtsListeners = {
      onState: (next) => setState(next),
      onSentence: (index, sentence) => {
        setActiveIndex(index);
        setActiveSentence(sentence);
      },
      onError: (err) => setError(err.message),
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
    setError(null);
  }, [source]);

  const play = useCallback(() => {
    setError(null);
    void engineRef.current?.play();
  }, []);
  const pause = useCallback(() => {
    engineRef.current?.pause();
  }, []);
  const stop = useCallback(() => {
    engineRef.current?.stop();
  }, []);
  const toggle = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.getState() === 'playing') engine.pause();
    else void engine.play();
  }, []);

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
      error,
      webSpeechAvailable,
      isPlaying: state === 'playing' || state === 'loading',
      play,
      pause,
      stop,
      toggle,
    }),
    [state, activeIndex, activeSentence, error, webSpeechAvailable, play, pause, stop, toggle],
  );
}
