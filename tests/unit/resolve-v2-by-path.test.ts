import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { captureCommentAnchor } from '../../src/services/comments/locator/capture-comment-anchor';
import { resolveV2ByPathOrPosition } from '../../src/services/comments/locator/resolve-v2-by-path';

function fixture() {
  const document = new JSDOM('<article>Hello <b>world</b></article>').window.document;
  const root = document.querySelector('article')!;
  const text = root.querySelector('b')!.firstChild!;
  const range = document.createRange();
  range.selectNodeContents(text);
  const locator = captureCommentAnchor({ root, range, surfaceHint: 'app' })!;
  return { document, root, locator };
}

describe('resolveV2ByPathOrPosition', () => {
  test('resolves an exact path candidate after evidence validation', () => {
    const { root, locator } = fixture();
    const result = resolveV2ByPathOrPosition({ root, locator });
    expect(result?.strategy).toBe('path');
    expect(result?.range.toString()).toBe('world');
  });

  test('falls back to exact position when path is invalid', () => {
    const { root, locator } = fixture();
    locator.boundaryPath.start.path = [99];
    const result = resolveV2ByPathOrPosition({ root, locator });
    expect(result?.strategy).toBe('position');
    expect(result?.range.toString()).toBe('world');
  });

  test('rejects evidence or exact mismatches without block fallback', () => {
    const { root, locator } = fixture();
    expect(resolveV2ByPathOrPosition({ root, locator: { ...locator, rootEvidence: { ...locator.rootEvidence, textHash: 'wrong' } } })).toBeNull();
    expect(resolveV2ByPathOrPosition({ root, locator: { ...locator, quote: { ...locator.quote, exact: 'World' } } })).toBeNull();
  });
});
