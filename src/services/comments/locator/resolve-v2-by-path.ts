import type { ArticleCommentLocatorV2 } from '@services/comments/domain/comment-locator';
import { restoreCommentBoundaryRange } from '@services/comments/locator/comment-boundary-path';
import { compareCommentRootEvidence } from '@services/comments/locator/comment-root-evidence';
import { createCommentDomTextIndex } from '@services/comments/locator/dom-text-index';

export type ResolveV2PathResult = { range: Range; strategy: 'path' | 'position' };

function exactRange(root: Element, range: Range, exact: string): Range | null {
  const index = createCommentDomTextIndex(root);
  const offsets = index.rangeToOffsets(range);
  if (!offsets) return null;
  return index.text.slice(offsets.start, offsets.end) === exact ? range : null;
}

export function resolveV2ByPathOrPosition(input: {
  root: Element;
  locator: ArticleCommentLocatorV2;
  lengthTolerance?: number;
}): ResolveV2PathResult | null {
  const { root, locator } = input;
  if (
    compareCommentRootEvidence(root, locator.rootEvidence, { lengthTolerance: input.lengthTolerance }) !== 'matched'
  ) {
    return null;
  }

  const byPath = restoreCommentBoundaryRange(root, locator.boundaryPath);
  if (byPath && exactRange(root, byPath, locator.quote.exact)) return { range: byPath, strategy: 'path' };

  const index = createCommentDomTextIndex(root);
  const byPosition = index.offsetsToRange(locator.position.start, locator.position.end);
  if (byPosition && exactRange(root, byPosition, locator.quote.exact))
    return { range: byPosition, strategy: 'position' };
  return null;
}
