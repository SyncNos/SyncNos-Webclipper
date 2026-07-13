import type { ArticleCommentLocatorV2 } from '@services/comments/domain/comment-locator';
import { createCommentDomTextIndex } from '@services/comments/locator/dom-text-index';

export type ResolveV2QuoteResult =
  | { ok: true; range: Range; start: number; end: number }
  | { ok: false; reason: 'quote_not_found' | 'ambiguous_quote' | 'budget_exceeded' };

export function resolveV2ByQuoteContext(input: {
  root: Element;
  locator: ArticleCommentLocatorV2;
  maxMatches?: number;
  maxTextLength?: number;
}): ResolveV2QuoteResult {
  const index = createCommentDomTextIndex(input.root);
  const maxTextLength = Math.max(0, Math.floor(Number(input.maxTextLength ?? 200_000) || 0));
  if (index.text.length > maxTextLength) return { ok: false, reason: 'budget_exceeded' };

  const exact = input.locator.quote.exact;
  const maxMatches = Math.max(1, Math.floor(Number(input.maxMatches ?? 32) || 1));
  const matches: Array<{ start: number; end: number }> = [];
  let cursor = 0;
  while (cursor <= index.text.length - exact.length) {
    const start = index.text.indexOf(exact, cursor);
    if (start < 0) break;
    const end = start + exact.length;
    const prefix = input.locator.quote.prefix || '';
    const suffix = input.locator.quote.suffix || '';
    const prefixMatches = !prefix || index.text.slice(Math.max(0, start - prefix.length), start) === prefix;
    const suffixMatches = !suffix || index.text.slice(end, end + suffix.length) === suffix;
    if (prefixMatches && suffixMatches) matches.push({ start, end });
    if (matches.length > maxMatches) return { ok: false, reason: 'budget_exceeded' };
    cursor = start + Math.max(1, exact.length);
  }

  if (!matches.length) return { ok: false, reason: 'quote_not_found' };
  if (matches.length !== 1) return { ok: false, reason: 'ambiguous_quote' };
  const [match] = matches;
  const range = index.offsetsToRange(match.start, match.end);
  return range ? { ok: true, range, ...match } : { ok: false, reason: 'quote_not_found' };
}
