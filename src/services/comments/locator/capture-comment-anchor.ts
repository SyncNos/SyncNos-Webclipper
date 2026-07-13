import type { ArticleCommentLocatorV2, ArticleCommentSurfaceHint } from '@services/comments/domain/comment-locator';
import { captureCommentBoundaryPath, encodeCommentNodePath } from '@services/comments/locator/comment-boundary-path';
import { toCanonicalCommentQuote } from '@services/comments/locator/comment-quote-policy';
import { captureCommentRootSnapshot } from '@services/comments/locator/comment-root-snapshot';
import { createCommentDomTextIndex } from '@services/comments/locator/dom-text-index';

const CONTEXT_LENGTH = 64;

export function captureCommentAnchor(input: {
  root: Element;
  range: Range;
  surfaceHint: ArticleCommentSurfaceHint;
  documentRoot?: Element | null;
}): ArticleCommentLocatorV2 | null {
  const { root, range } = input;
  const index = createCommentDomTextIndex(root);
  const offsets = index.rangeToOffsets(range);
  if (!offsets || offsets.end <= offsets.start) return null;

  const exact = toCanonicalCommentQuote(range.toString());
  if (!exact || index.text.slice(offsets.start, offsets.end) !== exact) return null;

  const boundaryPath = captureCommentBoundaryPath(root, range);
  const rootEvidence = captureCommentRootSnapshot(root);
  if (!boundaryPath || !rootEvidence) return null;

  const prefix = index.text.slice(Math.max(0, offsets.start - CONTEXT_LENGTH), offsets.start);
  const suffix = index.text.slice(offsets.end, offsets.end + CONTEXT_LENGTH);
  const documentRelativeRootPath = input.documentRoot ? encodeCommentNodePath(input.documentRoot, root) : null;

  return {
    v: 2,
    textModelVersion: 'dom-text-v2',
    surfaceHint: input.surfaceHint,
    quote: {
      type: 'TextQuoteSelector',
      exact,
      ...(prefix ? { prefix } : {}),
      ...(suffix ? { suffix } : {}),
    },
    position: { type: 'TextPositionSelector', start: offsets.start, end: offsets.end },
    boundaryPath,
    rootEvidence,
    ...(documentRelativeRootPath ? { documentRelativeRootPath } : {}),
  };
}
