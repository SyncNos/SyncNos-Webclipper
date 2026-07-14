import { describe, expect, test } from 'vitest';

import {
  COMMENT_DISPLAY_QUOTE_GRAPHEME_LIMIT,
  toCanonicalCommentQuote,
  toDisplayCommentQuote,
} from '../../src/services/comments/locator/comment-quote-policy';

describe('comment quote policy', () => {
  test('canonical quote keeps full text, line breaks, and zero-width characters', () => {
    const input = `alpha\r\nbeta\u200d${'x'.repeat(COMMENT_DISPLAY_QUOTE_GRAPHEME_LIMIT + 20)}`;
    expect(toCanonicalCommentQuote(input)).toBe(
      `alpha\nbeta\u200d${'x'.repeat(COMMENT_DISPLAY_QUOTE_GRAPHEME_LIMIT + 20)}`,
    );
  });

  test('display quote truncates by grapheme without changing canonical quote', () => {
    const family = '👨‍👩‍👧‍👦';
    const input = `${family}${family}tail`;
    expect(toDisplayCommentQuote(input, { graphemeLimit: 2 })).toBe(`${family}${family}…`);
    expect(toCanonicalCommentQuote(input)).toBe(input);
  });

  test('display quote supports explicit empty budget', () => {
    expect(toDisplayCommentQuote('quote', { graphemeLimit: 0, ellipsis: '' })).toBe('');
  });
});
