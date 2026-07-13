import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { captureCommentAnchor } from '../../src/services/comments/locator/capture-comment-anchor';
import { createInpageCommentRootSource } from '../../src/ui/comments/inpage-comment-root-source';

describe('inpage comment root source', () => {
  test('derives the smallest stable capture root from the current selection', () => {
    const document = new JSDOM('<main><article><p>Hello <b>world</b></p></article></main>', {
      url: 'https://example.com/',
    }).window.document;
    const text = document.querySelector('b')!.firstChild!;
    const range = document.createRange();
    range.selectNodeContents(text);
    const selection = { rangeCount: 1, getRangeAt: () => range } as unknown as Selection;
    const roots = createInpageCommentRootSource({ document }).capture(selection);
    expect(roots?.sourceRoot).toBe(document.querySelector('b'));
  });

  test('rejects panel selections and body-only capture fallback', () => {
    const document = new JSDOM('<body><div id="panel">panel</div><span>page</span></body>', {
      url: 'https://example.com/',
    }).window.document;
    const panel = document.querySelector('#panel')!;
    const range = document.createRange();
    range.selectNodeContents(panel);
    const selection = { rangeCount: 1, getRangeAt: () => range } as unknown as Selection;
    const source = createInpageCommentRootSource({ document, getPanelRoot: () => panel });
    expect(source.capture(selection)).toBeNull();
  });

  test('restores document-relative root first and limits evidence candidates', () => {
    const document = new JSDOM('<main><article>exact</article><article>other</article></main>', {
      url: 'https://example.com/',
    }).window.document;
    const root = document.querySelector('article')!;
    const range = document.createRange();
    range.selectNodeContents(root.firstChild!);
    const locator = captureCommentAnchor({
      root,
      range,
      surfaceHint: 'inpage',
      documentRoot: document.documentElement,
    })!;
    const candidates = createInpageCommentRootSource({ document, maxCandidates: 1 }).locate(locator);
    expect(candidates).toEqual([root]);
  });
});
