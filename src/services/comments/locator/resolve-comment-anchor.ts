import type { ArticleCommentAnchorResolveReason, ArticleCommentLocator } from '@services/comments/domain/comment-locator';
import { compareCommentRootEvidence } from '@services/comments/locator/comment-root-evidence';
import { createCommentDomTextIndex } from '@services/comments/locator/dom-text-index';
import { resolveV1CommentAnchor } from '@services/comments/locator/resolve-v1-comment-anchor';
import { resolveV2ByPathOrPosition } from '@services/comments/locator/resolve-v2-by-path';
import { resolveV2ByQuoteContext } from '@services/comments/locator/resolve-v2-by-quote';

export type ResolveCommentAnchorResult =
  | { ok: true; range: Range; root: Element; rootIndex: number }
  | { ok: false; reason: ArticleCommentAnchorResolveReason | 'aborted' | 'ambiguous_root' };

export function resolveCommentAnchor(input: {
  locator: ArticleCommentLocator;
  roots: readonly Element[];
  signal?: AbortSignal;
  generation?: number;
  isGenerationCurrent?: (generation: number) => boolean;
  maxRoots?: number;
  maxTotalTextLength?: number;
}): ResolveCommentAnchorResult {
  const maxRoots = Math.max(1, Math.floor(Number(input.maxRoots ?? 8) || 1));
  const maxTotalTextLength = Math.max(0, Math.floor(Number(input.maxTotalTextLength ?? 400_000) || 0));
  if (input.roots.length > maxRoots) return { ok: false, reason: 'budget_exceeded' };

  const candidates: Array<{ range: Range; root: Element; rootIndex: number; signature: string }> = [];
  let scanned = 0;
  for (let rootIndex = 0; rootIndex < input.roots.length; rootIndex += 1) {
    if (input.signal?.aborted) return { ok: false, reason: 'aborted' };
    if (input.generation != null && input.isGenerationCurrent && !input.isGenerationCurrent(input.generation)) {
      return { ok: false, reason: 'aborted' };
    }
    const root = input.roots[rootIndex]!;
    const index = createCommentDomTextIndex(root);
    scanned += index.text.length;
    if (scanned > maxTotalTextLength) return { ok: false, reason: 'budget_exceeded' };

    const ranges: Range[] = [];
    if (input.locator.v === 1) {
      const range = resolveV1CommentAnchor({ root, locator: input.locator });
      if (range) ranges.push(range);
    } else if (compareCommentRootEvidence(root, input.locator.rootEvidence) === 'matched') {
      const path = resolveV2ByPathOrPosition({ root, locator: input.locator });
      if (path) ranges.push(path.range);
      const quote = resolveV2ByQuoteContext({ root, locator: input.locator });
      if (quote.ok) ranges.push(quote.range);
    }

    for (const range of ranges) {
      const offsets = index.rangeToOffsets(range);
      if (!offsets) continue;
      const signature = `${rootIndex}:${offsets.start}:${offsets.end}`;
      if (!candidates.some((candidate) => candidate.signature === signature)) {
        candidates.push({ range, root, rootIndex, signature });
      }
    }
  }

  if (!candidates.length) return { ok: false, reason: 'quote_not_found' };
  if (candidates.length !== 1) return { ok: false, reason: 'ambiguous_root' };
  const [candidate] = candidates;
  return { ok: true, range: candidate.range, root: candidate.root, rootIndex: candidate.rootIndex };
}
