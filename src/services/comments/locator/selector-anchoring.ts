import TextPositionAnchor from 'dom-anchor-text-position';
import TextQuoteAnchor from 'dom-anchor-text-quote';

import type { ArticleCommentLocator, ArticleCommentLocatorEnv } from '@services/comments/domain/models';

function isLocatorDebugEnabled(): boolean {
  const anyGlobal = globalThis as any;
  if (anyGlobal.__SYNCNOS_DEBUG_COMMENTS_SELECTION__ === true) return true;
  try {
    return String(anyGlobal.localStorage?.getItem?.('__SYNCNOS_DEBUG_COMMENTS_SELECTION__') || '') === '1';
  } catch (_e) {
    return false;
  }
}

function debugLocator(event: string, payload: Record<string, unknown>) {
  if (!isLocatorDebugEnabled()) return;
  try {
    console.log('[CommentsLocator]', event, payload);
  } catch (_e) {
    // ignore
  }
}

function normalizeAnchorText(text: unknown): string {
  const raw = String(text ?? '');
  if (!raw) return '';
  return raw
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/(?:\u200b|\u200c|\u200d|\ufeff)/g, '')
    .replace(/[ \t\n]+/g, ' ')
    .trim();
}

function rangeTextMatchesExact(range: Range, expectedExact: string): boolean {
  const expected = normalizeAnchorText(expectedExact);
  if (!expected) return true;
  const actual = normalizeAnchorText((range as any).toString?.());
  return actual === expected;
}

export function buildArticleCommentLocatorFromRange(input: {
  env: ArticleCommentLocatorEnv;
  root: Element;
  range: Range;
}): ArticleCommentLocator | null {
  const env = input.env;
  const root = input.root;
  const range = input.range;

  if (!root || typeof (root as any).querySelector !== 'function') return null;
  if (!range || typeof (range as any).cloneRange !== 'function') return null;

  try {
    const quoteAnchor = TextQuoteAnchor.fromRange(root, range);
    const quote = (quoteAnchor as any)?.toSelector?.();
    const positionFromRange = (TextPositionAnchor as any)?.fromRange?.(root, range);
    const positionFromQuote = (quoteAnchor as any)?.toPositionAnchor?.()?.toSelector?.();
    const position =
      (positionFromRange &&
      typeof positionFromRange === 'object' &&
      typeof (positionFromRange as any).start === 'number' &&
      typeof (positionFromRange as any).end === 'number' &&
      Number.isFinite((positionFromRange as any).start) &&
      Number.isFinite((positionFromRange as any).end)
        ? { type: 'TextPositionSelector', start: (positionFromRange as any).start, end: (positionFromRange as any).end }
        : null) ?? positionFromQuote;

    if (!quote || typeof quote !== 'object') {
      debugLocator('build_locator_invalid_quote', {
        env,
        quoteType: typeof quote,
        quoteAnchorType: quoteAnchor ? typeof quoteAnchor : 'null',
      });
      return null;
    }
    if (!position || typeof position !== 'object') {
      debugLocator('build_locator_invalid_position', {
        env,
        positionType: typeof position,
        positionFromRangeType: positionFromRange ? typeof positionFromRange : 'null',
        positionFromQuoteType: positionFromQuote ? typeof positionFromQuote : 'null',
      });
      return null;
    }

    return {
      v: 1,
      env,
      quote: quote as any,
      position: position as any,
    };
  } catch (e) {
    debugLocator('build_locator_failed', {
      env,
      error: e instanceof Error ? e.message : String(e || ''),
      rootTag: String((root as any)?.tagName || ''),
      rootTextLen: Number(String((root as any)?.textContent || '').length) || 0,
      rangeTextLen: Number(String((range as any)?.toString?.() || '').length) || 0,
    });
    return null;
  }
}

export function restoreRangeFromArticleCommentLocator(input: {
  root: Element;
  locator: ArticleCommentLocator;
}): Range | null {
  const root = input.root;
  const locator = input.locator;

  if (!root || typeof (root as any).querySelector !== 'function') return null;
  if (!locator || typeof locator !== 'object') return null;

  const quoteSelector = (locator as any).quote;
  if (!quoteSelector || typeof quoteSelector !== 'object') return null;

  const hint = Number((locator as any)?.position?.start);
  const expectedExact = String((quoteSelector as any)?.exact || '');

  const attempts: Array<() => Range | null> = [];
  attempts.push(() => {
    const anchor = (TextQuoteAnchor as any).fromSelector(root, quoteSelector);
    const range = (anchor as any).toRange?.(Number.isFinite(hint) ? { hint } : undefined);
    return range ? (range as Range) : null;
  });

  const positionSelector = (locator as any).position;
  if (positionSelector && typeof positionSelector === 'object') {
    attempts.push(() => {
      const range = (TextPositionAnchor as any).toRange?.(root, positionSelector);
      return range ? (range as Range) : null;
    });
  }

  for (const buildRange of attempts) {
    try {
      const range = buildRange();
      if (!range) continue;
      if (!rangeTextMatchesExact(range, expectedExact)) continue;
      return range;
    } catch (_e) {
      // ignore and fallback
    }
  }

  return null;
}
