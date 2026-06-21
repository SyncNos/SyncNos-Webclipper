import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { buildReaderOutlineDomEntries } from '../../src/ui/reader/article-outline-dom';
import { pickReaderOutlineActiveIndex } from '../../src/services/protocols/reader-outline';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });

  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
}

function cleanupDom() {
  delete (globalThis as any).window;
  delete (globalThis as any).document;
  delete (globalThis as any).HTMLElement;
  delete (globalThis as any).Node;
}

function makeRect(top: number, bottom: number): DOMRect {
  return {
    top,
    bottom,
    left: 0,
    right: 0,
    width: 0,
    height: bottom - top,
    x: 0,
    y: top,
    toJSON: () => ({ top, bottom }),
  } as DOMRect;
}

describe('reader-outline DOM adapter', () => {
  beforeEach(() => {
    setupDom();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanupDom();
  });

  it('reads h1/h2/h3 headings, preserves existing ids and skips empty titles', () => {
    document.body.innerHTML = `
      <article id="article">
        <h1>  深度工作  </h1>
        <p>段落内容</p>
        <h2 id="existing-id">  第一条策略  </h2>
        <h3>   </h3>
        <h2><span>第二条</span> 策略</h2>
      </article>
    `;

    const article = document.getElementById('article') as HTMLElement;
    const headings = Array.from(article.querySelectorAll('h1, h2, h3')) as HTMLElement[];
    vi.spyOn(headings[0], 'getBoundingClientRect').mockReturnValue(makeRect(18, 54));
    vi.spyOn(headings[1], 'getBoundingClientRect').mockReturnValue(makeRect(126, 168));
    vi.spyOn(headings[3], 'getBoundingClientRect').mockReturnValue(makeRect(260, 306));

    const entries = buildReaderOutlineDomEntries(article);

    expect(entries).toHaveLength(3);
    expect(entries.map((entry) => entry.index)).toEqual([0, 1, 2]);
    expect(entries.map((entry) => entry.level)).toEqual([1, 2, 2]);
    expect(entries[0]?.title).toBe('深度工作');
    expect(entries[0]?.id).toBe('reader-outline-1');
    expect(entries[0]?.element.id).toBe('reader-outline-1');
    expect(entries[1]?.id).toBe('existing-id');
    expect(entries[2]?.title).toBe('第二条 策略');
    expect(entries[2]?.id).toBe('reader-outline-4');
    expect(entries[2]?.rect).toEqual({ top: 260, bottom: 306 });

    const activeIndex = pickReaderOutlineActiveIndex({
      viewportRect: { top: 0, bottom: 600 },
      candidates: entries.map(({ index, rect, level, id, title }) => ({ index, rect, level, id, title })),
    });
    expect(activeIndex).toBe(1);
  });

  it('returns an empty list for missing roots', () => {
    expect(buildReaderOutlineDomEntries(null)).toEqual([]);
  });
});
