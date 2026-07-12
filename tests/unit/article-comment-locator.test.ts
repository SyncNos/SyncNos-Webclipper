import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import {
  buildArticleCommentLocatorFromRange,
  restoreRangeFromArticleCommentLocator,
} from '../../src/services/comments/locator';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });

  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
  Object.defineProperty(globalThis, 'NodeFilter', { configurable: true, value: dom.window.NodeFilter });
}

function cleanupDom() {
  delete (globalThis as any).window;
  delete (globalThis as any).document;
  delete (globalThis as any).navigator;
  delete (globalThis as any).HTMLElement;
  delete (globalThis as any).Node;
  // Keep the minimal NodeFilter polyfill from setup-nodefilter.ts.
}

describe('article-comment-locator', () => {
  beforeEach(() => setupDom());
  afterEach(() => cleanupDom());

  it('builds locator from Range', () => {
    document.body.innerHTML = '<div id="root">Hello world</div>';
    const root = document.getElementById('root') as HTMLElement;
    const textNode = root.firstChild as Text;

    const range = document.createRange();
    range.setStart(textNode, 6);
    range.setEnd(textNode, 11);

    const locator = buildArticleCommentLocatorFromRange({
      env: 'inpage',
      root,
      range,
    });

    expect(locator?.v).toBe(1);
    expect(locator?.env).toBe('inpage');
    expect(locator?.quote?.exact).toBe('world');
    expect(typeof (locator as any)?.position?.start).toBe('number');
    expect(typeof (locator as any)?.position?.end).toBe('number');
    expect(Number((locator as any).position.end)).toBeGreaterThan(Number((locator as any).position.start));

    const restored = locator ? restoreRangeFromArticleCommentLocator({ root, locator }) : null;
    expect(restored?.toString()).toBe('world');
  });

  it('restores range when exact differs only by whitespace', () => {
    document.body.innerHTML = '<div id="root">Hello world</div>';
    const root = document.getElementById('root') as HTMLElement;

    const baseLocator = buildArticleCommentLocatorFromRange({
      env: 'app',
      root,
      range: (() => {
        const textNode = root.firstChild as Text;
        const range = document.createRange();
        range.setStart(textNode, 0);
        range.setEnd(textNode, 11);
        return range;
      })(),
    });

    expect(baseLocator).toBeTruthy();

    const locator = {
      ...(baseLocator as any),
      quote: {
        ...(baseLocator as any).quote,
        exact: 'Hello\nworld',
      },
    };

    const restored = restoreRangeFromArticleCommentLocator({ root, locator });
    expect(restored?.toString()).toBe('Hello world');
  });
});

import { parseArticleCommentLocator } from '../../src/services/comments/locator';

describe('article-comment-locator parser', () => {
  it('parses a valid V2 locator without losing evidence', () => {
    const parsed = parseArticleCommentLocator({
      v: 2,
      textModelVersion: 'dom-text-v2',
      surfaceHint: 'app',
      quote: { type: 'TextQuoteSelector', exact: 'world', prefix: 'hello ' },
      position: { type: 'TextPositionSelector', start: 6, end: 11 },
      boundaryPath: { start: { path: [0], offset: 6 }, end: { path: [0], offset: 11 } },
      rootEvidence: { textModelVersion: 'dom-text-v2', textLength: 11, textHash: 'abc' },
      documentRelativeRootPath: [1, 0],
    });
    expect(parsed.ok).toBe(true);
    expect(parsed.value).toMatchObject({ v: 2, surfaceHint: 'app', rootEvidence: { textHash: 'abc' } });
  });


  it('rejects locator fields that exceed parser budgets', () => {
    const base = {
      v: 2,
      textModelVersion: 'dom-text-v2',
      surfaceHint: 'app',
      quote: { type: 'TextQuoteSelector', exact: 'x'.repeat(20001) },
      position: { type: 'TextPositionSelector', start: 0, end: 1 },
      boundaryPath: { start: { path: [0], offset: 0 }, end: { path: [0], offset: 1 } },
      rootEvidence: { textModelVersion: 'dom-text-v2', textLength: 1, textHash: 'x' },
    };
    expect(parseArticleCommentLocator(base).reason).toBe('invalid_quote');
    expect(parseArticleCommentLocator({ ...base, quote: { type: 'TextQuoteSelector', exact: 'x' }, boundaryPath: { start: { path: Array(129).fill(0), offset: 0 }, end: { path: [0], offset: 1 } } }).reason).toBe('invalid_boundary_path');
  });

  it('rejects unsupported or malformed locator versions', () => {
    expect(parseArticleCommentLocator({ v: 3 }).reason).toBe('unsupported_version');
    expect(parseArticleCommentLocator({ v: 1, env: 'app', quote: { type: 'TextQuoteSelector', exact: '' }, position: { type: 'TextPositionSelector', start: 0, end: 1 } }).reason).toBe('invalid_quote');
  });
});
