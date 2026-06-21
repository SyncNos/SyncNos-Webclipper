import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createElement } from 'react';
import ReactDOM from 'react-dom/client';
import { JSDOM } from 'jsdom';

import { DEFAULT_READER_PREFS } from '../../src/services/protocols/reader-prefs';

vi.mock('../../src/ui/shared/SelectMenu', () => ({
  SelectMenu: ({
    ariaLabel,
    value,
    options,
  }: {
    ariaLabel: string;
    value: string;
    options: Array<{ value: string; label: string }>;
  }) =>
    createElement(
      'div',
      {
        'data-select-aria': ariaLabel,
        'data-value': value,
      },
      options.map((option) =>
        createElement(
          'div',
          {
            key: option.value,
            'data-option-value': option.value,
          },
          option.label,
        ),
      ),
    ),
}));

vi.mock('../../src/ui/shared/button-styles', () => ({
  buttonTintClassName: () => 'btn',
}));

vi.mock('../../src/ui/settings/ui', () => ({
  textInputClassName: 'input',
}));

vi.mock('../../src/ui/i18n', () => ({
  t: (key: string) => key,
}));

import { NarrationPanel } from '../../src/ui/reader/NarrationPanel';

type FakeSpeechSynthesis = {
  voices: Array<{ voiceURI: string; name: string }>;
  listeners: Set<() => void>;
  getVoices: () => Array<{ voiceURI: string; name: string }>;
  addEventListener: (type: 'voiceschanged', listener: () => void) => void;
  removeEventListener: (type: 'voiceschanged', listener: () => void) => void;
  dispatchVoicesChanged: () => void;
};

function createFakeSpeechSynthesis(): FakeSpeechSynthesis {
  const listeners = new Set<() => void>();
  return {
    voices: [],
    listeners,
    getVoices() {
      return this.voices.slice();
    },
    addEventListener(type, listener) {
      if (type === 'voiceschanged') listeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === 'voiceschanged') listeners.delete(listener);
    },
    dispatchVoicesChanged() {
      for (const listener of listeners) listener();
    },
  };
}

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
  delete (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
  delete (globalThis as any).speechSynthesis;
}

describe('NarrationPanel', () => {
  let root: ReactDOM.Root | null = null;
  let speechSynthesisMock: FakeSpeechSynthesis;

  beforeEach(() => {
    setupDom();
    speechSynthesisMock = createFakeSpeechSynthesis();
    Object.defineProperty(globalThis, 'speechSynthesis', {
      configurable: true,
      value: speechSynthesisMock,
    });
    root = ReactDOM.createRoot(document.getElementById('root')!);
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = null;
    cleanupDom();
  });

  it('refreshes the Web voice list after voiceschanged fires', async () => {
    const update = vi.fn();

    act(() => {
      root!.render(
        createElement(NarrationPanel, {
          prefs: {
            ...DEFAULT_READER_PREFS,
            tts: { ...DEFAULT_READER_PREFS.tts, engine: 'web' },
          },
          update,
        }),
      );
    });

    const voiceMenu = document.querySelector('[data-select-aria="readerNarrationVoiceAria"]');
    expect(voiceMenu?.querySelectorAll('[data-option-value]').length).toBe(1);

    speechSynthesisMock.voices = [{ voiceURI: 'voice-1', name: 'Voice One' }];
    await act(async () => {
      speechSynthesisMock.dispatchVoicesChanged();
      await Promise.resolve();
    });

    const options = Array.from(voiceMenu?.querySelectorAll('[data-option-value]') ?? []);
    expect(options).toHaveLength(2);
    expect(options[1]?.getAttribute('data-option-value')).toBe('voice-1');
    expect(options[1]?.textContent).toBe('Voice One');
  });
});
