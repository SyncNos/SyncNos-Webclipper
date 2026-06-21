import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { buildSentences } from '../../src/services/reader/tts/reader-tts-engine';
import {
  findReaderSentenceElementAtOffset,
  findReaderSentenceIndexFromTarget,
  findReaderSentenceRangeByIndex,
  isReaderSentenceDecoratableTextNode,
  pickFirstVisibleSentenceIndex,
} from '../../src/ui/reader/reader-sentence-dom';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });

  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Element', { configurable: true, value: dom.window.Element });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
}

function cleanupDom() {
  delete (globalThis as any).window;
  delete (globalThis as any).document;
  delete (globalThis as any).HTMLElement;
  delete (globalThis as any).Element;
  delete (globalThis as any).Node;
}

describe('reader-sentence DOM helpers', () => {
  beforeEach(() => {
    setupDom();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanupDom();
  });

  it('maps sentence offsets to DOM ranges and highlightable elements', () => {
    document.body.innerHTML = '<article id="article"><p>Hello <a href="/hello">world</a>!</p><p>Next line。</p></article>';

    const article = document.getElementById('article') as HTMLElement;
    const sentences = buildSentences(article.textContent ?? '');

    expect(sentences).toHaveLength(2);

    const range = findReaderSentenceRangeByIndex(article, sentences, 0);
    expect(range).not.toBeNull();
    expect(range?.startContainer.textContent).toBe('Hello ');
    expect(range?.startOffset).toBe(0);
    expect(range?.endContainer.textContent).toBe('!');
    expect(range?.endOffset).toBe(1);

    const highlightable = findReaderSentenceElementAtOffset(article, sentences[0], sentences[0].start + 6);
    expect(highlightable?.tagName).toBe('A');
  });

  it('picks the first visible sentence and falls back to 0', () => {
    expect(
      pickFirstVisibleSentenceIndex(
        [
          { index: 0, rect: { top: -80, bottom: -20 } },
          { index: 1, rect: { top: 12, bottom: 48 } },
          { index: 2, rect: { top: 120, bottom: 160 } },
        ],
        { top: 0, bottom: 100 },
      ),
    ).toBe(1);

    expect(
      pickFirstVisibleSentenceIndex(
        [
          { index: 3, rect: { top: 150, bottom: 190 } },
          { index: 4, rect: { top: 210, bottom: 250 } },
        ],
        { top: 0, bottom: 100 },
      ),
    ).toBe(0);
  });

  it('parses decorated span targets and skips forbidden containers', () => {
    document.body.innerHTML =
      '<article id="article"><span data-reader-sentence-index="4"><em>click me</em></span><script>ignore me</script><a href="/x">link text</a><button>skip me</button></article>';

    const article = document.getElementById('article') as HTMLElement;
    const span = article.querySelector('[data-reader-sentence-index="4"]') as HTMLElement;
    const emText = span.querySelector('em')?.firstChild;
    const linkText = article.querySelector('a')?.firstChild;
    const scriptText = article.querySelector('script')?.firstChild;
    const buttonText = article.querySelector('button')?.firstChild;

    expect(findReaderSentenceIndexFromTarget(emText ?? null)).toBe(4);
    expect(findReaderSentenceIndexFromTarget(document.createTextNode('plain'))).toBeNull();
    expect(isReaderSentenceDecoratableTextNode(linkText)).toBe(true);
    expect(isReaderSentenceDecoratableTextNode(scriptText)).toBe(false);
    expect(isReaderSentenceDecoratableTextNode(buttonText)).toBe(false);
  });
});
