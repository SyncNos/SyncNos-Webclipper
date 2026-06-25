import { restoreRangeFromArticleCommentLocator } from '@services/comments/locator';
import type { ArticleCommentLocator } from '@services/comments/domain/models';
import type { ThreadedCommentItem } from './types';

const LOCATE_HIGHLIGHT_ATTR = 'data-webclipper-locate-highlight';
const LOCATE_HIGHLIGHT_STYLE_ID = 'webclipper-comments-locate-highlight-style';
const LOCATE_HIGHLIGHT_RADIUS = 'var(--radius-inline, 10px)';

type ThreadLocateControllerOptions = {
  locatorEnv: 'inpage' | 'app' | null;
  pickLocatorRoot: () => Element | null;
};

type LocatorLike = {
  env?: unknown;
  quote?: unknown;
  hintStart?: unknown;
  textOffset?: unknown;
  start?: unknown;
  position?: {
    start?: unknown;
  } | null;
};

function isLocateDebugEnabled(): boolean {
  const anyGlobal = globalThis as any;
  if (anyGlobal.__SYNCNOS_DEBUG_COMMENTS_SELECTION__ === true) return true;
  try {
    const storage = anyGlobal.window?.localStorage;
    return String(storage?.getItem?.('__SYNCNOS_DEBUG_COMMENTS_SELECTION__') || '') === '1';
  } catch (_e) {
    return false;
  }
}

function debugLocate(event: string, payload: Record<string, unknown>) {
  if (!isLocateDebugEnabled()) return;
  try {
    console.log('[CommentsLocate]', event, payload);
  } catch (_e) {
    // ignore
  }
}

function readLocator(value: unknown): LocatorLike | null {
  if (!value || typeof value !== 'object') return null;
  return value as LocatorLike;
}

function readLocatorEnv(value: unknown): string {
  return String(readLocator(value)?.env || '').trim();
}

function isArticleCommentLocator(value: unknown): value is ArticleCommentLocator {
  const locator = readLocator(value);
  if (!locator) return false;
  return typeof locator.env === 'string' && !!locator.quote && typeof locator.quote === 'object';
}

function pickRangeTargetElement(range: Range): HTMLElement | null {
  const node = range.startContainer;
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) {
    return node.parentElement as HTMLElement | null;
  }
  return node instanceof HTMLElement ? node : null;
}

function ensureLocateHighlightStyle() {
  try {
    if (document.getElementById(LOCATE_HIGHLIGHT_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = LOCATE_HIGHLIGHT_STYLE_ID;
    style.textContent = [
      `[${LOCATE_HIGHLIGHT_ATTR}="1"] {`,
      '  outline: 2px solid rgba(79, 156, 255, 0.95) !important;',
      '  outline-offset: 2px !important;',
      `  border-radius: ${LOCATE_HIGHLIGHT_RADIUS} !important;`,
      '  background-color: rgba(79, 156, 255, 0.12) !important;',
      '  transition: background-color 200ms ease, outline-color 200ms ease !important;',
      '}',
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  } catch (_e) {
    // ignore
  }
}

function createLocateHighlighter() {
  let lastEl: HTMLElement | null = null;
  let timer: ReturnType<typeof setTimeout> | 0 = 0;

  const clear = () => {
    if (timer) clearTimeout(timer);
    timer = 0;
    if (lastEl) {
      try {
        lastEl.removeAttribute(LOCATE_HIGHLIGHT_ATTR);
      } catch (_e) {
        // ignore
      }
    }
    lastEl = null;
  };

  const flash = (el: HTMLElement) => {
    if (!el) return;
    ensureLocateHighlightStyle();

    if (lastEl && lastEl !== el) {
      try {
        lastEl.removeAttribute(LOCATE_HIGHLIGHT_ATTR);
      } catch (_e) {
        // ignore
      }
    }

    try {
      el.setAttribute(LOCATE_HIGHLIGHT_ATTR, '1');
      lastEl = el;
    } catch (_e) {
      // ignore
    }

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        el.removeAttribute(LOCATE_HIGHLIGHT_ATTR);
      } catch (_e) {
        // ignore
      }
      if (lastEl === el) lastEl = null;
    }, 1400);
  };

  return { flash, clear };
}

function scrollRangeIntoView(range: Range, highlighter?: { flash: (el: HTMLElement) => void }): boolean {
  const el = pickRangeTargetElement(range);
  if (!el) return false;
  try {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  } catch (_e) {
    try {
      el.scrollIntoView({ block: 'center', inline: 'nearest' });
    } catch (_e2) {
      // ignore
    }
  }
  highlighter?.flash(el);
  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readLocatorHint(locator: unknown): number | null {
  const candidate = readLocator(locator);
  const candidates = [candidate?.hintStart, candidate?.textOffset, candidate?.start, candidate?.position?.start];
  for (const value of candidates) {
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0) return Math.round(n);
  }
  return null;
}

function pickBestScrollContainer(rootEl: Element): HTMLElement | null {
  const candidates: HTMLElement[] = [];
  const pushIf = (el: Element | null | undefined) => {
    if (!el || !(el instanceof HTMLElement)) return;
    candidates.push(el);
  };

  pushIf(rootEl);
  try {
    pushIf(rootEl.closest('.route-scroll'));
    pushIf(rootEl.closest('.captured-list-sidebar'));
    pushIf(document.querySelector('.route-scroll'));
    pushIf(document.scrollingElement);
    pushIf(document.documentElement);
    pushIf(document.body);
  } catch (_e) {
    // ignore
  }

  const seen = new Set<HTMLElement>();
  for (const el of candidates) {
    if (!el || seen.has(el)) continue;
    seen.add(el);
    return el;
  }
  return null;
}

function nudgeScrollTowardsHint(hint: number, rootEl: Element): void {
  const scroller = pickBestScrollContainer(rootEl);
  if (!scroller) return;

  const maxScroll = Math.max(0, Number(scroller.scrollHeight || 0) - Number(scroller.clientHeight || 0));
  if (!Number.isFinite(maxScroll) || maxScroll <= 0) return;

  const textLength = Math.max(0, Number(String(rootEl.textContent || '').length) || 0);
  const ratio = textLength > 0 ? Math.max(0, Math.min(1, hint / textLength)) : 1;
  const nextTop = Math.round(maxScroll * ratio);

  try {
    scroller.scrollTop = nextTop;
  } catch (_e) {
    // ignore
  }
}

export function createThreadLocateController(options: ThreadLocateControllerOptions) {
  const locateHighlighter = createLocateHighlighter();

  type LocateAttemptResult = { ok: true } | { ok: false; reason: string; extra?: Record<string, unknown> | null };

  function locateThreadRootOnce(rootItem: ThreadedCommentItem, rootEl: Element): LocateAttemptResult {
    const locator = rootItem?.locator;
    if (!isArticleCommentLocator(locator)) {
      return { ok: false, reason: 'invalid_locator' };
    }

    const env = readLocatorEnv(locator);
    const expectedEnv = String(options.locatorEnv || '').trim();
    if (!expectedEnv) return { ok: false, reason: 'missing_expected_env' };
    if (env !== expectedEnv) return { ok: false, reason: 'env_mismatch', extra: { env, expectedEnv } };

    try {
      const range = restoreRangeFromArticleCommentLocator({ root: rootEl, locator });
      if (!range) {
        return {
          ok: false,
          reason: 'restore_range_failed',
          extra: {
            hasQuoteExact: Boolean(String((locator as any)?.quote?.exact || '').trim()),
            hintStart: readLocatorHint(locator),
          },
        };
      }
      const scrolled = scrollRangeIntoView(range, locateHighlighter);
      return scrolled ? { ok: true } : { ok: false, reason: 'scroll_failed' };
    } catch (_e) {
      return { ok: false, reason: 'exception' };
    }
  }

  const locateThreadRootWithRetry = async (rootItem: ThreadedCommentItem): Promise<boolean> => {
    const locator = rootItem?.locator;
    if (!isArticleCommentLocator(locator)) {
      debugLocate('locate_rejected', { reason: 'invalid_locator' });
      return false;
    }

    const env = readLocatorEnv(locator);
    const expectedEnv = String(options.locatorEnv || '').trim();
    if (!expectedEnv) {
      debugLocate('locate_rejected', { reason: 'missing_expected_env' });
      return false;
    }
    if (env !== expectedEnv) {
      debugLocate('locate_rejected', { reason: 'env_mismatch', env, expectedEnv });
      return false;
    }

    const pickedRoot = options.pickLocatorRoot();
    if (expectedEnv === 'app' && !pickedRoot) {
      debugLocate('locate_rejected', { reason: 'missing_locator_root', expectedEnv });
      return false;
    }
    const rootEl = pickedRoot || document.body || document.documentElement;
    if (!rootEl) return false;

    const attempt1 = locateThreadRootOnce(rootItem, rootEl);
    if (attempt1.ok) return true;
    debugLocate('locate_attempt_failed', { attempt: 1, reason: attempt1.reason, extra: attempt1.extra || null });

    const hint = readLocatorHint(locator);
    if (hint != null) nudgeScrollTowardsHint(hint, rootEl);

    await sleep(120);
    const attempt2 = locateThreadRootOnce(rootItem, rootEl);
    if (attempt2.ok) return true;
    debugLocate('locate_attempt_failed', { attempt: 2, reason: attempt2.reason, extra: attempt2.extra || null });

    await sleep(260);
    const attempt3 = locateThreadRootOnce(rootItem, rootEl);
    if (!attempt3.ok) {
      debugLocate('locate_attempt_failed', { attempt: 3, reason: attempt3.reason, extra: attempt3.extra || null });
    }
    return attempt3.ok;
  };

  return {
    locateThreadRootWithRetry,
    clear: () => locateHighlighter.clear(),
  };
}
