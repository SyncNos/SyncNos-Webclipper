import { describe, expect, it } from 'vitest';

import { parseArticleCommentAddRequest } from '@services/comments/domain/comment-dto';

const valid = {
  canonicalUrl: 'https://example.com/article',
  conversationId: null,
  parentId: null,
  quoteText: 'quote',
  commentText: 'comment',
  locator: null,
};

describe('article comment runtime DTO', () => {
  it('accepts omitted or null optional ids', () => {
    expect(parseArticleCommentAddRequest(valid)).toMatchObject({ conversationId: null, parentId: null });
    const { conversationId: _conversationId, parentId: _parentId, ...withoutIds } = valid;
    expect(parseArticleCommentAddRequest(withoutIds)).toMatchObject({ conversationId: null, parentId: null });
  });

  it.each([
    { parentId: 0 },
    { parentId: -1 },
    { parentId: 'bad' },
    { conversationId: 0 },
    { conversationId: -1 },
    { conversationId: 'bad' },
  ])('rejects explicit invalid optional ids: %j', (override) => {
    expect(parseArticleCommentAddRequest({ ...valid, ...override })).toBeNull();
  });
});
