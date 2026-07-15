import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { captureCommentAnchor } from '../../src/services/comments/locator/capture-comment-anchor';
import { createCommentDomTextIndex } from '../../src/services/comments/locator/dom-text-index';
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

  test('preserves missing root, root mismatch, and ambiguous quote reasons', () => {
    const source = element('exact and exact');
    const range = source.ownerDocument.createRange();
    range.setStart(source.firstChild!, 0);
    range.setEnd(source.firstChild!, 5);
    const locator = captureCommentAnchor({ root: source, range, surfaceHint: 'app' })!;

    expect(resolveCommentAnchor({ locator, roots: [] })).toEqual({ ok: false, reason: 'missing_root' });
    expect(resolveCommentAnchor({ locator, roots: [element('unrelated')] })).toEqual({
      ok: false,
      reason: 'root_mismatch',
    });

    const ambiguousLocator = {
      ...locator,
      quote: { type: 'TextQuoteSelector' as const, exact: 'exact' },
      position: { type: 'TextPositionSelector' as const, start: 99, end: 104 },
      boundaryPath: {
        start: { path: [99], offset: 0 },
        end: { path: [99], offset: 5 },
      },
    };
    expect(resolveCommentAnchor({ locator: ambiguousLocator, roots: [source] })).toEqual({
      ok: false,
      reason: 'ambiguous_quote',
    });
  });

  test('resolves a cross-surface V2 locator only when its exact quote is globally unique', () => {
    const source = element('source prefix exact source suffix');
    const range = source.ownerDocument.createRange();
    range.setStart(source.firstChild!, 14);
    range.setEnd(source.firstChild!, 19);
    const locator = captureCommentAnchor({ root: source, range, surfaceHint: 'inpage' })!;
    const renderedArticle = element('reader prefix changed exact reader suffix changed');

    expect(resolveCommentAnchor({ locator, roots: [renderedArticle] })).toEqual({
      ok: false,
      reason: 'root_mismatch',
    });

    const result = resolveCommentAnchor({ locator, roots: [renderedArticle], targetSurfaceHint: 'app' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.range.toString()).toBe('exact');
  });

  test('rejects ambiguous cross-surface exact quotes within one root or across roots', () => {
    const source = element('source exact context');
    const range = source.ownerDocument.createRange();
    range.setStart(source.firstChild!, 7);
    range.setEnd(source.firstChild!, 12);
    const locator = captureCommentAnchor({ root: source, range, surfaceHint: 'inpage' })!;

    expect(resolveCommentAnchor({ locator, roots: [element('exact and exact')], targetSurfaceHint: 'app' })).toEqual({
      ok: false,
      reason: 'ambiguous_quote',
    });
    expect(
      resolveCommentAnchor({ locator, roots: [element('exact'), element('exact')], targetSurfaceHint: 'app' }),
    ).toEqual({ ok: false, reason: 'ambiguous_root' });
  });

  test('rejects a V1 locator that resolves in more than one root', () => {
    const locator = {
      v: 1 as const,
      env: 'app' as const,
      quote: { type: 'TextQuoteSelector' as const, exact: 'exact' },
      position: { type: 'TextPositionSelector' as const, start: 0, end: 5 },
    };
    expect(resolveCommentAnchor({ locator, roots: [element('exact'), element('exact')] })).toEqual({
      ok: false,
      reason: 'ambiguous_root',
    });
  });

  test('builds one DOM text index per V2 root and reuses it across strategies', () => {
    const source = element('before exact after');
    const range = source.ownerDocument.createRange();
    range.setStart(source.firstChild!, 7);
    range.setEnd(source.firstChild!, 12);
    const locator = captureCommentAnchor({ root: source, range, surfaceHint: 'app' })!;
    let calls = 0;

    expect(
      resolveCommentAnchor({
        locator,
        roots: [source],
        createIndex(root) {
          calls += 1;
          return createCommentDomTextIndex(root);
        },
      }).ok,
    ).toBe(true);
    expect(calls).toBe(1);
  });

  test('enforces root/text budgets and cancellation', () => {
    const locator = {
      v: 1 as const,
      env: 'app' as const,
      quote: { type: 'TextQuoteSelector' as const, exact: 'x' },
      position: { type: 'TextPositionSelector' as const, start: 0, end: 1 },
    };
    expect(resolveCommentAnchor({ locator, roots: [element('x'), element('x')], maxRoots: 1 })).toEqual({
      ok: false,
      reason: 'budget_exceeded',
    });
    expect(resolveCommentAnchor({ locator, roots: [element('long')], maxTotalTextLength: 1 })).toEqual({
      ok: false,
      reason: 'budget_exceeded',
    });
    const controller = new AbortController();
    controller.abort();
    expect(resolveCommentAnchor({ locator, roots: [element('x')], signal: controller.signal })).toEqual({
      ok: false,
      reason: 'aborted',
    });
    expect(
      resolveCommentAnchor({ locator, roots: [element('x')], generation: 2, isGenerationCurrent: () => false }),
    ).toEqual({ ok: false, reason: 'aborted' });
  });
});
