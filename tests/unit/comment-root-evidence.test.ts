import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { compareCommentRootEvidence } from '../../src/services/comments/locator/comment-root-evidence';
import { captureCommentRootSnapshot } from '../../src/services/comments/locator/comment-root-snapshot';

function root(html: string): Element {
  return new JSDOM(html).window.document.body.firstElementChild!;
}

describe('comment root evidence', () => {
  test('matches identical versioned root evidence', () => {
    const element = root('<article role="main" data-testid="story">Hello</article>');
    const evidence = captureCommentRootSnapshot(element)!;
    expect(compareCommentRootEvidence(element, evidence)).toBe('matched');
  });

  test('rejects hash, tag, role, and data evidence mismatches', () => {
    const original = root('<article role="main" data-testid="story">Hello</article>');
    const evidence = captureCommentRootSnapshot(original)!;
    expect(compareCommentRootEvidence(root('<article role="main" data-testid="story">Other</article>'), evidence)).toBe('mismatch');
    expect(compareCommentRootEvidence(root('<section role="main" data-testid="story">Hello</section>'), evidence)).toBe('mismatch');
    expect(compareCommentRootEvidence(root('<article role="note" data-testid="story">Hello</article>'), evidence)).toBe('mismatch');
    expect(compareCommentRootEvidence(root('<article role="main" data-testid="other">Hello</article>'), evidence)).toBe('mismatch');
  });

  test('supports explicit length tolerance but never ignores hash mismatch', () => {
    const element = root('<main>Hello</main>');
    const evidence = { ...captureCommentRootSnapshot(element)!, textLength: 6 };
    expect(compareCommentRootEvidence(element, evidence)).toBe('mismatch');
    expect(compareCommentRootEvidence(element, evidence, { lengthTolerance: 1 })).toBe('matched');
  });

  test('returns insufficient for missing or unsupported evidence', () => {
    const element = root('<main>Hello</main>');
    expect(compareCommentRootEvidence(element, null)).toBe('insufficient');
    expect(compareCommentRootEvidence(element, { textModelVersion: 'legacy' } as never)).toBe('insufficient');
  });
});
