import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createElement } from 'react';
import ReactDOM from 'react-dom/client';
import { JSDOM } from 'jsdom';

import { DEFAULT_READER_PREFS } from '../../src/services/protocols/reader-prefs';
import type { ReaderOutlineDomEntry } from '../../src/ui/reader/article-outline-dom';

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
  buttonTintClassName: () => 'btn-tint',
  buttonFilledClassName: () => 'btn-filled',
}));

vi.mock('../../src/ui/i18n', () => ({
  t: (key: string) => key,
}));

vi.mock('../../src/ui/shared/hooks/useIsNarrowScreen', () => ({
  useIsNarrowScreen: vi.fn(),
}));

vi.mock('../../src/ui/reader/TextLayoutPanel', () => ({
  TextLayoutPanel: ({ className }: { className?: string }) =>
    createElement('div', { 'data-testid': 'text-layout-panel', className }, 'text-layout-panel'),
}));

vi.mock('../../src/ui/reader/NarrationPanel', () => ({
  NarrationPanel: ({ className }: { className?: string }) =>
    createElement('div', { 'data-testid': 'narration-panel', className }, 'narration-panel'),
}));

import { ReaderToolbar } from '../../src/ui/reader/ReaderToolbar';
import { useIsNarrowScreen } from '../../src/ui/shared/hooks/useIsNarrowScreen';

function setupDom(width = 1024) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });

  Object.defineProperty(dom.window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Element', { configurable: true, value: dom.window.Element });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
  Object.defineProperty(globalThis, 'MouseEvent', { configurable: true, value: dom.window.MouseEvent });
  Object.defineProperty(globalThis, 'KeyboardEvent', { configurable: true, value: dom.window.KeyboardEvent });
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
  delete (globalThis as any).Element;
  delete (globalThis as any).Node;
  delete (globalThis as any).MouseEvent;
  delete (globalThis as any).KeyboardEvent;
  delete (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
}

describe('ReaderToolbar', () => {
  let root: ReactDOM.Root | null = null;
  const update = vi.fn();
  const narration = {
    state: 'idle' as 'idle' | 'loading' | 'playing' | 'paused',
    isPlaying: false,
    error: null as string | null,
    webSpeechAvailable: true,
    pause: vi.fn(),
    stop: vi.fn(),
    toggle: vi.fn(),
  };

  beforeEach(() => {
    setupDom();
    root = ReactDOM.createRoot(document.getElementById('root')!);
    vi.mocked(useIsNarrowScreen).mockReturnValue(false);
    update.mockReset();
    narration.pause.mockReset();
    narration.stop.mockReset();
    narration.toggle.mockReset();
    Object.assign(narration, {
      state: 'idle',
      isPlaying: false,
      error: null,
      webSpeechAvailable: true,
    });
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = null;
    cleanupDom();
  });

  function renderToolbar(overrides: Partial<Parameters<typeof ReaderToolbar>[0]> = {}) {
    act(() => {
      root!.render(
        createElement(ReaderToolbar, {
          features: { textLayout: true, theme: true, narration: true },
          prefs: DEFAULT_READER_PREFS,
          update,
          narration,
          ...overrides,
        }),
      );
    });
  }

  function getTrigger(panel: 'text' | 'theme' | 'narration'): HTMLButtonElement {
    const trigger = document.querySelector(`[data-reader-rail-trigger="${panel}"]`) as HTMLButtonElement | null;
    if (!trigger) throw new Error(`missing trigger: ${panel}`);
    return trigger;
  }

  function getWrap(panel: 'text' | 'theme' | 'narration' | 'outline'): HTMLElement {
    const wrap = document.querySelector(`[data-reader-rail-wrap="${panel}"]`) as HTMLElement | null;
    if (!wrap) throw new Error(`missing wrap: ${panel}`);
    return wrap;
  }

  function getPanel(panel: 'text' | 'theme' | 'narration' | 'outline'): HTMLElement | null {
    return document.querySelector(`[data-reader-rail-panel="${panel}"]`) as HTMLElement | null;
  }

  async function hoverOpen(panel: 'text' | 'theme' | 'narration' | 'outline') {
    await act(async () => {
      getWrap(panel).dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
      await Promise.resolve();
    });
  }

  async function hoverLeave(panel: 'text' | 'theme' | 'narration' | 'outline') {
    await act(async () => {
      getWrap(panel).dispatchEvent(
        new MouseEvent('mouseout', { bubbles: true, cancelable: true, relatedTarget: document.body }),
      );
      await Promise.resolve();
    });
  }

  it('renders a vertical rail with icon triggers, opens one panel at a time, and drops ThemePanel titles', async () => {
    renderToolbar();

    const toolbar = document.querySelector('[role="toolbar"]') as HTMLElement | null;
    expect(toolbar).toBeTruthy();
    expect(toolbar?.getAttribute('aria-orientation')).toBe('vertical');

    const textTrigger = getTrigger('text');
    const themeTrigger = getTrigger('theme');
    const narrationTrigger = getTrigger('narration');
    expect(textTrigger.textContent).toBe('Aa');
    expect(themeTrigger.textContent).toBe('');
    expect(narrationTrigger.textContent).toBe('');
    expect(textTrigger.querySelector('svg')).toBeNull();
    expect(themeTrigger.querySelector('svg')).toBeTruthy();
    expect(narrationTrigger.querySelector('svg')).toBeTruthy();

    await hoverOpen('theme');
    const themePanel = getPanel('theme');
    expect(themePanel).toBeTruthy();
    expect(themePanel?.querySelector('h3')).toBeNull();
    expect(themePanel?.className).not.toContain('webclipper-menu-popover-panel');
    expect(document.querySelector('.webclipper-menu-popover-panel')).toBeNull();

    await hoverOpen('narration');
    expect(getPanel('theme')).toBeNull();
    expect(getPanel('narration')).toBeTruthy();
    expect(document.querySelectorAll('[data-reader-rail-panel]').length).toBe(1);
  });

  it('closes the open panel on hover leave after the delay and on Escape', async () => {
    renderToolbar();

    await hoverOpen('text');
    expect(getPanel('text')).toBeTruthy();

    await hoverLeave('text');
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 180));
    });
    expect(getPanel('text')).toBeNull();

    await hoverOpen('theme');
    expect(getPanel('theme')).toBeTruthy();

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await Promise.resolve();
    });
    expect(getPanel('theme')).toBeNull();
  });

  it('uses narrow panel geometry when the viewport is narrower than 720px', async () => {
    vi.mocked(useIsNarrowScreen).mockReturnValue(true);
    renderToolbar();

    await hoverOpen('narration');
    const panel = getPanel('narration');
    expect(panel).toBeTruthy();
    expect(panel?.style.right).toBe('0px');
    expect(panel?.style.top).toBe('calc(100% + 10px)');
    expect(panel?.style.width).toBe('300px');
    expect(panel?.style.maxWidth).toBe('calc(100vw - 28px)');
    expect(panel?.style.maxHeight).toBe('70vh');
    expect(panel?.style.overflow).toBe('auto');
  });

  it('keeps the outline panel open on strip clicks and closes it after list-item clicks', async () => {
    const outlineEntryElement = document.createElement('h2');
    Object.defineProperty(outlineEntryElement, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
    const outlineEntry = {
      index: 0,
      level: 2,
      id: 'outline-1',
      title: 'Outline heading',
      element: outlineEntryElement,
      rect: { top: 24, bottom: 60 },
    } satisfies ReaderOutlineDomEntry;
    const onPickStripEntry = vi.fn((entry: ReaderOutlineDomEntry) => {
      entry.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    const onPickPanelEntry = vi.fn((entry: ReaderOutlineDomEntry) => {
      entry.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    renderToolbar({
      outline: {
        entries: [outlineEntry],
        activeIndex: 0,
        onPickStripEntry,
        onPickPanelEntry,
      },
    });

    await hoverOpen('outline');
    expect(getPanel('outline')).toBeTruthy();

    const stripButton = document.querySelector(
      '[data-reader-rail-wrap="outline"] > nav button[data-reader-outline-level="lvl-2"]',
    ) as HTMLButtonElement | null;
    expect(stripButton).toBeTruthy();

    act(() => {
      stripButton!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    expect(onPickStripEntry).toHaveBeenCalledTimes(1);
    expect(onPickPanelEntry).toHaveBeenCalledTimes(0);
    expect(getPanel('outline')).toBeTruthy();

    const panelButton = document.querySelector(
      '[data-reader-rail-panel="outline"] button[data-reader-outline-level="lvl-2"]',
    ) as HTMLButtonElement | null;
    expect(panelButton).toBeTruthy();

    act(() => {
      panelButton!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    expect(onPickStripEntry).toHaveBeenCalledTimes(1);
    expect(onPickPanelEntry).toHaveBeenCalledTimes(1);
    expect(getPanel('outline')).toBeNull();
    expect(outlineEntryElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('returns null when all reader features are disabled', () => {
    renderToolbar({
      features: { textLayout: false, theme: false, narration: false },
    });

    expect(document.querySelector('[role="toolbar"]')).toBeNull();
    expect(document.getElementById('root')?.innerHTML).toBe('');
  });
});
