import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import {
  DEDAO_GUI_NOTE_CONTENT_SELECTOR,
  buildDedaoGuiMarkerCandidatePoints,
  collectDedaoGuiNoteMarkers,
  extractDedaoGuiNotesFromDocument,
} from '../../src/collectors/web/dedao-gui-notes-dom-extractor';

let dom: JSDOM | null = null;

function setRect(el: Element | null, rect: Partial<DOMRect>) {
  if (!el) return;
  const merged = {
    width: 24,
    height: 14,
    top: 200,
    left: 300,
    right: 324,
    bottom: 214,
    ...rect,
  };
  (el as any).getBoundingClientRect = () => merged;
}

function installDom(html: string, url = 'https://www.dedao.cn/course/article?id=test') {
  dom = new JSDOM(html, {
    url,
    pretendToBeVisual: true,
  });

  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'location', { configurable: true, value: dom.window.location });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Element', { configurable: true, value: dom.window.Element });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
  Object.defineProperty(globalThis, 'MouseEvent', { configurable: true, value: dom.window.MouseEvent });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  dom = null;
  // @ts-expect-error cleanup
  delete globalThis.window;
  // @ts-expect-error cleanup
  delete globalThis.document;
  // @ts-expect-error cleanup
  delete globalThis.location;
});

describe('dedao gui notes dom extractor', () => {
  it('collects visible unique markers and candidate points', () => {
    installDom(`
      <html><body>
        <svg id="s1"><text class="em-highlight-tag-text">笔记</text></svg>
        <svg id="s2"><text class="em-highlight-tag-text">笔记</text></svg>
      </body></html>
    `);

    const markers = Array.from(document.querySelectorAll('text.em-highlight-tag-text'));
    setRect(markers[0], { left: 10, top: 20, right: 34, bottom: 34 });
    setRect(markers[1], { left: 10, top: 20, right: 34, bottom: 34 });

    const collected = collectDedaoGuiNoteMarkers(document);
    expect(collected).toHaveLength(1);
    expect(collected[0]?.candidatePoints).toHaveLength(9);

    const points = buildDedaoGuiMarkerCandidatePoints(collected[0]!.rect);
    expect(points[0]).toEqual({ x: 22, y: 27 });
  });

  it('extracts notes and dedupes repeated interaction results', async () => {
    installDom(`
      <html><body>
        <div id="article">
          <p id="p1">第一段原文</p>
          <svg><text class="em-highlight-tag-text">笔记</text></svg>
          <p id="p2">第二段原文</p>
          <svg><text class="em-highlight-tag-text">笔记</text></svg>
        </div>
      </body></html>
    `);

    const markers = Array.from(document.querySelectorAll('text.em-highlight-tag-text'));
    setRect(markers[0], { left: 50, top: 100, right: 74, bottom: 114 });
    setRect(markers[1], { left: 50, top: 200, right: 74, bottom: 214 });

    const notesByIndex = [
      { externalId: 'n-1', quoteText: '第一段摘录', commentText: '第一条笔记' },
      { externalId: 'n-1', quoteText: '第一段摘录', commentText: '第一条笔记' },
    ];

    const result = await extractDedaoGuiNotesFromDocument({
      document,
      clickMarker: vi.fn(async (marker) => ({
        opened: true,
        ...notesByIndex[marker.index],
      })),
      readCurrentNote: vi.fn(async ({ marker }) => ({
        commentText: notesByIndex[marker.index]?.commentText,
      })),
    });

    expect(result).toEqual([
      {
        externalId: 'n-1',
        quoteText: '第一段摘录',
        commentText: '第一条笔记',
        markerText: '笔记',
        markerVisitKey: expect.any(String),
      },
    ]);
  });

  it('skips markers when note popup content is missing or empty', async () => {
    installDom(`
      <html><body>
        <div id="article">
          <p id="p1">第一段原文</p>
          <svg><text class="em-highlight-tag-text">笔记</text></svg>
          <div class="notes-edit-content"></div>
        </div>
      </body></html>
    `);

    const marker = document.querySelector('text.em-highlight-tag-text');
    setRect(marker, { left: 20, top: 40, right: 44, bottom: 54 });

    const result = await extractDedaoGuiNotesFromDocument({
      document,
      clickMarker: vi.fn(async () => ({ opened: false })),
    });

    expect(result).toEqual([]);
    expect(document.querySelector(DEDAO_GUI_NOTE_CONTENT_SELECTOR)).not.toBeNull();
  });

  it('continues after one marker throws and still closes each marker', async () => {
    installDom(`
      <html><body>
        <p>第一段原文</p>
        <svg><text class="em-highlight-tag-text">笔记</text></svg>
        <p>第二段原文</p>
        <svg><text class="em-highlight-tag-text">笔记</text></svg>
      </body></html>
    `);

    const markers = Array.from(document.querySelectorAll('text.em-highlight-tag-text'));
    setRect(markers[0], { left: 20, top: 40, right: 44, bottom: 54 });
    setRect(markers[1], { left: 20, top: 80, right: 44, bottom: 94 });

    const closeCurrentNote = vi.fn();
    const result = await extractDedaoGuiNotesFromDocument({
      document,
      clickMarker: vi.fn(async (marker) => {
        if (marker.index === 0) throw new Error('boom');
        return {
          opened: true,
          externalId: 'n-2',
          quoteText: '第二段摘录',
          commentText: '第二条笔记',
        };
      }),
      closeCurrentNote,
    });

    expect(result).toEqual([
      {
        externalId: 'n-2',
        quoteText: '第二段摘录',
        commentText: '第二条笔记',
        markerText: '笔记',
        markerVisitKey: expect.any(String),
      },
    ]);
    expect(closeCurrentNote).toHaveBeenCalledTimes(2);
  });

  it('retries real click points and preserves same-content notes from different marker positions', async () => {
    installDom(`
      <html><body>
        <p>第一段原文</p>
        <svg id="svg-1"><text class="em-highlight-tag-text">笔记</text></svg>
        <p>第二段原文</p>
        <svg id="svg-2"><text class="em-highlight-tag-text">笔记</text></svg>
      </body></html>
    `);

    const markers = Array.from(document.querySelectorAll('text.em-highlight-tag-text'));
    setRect(markers[0], { left: 40, top: 100, right: 64, bottom: 114 });
    setRect(markers[1], { left: 40, top: 200, right: 64, bottom: 214 });

    const popup = document.createElement('div');
    popup.className = 'notes-edit-content';
    document.body.appendChild(popup);
    popup.textContent = '';

    const markerByY = new Map([
      [100, { quoteText: '同一摘录', commentText: '同一笔记' }],
      [200, { quoteText: '同一摘录', commentText: '同一笔记' }],
    ]);

    (document as any).elementsFromPoint = (x: number, y: number) => {
      const marker = y >= 190 ? markers[1] : markers[0];
      const overlay = document.createElement('button');
      overlay.addEventListener('click', (event: Event) => {
        const mouseEvent = event as MouseEvent;
        const markerTop = y >= 190 ? 200 : 100;
        if (mouseEvent.clientX === 52 && mouseEvent.clientY === markerTop - 8) {
          popup.textContent = markerByY.get(markerTop)!.commentText;
          const selectionValue = markerByY.get(markerTop)!.quoteText;
          document.defaultView!.getSelection = () =>
            ({
              toString: () => selectionValue,
            }) as Selection;
        }
      });
      return [overlay, marker];
    };

    const result = await extractDedaoGuiNotesFromDocument({ document, waitTimeoutMs: 200, pollIntervalMs: 10 });
    expect(result).toHaveLength(2);
    expect(result[0]?.commentText).toBe('同一笔记');
    expect(result[1]?.commentText).toBe('同一笔记');
    expect(result[0]?.markerVisitKey).not.toBe(result[1]?.markerVisitKey);
  });

  it('uses only nearby text blocks for quote fallback', async () => {
    installDom(`
      <html><body>
        <div class="wrapper">无关容器</div>
        <div><span>不是文本块</span></div>
        <svg><text class="em-highlight-tag-text">笔记</text></svg>
        <div class="notes-edit-content">只有笔记正文</div>
      </body></html>
    `);

    const marker = document.querySelector('text.em-highlight-tag-text');
    setRect(marker, { left: 20, top: 40, right: 44, bottom: 54 });
    document.defaultView!.getSelection = () =>
      ({
        toString: () => '',
      }) as Selection;

    const result = await extractDedaoGuiNotesFromDocument({
      document,
      clickMarker: vi.fn(async () => ({ opened: true })),
    });

    expect(result).toEqual([]);
  });

  it('emits debug events only when a logger is provided', async () => {
    installDom(`
      <html><body>
        <div id="article">
          <p id="p1">第一段原文</p>
          <svg><text class="em-highlight-tag-text">笔记</text></svg>
        </div>
      </body></html>
    `);

    const marker = document.querySelector('text.em-highlight-tag-text');
    setRect(marker, { left: 20, top: 40, right: 44, bottom: 54 });

    const debugLog = vi.fn();
    await extractDedaoGuiNotesFromDocument({
      document,
      debugLog,
      clickMarker: vi.fn(async () => ({
        opened: true,
        externalId: 'n-1',
        quoteText: '摘录',
        commentText: '笔记',
      })),
    });

    expect(debugLog).toHaveBeenCalledWith('marker_scan', { markerCount: 1 });
    expect(debugLog).toHaveBeenCalledWith(
      'marker_dedupe_done',
      expect.objectContaining({ rawCount: 1, dedupedCount: 1 }),
    );
  });
});

describe('dedao gui notes main-world bridge', () => {
  it('exports a MAIN-world content script restricted to dedao article urls', async () => {
    installDom('<html><body></body></html>');
    vi.resetModules();
    (globalThis as any).defineContentScript = (config: unknown) => config;

    const mod = await import('../../src/entrypoints/dedao-gui-notes-main.content');
    const entry = mod.default as any;

    expect(entry.world).toBe('MAIN');
    expect(entry.matches).toContain('https://www.dedao.cn/course/article*');
    expect(mod.isDedaoArticleUrl('https://www.dedao.cn/course/article?id=1')).toBe(true);
    expect(mod.isDedaoArticleUrl('https://www.dedao.cn/')).toBe(false);
  });

  it('returns success and malformed responses through the bridge listener', async () => {
    installDom('<html><body></body></html>');
    vi.resetModules();
    (globalThis as any).defineContentScript = (config: unknown) => config;

    const mod = await import('../../src/entrypoints/dedao-gui-notes-main.content');
    const responses: any[] = [];
    const listener = mod.createDedaoGuiNotesMainWorldListener({
      document,
      locationHref: 'https://www.dedao.cn/course/article?id=1',
      postMessage: (response: unknown) => responses.push(response),
      extractNotes: vi.fn(async () => [{ externalId: 'n-1', quoteText: 'q', commentText: 'c' }]),
    });

    await listener(
      new window.MessageEvent('message', {
        source: window,
        data: {
          __syncnos: true,
          type: 'SYNCNOS_DEDAO_GUI_NOTES_REQUEST',
          requestId: 'req-1',
          timeoutMs: 600,
        },
      }),
    );

    await listener(
      new window.MessageEvent('message', {
        source: window,
        data: {
          __syncnos: true,
          type: 'SYNCNOS_DEDAO_GUI_NOTES_REQUEST',
          requestId: 'req-2',
          timeoutMs: 0,
        },
      }),
    );

    expect(responses[0]).toMatchObject({
      ok: true,
      status: 'success',
      requestId: 'req-1',
    });
    expect(responses[1]).toMatchObject({
      ok: false,
      status: 'malformed_payload',
      requestId: 'req-2',
    });
  });

  it('returns malformed_payload when extractor returns malformed runtime data', async () => {
    installDom('<html><body></body></html>');
    vi.resetModules();
    (globalThis as any).defineContentScript = (config: unknown) => config;

    const mod = await import('../../src/entrypoints/dedao-gui-notes-main.content');
    const malformed = await mod.executeDedaoGuiNotesBridgeRequest(
      {
        __syncnos: true,
        type: 'SYNCNOS_DEDAO_GUI_NOTES_REQUEST',
        requestId: 'req-3',
        timeoutMs: 500,
      },
      {
        document,
        locationHref: 'https://www.dedao.cn/course/article?id=1',
        extractNotes: vi.fn(async () => [{} as any]),
      },
    );

    expect(malformed).toMatchObject({
      ok: false,
      status: 'malformed_payload',
      requestId: 'req-3',
    });
  });

  it('does not install the bridge listener on non-dedao pages', async () => {
    installDom('<html><body></body></html>', 'https://example.com/post');
    vi.resetModules();
    const addListener = vi.spyOn(window, 'addEventListener');
    (globalThis as any).defineContentScript = (config: unknown) => config;

    const mod = await import('../../src/entrypoints/dedao-gui-notes-main.content');
    const entry = mod.default as any;
    entry.main();

    expect(addListener).not.toHaveBeenCalledWith('message', expect.any(Function));
  });
});
