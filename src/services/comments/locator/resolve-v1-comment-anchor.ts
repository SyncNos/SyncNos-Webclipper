import TextPositionAnchor from 'dom-anchor-text-position';
import TextQuoteAnchor from 'dom-anchor-text-quote';

import type { ArticleCommentLocatorV1 } from '@services/comments/domain/comment-locator';

export function normalizeV1CommentAnchorText(value: unknown): string {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/(?:\u200b|\u200c|\u200d|\ufeff)/g, '')
    .replace(/[ \t\n]+/g, ' ')
    .trim();
}

function exactMatches(range: Range, exact: string): boolean {
  const expected = normalizeV1CommentAnchorText(exact);
  if (!expected) return true;
  return normalizeV1CommentAnchorText(range.toString()) === expected;
}

export function resolveV1CommentAnchor(input: { root: Element; locator: ArticleCommentLocatorV1 }): Range | null {
  const { root, locator } = input;
  const hint = locator.position.start;
  const attempts: Array<() => Range | null> = [
    () => {
      const anchor = (TextQuoteAnchor as any).fromSelector(root, locator.quote);
      return (anchor as any).toRange?.({ hint }) || null;
    },
    () => (TextPositionAnchor as any).toRange?.(root, locator.position) || null,
  ];
  for (const attempt of attempts) {
    try {
      const range = attempt();
      if (range && exactMatches(range, locator.quote.exact)) return range;
    } catch (_error) {
      // Try the next historical exact strategy.
    }
  }
  return null;
}
