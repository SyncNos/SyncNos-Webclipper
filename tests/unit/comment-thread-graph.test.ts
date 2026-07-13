import { describe, expect, it } from 'vitest';
import { normalizeCommentThreadGraph } from '@services/comments/domain/comment-thread-graph';

const item = (id: number, parentId: number | null, createdAt = id) => ({
  id,
  parentId,
  conversationId: 1,
  canonicalUrl: 'https://example.com',
  authorName: null,
  quoteText: '',
  commentText: String(id),
  locator: null,
  createdAt,
  updatedAt: createdAt,
});

describe('comment thread graph', () => {
  it('sorts roots descending and replies ascending', () => {
    const graph = normalizeCommentThreadGraph([item(1, null, 1), item(2, 1, 3), item(3, 1, 2), item(4, null, 4)]);
    expect(graph.threads.map((t) => t.root.id)).toEqual([4, 1]);
    expect(graph.threads[1].replies.map((r) => r.id)).toEqual([3, 2]);
  });
  it('classifies duplicates, orphans and cycles deterministically', () => {
    const graph = normalizeCommentThreadGraph([item(1, 2), item(2, 1), item(3, 999), item(3, null)]);
    expect(graph.duplicateIds).toEqual([3]);
    expect(graph.orphanIds).toEqual([3]);
    expect(graph.cycleIds).toEqual([1, 2]);
  });
});
