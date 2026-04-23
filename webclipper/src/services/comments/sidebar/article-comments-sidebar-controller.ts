import type { CommentSidebarComposerSelectionRequest, CommentSidebarSession } from '@services/comments/sidebar/comment-sidebar-contract';
import { normalizePositiveInt } from '@services/shared/numbers';
import { canonicalizeArticleUrl } from '@services/url-cleaning/http-url';

import type {
  ArticleCommentsSidebarAdapter,
  ArticleCommentsSidebarContext,
  ArticleCommentsSidebarEnsureContextInput,
} from '@services/comments/sidebar/article-comments-sidebar-adapter';
import type {
  CommentsSidebarAdapter,
  CommentsSidebarContext,
  CommentsSidebarEnsureContextInput,
} from '@services/comments/sidebar/comments-sidebar-adapter';
import {
  createCommentsSidebarController,
  type CommentsSidebarController,
  type CommentsSidebarControllerOpenInput,
} from '@services/comments/sidebar/comments-sidebar-controller';

export type ArticleCommentsSidebarControllerOpenInput = {
  selectionText?: string | null;
  locator?: unknown;
  focusComposer?: boolean;
  source?: string;
  ensureContext?: boolean;
  ensureContextInput?: ArticleCommentsSidebarEnsureContextInput;
};

export type ArticleCommentsSidebarControllerComposerSelectionPayload = {
  selectionText?: string | null;
  locator?: unknown;
};

export type ArticleCommentsSidebarController = {
  open: (input?: ArticleCommentsSidebarControllerOpenInput) => Promise<void>;
  refresh: () => Promise<void>;
  getContext: () => ArticleCommentsSidebarContext | null;
  setContext: (context: ArticleCommentsSidebarContext | null) => void;
};

function safeString(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeConversationId(value: unknown): number | null {
  return normalizePositiveInt(value);
}

function urlFromTargetKey(key: string): string {
  const text = safeString(key);
  if (!text.startsWith('url:')) return '';
  return text.slice('url:'.length);
}

export function createArticleCommentsSidebarController(input: {
  session: CommentSidebarSession;
  adapter: ArticleCommentsSidebarAdapter;
  onClose?: () => void;
  resolveComposerSelection?: (
    request: CommentSidebarComposerSelectionRequest,
  ) =>
    | ArticleCommentsSidebarControllerComposerSelectionPayload
    | null
    | undefined
    | Promise<ArticleCommentsSidebarControllerComposerSelectionPayload | null | undefined>;
}): ArticleCommentsSidebarController {
  const adapter: CommentsSidebarAdapter = {
    list: async ({ commentTargetKey, canonicalUrlFallback }) => {
      const canonicalUrl = urlFromTargetKey(commentTargetKey) || safeString(canonicalUrlFallback);
      if (!canonicalUrl) return [];
      return input.adapter.list({ canonicalUrl });
    },
    addRoot: async ({ canonicalUrl, conversationId, quoteText, commentText, locator }) => {
      return input.adapter.addRoot({ canonicalUrl, conversationId, quoteText, commentText, locator });
    },
    addReply: async ({ canonicalUrl, conversationId, parentId, commentText }) => {
      return input.adapter.addReply({ canonicalUrl, conversationId, parentId, commentText });
    },
    delete: async ({ id }) => {
      return input.adapter.delete({ id });
    },
    migrateTargetKey: input.adapter.migrateCanonicalUrl
      ? async ({ fromTargetKey, toTargetKey, conversationId }) => {
          const fromCanonicalUrl = urlFromTargetKey(fromTargetKey);
          const toCanonicalUrl = urlFromTargetKey(toTargetKey);
          if (!fromCanonicalUrl || !toCanonicalUrl) return;
          return input.adapter.migrateCanonicalUrl?.({ fromCanonicalUrl, toCanonicalUrl, conversationId });
        }
      : undefined,
    ensureContext: input.adapter.ensureContext
      ? async (ctxInput?: CommentsSidebarEnsureContextInput): Promise<CommentsSidebarContext> => {
          const mapped: ArticleCommentsSidebarEnsureContextInput = {
            tabId: ctxInput?.tabId ?? null,
            canonicalUrlFallback: urlFromTargetKey(safeString(ctxInput?.commentTargetKeyFallback)) || ctxInput?.canonicalUrlFallback,
            ensureArticle: ctxInput?.ensureConversationForTarget === true,
          };
          const resolved = await input.adapter.ensureContext?.(mapped);
          const canonicalUrl = canonicalizeArticleUrl(resolved?.canonicalUrl);
          return {
            commentTargetKey: canonicalUrl ? `url:${canonicalUrl}` : '',
            conversationId: normalizeConversationId(resolved?.conversationId),
            canonicalUrl,
          };
        }
      : undefined,
  };

  const base: CommentsSidebarController = createCommentsSidebarController({
    session: input.session,
    adapter,
    onClose: input.onClose,
    resolveComposerSelection: input.resolveComposerSelection,
  });

  return {
    open: async (openInput?: ArticleCommentsSidebarControllerOpenInput) => {
      const ensureInput = openInput?.ensureContextInput;
      const canonicalUrlFallback = canonicalizeArticleUrl(ensureInput?.canonicalUrlFallback);
      const mappedEnsureInput: CommentsSidebarEnsureContextInput | undefined = ensureInput
        ? {
            tabId: ensureInput?.tabId ?? null,
            commentTargetKeyFallback: canonicalUrlFallback ? `url:${canonicalUrlFallback}` : '',
            canonicalUrlFallback,
            ensureConversationForTarget: ensureInput?.ensureArticle === true,
          }
        : undefined;

      const mappedOpen: CommentsSidebarControllerOpenInput = {
        selectionText: openInput?.selectionText,
        locator: openInput?.locator,
        focusComposer: openInput?.focusComposer,
        source: openInput?.source,
        ensureContext: openInput?.ensureContext,
        ensureContextInput: mappedEnsureInput,
      };

      return base.open(mappedOpen);
    },
    refresh: () => base.refresh(),
    getContext: () => {
      const ctx = base.getContext();
      if (!ctx) return null;
      const canonicalUrl = canonicalizeArticleUrl(urlFromTargetKey(ctx.commentTargetKey) || ctx.canonicalUrl);
      return {
        canonicalUrl: canonicalUrl || '',
        conversationId: normalizeConversationId(ctx.conversationId),
      };
    },
    setContext: (context: ArticleCommentsSidebarContext | null) => {
      if (!context) return base.setContext(null);
      const canonicalUrl = canonicalizeArticleUrl(context.canonicalUrl);
      base.setContext({
        commentTargetKey: canonicalUrl ? `url:${canonicalUrl}` : '',
        conversationId: normalizeConversationId(context.conversationId),
        canonicalUrl,
      });
    },
  };
}
