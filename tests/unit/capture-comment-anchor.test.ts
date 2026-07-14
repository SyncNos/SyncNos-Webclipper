import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { captureCommentAnchor } from '../../src/services/comments/locator/capture-comment-anchor';

describe('captureCommentAnchor', () => {
  test('builds a V2 locator from explicit validated root and range', () => {
    const document = new JSDOM('<main><article>prefix <b>exact</b> suffix</article></main>').window.document;
    const main = document.querySelector('main')!;
    const root = document.querySelector('article')!;
    const text = root.querySelector('b')!.firstChild!;
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 5);

    const locator = captureCommentAnchor({ root, range, surfaceHint: 'inpage', documentRoot: main });
    expect(locator).toMatchObject({
      v: 2,
      textModelVersion: 'dom-text-v2',
      surfaceHint: 'inpage',
      quote: { type: 'TextQuoteSelector', exact: 'exact', prefix: 'prefix ', suffix: ' suffix' },
      position: { type: 'TextPositionSelector', start: 7, end: 12 },
      documentRelativeRootPath: [0],
    });
    expect(locator?.rootEvidence.textHash).toMatch(/^fnv1a32:/);
  });

  test('preserves canonical newline and zero-width exact text', () => {
    const document = new JSDOM('<article></article>').window.document;
    const root = document.querySelector('article')!;
    const text = document.createTextNode('a\nb\u200dc');
    root.append(text);
    const range = document.createRange();
    range.selectNodeContents(text);
    expect(captureCommentAnchor({ root, range, surfaceHint: 'app' })?.quote.exact).toBe('a\nb\u200dc');
  });

  test('rejects ranges that cannot be represented by the root text model', () => {
    const document = new JSDOM('<article>inside</article><aside>outside</aside>').window.document;
    const root = document.querySelector('article')!;
    const outside = document.querySelector('aside')!.firstChild!;
    const range = document.createRange();
    range.selectNodeContents(outside);
    expect(captureCommentAnchor({ root, range, surfaceHint: 'app' })).toBeNull();
  });
});
