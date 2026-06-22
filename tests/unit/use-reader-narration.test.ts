import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, createElement } from 'react';
import ReactDOM from 'react-dom/client';
import { JSDOM } from 'jsdom';

import { DEFAULT_READER_TTS_PREFS } from '../../src/services/protocols/reader-prefs';
import type {
  SpeechSynthesisLike,
  SpeechSynthesisUtteranceLike,
} from '../../src/services/reader/tts/reader-tts-engine';
import { useReaderNarration } from '../../src/viewmodels/reader/useReaderNarration';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });

  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: dom.window.localStorage });
  Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
    configurable: true,
    value: true,
  });
}

function cleanupDom() {
  delete (globalThis as any).window;
  delete (globalThis as any).document;
  delete (globalThis as any).navigator;
  delete (globalThis as any).HTMLElement;
  delete (globalThis as any).Node;
  delete (globalThis as any).localStorage;
  delete (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
  delete (globalThis as any).__syncnosReaderNarration;
}

type FakeSynth = SpeechSynthesisLike & {
  current: SpeechSynthesisUtteranceLike | null;
};

function createFakeSynth(): FakeSynth {
  return {
    current: null,
    speak(utterance) {
      this.current = utterance;
    },
    cancel() {
      this.current = null;
    },
    pause() {},
    resume() {},
    getVoices() {
      return [];
    },
  };
}

describe('useReaderNarration', () => {
  let root: ReactDOM.Root | null = null;
  let snapshot: ReturnType<typeof useReaderNarration> | null = null;
  let source = 'Secret article sentence.';
  const synth = createFakeSynth();

  function Harness() {
    snapshot = useReaderNarration(source, DEFAULT_READER_TTS_PREFS, {
      getSynth: () => synth,
      createUtterance: (text) => ({
        text,
        rate: 1,
        onend: null,
        onerror: null,
      }),
    });
    return createElement('div', null, 'reader-narration');
  }

  async function renderHarness() {
    await act(async () => {
      root!.render(createElement(Harness));
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  async function settleUtterance() {
    await act(async () => {
      synth.current?.onend?.();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  async function failUtterance(error = 'boom') {
    await act(async () => {
      synth.current?.onerror?.({ error });
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  function debugSnapshot(): Record<string, unknown> {
    return (globalThis as any).__syncnosReaderNarration as Record<string, unknown>;
  }

  beforeEach(() => {
    setupDom();
    source = 'Secret article sentence.';
    synth.current = null;
    snapshot = null;
    root = ReactDOM.createRoot(document.getElementById('root')!);
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = null;
    cleanupDom();
  });

  it('publishes only privacy-safe narration snapshot fields and exposes cursor state', async () => {
    await renderHarness();

    await act(async () => {
      snapshot?.play();
      await Promise.resolve();
      await Promise.resolve();
    });

    const debug = debugSnapshot();
    expect(debug).toBeTruthy();
    expect(Object.keys(debug).sort()).toEqual(
      ['activeIndex', 'errorCount', 'hasCursor', 'isPlaying', 'lastError', 'state', 'stateChanges', 'updatedAt'].sort(),
    );
    expect(debug.state).toBe('playing');
    expect(debug.isPlaying).toBe(true);
    expect(debug.hasCursor).toBe(true);
    expect(debug.activeIndex).toBe(0);
    expect(typeof debug.updatedAt).toBe('number');
    expect(debug.errorCount).toBe(0);
    expect(debug.lastError).toBeNull();
    expect(debug).not.toHaveProperty('text');
    expect(debug).not.toHaveProperty('source');
    expect(debug).not.toHaveProperty('prefs');
    expect(debug).not.toHaveProperty('aiApiKey');
    expect(debug).not.toHaveProperty('aiEndpoint');
    expect(String(JSON.stringify(debug))).not.toContain(source);
    expect(snapshot?.hasCursor).toBe(true);
    expect(snapshot?.activeSentence?.text).toBe('Secret article sentence.');
  });

  it('seek() only positions the cursor while idle and source reload clears stale selection', async () => {
    source = 'A. B. C.';
    await renderHarness();

    await act(async () => {
      snapshot?.seek(1);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(snapshot?.state).toBe('idle');
    expect(snapshot?.activeIndex).toBe(1);
    expect(snapshot?.activeSentence?.text).toBe('B.');
    expect(snapshot?.hasCursor).toBe(true);
    expect(snapshot?.error).toBeNull();
    expect(synth.current).toBeNull();

    await act(async () => {
      source = 'D. E.';
      root!.render(createElement(Harness));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(snapshot?.state).toBe('idle');
    expect(snapshot?.activeIndex).toBe(-1);
    expect(snapshot?.activeSentence).toBeNull();
    expect(snapshot?.hasCursor).toBe(false);
    expect(snapshot?.error).toBeNull();
    expect(debugSnapshot().lastError).toBeNull();
  });

  it('play(fromIndex) starts from the requested sentence and exhausts the cursor', async () => {
    source = 'A. B. C.';
    await renderHarness();

    await act(async () => {
      snapshot?.play(1);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(synth.current?.text).toBe('B.');
    expect(snapshot?.state).toBe('playing');
    expect(snapshot?.activeIndex).toBe(1);
    expect(snapshot?.activeSentence?.text).toBe('B.');
    expect(snapshot?.hasCursor).toBe(true);

    await settleUtterance();
    expect(synth.current?.text).toBe('C.');
    expect(snapshot?.activeIndex).toBe(2);
    expect(snapshot?.activeSentence?.text).toBe('C.');
    expect(snapshot?.hasCursor).toBe(true);

    await settleUtterance();
    expect(snapshot?.state).toBe('idle');
    expect(snapshot?.activeIndex).toBe(-1);
    expect(snapshot?.activeSentence).toBeNull();
    expect(snapshot?.hasCursor).toBe(false);
  });

  it('toggle(firstVisibleIndex) starts from the first visible sentence and reuses an existing cursor', async () => {
    source = 'A. B. C.';
    await renderHarness();

    await act(async () => {
      snapshot?.toggle(1);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(synth.current?.text).toBe('B.');
    expect(snapshot?.state).toBe('playing');
    expect(snapshot?.activeIndex).toBe(1);
    expect(snapshot?.hasCursor).toBe(true);

    await act(async () => {
      snapshot?.stop();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(snapshot?.state).toBe('idle');
    expect(snapshot?.activeIndex).toBe(-1);
    expect(snapshot?.hasCursor).toBe(false);
    expect(synth.current).toBeNull();

    await act(async () => {
      snapshot?.seek(2);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(snapshot?.state).toBe('idle');
    expect(snapshot?.activeIndex).toBe(2);
    expect(snapshot?.hasCursor).toBe(true);

    await act(async () => {
      snapshot?.toggle();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(synth.current?.text).toBe('C.');
    expect(snapshot?.state).toBe('playing');
    expect(snapshot?.activeIndex).toBe(2);
    expect(snapshot?.hasCursor).toBe(true);
  });

  it('source changes clear an existing error and cursor state', async () => {
    source = 'A. B.';
    await renderHarness();

    await act(async () => {
      snapshot?.play();
      await Promise.resolve();
      await Promise.resolve();
    });

    await failUtterance('boom');
    expect(snapshot?.state).toBe('idle');
    expect(snapshot?.error).toContain('boom');
    expect(snapshot?.activeIndex).toBe(-1);
    expect(snapshot?.hasCursor).toBe(false);
    expect(debugSnapshot().lastError).toContain('boom');

    await act(async () => {
      source = 'New one. New two.';
      root!.render(createElement(Harness));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(snapshot?.state).toBe('idle');
    expect(snapshot?.error).toBeNull();
    expect(snapshot?.activeIndex).toBe(-1);
    expect(snapshot?.activeSentence).toBeNull();
    expect(snapshot?.hasCursor).toBe(false);
    expect(debugSnapshot().lastError).toBeNull();
  });

  it('stop() clears an error state and its debug snapshot after a playback failure', async () => {
    source = 'A. B.';
    await renderHarness();

    await act(async () => {
      snapshot?.play();
      await Promise.resolve();
      await Promise.resolve();
    });

    await failUtterance('boom');
    expect(snapshot?.state).toBe('idle');
    expect(snapshot?.error).toContain('boom');
    expect(snapshot?.activeIndex).toBe(-1);
    expect(snapshot?.hasCursor).toBe(false);
    expect(debugSnapshot().lastError).toContain('boom');

    await act(async () => {
      snapshot?.stop();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(snapshot?.error).toBeNull();
    expect(snapshot?.activeIndex).toBe(-1);
    expect(snapshot?.activeSentence).toBeNull();
    expect(snapshot?.hasCursor).toBe(false);
    expect(debugSnapshot().lastError).toBeNull();
  });
});
