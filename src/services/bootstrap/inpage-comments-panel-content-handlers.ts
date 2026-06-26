import { CONTENT_MESSAGE_TYPES } from '@platform/messaging/message-contracts';
import { createCommentSidebarSession } from '@services/comments/sidebar/comment-sidebar-session';
import { createArticleCommentsSidebarController } from '@services/comments/sidebar/article-comments-sidebar-controller';
import { createArticleCommentsSidebarInpageAdapter } from '@services/comments/sidebar/article-comments-sidebar-inpage-adapter';
import { buildArticleCommentLocatorFromRange } from '@services/comments/locator';
import { normalizePositiveInt } from '@services/shared/numbers';
import {
  extractSelectionText,
  extractUserSelectionText,
  isSelectionLikelyWithinRoot,
} from '@services/shared/dom/selection';
import { canonicalizeArticleUrl } from '@services/url-cleaning/http-url';
import type { CommentSidebarPanelApi } from '@services/comments/sidebar/comment-sidebar-contract';

type RuntimeClient = {
  send?: (type: string, payload?: Record<string, unknown>) => Promise<any>;
};

function isSelectionWithinLocatorRoot(selection: Selection | null, locatorRoot: Element | null): boolean {
  return isSelectionLikelyWithinRoot(selection, locatorRoot);
}

function pickQuoteFromSelection(): { text: string; method: string; rangeCount: number } {
  try {
    const selection = globalThis.getSelection?.();
    const rangeCount = Number((selection as any)?.rangeCount || 0) || 0;
    const locatorRoot = document.body || document.documentElement;
    if (!isSelectionWithinLocatorRoot(selection || null, locatorRoot)) {
      // Still allow quoting when the selection is within an active iframe (common for reader views),
      // but do not attempt locator building for cross-document ranges.
      const extractedFromUser = extractUserSelectionText({ trim: true, maxLen: 4000 });
      if (extractedFromUser.text) return { text: extractedFromUser.text, method: extractedFromUser.method, rangeCount };
      return { text: '', method: 'none', rangeCount };
    }
    const extracted = extractSelectionText(selection || null, { trim: true, maxLen: 4000 });
    if (extracted.text) return { text: extracted.text, method: extracted.method, rangeCount };
    const fallback = extractUserSelectionText({ trim: true, maxLen: 4000 });
    return { text: fallback.text, method: fallback.text ? fallback.method : extracted.method, rangeCount };
  } catch (_e) {
    return { text: '', method: 'none', rangeCount: 0 };
  }
}

function debugSelection(event: string, payload: Record<string, unknown>) {
  const anyGlobal = globalThis as any;
  const enabled =
    anyGlobal.__SYNCNOS_DEBUG_COMMENTS_SELECTION__ === true ||
    (() => {
      try {
        const storage = anyGlobal.window?.localStorage;
        return String(storage?.getItem?.('__SYNCNOS_DEBUG_COMMENTS_SELECTION__') || '') === '1';
      } catch (_e) {
        return false;
      }
    })();
  if (!enabled) return;
  try {
    console.log('[CommentsSelection][inpage]', event, payload);
  } catch (_e) {
    // ignore
  }
}

function pickLocatorFromSelection(): any | null {
  try {
    const selection = globalThis.getSelection?.();
    if (!selection || selection.rangeCount <= 0) return null;
    const locatorRoot = document.body || document.documentElement;
    if (!isSelectionWithinLocatorRoot(selection, locatorRoot)) return null;
    const range = selection.getRangeAt(0);
    const text = extractSelectionText(selection, { trim: true, maxLen: 4000 }).text;
    if (!text) return null;
    return buildArticleCommentLocatorFromRange({
      env: 'inpage',
      root: locatorRoot,
      range,
    });
  } catch (_e) {
    return null;
  }
}

function resolveInpageSelectionPayload(): {
  selectionText: string;
  locator: any | null;
} {
  const selection = pickQuoteFromSelection();
  const selectionText = selection.text;
  if (!selectionText) {
    let anchorNodeType: number | null = null;
    let focusNodeType: number | null = null;
    try {
      const sel = globalThis.getSelection?.();
      anchorNodeType = typeof (sel as any)?.anchorNode?.nodeType === 'number' ? (sel as any).anchorNode.nodeType : null;
      focusNodeType = typeof (sel as any)?.focusNode?.nodeType === 'number' ? (sel as any).focusNode.nodeType : null;
    } catch (_e) {
      // ignore
    }
    debugSelection('resolve_selection', {
      ok: false,
      reason: 'empty_text',
      selectionRangeCount: selection.rangeCount,
      selectionTextMethod: selection.method,
      anchorNodeType,
      focusNodeType,
    });
    return { selectionText: '', locator: null };
  }
  const locator = pickLocatorFromSelection();
  debugSelection('resolve_selection', {
    ok: true,
    selectionTextLen: selectionText.length,
    locatorOk: Boolean(locator),
  });
  return {
    selectionText,
    locator,
  };
}

export type InpageCommentsPanelController = {
  open: (input?: { tabId?: number | null; focusComposer?: boolean; ensureArticle?: boolean }) => Promise<void>;
};

export type InpageCommentsPanelDeps = {
  // Injected from the entrypoint (UI layer) so that `services` never imports `ui`
  // directly, preserving the one-way layering rule in AGENTS.md.
  createPanelApi: (runtime: RuntimeClient | null) => CommentSidebarPanelApi;
};

export function createInpageCommentsPanelController(
  runtime: RuntimeClient | null,
  deps: InpageCommentsPanelDeps,
): InpageCommentsPanelController {
  const sidebarSession = createCommentSidebarSession(deps.createPanelApi(runtime));
  const controller = createArticleCommentsSidebarController({
    session: sidebarSession,
    adapter: createArticleCommentsSidebarInpageAdapter(runtime),
    resolveComposerSelection: () => resolveInpageSelectionPayload(),
  });

  let lastTabId: number | null = null;

  async function open(input?: { tabId?: number | null; focusComposer?: boolean; ensureArticle?: boolean }) {
    // Only handle on top frame to avoid duplicate panels.
    try {
      if (globalThis.top && globalThis.top !== globalThis.self) return;
    } catch (_e) {
      // ignore
    }

    lastTabId = normalizePositiveInt(input?.tabId) || lastTabId;
    const ensureArticle = input?.ensureArticle !== false;

    await controller.open({
      focusComposer: input?.focusComposer === true,
      source: 'inpage',
      ensureContext: true,
      ensureContextInput: {
        tabId: lastTabId,
        canonicalUrlFallback: canonicalizeArticleUrl(location.href),
        ensureArticle,
      },
    });
  }

  return { open };
}

export function registerInpageCommentsPanelContentHandlers(
  runtime: RuntimeClient | null,
  deps: InpageCommentsPanelDeps,
) {
  const onMessage = (globalThis as any).chrome?.runtime?.onMessage ?? (globalThis as any).browser?.runtime?.onMessage;
  if (!onMessage?.addListener)
    return { controller: createInpageCommentsPanelController(runtime, deps), cleanup: () => {} };

  const controller = createInpageCommentsPanelController(runtime, deps);

  const listener = (msg: any, _sender: any, sendResponse: (value: any) => void) => {
    if (!msg || typeof msg.type !== 'string') return undefined;
    if (msg.type !== CONTENT_MESSAGE_TYPES.OPEN_INPAGE_COMMENTS_PANEL) return undefined;

    void controller
      .open({
        tabId: normalizePositiveInt(msg?.payload?.tabId) || null,
        focusComposer: true,
        ensureArticle: true,
      })
      .finally(() => {
        sendResponse?.({ ok: true });
      });

    return true;
  };

  onMessage.addListener(listener);

  const cleanup = () => {
    try {
      onMessage.removeListener?.(listener);
    } catch (_e) {
      // ignore
    }
  };

  return { controller, cleanup };
}
