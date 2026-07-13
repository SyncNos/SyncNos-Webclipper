import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import type { ArticleCommentLocatorV2 } from '../../src/services/comments/domain/comment-locator';
import { captureCommentRootSnapshot } from '../../src/services/comments/locator/comment-root-snapshot';
import { resolveV2ByQuoteContext } from '../../src/services/comments/locator/resolve-v2-by-quote';

function locator(root: Element, exact: string, prefix = '', suffix = ''): ArticleCommentLocatorV2 {
  return {
    v: 2,
    textModelVersion: 'dom-text-v2',
    surfaceHint: 'app',
    quote: { type: 'TextQuoteSelector', exact, ...(prefix ? { prefix } : {}), ...(suffix ? { suffix } : {}) },
    position: { type: 'TextPositionSelector', start: 0, end: exact.length },
    boundaryPath: { start: { path: [0], offset: 0 }, end: { path: [0], offset: exact.length } },
    rootEvidence: captureCommentRootSnapshot(root)!,
  };
}

function root(text: string): Element {
  const document = new JSDOM('<article></article>').window.document;
  const element = document.querySelector('article')!;
  element.textContent = text;
  return element;
}

describe('resolveV2ByQuoteContext', () => {
  test('returns the only exact/context match', () => {
    const element = root('before exact after exact tail');
    const result = resolveV2ByQuoteContext({ root: element, locator: locator(element, 'exact', 'before ', ' after') });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.range.toString()).toBe('exact');
  });

  test('rejects globally ambiguous exact matches', () => {
    const element = root('exact and exact');
    expect(resolveV2ByQuoteContext({ root: element, locator: locator(element, 'exact') })).toEqual({
      ok: false,
      reason: 'ambiguous_quote',
    });
  });

  test('reports not found and budget exceeded separately', () => {
    const element = root('short text');
    expect(resolveV2ByQuoteContext({ root: element, locator: locator(element, 'missing') })).toEqual({
      ok: false,
      reason: 'quote_not_found',
    });
    expect(resolveV2ByQuoteContext({ root: element, locator: locator(element, 'text'), maxTextLength: 3 })).toEqual({
      ok: false,
      reason: 'budget_exceeded',
    });
  });
});
