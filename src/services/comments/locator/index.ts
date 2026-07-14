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
export {
  resolveV1CommentAnchor,
  normalizeV1CommentAnchorText,
} from '@services/comments/locator/resolve-v1-comment-anchor';

export { captureCommentAnchor } from '@services/comments/locator/capture-comment-anchor';

export { resolveCommentAnchor } from '@services/comments/locator/resolve-comment-anchor';
