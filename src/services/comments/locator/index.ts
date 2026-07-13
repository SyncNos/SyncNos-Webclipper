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

import type { ArticleCommentLocator } from '@services/comments/domain/comment-locator';
import { resolveV1CommentAnchor } from '@services/comments/locator/resolve-v1-comment-anchor';

export function restoreRangeFromArticleCommentLocator(input: {
  root: Element;
  locator: ArticleCommentLocator;
}): Range | null {
  return input.locator.v === 1 ? resolveV1CommentAnchor({ root: input.root, locator: input.locator }) : null;
}
export { resolveCommentAnchor } from '@services/comments/locator/resolve-comment-anchor';
