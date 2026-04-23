export type CommentLocatorEnv = 'inpage' | 'app';

export type CommentTextQuoteSelector = {
  type: 'TextQuoteSelector';
  exact: string;
  prefix?: string;
  suffix?: string;
};

export type CommentTextPositionSelector = {
  type: 'TextPositionSelector';
  start: number;
  end: number;
};

export type CommentLocatorV1 = {
  v: 1;
  env: CommentLocatorEnv;
  quote: CommentTextQuoteSelector;
  position: CommentTextPositionSelector;
};

export type CommentLocator = CommentLocatorV1;

export type Comment = {
  id: number;
  parentId: number | null;
  conversationId: number | null;
  targetKey: string;
  canonicalUrl: string;
  authorName?: string | null;
  quoteText: string;
  commentText: string;
  locator?: CommentLocator | null;
  createdAt: number;
  updatedAt: number;
};

export type AddCommentInput = {
  parentId?: number | null;
  conversationId: number | null;
  targetKey: string;
  canonicalUrl?: string | null;
  authorName?: string | null;
  quoteText?: string | null;
  commentText: string;
  locator?: CommentLocator | null;
  createdAt?: number | null;
  updatedAt?: number | null;
};

