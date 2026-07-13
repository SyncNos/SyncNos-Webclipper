import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { captureCommentAnchor } from '../../src/services/comments/locator/capture-comment-anchor';
import { resolveCommentAnchor } from '../../src/services/comments/locator/resolve-comment-anchor';

function element(text: string): Element {
  const document = new JSDOM('<article></article>').window.document;
  const root = document.querySelector('article')!;
  root.textContent = text;
  return root;
}

describe('resolveCommentAnchor', () => {
  test('succeeds only for one verified range across all roots', () => {
    const source = element('before exact after');
    const range = source.ownerDocument.createRange();
    range.setStart(source.firstChild!, 7);
    range.setEnd(source.firstChild!, 12);
    const locator = captureCommentAnchor({ root: source, range, surfaceHint: 'app' })!;
    const result = resolveCommentAnchor({ locator, roots: [element('unrelated'), source] });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rootIndex).toBe(1);
      expect(result.range.toString()).toBe('exact');
    }
  });

  test('rejects a V1 locator that resolves in more than one root', () => {
    const locator = {
      v: 1 as const,
      env: 'app' as const,
      quote: { type: 'TextQuoteSelector' as const, exact: 'exact' },
      position: { type: 'TextPositionSelector' as const, start: 0, end: 5 },
    };
    expect(resolveCommentAnchor({ locator, roots: [element('exact'), element('exact')] })).toEqual({ ok: false, reason: 'ambiguous_root' });
  });

  test('enforces root/text budgets and cancellation', () => {
    const locator = {
      v: 1 as const,
      env: 'app' as const,
      quote: { type: 'TextQuoteSelector' as const, exact: 'x' },
      position: { type: 'TextPositionSelector' as const, start: 0, end: 1 },
    };
    expect(resolveCommentAnchor({ locator, roots: [element('x'), element('x')], maxRoots: 1 })).toEqual({ ok: false, reason: 'budget_exceeded' });
    expect(resolveCommentAnchor({ locator, roots: [element('long')], maxTotalTextLength: 1 })).toEqual({ ok: false, reason: 'budget_exceeded' });
    const controller = new AbortController();
    controller.abort();
    expect(resolveCommentAnchor({ locator, roots: [element('x')], signal: controller.signal })).toEqual({ ok: false, reason: 'aborted' });
    expect(resolveCommentAnchor({ locator, roots: [element('x')], generation: 2, isGenerationCurrent: () => false })).toEqual({ ok: false, reason: 'aborted' });
  });
});
