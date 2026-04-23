import type {
  CommentSidebarHandlers,
  CommentSidebarComposerSelectionRequest,
  CommentSidebarSession,
} from '@services/comments/sidebar/comment-sidebar-contract';
import { normalizeCommentSidebarQuoteText } from '@services/comments/sidebar/comment-sidebar-session';
import type { ArticleCommentLocator } from '@services/comments/domain/models';
import { normalizePositiveInt } from '@services/shared/numbers';

import type {
  CommentsSidebarAdapter,
  CommentsSidebarContext,
  CommentsSidebarEnsureContextInput,
} from '@services/comments/sidebar/comments-sidebar-adapter';

export type CommentsSidebarControllerOpenInput = {
  selectionText?: string | null;
  locator?: unknown;
  focusComposer?: boolean;
  source?: string;
  ensureContext?: boolean;
  ensureContextInput?: CommentsSidebarEnsureContextInput;
};

export type CommentsSidebarControllerComposerSelectionPayload = {
  selectionText?: string | null;
  locator?: unknown;
};

export type CommentsSidebarController = {
  open: (input?: CommentsSidebarControllerOpenInput) => Promise<void>;
  refresh: () => Promise<void>;
  getContext: () => CommentsSidebarContext | null;
  setContext: (context: CommentsSidebarContext | null) => void;
};

function safeString(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeConversationId(value: unknown): number | null {
  return normalizePositiveInt(value);
}

function normalizeLocator(locator: unknown): ArticleCommentLocator | null {
  if (!locator || typeof locator !== 'object') return null;
  return locator as ArticleCommentLocator;
}

function normalizeContext(next: CommentsSidebarContext): CommentsSidebarContext {
  return {
    commentTargetKey: safeString(next.commentTargetKey),
    conversationId: normalizeConversationId(next.conversationId),
    canonicalUrl: safeString(next.canonicalUrl) || null,
  };
}

function buildContextKey(context: CommentsSidebarContext | null): string {
  if (!context) return '';
  const targetKey = safeString(context.commentTargetKey);
  const conversationId = normalizeConversationId(context.conversationId);
  if (!targetKey && !conversationId) return '';
  return `${targetKey}#${conversationId ?? ''}`;
}

function isUrlTargetKey(key: string): boolean {
  return safeString(key).startsWith('url:');
}

function urlFromTargetKey(key: string): string {
  const text = safeString(key);
  if (!text.startsWith('url:')) return '';
  return text.slice('url:'.length);
}

export function createCommentsSidebarController(input: {
  session: CommentSidebarSession;
  adapter: CommentsSidebarAdapter;
  onClose?: () => void;
  resolveComposerSelection?: (
    request: CommentSidebarComposerSelectionRequest,
  ) =>
    | CommentsSidebarControllerComposerSelectionPayload
    | null
    | undefined
    | Promise<CommentsSidebarControllerComposerSelectionPayload | null | undefined>;
}): CommentsSidebarController {
  const session = input.session;
  const adapter = input.adapter;
  const onClose = input.onClose;

  let activeContext: CommentsSidebarContext | null = null;
  let lastEnsureContextInput: CommentsSidebarEnsureContextInput | undefined;
  let pendingRootLocator: ArticleCommentLocator | null = null;
  let refreshRunId = 0;
  let composerSelectionRequestSeq = 0;

  const applyComposerSelection = (payload?: CommentsSidebarControllerComposerSelectionPayload | null) => {
    const quoteText = normalizeCommentSidebarQuoteText(payload?.selectionText);
    if (!quoteText) return;
    session.setQuoteText(quoteText);
    pendingRootLocator = normalizeLocator(payload?.locator);
  };

  const ensureContext = async (
    ensure: boolean,
    ensureInput?: CommentsSidebarEnsureContextInput,
  ): Promise<CommentsSidebarContext | null> => {
    if (ensureInput) lastEnsureContextInput = ensureInput;
    if (!ensure || typeof adapter.ensureContext !== 'function') return activeContext;
    const resolved = await adapter.ensureContext(lastEnsureContextInput);
    activeContext = normalizeContext(resolved);
    return activeContext;
  };

  const getContextKey = () => buildContextKey(activeContext);

  const refresh = async (options?: { manageBusy?: boolean }) => {
    const manageBusy = options?.manageBusy !== false;
    const runId = ++refreshRunId;
    const contextKeyAtStart = getContextKey();
    const targetKey = safeString(activeContext?.commentTargetKey);
    const conversationId = normalizeConversationId(activeContext?.conversationId);
    if (!targetKey && !conversationId) {
      session.setComments([]);
      return;
    }
    if (manageBusy) session.setBusy(true);
    try {
      const items = await adapter.list({
        commentTargetKey: targetKey,
        conversationId,
        canonicalUrlFallback: safeString(activeContext?.canonicalUrl) || null,
      });
      if (runId !== refreshRunId || contextKeyAtStart !== getContextKey()) return;
      session.setComments(Array.isArray(items) ? items : []);
    } catch (_e) {
      if (runId !== refreshRunId || contextKeyAtStart !== getContextKey()) return;
      session.setComments([]);
    } finally {
      if (manageBusy && runId === refreshRunId) session.setBusy(false);
    }
  };

  const ensureContextForAction = async () => {
    const targetKey = safeString(activeContext?.commentTargetKey);
    const canonicalUrl = urlFromTargetKey(targetKey) || safeString(activeContext?.canonicalUrl);
    if (canonicalUrl) return activeContext;
    await ensureContext(true);
    return activeContext;
  };

  const installHandlers = () => {
    const handlers: CommentSidebarHandlers = {
      onClose: () => {
        try {
          onClose?.();
        } catch (_e) {
          // ignore
        }
      },
      onSave: async (text) => {
        const value = safeString(text);
        if (!value) return false;

        const ctx = await ensureContextForAction();
        const targetKey = safeString(ctx?.commentTargetKey);
        const canonicalUrl = urlFromTargetKey(targetKey) || safeString(ctx?.canonicalUrl);
        if (!canonicalUrl) throw new Error('missing canonicalUrl for comment save');

        const quoteText = normalizeCommentSidebarQuoteText(session.getSnapshot().quoteText);
        const created = await adapter.addRoot({
          commentTargetKey: targetKey,
          canonicalUrl,
          conversationId: normalizeConversationId(ctx?.conversationId),
          quoteText,
          commentText: value,
          locator: quoteText && pendingRootLocator ? pendingRootLocator : null,
        });
        composerSelectionRequestSeq += 1;
        session.setQuoteText('');
        pendingRootLocator = null;
        await refresh();
        const createdRootId = Number(created?.id);
        return { ok: true, createdRootId: Number.isFinite(createdRootId) && createdRootId > 0 ? createdRootId : null };
      },
      onReply: async (parentId, text) => {
        const value = safeString(text);
        if (!value) return;
        const id = Number(parentId);
        if (!Number.isFinite(id) || id <= 0) return;

        const ctx = await ensureContextForAction();
        const targetKey = safeString(ctx?.commentTargetKey);
        const canonicalUrl = urlFromTargetKey(targetKey) || safeString(ctx?.canonicalUrl);
        if (!canonicalUrl) throw new Error('missing canonicalUrl for comment reply');

        await adapter.addReply({
          commentTargetKey: targetKey,
          canonicalUrl,
          conversationId: normalizeConversationId(ctx?.conversationId),
          parentId: id,
          commentText: value,
        });
        await refresh();
      },
      onDelete: async (id) => {
        const commentId = Number(id);
        if (!Number.isFinite(commentId) || commentId <= 0) return;
        await adapter.delete({ id: commentId });
        await refresh();
      },
      onComposerSelectionRequest: async (request) => {
        const resolveComposerSelection = input.resolveComposerSelection;
        if (typeof resolveComposerSelection !== 'function') return;
        const requestSeq = ++composerSelectionRequestSeq;
        const applyIfLatest = (payload: CommentsSidebarControllerComposerSelectionPayload | null | undefined) => {
          if (requestSeq !== composerSelectionRequestSeq) return;
          applyComposerSelection(payload);
        };
        try {
          const resolved = resolveComposerSelection(request);
          if (resolved && typeof (resolved as PromiseLike<unknown>).then === 'function') {
            void Promise.resolve(resolved)
              .then((payload) => {
                applyIfLatest(payload as CommentsSidebarControllerComposerSelectionPayload | null | undefined);
              })
              .catch(() => {
                applyIfLatest(null);
              });
            return;
          }
          applyIfLatest(resolved as CommentsSidebarControllerComposerSelectionPayload | null | undefined);
        } catch (_error) {
          applyIfLatest(null);
        }
      },
      onComposerQuoteClearRequest: () => {
        composerSelectionRequestSeq += 1;
        session.setQuoteText('');
        pendingRootLocator = null;
      },
    };

    session.setHandlers(handlers);
  };

  installHandlers();

  const open = async (openInput?: CommentsSidebarControllerOpenInput) => {
    const selectionText = openInput?.selectionText;
    if (selectionText != null) {
      applyComposerSelection({ selectionText, locator: openInput?.locator });
    }
    session.requestOpen({ focusComposer: openInput?.focusComposer === true, source: openInput?.source });

    const shouldEnsureContext = openInput?.ensureContext !== false;
    session.setBusy(true);
    try {
      await ensureContext(shouldEnsureContext, openInput?.ensureContextInput);
      await refresh({ manageBusy: false });
    } finally {
      session.setBusy(false);
    }
  };

  const getContext = () => (activeContext ? { ...activeContext } : null);

  const setContext = (next: CommentsSidebarContext | null) => {
    const normalized = next ? normalizeContext(next) : null;
    if (buildContextKey(activeContext) === buildContextKey(normalized)) return;

    const previousTargetKey = safeString(activeContext?.commentTargetKey);
    const previousConversationId = normalizeConversationId(activeContext?.conversationId);
    const nextTargetKey = safeString(normalized?.commentTargetKey);
    const nextConversationId = normalizeConversationId(normalized?.conversationId);

    if (
      previousTargetKey &&
      nextTargetKey &&
      previousTargetKey !== nextTargetKey &&
      previousConversationId &&
      nextConversationId &&
      previousConversationId === nextConversationId &&
      isUrlTargetKey(previousTargetKey) &&
      isUrlTargetKey(nextTargetKey) &&
      typeof adapter.migrateTargetKey === 'function'
    ) {
      void adapter
        .migrateTargetKey({
          fromTargetKey: previousTargetKey,
          toTargetKey: nextTargetKey,
          conversationId: nextConversationId,
        })
        .catch((error) => {
          console.warn('[CommentsSidebar] target key migration failed', {
            fromTargetKey: previousTargetKey,
            toTargetKey: nextTargetKey,
            conversationId: nextConversationId,
            error: error instanceof Error ? error.message : String(error || ''),
          });
        });
    }

    activeContext = normalized;
    pendingRootLocator = null;
    session.setQuoteText('');
    refreshRunId += 1;

    const targetKey = safeString(activeContext?.commentTargetKey);
    const conversationId = normalizeConversationId(activeContext?.conversationId);
    if (!targetKey && !conversationId) {
      session.setBusy(false);
      session.setComments([]);
      return;
    }

    void refresh();
  };

  return {
    open,
    refresh: () => refresh(),
    getContext,
    setContext,
  };
}

