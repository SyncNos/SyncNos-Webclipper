import { describe, it, expect } from 'vitest';
import { buildSentences, ReaderTtsEngine } from '@services/reader/tts/reader-tts-engine';
import type { ReaderTtsState, SpeechSynthesisLike } from '@services/reader/tts/reader-tts-engine';
import { DEFAULT_READER_TTS_PREFS } from '@services/protocols/reader-prefs';

describe('buildSentences', () => {
  it('returns [] for empty or whitespace-only input', () => {
    expect(buildSentences('')).toEqual([]);
    expect(buildSentences('   ')).toEqual([]);
    expect(buildSentences('\n\t  \n')).toEqual([]);
    // non-string coercion guard
    expect(buildSentences(undefined as unknown as string)).toEqual([]);
  });

  it('falls back to a single sentence when there is no terminator punctuation', () => {
    const out = buildSentences('just some plain text');
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ index: 0, text: 'just some plain text' });
  });

  it('splits on CJK fullwidth punctuation', () => {
    const out = buildSentences('\u7b2c\u4e00\u53e5\u3002\u7b2c\u4e8c\u53e5\uff01\u7b2c\u4e09\u53e5\uff1f');
    expect(out.map((s) => s.text)).toEqual([
      '\u7b2c\u4e00\u53e5\u3002',
      '\u7b2c\u4e8c\u53e5\uff01',
      '\u7b2c\u4e09\u53e5\uff1f',
    ]);
    expect(out.map((s) => s.index)).toEqual([0, 1, 2]);
  });

  it('splits mixed Latin + CJK sentences', () => {
    const out = buildSentences('Hello world. \u4f60\u597d\u4e16\u754c\u3002How are you?');
    expect(out.map((s) => s.text)).toEqual(['Hello world.', '\u4f60\u597d\u4e16\u754c\u3002', 'How are you?']);
  });

  it('treats newlines as sentence breaks', () => {
    const out = buildSentences('Line one\nLine two\nLine three');
    expect(out.map((s) => s.text)).toEqual(['Line one', 'Line two', 'Line three']);
  });

  it('records trimmed char offsets into the original source', () => {
    const out = buildSentences('  \u4f60\u597d\u3002\u4e16\u754c\u3002');
    expect(out).toHaveLength(2);
    // leading two spaces skipped: first sentence starts at offset 2
    expect(out[0]).toMatchObject({ index: 0, text: '\u4f60\u597d\u3002', start: 2, end: 5 });
    expect(out[1]).toMatchObject({ index: 1, text: '\u4e16\u754c\u3002', start: 5, end: 8 });
  });
});

// --- ReaderTtsEngine (Web tier) -------------------------------------------

type FakeUtterance = {
  text: string;
  rate: number;
  voice?: unknown;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
};

class FakeSynth {
  spoken: string[] = [];
  current: FakeUtterance | null = null;
  cancelCount = 0;
  pauseCount = 0;
  resumeCount = 0;
  voices: Array<{ voiceURI: string }>;

  constructor(voices: Array<{ voiceURI: string }> = []) {
    this.voices = voices;
  }

  speak(utterance: FakeUtterance): void {
    this.current = utterance;
    this.spoken.push(utterance.text);
  }
  cancel(): void {
    this.cancelCount += 1;
    this.current = null;
  }
  pause(): void {
    this.pauseCount += 1;
  }
  resume(): void {
    this.resumeCount += 1;
  }
  getVoices(): Array<{ voiceURI: string }> {
    return this.voices;
  }
  /** Simulate the current utterance finishing successfully. */
  finish(): void {
    const utterance = this.current;
    this.current = null;
    utterance?.onend?.();
  }
}

const createUtterance = (text: string): FakeUtterance => ({
  text,
  rate: 1,
  voice: undefined,
  onend: null,
  onerror: null,
});

const deps = (synth: FakeSynth) => ({
  getSynth: () => synth as unknown as SpeechSynthesisLike,
  createUtterance,
});

const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('ReaderTtsEngine (Web tier)', () => {
  it('load() segments text and stays idle', () => {
    const synth = new FakeSynth();
    const engine = new ReaderTtsEngine(DEFAULT_READER_TTS_PREFS, {}, deps(synth));
    engine.load('A. B. C.');
    expect(engine.getState()).toBe('idle');
    expect(engine.getActiveIndex()).toBe(-1);
    expect(synth.spoken).toEqual([]);
  });

  it('seek() only positions the cursor while idle and stop/load clear it', () => {
    const synth = new FakeSynth();
    const highlights: number[] = [];
    const engine = new ReaderTtsEngine(
      DEFAULT_READER_TTS_PREFS,
      { onSentence: (i) => highlights.push(i) },
      deps(synth),
    );

    engine.load('A. B. C.');
    engine.seek(1);
    expect(engine.getState()).toBe('idle');
    expect(engine.getActiveIndex()).toBe(1);
    expect(engine.getHasCursor()).toBe(true);
    expect(synth.spoken).toEqual([]);
    expect(highlights).toEqual([1]);

    engine.stop();
    expect(engine.getActiveIndex()).toBe(-1);
    expect(engine.getHasCursor()).toBe(false);
    expect(highlights).toEqual([1, -1]);

    engine.seek(2);
    expect(engine.getActiveIndex()).toBe(2);
    engine.load('X. Y.');
    expect(engine.getActiveIndex()).toBe(-1);
    expect(engine.getHasCursor()).toBe(false);
    expect(highlights).toEqual([1, -1, 2, -1]);
  });

  it('plays sentences in order, emitting state + highlight callbacks', async () => {
    const synth = new FakeSynth();
    const states: ReaderTtsState[] = [];
    const highlights: number[] = [];
    const engine = new ReaderTtsEngine(
      DEFAULT_READER_TTS_PREFS,
      { onState: (s) => states.push(s), onSentence: (i) => highlights.push(i) },
      deps(synth),
    );
    engine.load('A. B. C.');
    const done = engine.play();
    expect(synth.spoken).toEqual(['A.']);
    expect(engine.getState()).toBe('playing');
    synth.finish();
    await tick();
    expect(synth.spoken).toEqual(['A.', 'B.']);
    synth.finish();
    await tick();
    expect(synth.spoken).toEqual(['A.', 'B.', 'C.']);
    synth.finish();
    await done;
    expect(engine.getState()).toBe('idle');
    expect(highlights).toEqual([0, 1, 2, -1]);
    expect(states[0]).toBe('playing');
    expect(states[states.length - 1]).toBe('idle');
  });

  it('stop() cancels the synth and the generation guard blocks a late onend', async () => {
    const synth = new FakeSynth();
    const highlights: number[] = [];
    const engine = new ReaderTtsEngine(
      DEFAULT_READER_TTS_PREFS,
      { onSentence: (i) => highlights.push(i) },
      deps(synth),
    );
    engine.load('A. B.');
    engine.play();
    const pending = synth.current; // capture before stop() nulls it
    expect(synth.spoken).toEqual(['A.']);
    const cancelsBeforeStop = synth.cancelCount;
    engine.stop();
    expect(synth.cancelCount).toBe(cancelsBeforeStop + 1);
    expect(engine.getState()).toBe('idle');
    // a late onend from the cancelled utterance must NOT advance to 'B.'
    pending?.onend?.();
    await tick();
    expect(synth.spoken).toEqual(['A.']);
    expect(engine.getState()).toBe('idle');
    expect(highlights).toEqual([0, -1]);
  });

  it('play(fromIndex) cancels the old utterance and restarts from the requested sentence', async () => {
    const synth = new FakeSynth();
    const highlights: number[] = [];
    const engine = new ReaderTtsEngine(
      DEFAULT_READER_TTS_PREFS,
      { onSentence: (i) => highlights.push(i) },
      deps(synth),
    );
    engine.load('A. B. C.');
    const firstRun = engine.play();
    expect(synth.spoken).toEqual(['A.']);
    const firstUtterance = synth.current;
    const restartRun = engine.play(1);
    expect(synth.cancelCount).toBeGreaterThan(0);
    expect(engine.getActiveIndex()).toBe(1);
    expect(engine.getHasCursor()).toBe(true);
    expect(synth.spoken).toEqual(['A.', 'B.']);

    firstUtterance?.onend?.();
    await tick();
    expect(synth.spoken).toEqual(['A.', 'B.']);

    synth.finish();
    await tick();
    expect(synth.spoken).toEqual(['A.', 'B.', 'C.']);
    synth.finish();
    await restartRun;
    await firstRun;

    expect(engine.getState()).toBe('idle');
    expect(engine.getActiveIndex()).toBe(-1);
    expect(engine.getHasCursor()).toBe(false);
    expect(highlights).toEqual([0, -1, 1, 2, -1]);
  });

  it('pause() and resume() drive the underlying synth', () => {
    const synth = new FakeSynth();
    const engine = new ReaderTtsEngine(DEFAULT_READER_TTS_PREFS, {}, deps(synth));
    engine.load('A. B.');
    engine.play();
    engine.pause();
    expect(engine.getState()).toBe('paused');
    expect(synth.pauseCount).toBe(1);
    engine.resume();
    expect(engine.getState()).toBe('playing');
    expect(synth.resumeCount).toBe(1);
  });

  it('selects a matching Web voice by URI', () => {
    const synth = new FakeSynth([{ voiceURI: 'alpha' }, { voiceURI: 'beta' }]);
    const engine = new ReaderTtsEngine({ ...DEFAULT_READER_TTS_PREFS, webVoiceURI: 'beta' }, {}, deps(synth));
    engine.load('Hello.');
    engine.play();
    expect(synth.current?.voice).toEqual({ voiceURI: 'beta' });
    expect(synth.current?.rate).toBe(DEFAULT_READER_TTS_PREFS.rate);
  });

  it('emits onError and returns to idle when the synth fails', async () => {
    const synth = new FakeSynth();
    const errors: string[] = [];
    const engine = new ReaderTtsEngine(
      DEFAULT_READER_TTS_PREFS,
      { onError: (e) => errors.push(e.message) },
      deps(synth),
    );
    engine.load('A. B.');
    const done = engine.play();
    const pending = synth.current;
    pending?.onerror?.({ error: 'boom' });
    await done;
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('boom');
    expect(engine.getState()).toBe('idle');
  });

  it('dispose() stops playback and silences further callbacks', async () => {
    const synth = new FakeSynth();
    const states: ReaderTtsState[] = [];
    const engine = new ReaderTtsEngine(DEFAULT_READER_TTS_PREFS, { onState: (s) => states.push(s) }, deps(synth));
    engine.load('A. B.');
    engine.play();
    const pending = synth.current;
    engine.dispose();
    expect(synth.cancelCount).toBeGreaterThanOrEqual(1);
    const before = states.length;
    pending?.onend?.();
    await tick();
    expect(states.length).toBe(before);
  });
});

// --- ReaderTtsEngine (AI tier) --------------------------------------------

type FakeAudio = {
  src: string;
  paused: boolean;
  playCount: number;
  play: () => Promise<void>;
  pause: () => void;
  onended: (() => void) | null;
  onerror: ((event?: unknown) => void) | null;
};

function aiHarness(opts: { ok?: boolean; status?: number } = {}) {
  const ok = opts.ok ?? true;
  const status = opts.status ?? 200;
  const fetchCalls: Array<{ url: string; init: any }> = [];
  const created: string[] = [];
  const revoked: string[] = [];
  const audios: FakeAudio[] = [];
  let urlSeq = 0;

  const deps = {
    fetch: (url: string, init?: any) => {
      fetchCalls.push({ url, init });
      return Promise.resolve({
        ok,
        status,
        blob: async () => ({ size: 3, type: 'audio/ogg' }),
        text: async () => '',
      });
    },
    createObjectURL: (_blob: any) => {
      const value = `blob:fake/${urlSeq++}`;
      created.push(value);
      return value;
    },
    revokeObjectURL: (value: string) => {
      revoked.push(value);
    },
    createAudio: (src: string) => {
      const audio: FakeAudio = {
        src,
        paused: true,
        playCount: 0,
        play: () => {
          audio.playCount += 1;
          audio.paused = false;
          return Promise.resolve();
        },
        pause: () => {
          audio.paused = true;
        },
        onended: null,
        onerror: null,
      };
      audios.push(audio);
      return audio;
    },
  };

  return { deps, fetchCalls, created, revoked, audios };
}

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const aiPrefs = (overrides: Record<string, unknown> = {}) => ({
  ...DEFAULT_READER_TTS_PREFS,
  engine: 'ai' as const,
  aiEndpoint: 'http://localhost:8880/v1',
  ...overrides,
});

describe('ReaderTtsEngine (AI tier)', () => {
  it('POSTs the OpenAI-compatible request and plays each sentence blob', async () => {
    const h = aiHarness();
    const engine = new ReaderTtsEngine(
      aiPrefs({
        aiEndpoint: 'http://localhost:8880/v1/',
        aiApiKey: 'secret',
        aiModel: 'kokoro',
        aiVoice: 'af_sky',
        aiFormat: 'opus',
        rate: 1.25,
      }),
      {},
      h.deps as any,
    );
    engine.load('Hello. World.');
    const done = engine.play();
    await tick();

    expect(h.fetchCalls).toHaveLength(1);
    expect(h.fetchCalls[0].url).toBe('http://localhost:8880/v1/audio/speech');
    const init = h.fetchCalls[0].init;
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.headers.Authorization).toBe('Bearer secret');
    const payload = JSON.parse(init.body);
    expect(payload).toMatchObject({
      model: 'kokoro',
      voice: 'af_sky',
      input: 'Hello.',
      response_format: 'opus',
      speed: 1.25,
    });
    expect(h.audios).toHaveLength(1);

    // finish first sentence -> URL revoked, advances to second
    h.audios[0].onended?.();
    await tick();
    expect(h.revoked).toContain(h.created[0]);
    expect(h.fetchCalls).toHaveLength(2);
    expect(JSON.parse(h.fetchCalls[1].init.body).input).toBe('World.');

    h.audios[1].onended?.();
    await done;
    expect(engine.getState()).toBe('idle');
    expect([...h.revoked].sort()).toEqual([...h.created].sort());
  });

  it('defaults response_format to opus when unset', async () => {
    const h = aiHarness();
    const engine = new ReaderTtsEngine(aiPrefs({ aiFormat: '' as any, aiApiKey: '' }), {}, h.deps as any);
    engine.load('Hi.');
    engine.play();
    await tick();
    const payload = JSON.parse(h.fetchCalls[0].init.body);
    expect(payload.response_format).toBe('opus');
    // no API key -> no Authorization header
    expect(h.fetchCalls[0].init.headers.Authorization).toBeUndefined();
  });

  it('stop() aborts the in-flight request and tears down audio', async () => {
    const h = aiHarness();
    const engine = new ReaderTtsEngine(aiPrefs(), {}, h.deps as any);
    engine.load('Hello. World.');
    engine.play();
    await tick();
    expect(h.audios).toHaveLength(1);
    const signal = h.fetchCalls[0].init.signal;
    expect(signal.aborted).toBe(false);

    engine.stop();
    expect(signal.aborted).toBe(true);
    expect(engine.getState()).toBe('idle');
    expect(h.audios[0].paused).toBe(true);
    expect(h.revoked).toContain(h.created[0]);

    // a late onended from the torn-down audio must not advance
    h.audios[0].onended?.();
    await tick();
    expect(h.fetchCalls).toHaveLength(1);
  });

  it('pause()/resume() suspend and resume the AI audio element', async () => {
    const h = aiHarness();
    const engine = new ReaderTtsEngine(aiPrefs(), {}, h.deps as any);
    engine.load('Hello. World.');
    engine.play();
    await tick();
    expect(h.audios).toHaveLength(1);
    expect(h.audios[0].paused).toBe(false);

    engine.pause();
    expect(engine.getState()).toBe('paused');
    expect(h.audios[0].paused).toBe(true);

    engine.resume();
    expect(engine.getState()).toBe('playing');
    expect(h.audios[0].paused).toBe(false);
    expect(h.audios[0].playCount).toBe(2);
  });

  it('pause() during AI loading prevents late auto-play until resume()', async () => {
    const fetchGate = deferred<any>();
    const h = aiHarness();
    const engine = new ReaderTtsEngine(aiPrefs(), {}, {
      ...h.deps,
      fetch: (_url: string, init?: any) => {
        h.fetchCalls.push({ url: 'http://localhost:8880/v1/audio/speech', init });
        return fetchGate.promise;
      },
    } as any);
    engine.load('Hello.');
    const done = engine.play();
    expect(engine.getState()).toBe('loading');

    engine.pause();
    expect(engine.getState()).toBe('paused');

    fetchGate.resolve({
      ok: true,
      status: 200,
      blob: async () => ({ size: 3, type: 'audio/ogg' }),
      text: async () => '',
    });
    await tick();
    await tick();

    expect(h.audios).toHaveLength(1);
    expect(h.audios[0].playCount).toBe(0);
    expect(h.audios[0].paused).toBe(true);
    expect(engine.getState()).toBe('paused');

    engine.resume();
    expect(engine.getState()).toBe('playing');
    expect(h.audios[0].playCount).toBe(1);
    expect(h.audios[0].paused).toBe(false);

    h.audios[0].onended?.();
    await done;
    expect(engine.getState()).toBe('idle');
  });

  it('stop() settles an in-flight AI audio promise without advancing', async () => {
    const h = aiHarness();
    const engine = new ReaderTtsEngine(aiPrefs(), {}, h.deps as any);
    engine.load('Hello. World.');
    const done = engine.play();
    await tick();
    expect(h.audios).toHaveLength(1);

    engine.stop();
    await done;

    expect(engine.getState()).toBe('idle');
    expect(h.fetchCalls).toHaveLength(1);
    expect(h.revoked).toContain(h.created[0]);
  });

  it('play(fromIndex) aborts the in-flight AI audio and restarts from the requested sentence', async () => {
    const h = aiHarness();
    const engine = new ReaderTtsEngine(aiPrefs(), {}, h.deps as any);
    engine.load('Hello. World.');
    engine.play();
    await tick();

    expect(h.fetchCalls).toHaveLength(1);
    expect(h.audios).toHaveLength(1);
    const firstAudio = h.audios[0];

    const restart = engine.play(1);
    await tick();

    expect(h.fetchCalls).toHaveLength(2);
    expect(JSON.parse(h.fetchCalls[1].init.body).input).toBe('World.');
    expect(firstAudio.paused).toBe(true);
    expect(h.revoked).toContain(h.created[0]);

    firstAudio.onended?.();
    await tick();
    expect(h.fetchCalls).toHaveLength(2);

    h.audios[1].onended?.();
    await restart;
    expect(engine.getState()).toBe('idle');
    expect(engine.getActiveIndex()).toBe(-1);
    expect(engine.getHasCursor()).toBe(false);
  });

  it('reports an error and stays idle when no endpoint is configured', async () => {
    const h = aiHarness();
    const errors: string[] = [];
    const engine = new ReaderTtsEngine(
      aiPrefs({ aiEndpoint: '' }),
      { onError: (e) => errors.push(e.message) },
      h.deps as any,
    );
    engine.load('Hello.');
    await engine.play();
    expect(h.fetchCalls).toHaveLength(0);
    expect(errors).toHaveLength(1);
    expect(engine.getState()).toBe('idle');
  });

  it('treats a non-ok response as an error and creates no audio', async () => {
    const h = aiHarness({ ok: false, status: 500 });
    const errors: string[] = [];
    const engine = new ReaderTtsEngine(
      aiPrefs({ aiEndpoint: 'http://x/v1' }),
      { onError: (e) => errors.push(e.message) },
      h.deps as any,
    );
    engine.load('Hello.');
    await engine.play();
    expect(errors[0]).toContain('500');
    expect(h.created).toHaveLength(0);
    expect(h.audios).toHaveLength(0);
    expect(engine.getState()).toBe('idle');
  });
});
