// Framework-agnostic narration engine for the reader.
//
// P4-T1 lands the pure, deterministic core: sentence segmentation + the shared
// type surface. The stateful ReaderTtsEngine (Web tier + lifecycle) arrives in
// P4-T2, and the AI tier in P5-T1. Keeping this file free of React/DOM imports
// lets the segmentation logic be unit-tested in the node test environment.

import type { ReaderTtsPrefs } from '@services/protocols/reader-prefs';

export type ReaderTtsState = 'idle' | 'loading' | 'playing' | 'paused';

export type ReaderTtsSentence = {
  index: number;
  text: string;
  /** Character offset into the original source text (for DOM mapping if needed). */
  start: number;
  end: number;
};

export type ReaderTtsListeners = {
  onState?: (state: ReaderTtsState) => void;
  onSentence?: (index: number, sentence: ReaderTtsSentence | null) => void;
  onError?: (error: Error) => void;
};

// Greedy run of non-terminator chars followed by any trailing terminators.
// Terminators: Latin . ! ? plus CJK fullwidth \u3002 \uff01 \uff1f \uff0e and newline.
const SENTENCE_BREAK_RE = /[^.!?\u3002\uff01\uff1f\uff0e\n]+[.!?\u3002\uff01\uff1f\uff0e\n]*/g;

/**
 * Split source text into sentences with CJK + Latin punctuation awareness.
 *
 * - Empty / whitespace-only input -> `[]`.
 * - Text with no terminator punctuation -> a single trimmed sentence (fallback).
 * - `start`/`end` are character offsets into the original (untrimmed) source so
 *   callers can map a sentence back onto DOM ranges later.
 */
export function buildSentences(source: string): ReaderTtsSentence[] {
  const text = String(source || '');
  if (!text.trim()) return [];
  const out: ReaderTtsSentence[] = [];
  SENTENCE_BREAK_RE.lastIndex = 0;
  let match: RegExpExecArray | null = null;
  let index = 0;
  while ((match = SENTENCE_BREAK_RE.exec(text)) != null) {
    const raw = match[0];
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const start = match.index + (raw.length - raw.trimStart().length);
    out.push({ index: index++, text: trimmed, start, end: start + trimmed.length });
  }
  if (!out.length) {
    const trimmed = text.trim();
    out.push({ index: 0, text: trimmed, start: 0, end: trimmed.length });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Stateful narration engine (Web Speech tier).
//
// Speech-synthesis dependencies are injected so the engine can be exercised in
// the node test environment with fakes. Defaults read from `globalThis` for a
// real browser / content-script context. The AI tier (network + HTMLAudio) is
// layered on in P5-T1.
// ---------------------------------------------------------------------------

/** Structural subset of the Web Speech `SpeechSynthesis` we rely on. */
export interface SpeechSynthesisLike {
  speak(utterance: SpeechSynthesisUtteranceLike): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  getVoices(): Array<{ voiceURI: string }>;
}

/** Structural subset of `SpeechSynthesisUtterance`. */
export interface SpeechSynthesisUtteranceLike {
  text: string;
  rate: number;
  voice?: unknown;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
}

export type ReaderTtsDeps = {
  getSynth?: () => SpeechSynthesisLike | null;
  createUtterance?: (text: string) => SpeechSynthesisUtteranceLike;
  // AI tier (P5-T1)
  fetch?: FetchLike;
  createAudio?: (src: string) => HtmlAudioLike;
  createObjectURL?: (blob: BlobLike) => string;
  revokeObjectURL?: (url: string) => void;
};

function defaultGetSynth(): SpeechSynthesisLike | null {
  const scope = globalThis as Record<string, unknown>;
  return 'speechSynthesis' in scope ? (scope.speechSynthesis as SpeechSynthesisLike) : null;
}

function defaultCreateUtterance(text: string): SpeechSynthesisUtteranceLike {
  const scope = globalThis as Record<string, unknown>;
  const Ctor = scope.SpeechSynthesisUtterance as (new (value: string) => SpeechSynthesisUtteranceLike) | undefined;
  if (typeof Ctor !== 'function') throw new Error('SpeechSynthesisUtterance unavailable');
  return new Ctor(text);
}

// ---- AI tier (network + HTMLAudio) injectables ----------------------------
// Injected so the AI narration path is unit-testable without real network /
// audio. Defaults read from `globalThis` for a real browser context.

export interface BlobLike {
  readonly size?: number;
  readonly type?: string;
}

export interface FetchResponseLike {
  readonly ok: boolean;
  readonly status: number;
  blob(): Promise<BlobLike>;
  text(): Promise<string>;
}

export interface FetchRequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: unknown;
}

export type FetchLike = (input: string, init?: FetchRequestInit) => Promise<FetchResponseLike>;

/** Structural subset of `HTMLAudioElement` used for AI playback. */
export interface HtmlAudioLike {
  src: string;
  play(): Promise<void> | void;
  pause(): void;
  onended: (() => void) | null;
  onerror: ((event?: unknown) => void) | null;
}

function defaultFetch(input: string, init?: FetchRequestInit): Promise<FetchResponseLike> {
  const scope = globalThis as Record<string, unknown>;
  const impl = scope.fetch as FetchLike | undefined;
  if (typeof impl !== 'function') throw new Error('fetch unavailable');
  return impl(input, init);
}

function defaultCreateAudio(src: string): HtmlAudioLike {
  const scope = globalThis as Record<string, unknown>;
  const Ctor = scope.Audio as (new (src?: string) => HtmlAudioLike) | undefined;
  if (typeof Ctor !== 'function') throw new Error('Audio unavailable');
  return new Ctor(src);
}

function defaultCreateObjectURL(blob: BlobLike): string {
  const scope = globalThis as Record<string, unknown>;
  const url = scope.URL as { createObjectURL?: (b: BlobLike) => string } | undefined;
  if (!url?.createObjectURL) throw new Error('URL.createObjectURL unavailable');
  return url.createObjectURL(blob);
}

function defaultRevokeObjectURL(value: string): void {
  const scope = globalThis as Record<string, unknown>;
  const url = scope.URL as { revokeObjectURL?: (u: string) => void } | undefined;
  url?.revokeObjectURL?.(value);
}

export class ReaderTtsEngine {
  private prefs: ReaderTtsPrefs;
  private listeners: ReaderTtsListeners;
  private readonly getSynth: () => SpeechSynthesisLike | null;
  private readonly createUtterance: (text: string) => SpeechSynthesisUtteranceLike;
  private readonly fetchImpl: FetchLike;
  private readonly createAudio: (src: string) => HtmlAudioLike;
  private readonly createObjectURL: (blob: BlobLike) => string;
  private readonly revokeObjectURL: (url: string) => void;
  private sentences: ReaderTtsSentence[] = [];
  private cursor = 0;
  private state: ReaderTtsState = 'idle';
  // Monotonic token: every stop()/restart bumps it so a stale async
  // continuation (a late `onend`) can detect it has been superseded.
  private generation = 0;
  private disposed = false;
  // AI tier runtime handles, torn down by stop()/dispose().
  private currentAbort: AbortController | null = null;
  private currentAudio: HtmlAudioLike | null = null;
  private currentObjectUrl: string | null = null;
  private currentAudioSettle: ((error?: Error) => void) | null = null;
  private aiShouldAutoplay = true;

  constructor(prefs: ReaderTtsPrefs, listeners: ReaderTtsListeners = {}, deps: ReaderTtsDeps = {}) {
    this.prefs = prefs;
    this.listeners = listeners;
    this.getSynth = deps.getSynth ?? defaultGetSynth;
    this.createUtterance = deps.createUtterance ?? defaultCreateUtterance;
    this.fetchImpl = deps.fetch ?? defaultFetch;
    this.createAudio = deps.createAudio ?? defaultCreateAudio;
    this.createObjectURL = deps.createObjectURL ?? defaultCreateObjectURL;
    this.revokeObjectURL = deps.revokeObjectURL ?? defaultRevokeObjectURL;
  }

  getState(): ReaderTtsState {
    return this.state;
  }

  getActiveIndex(): number {
    return this.state === 'idle' ? -1 : this.cursor;
  }

  updatePrefs(prefs: ReaderTtsPrefs): void {
    this.prefs = prefs;
  }

  /** Load text to narrate. Resets playback; does not auto-start. */
  load(source: string): void {
    this.stop();
    this.sentences = buildSentences(source);
    this.cursor = 0;
  }

  async play(fromIndex?: number): Promise<void> {
    if (this.disposed || !this.sentences.length) return;
    if (typeof fromIndex === 'number') {
      this.cursor = Math.max(0, Math.min(fromIndex, this.sentences.length - 1));
    } else if (this.state === 'paused') {
      this.resume();
      return;
    }
    await this.speakFromCursor();
  }

  pause(): void {
    if (this.state !== 'playing' && this.state !== 'loading') return;
    // The AI tier plays an HTMLAudio element; the Web tier drives speechSynthesis.
    if (this.prefs.engine === 'ai') {
      this.aiShouldAutoplay = false;
      this.currentAudio?.pause();
    } else {
      if (this.state !== 'playing') return;
      this.getSynth()?.pause();
    }
    this.setState('paused');
  }

  resume(): void {
    if (this.state !== 'paused') return;
    if (this.prefs.engine === 'ai') {
      this.aiShouldAutoplay = true;
      if (this.currentAudio) {
        this.setState('playing');
        this.startCurrentAudioPlayback();
        return;
      }
      if (this.currentAbort) {
        this.setState('loading');
        return;
      }
    } else {
      this.getSynth()?.resume();
      this.setState('playing');
      return;
    }
  }

  stop(): void {
    // Invalidate any in-flight narration loop before cancelling the synth.
    this.generation += 1;
    this.aiShouldAutoplay = true;
    try {
      this.getSynth()?.cancel();
    } catch (_e) {
      // ignore synth teardown errors
    }
    // Abort any in-flight AI request and release the current audio + object URL.
    this.currentAbort?.abort();
    this.currentAbort = null;
    this.cancelCurrentAudio(new Error('AI playback cancelled'));
    if (this.state !== 'idle') {
      this.setState('idle');
      this.emitSentence(-1);
    }
  }

  dispose(): void {
    this.disposed = true;
    this.stop();
    this.listeners = {};
  }

  // ---- internals ----

  private async speakFromCursor(): Promise<void> {
    const generation = ++this.generation;
    while (!this.disposed && generation === this.generation && this.cursor < this.sentences.length) {
      const sentence = this.sentences[this.cursor];
      this.emitSentence(this.cursor);
      try {
        await this.speakSentence(sentence.text);
      } catch (error) {
        if (this.disposed || generation !== this.generation) return;
        this.listeners.onError?.(error instanceof Error ? error : new Error(String(error)));
        this.setState('idle');
        this.emitSentence(-1);
        return;
      }
      // A stop()/dispose()/restart bumped the generation while we awaited.
      if (this.disposed || generation !== this.generation) return;
      if (this.state === 'paused') return; // paused mid-sentence; resume() continues
      this.cursor += 1;
    }
    if (!this.disposed && generation === this.generation && this.cursor >= this.sentences.length) {
      this.setState('idle');
      this.emitSentence(-1);
      this.cursor = 0;
    }
  }

  private speakWeb(text: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const synth = this.getSynth();
      if (!synth) {
        reject(new Error('Web Speech API unavailable'));
        return;
      }
      this.setState('playing');
      const utter = this.createUtterance(text);
      utter.rate = this.prefs.rate;
      if (this.prefs.webVoiceURI) {
        const voice = synth.getVoices().find((v) => v.voiceURI === this.prefs.webVoiceURI);
        if (voice) utter.voice = voice;
      }
      utter.onend = () => resolve();
      utter.onerror = (event) => reject(new Error(`SpeechSynthesis error: ${event?.error || 'unknown'}`));
      synth.speak(utter);
    });
  }

  private speakSentence(text: string): Promise<void> {
    return this.prefs.engine === 'ai' ? this.speakAi(text) : this.speakWeb(text);
  }

  private async speakAi(text: string): Promise<void> {
    let endpoint = this.prefs.aiEndpoint || '';
    while (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1);
    if (!endpoint) throw new Error('AI endpoint not configured');
    this.aiShouldAutoplay = true;
    this.setState('loading');
    const controller = new AbortController();
    this.currentAbort = controller;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    // API key travels only in the request header; never logged.
    if (this.prefs.aiApiKey) headers.Authorization = `Bearer ${this.prefs.aiApiKey}`;
    const body = JSON.stringify({
      model: this.prefs.aiModel,
      voice: this.prefs.aiVoice,
      input: text,
      // Firefox can't reliably play streamed mp3 from a blob; opus is the safe default.
      response_format: this.prefs.aiFormat || 'opus',
      speed: this.prefs.rate,
    });
    try {
      const response = await this.fetchImpl(`${endpoint}/audio/speech`, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      if (!response.ok) throw new Error(`TTS endpoint error: ${response.status}`);
      const blob = await response.blob();
      if (controller.signal.aborted) return;
      await this.playBlob(blob);
    } catch (error) {
      // A stop()-triggered abort is a normal cancellation, not a failure.
      if (controller.signal.aborted) return;
      throw error instanceof Error ? error : new Error(String(error));
    } finally {
      if (this.currentAbort === controller) this.currentAbort = null;
    }
  }

  /** Play one fully-downloaded audio blob, releasing the object URL on every exit. */
  private playBlob(blob: BlobLike): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let settled = false;
      const settle = (error?: Error) => {
        if (settled) return;
        settled = true;
        if (this.currentAudioSettle === settle) this.currentAudioSettle = null;
        this.teardownAudio();
        if (error) reject(error);
        else resolve();
      };
      let objectUrl: string;
      try {
        objectUrl = this.createObjectURL(blob);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
        return;
      }
      this.currentObjectUrl = objectUrl;
      const audio = this.createAudio(objectUrl);
      this.currentAudio = audio;
      this.currentAudioSettle = settle;
      audio.onended = () => {
        settle();
      };
      audio.onerror = () => {
        settle(new Error('Audio playback failed'));
      };
      if (this.aiShouldAutoplay) {
        this.setState('playing');
        this.startCurrentAudioPlayback(settle);
      }
    });
  }

  private startCurrentAudioPlayback(onError?: (error?: Error) => void): void {
    const audio = this.currentAudio;
    if (!audio) return;
    try {
      const started = audio.play();
      if (started && typeof (started as Promise<void>).then === 'function') {
        (started as Promise<void>).catch((error) => {
          onError?.(error instanceof Error ? error : new Error(String(error)));
        });
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private cancelCurrentAudio(error: Error): void {
    const settle = this.currentAudioSettle;
    if (settle) {
      this.currentAudioSettle = null;
      settle(error);
      return;
    }
    this.teardownAudio();
  }

  /** Release the current HTMLAudio + object URL. Safe to call repeatedly. */
  private teardownAudio(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
      } catch (_e) {
        // ignore audio teardown errors
      }
      this.currentAudio.onended = null;
      this.currentAudio.onerror = null;
      this.currentAudio = null;
    }
    this.currentAudioSettle = null;
    if (this.currentObjectUrl) {
      try {
        this.revokeObjectURL(this.currentObjectUrl);
      } catch (_e) {
        // ignore revoke errors
      }
      this.currentObjectUrl = null;
    }
  }

  private setState(next: ReaderTtsState): void {
    if (this.state === next) return;
    this.state = next;
    this.listeners.onState?.(next);
  }

  private emitSentence(index: number): void {
    this.listeners.onSentence?.(index, index >= 0 ? (this.sentences[index] ?? null) : null);
  }
}
