import { describe, expect, it } from 'vitest';

import { computeArticleCommentThreadCount } from '@services/comments/domain/comment-metrics';

const c = (id: any, parentId: any) => ({ id, parentId, conversationId: 1, canonicalUrl: 'https://example.com', authorName: null, quoteText: '', commentText: String(id), locator: null, createdAt: Number(id) || 0, updatedAt: Number(id) || 0 });

describe('computeArticleCommentThreadCount', () => {
  it('returns 0 for empty list', () => {
    expect(computeArticleCommentThreadCount([])).toBe(0);
  });

  it('counts only root comments when parent exists', () => {
    const comments = [
      c(1, null),
      c(2, 1),
      c(3, 1),
      c(4, null),
    ];
    expect(computeArticleCommentThreadCount(comments)).toBe(2);
  });

  it('treats orphan replies as roots', () => {
    const comments = [
      c(1, 999),
      c(2, 1),
      c(3, null),
    ];
    expect(computeArticleCommentThreadCount(comments)).toBe(2);
  });

  it('deduplicates by id', () => {
    const comments = [
      c(1, null),
      c(1, null),
      c(2, 1),
      c(2, 1),
    ];
    expect(computeArticleCommentThreadCount(comments)).toBe(1);
  });

  it('keeps stable output for invalid id/parentId values', () => {
    const comments = [
      c(0, null),
      c(Number.NaN, Number.NaN),
      c(Number.POSITIVE_INFINITY, 123),
      c(-1, -2),
    ];
    expect(computeArticleCommentThreadCount(comments)).toBe(0);
  });
});
