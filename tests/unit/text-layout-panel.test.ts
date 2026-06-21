import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createElement } from 'react';
import ReactDOM from 'react-dom/client';
import { JSDOM } from 'jsdom';

import {
  DEFAULT_READER_PREFS,
  DEFAULT_READER_TYPOGRAPHY_PRESET,
  READER_PREFS_LIMITS,
} from '../../src/services/protocols/reader-prefs';

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

vi.mock('../../src/ui/i18n', () => ({
  t: (key: string) => key,
}));

import { TextLayoutPanel } from '../../src/ui/reader/TextLayoutPanel';

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
}

describe('TextLayoutPanel', () => {
  let root: ReactDOM.Root | null = null;

  beforeEach(() => {
    setupDom();
    root = ReactDOM.createRoot(document.getElementById('root')!);
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = null;
    cleanupDom();
  });

  it('renders only reset and field controls', () => {
    const update = vi.fn();
    const prefs = {
      ...DEFAULT_READER_PREFS,
      fontFamily: 'mono' as const,
      fontSize: 24,
      lineHeight: 1.5,
      contentWidth: 1500,
      letterSpacing: 0.02,
      textAlign: 'justify' as const,
    };

    act(() => {
      root!.render(createElement(TextLayoutPanel, { prefs, update }));
    });

    const buttons = Array.from(document.querySelectorAll('button'));
    expect(buttons).toHaveLength(1);
    expect(buttons[0]?.textContent).toBe('reset');
    expect(document.body.textContent).not.toContain('readerPresetNotion');
    expect(document.body.textContent).not.toContain('readerPresetBook');

    const widthInput = document.querySelector('[aria-label="readerContentWidthAria"]') as HTMLInputElement | null;
    expect(widthInput?.max).toBe(String(READER_PREFS_LIMITS.contentWidth.max));
    expect(widthInput?.value).toBe('1500');

    const fontSelect = document.querySelector('[data-select-aria="readerFontAria"]');
    expect(fontSelect?.getAttribute('data-value')).toBe('mono');

    const alignSelect = document.querySelector('[data-select-aria="readerAlignAria"]');
    expect(alignSelect?.getAttribute('data-value')).toBe('justify');
  });

  it('resets typography to the canonical medium/default preset', () => {
    const update = vi.fn();

    act(() => {
      root!.render(
        createElement(TextLayoutPanel, {
          prefs: DEFAULT_READER_PREFS,
          update,
        }),
      );
    });

    const resetButton = document.querySelector('button');
    expect(resetButton?.textContent).toBe('reset');

    act(() => {
      resetButton?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    });

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(DEFAULT_READER_TYPOGRAPHY_PRESET);
  });
});
