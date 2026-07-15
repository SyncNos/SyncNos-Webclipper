import type { ArticleCommentLocatorV2 } from '@services/comments/domain/comment-locator';
import { createCommentDomTextIndex, type CommentDomTextIndex } from '@services/comments/locator/dom-text-index';

export type ResolveV2QuoteResult =
  | { ok: true; range: Range; start: number; end: number }
  | { ok: false; reason: 'quote_not_found' | 'ambiguous_quote' | 'budget_exceeded' };

export type CommentExactQuoteMatch = { range: Range; start: number; end: number };

export type CollectV2ExactQuoteMatchesResult =
  | { ok: true; matches: CommentExactQuoteMatch[] }
  | { ok: false; reason: 'budget_exceeded' };

export function collectV2ExactQuoteMatches(input: {
  root: Element;
  locator: ArticleCommentLocatorV2;
  maxMatches?: number;
  maxTextLength?: number;
  index?: CommentDomTextIndex;
}): CollectV2ExactQuoteMatchesResult {
  const index = input.index?.root === input.root ? input.index : createCommentDomTextIndex(input.root);
  const maxTextLength = Math.max(0, Math.floor(Number(input.maxTextLength ?? 200_000) || 0));
  if (index.text.length > maxTextLength) return { ok: false, reason: 'budget_exceeded' };

  const exact = input.locator.quote.exact;
  const maxMatches = Math.max(1, Math.floor(Number(input.maxMatches ?? 32) || 1));
  const matches: CommentExactQuoteMatch[] = [];
  let cursor = 0;
  while (cursor <= index.text.length - exact.length) {
    const start = index.text.indexOf(exact, cursor);
    if (start < 0) break;
    const end = start + exact.length;
    const range = index.offsetsToRange(start, end);
    if (range) matches.push({ range, start, end });
    if (matches.length > maxMatches) return { ok: false, reason: 'budget_exceeded' };
    cursor = start + Math.max(1, exact.length);
  }

  return { ok: true, matches };
}

export function resolveV2ByQuoteContext(input: {
  root: Element;
  locator: ArticleCommentLocatorV2;
  maxMatches?: number;
  maxTextLength?: number;
  index?: CommentDomTextIndex;
}): ResolveV2QuoteResult {
  const index = input.index?.root === input.root ? input.index : createCommentDomTextIndex(input.root);
  const collected = collectV2ExactQuoteMatches({ ...input, index });
  if (!collected.ok) return collected;

  const matches = collected.matches.filter(({ start, end }) => {
    const prefix = input.locator.quote.prefix || '';
    const suffix = input.locator.quote.suffix || '';
    const prefixMatches = !prefix || index.text.slice(Math.max(0, start - prefix.length), start) === prefix;
    const suffixMatches = !suffix || index.text.slice(end, end + suffix.length) === suffix;
    return prefixMatches && suffixMatches;
  });

  if (!matches.length) return { ok: false, reason: 'quote_not_found' };
  if (matches.length !== 1) return { ok: false, reason: 'ambiguous_quote' };
  const [match] = matches;
  return { ok: true, range: match.range, start: match.start, end: match.end };
}
