export type {
  ArticleCommentBoundaryPath,
  ArticleCommentLocator,
  ArticleCommentLocatorEnv,
  ArticleCommentLocatorV1,
  ArticleCommentLocatorV2,
  ArticleCommentRootEvidence,
  ArticleCommentSurfaceHint,
  ArticleCommentTextModelVersion,
  ArticleCommentTextPositionSelector,
  ArticleCommentTextQuoteSelector,
} from '@services/comments/domain/comment-locator';
export { normalizeArticleCommentLocator, parseArticleCommentLocator } from '@services/comments/domain/comment-locator';
export { buildArticleCommentLocatorFromRange, restoreRangeFromArticleCommentLocator } from '@services/comments/locator/selector-anchoring';
