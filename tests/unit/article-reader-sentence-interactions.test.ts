import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createElement } from 'react';
import ReactDOM from 'react-dom/client';
import { JSDOM } from 'jsdom';

import { DEFAULT_READER_PREFS } from '../../src/services/protocols/reader-prefs';
import type { ReaderTtsSentence } from '../../src/services/reader/tts/reader-tts-engine';
import * as readerSentenceDom from '../../src/ui/reader/reader-sentence-dom';

const mocks = vi.hoisted(() => {
  const play = vi.fn();
  const seek = vi.fn();
  const pause = vi.fn();
  const stop = vi.fn();
  const toggle = vi.fn();
  const update = vi.fn();
  const narration = {
    state: 'idle' as 'idle' | 'loading' | 'playing' | 'paused',
    activeIndex: -1,
    activeSentence: null as ReaderTtsSentence | null,
    hasCursor: false,
    error: null as string | null,
    webSpeechAvailable: true,
    isPlaying: false,
  };
  const sources: string[] = [];
  return { play, seek, pause, stop, toggle, update, narration, sources };
});

vi.mock('../../src/viewmodels/reader/useReaderPrefs', () => ({
  useReaderPrefs: () => ({
    prefs: DEFAULT_READER_PREFS,
    update: mocks.update,
  }),
}));

vi.mock('../../src/viewmodels/reader/useReaderNarration', () => ({
  useReaderNarration: (source: string) => {
    mocks.sources.push(source);
    return {
      ...mocks.narration,
      play: mocks.play,
      seek: mocks.seek,
      pause: mocks.pause,
      stop: mocks.stop,
      toggle: mocks.toggle,
    };
  },
}));

vi.mock('../../src/ui/reader/ReaderToolbar', () => ({
  ReaderToolbar: ({ features, narration }: any) => {
    if (!features.narration) return null;
    return createElement(
      'div',
      { 'data-testid': 'reader-toolbar' },
      createElement(
        'button',
        {
          type: 'button',
          'data-testid': 'toolbar-play',
          onClick: () => narration.play(),
        },
        'play',
      ),
      createElement(
        'button',
        {
          type: 'button',
          'data-testid': 'toolbar-toggle',
          onClick: () => narration.toggle(),
        },
        'toggle',
      ),
      createElement(
        'button',
        {
          type: 'button',
          'data-testid': 'toolbar-stop',
          onClick: () => narration.stop(),
        },
        'stop',
      ),
    );
  },
}));

import { ArticleReaderView } from '../../src/ui/conversations/views/ArticleReaderView';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });

  const raf = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0);
  const caf = (id: ReturnType<typeof setTimeout>) => clearTimeout(id);

  Object.defineProperty(dom.window, 'requestAnimationFrame', { configurable: true, value: raf });
  Object.defineProperty(dom.window, 'cancelAnimationFrame', { configurable: true, value: caf });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Element', { configurable: true, value: dom.window.Element });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
  Object.defineProperty(globalThis, 'Text', { configurable: true, value: dom.window.Text });
  Object.defineProperty(globalThis, 'MouseEvent', { configurable: true, value: dom.window.MouseEvent });
  Object.defineProperty(globalThis, 'MutationObserver', { configurable: true, value: dom.window.MutationObserver });
  Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: raf });
  Object.defineProperty(globalThis, 'cancelAnimationFrame', { configurable: true, value: caf });
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
  delete (globalThis as any).Text;
  delete (globalThis as any).MouseEvent;
  delete (globalThis as any).MutationObserver;
  delete (globalThis as any).requestAnimationFrame;
  delete (globalThis as any).cancelAnimationFrame;
  delete (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
}

function resetMocks() {
  mocks.play.mockReset();
  mocks.seek.mockReset();
  mocks.pause.mockReset();
  mocks.stop.mockReset();
  mocks.toggle.mockReset();
  mocks.update.mockReset();
  mocks.sources.length = 0;
  Object.assign(mocks.narration, {
    state: 'idle',
    activeIndex: -1,
    activeSentence: null,
    hasCursor: false,
    error: null,
    webSpeechAvailable: true,
    isPlaying: false,
  });
}

function normalizeText(value: string): string {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderArticle(
  root: ReactDOM.Root,
  markdown = 'Alpha sentence with [link](https://example.com). Beta sentence.',
) {
  const detail = {
    messages: [{ id: 1, role: 'assistant', contentMarkdown: markdown, conversationId: 42 }],
  };
  act(() => {
    root.render(
      createElement(ArticleReaderView, {
        selected: { id: 42 },
        activeId: 42,
        detail,
        listError: null,
        loadingDetail: false,
        detailError: null,
        setMessagesRootRef: () => {},
        readerFeatures: { textLayout: true, theme: true, narration: true },
      }),
    );
  });
}

function getSentenceRoot(): HTMLElement {
  const root = document.querySelector('[data-reader-sentence-root="true"]') as HTMLElement | null;
  if (!root) throw new Error('sentence root not found');
  return root;
}

function getSentenceSpans(): HTMLElement[] {
  return Array.from(getSentenceRoot().querySelectorAll<HTMLElement>('[data-reader-sentence-index]'));
}

function setRect(
  element: Element,
  rect: { top: number; bottom: number; left?: number; right?: number; width?: number; height?: number },
) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left ?? 0,
      right: rect.right ?? 0,
      width: rect.width ?? Math.max(0, (rect.right ?? 0) - (rect.left ?? 0)),
      height: rect.height ?? Math.max(0, rect.bottom - rect.top),
      x: rect.left ?? 0,
      y: rect.top,
      toJSON() {
        return this;
      },
    }),
  });
}

async function flushDom(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  });
}

async function waitForSentenceCount(expected: number): Promise<void> {
  await act(async () => {
    for (let index = 0; index < 12; index += 1) {
      if (getSentenceSpans().length === expected) return;
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
  });
}

describe('ArticleReaderView sentence interactions', () => {
  let root: ReactDOM.Root | null = null;

  beforeEach(() => {
    setupDom();
    resetMocks();
    root = ReactDOM.createRoot(document.getElementById('root')!);
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = null;
    cleanupDom();
  });

  it('decorates sentences as clickable spans and keeps spans stable across rerender', async () => {
    renderArticle(root!);
    await flushDom();

    const rootNode = getSentenceRoot();
    const spans = getSentenceSpans();
    expect(spans).toHaveLength(2);
    expect(spans.map((span) => span.getAttribute('data-reader-sentence-index'))).toEqual(['0', '1']);
    expect(normalizeText(mocks.sources[mocks.sources.length - 1])).toBe('Alpha sentence with link. Beta sentence.');

    const snapshot = rootNode.innerHTML;
    renderArticle(root!);
    await flushDom();
    expect(getSentenceRoot().innerHTML).toBe(snapshot);
    expect(getSentenceSpans()).toHaveLength(2);
  });

  it('collects sentence text segments once per decoration pass', async () => {
    const collectSpy = vi.spyOn(readerSentenceDom, 'collectReaderSentenceTextSegments');

    renderArticle(root!);
    await flushDom();

    expect(getSentenceSpans()).toHaveLength(2);
    expect(collectSpy).toHaveBeenCalledTimes(1);
  });

  it('clicking a sentence seeks while idle and plays while active, without blocking links', async () => {
    renderArticle(root!);
    await flushDom();

    const spans = getSentenceSpans();
    const firstSentence = spans[0];
    const firstLink = firstSentence.querySelector('a') as HTMLAnchorElement | null;
    expect(firstLink).toBeTruthy();

    firstSentence.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(mocks.seek).toHaveBeenCalledWith(0);
    expect(mocks.play).not.toHaveBeenCalled();

    firstLink!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(mocks.seek).toHaveBeenCalledTimes(1);
    expect(mocks.play).not.toHaveBeenCalled();

    Object.assign(mocks.narration, {
      state: 'playing',
      activeIndex: 0,
      activeSentence: { index: 0, text: 'Alpha sentence with link.', start: 0, end: 26 },
      hasCursor: true,
      isPlaying: true,
    });
    renderArticle(root!);
    await flushDom();

    expect(getSentenceSpans()[0].classList.contains('reader-active-sentence')).toBe(true);
    getSentenceSpans()[1].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(mocks.play).toHaveBeenCalledWith(1);
  });

  it('toolbar wrappers compute the first visible sentence and reuse the active cursor', async () => {
    renderArticle(root!);
    await flushDom();

    Object.assign(mocks.narration, {
      state: 'idle',
      activeIndex: -1,
      activeSentence: null,
      hasCursor: false,
      isPlaying: false,
    });
    renderArticle(root!);
    await flushDom();

    const spans = getSentenceSpans();
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 });
    setRect(spans[0], { top: 120, bottom: 160 });
    setRect(spans[1], { top: 20, bottom: 60 });

    (document.querySelector('[data-testid="toolbar-play"]') as HTMLButtonElement).click();
    expect(mocks.play).toHaveBeenLastCalledWith(1);

    (document.querySelector('[data-testid="toolbar-toggle"]') as HTMLButtonElement).click();
    expect(mocks.toggle).toHaveBeenLastCalledWith(1);

    Object.assign(mocks.narration, {
      state: 'paused',
      activeIndex: 0,
      activeSentence: { index: 0, text: 'Alpha sentence with link.', start: 0, end: 26 },
      hasCursor: true,
      isPlaying: false,
    });
    renderArticle(root!);
    await flushDom();

    (document.querySelector('[data-testid="toolbar-play"]') as HTMLButtonElement).click();
    expect(mocks.play).toHaveBeenLastCalledWith(0);
  });

  it('rebuilds spans after DOM mutation and disconnects its observer on unmount', async () => {
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');
    renderArticle(root!);
    await flushDom();

    const rootNode = getSentenceRoot();
    expect(getSentenceSpans()).toHaveLength(2);

    rootNode.appendChild(document.createTextNode(' Third sentence.'));
    await waitForSentenceCount(3);

    expect(normalizeText(mocks.sources[mocks.sources.length - 1])).toBe(
      'Alpha sentence with link. Beta sentence. Third sentence.',
    );
    expect(getSentenceSpans()).toHaveLength(3);

    act(() => {
      root?.unmount();
    });

    expect(disconnectSpy).toHaveBeenCalled();
  });
});
