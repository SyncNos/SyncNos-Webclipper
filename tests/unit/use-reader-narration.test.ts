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

  it('publishes only privacy-safe narration snapshot fields', async () => {
    act(() => {
      root!.render(createElement(Harness));
    });

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      snapshot?.play();
      await Promise.resolve();
    });

    const debug = (globalThis as any).__syncnosReaderNarration as Record<string, unknown>;
    expect(debug).toBeTruthy();
    expect(Object.keys(debug).sort()).toEqual(
      ['activeIndex', 'errorCount', 'isPlaying', 'lastError', 'state', 'stateChanges', 'updatedAt'].sort(),
    );
    expect(debug.state).toBe('playing');
    expect(debug.isPlaying).toBe(true);
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
  });
});
