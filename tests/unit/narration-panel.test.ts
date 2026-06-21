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
    options: Array<{ value: string; label: string; disabled?: boolean }>;
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
            'data-option-disabled': String(option.disabled ?? false),
          },
          option.label,
        ),
      ),
    ),
}));

vi.mock('../../src/ui/shared/button-styles', () => ({
  buttonTintClassName: () => 'btn',
  buttonFilledClassName: () => 'btn-filled',
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

  it('renders fixed narration rate buttons and writes selected tts.rate', async () => {
    const update = vi.fn();

    act(() => {
      root!.render(
        createElement(NarrationPanel, {
          prefs: {
            ...DEFAULT_READER_PREFS,
            tts: { ...DEFAULT_READER_PREFS.tts, engine: 'web', rate: 1.25 },
          },
          update,
        }),
      );
    });

    expect(document.querySelector('input[type="range"]')).toBeNull();

    const rateButtons = Array.from(document.querySelectorAll('button')).map((button) => button.textContent);
    expect(rateButtons).toEqual(['0.8x', '1x', '1.25x', '1.5x', '2x']);
    expect(document.querySelector('[aria-pressed="true"]')?.textContent).toBe('1.25x');

    (Array.from(document.querySelectorAll('button')).find((button) => button.textContent === '0.8x') as
      | HTMLButtonElement
      | undefined)?.click();

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        tts: expect.objectContaining({
          rate: 0.8,
        }),
      }),
    );
  });

  it('disables the Web voice option when Web Speech is unavailable and keeps AI fields available', async () => {
    const update = vi.fn();

    act(() => {
      root!.render(
        createElement(NarrationPanel, {
          prefs: {
            ...DEFAULT_READER_PREFS,
            tts: { ...DEFAULT_READER_PREFS.tts, engine: 'ai' },
          },
          update,
          webSpeechAvailable: false,
        }),
      );
    });

    const engineMenu = document.querySelector('[data-select-aria="readerNarrationEngineAria"]');
    expect(engineMenu?.querySelector('[data-option-value="web"]')?.getAttribute('data-option-disabled')).toBe('true');
    expect(document.querySelector('[aria-label="readerNarrationEndpointAria"]')).toBeTruthy();
    expect(document.querySelector('[aria-label="readerNarrationApiKeyAria"]')).toBeTruthy();
    expect(document.querySelector('[aria-label="readerNarrationModelAria"]')).toBeTruthy();
    expect(document.querySelector('[aria-label="readerNarrationAiVoiceAria"]')).toBeTruthy();
    expect(document.querySelector('[data-select-aria="readerNarrationFormatAria"]')).toBeTruthy();
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
