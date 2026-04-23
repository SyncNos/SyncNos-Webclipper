import { ARTICLE_MESSAGE_TYPES, COMMENTS_MESSAGE_TYPES } from '@platform/messaging/message-contracts';
import { canonicalizeArticleUrl } from '@services/url-cleaning/http-url';

import type {
  CommentsSidebarAdapter,
  CommentsSidebarContext,
  CommentsSidebarEnsureContextInput,
} from '@services/comments/sidebar/comments-sidebar-adapter';

type RuntimeClient = {
  send?: (type: string, payload?: Record<string, unknown>) => Promise<any>;
};

function safeString(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeConversationId(value: unknown): number | null {
  const id = Number(value);
  if (!Number.isFinite(id) || id <= 0) return null;
  return id;
}

function isConvoTargetKey(key: string): boolean {
  return safeString(key).startsWith('convo:');
}

function urlFromTargetKey(key: string): string {
  const text = safeString(key);
  if (!text.startsWith('url:')) return '';
  return text.slice('url:'.length);
}

function getLocationHrefFallback(): string {
  try {
    return String(globalThis.location?.href || '');
  } catch (_e) {
    return '';
  }
}

function toSidebarItems(list: unknown): any[] {
  const items = Array.isArray(list) ? list : [];
  return items.map((c: any) => ({
    id: Number(c?.id),
    parentId: c?.parentId != null ? Number(c.parentId) : null,
    authorName: c?.authorName != null ? String(c.authorName) : null,
    createdAt: Number(c?.createdAt) || null,
    quoteText: String(c?.quoteText || ''),
    commentText: String(c?.commentText || ''),
    locator: c?.locator ?? null,
  }));
}

export function createCommentsSidebarInpageAdapter(runtime: RuntimeClient | null): CommentsSidebarAdapter {
  const rt = runtime;

  return {
    async list({ commentTargetKey, conversationId, canonicalUrlFallback }) {
      if (!rt?.send) return [];
      const id = normalizeConversationId(conversationId);
      if (isConvoTargetKey(commentTargetKey) && id) {
        const res = await rt.send(COMMENTS_MESSAGE_TYPES.LIST_COMMENTS, {
          canonicalUrl: '',
          conversationId: id,
        } as any);
        if (!res?.ok) return [];
        return toSidebarItems(res?.data);
      }

      const canonicalUrl = urlFromTargetKey(commentTargetKey) || safeString(canonicalUrlFallback);
      const normalized = canonicalizeArticleUrl(canonicalUrl);
      if (!normalized) return [];
      const res = await rt.send(COMMENTS_MESSAGE_TYPES.LIST_COMMENTS, { canonicalUrl: normalized } as any);
      if (!res?.ok) return [];
      return toSidebarItems(res?.data);
    },
    async ensureContext(input?: CommentsSidebarEnsureContextInput): Promise<CommentsSidebarContext> {
      const ensureConversation = input?.ensureConversationForTarget === true;
      const tabId = input?.tabId != null ? Number(input.tabId) : null;

      const fallbackKey = safeString(input?.commentTargetKeyFallback);
      const fallbackCanonicalUrl =
        urlFromTargetKey(fallbackKey) ||
        canonicalizeArticleUrl(input?.canonicalUrlFallback) ||
        canonicalizeArticleUrl(getLocationHrefFallback());

      if (!rt?.send || !ensureConversation) {
        return {
          commentTargetKey: fallbackKey,
          conversationId: null,
          canonicalUrl: fallbackCanonicalUrl,
        };
      }

      const payload = tabId && Number.isFinite(tabId) && tabId > 0 ? { tabId } : null;
      const res = await rt.send(ARTICLE_MESSAGE_TYPES.RESOLVE_OR_CAPTURE_ACTIVE_TAB, payload as any);
      if (!res?.ok) {
        return { commentTargetKey: fallbackKey, conversationId: null, canonicalUrl: fallbackCanonicalUrl };
      }

      const resolvedCanonicalUrl = canonicalizeArticleUrl(res?.data?.url) || fallbackCanonicalUrl;
      const conversationId = normalizeConversationId(res?.data?.conversationId);
      const nextTargetKey = resolvedCanonicalUrl ? `url:${resolvedCanonicalUrl}` : fallbackKey;

      if (resolvedCanonicalUrl && conversationId) {
        try {
          await rt.send(COMMENTS_MESSAGE_TYPES.ATTACH_ORPHAN_COMMENTS, {
            canonicalUrl: resolvedCanonicalUrl,
            conversationId,
          } as any);
        } catch (_e) {
          // ignore
        }
      }

      return {
        commentTargetKey: nextTargetKey,
        conversationId,
        canonicalUrl: resolvedCanonicalUrl,
      };
    },
    async addRoot({ canonicalUrl, conversationId, quoteText, commentText, locator }) {
      if (!rt?.send) throw new Error('missing runtime for adding comment');
      const normalized = canonicalizeArticleUrl(canonicalUrl);
      if (!normalized) throw new Error('missing canonicalUrl for adding comment');
      const res = await rt.send(COMMENTS_MESSAGE_TYPES.ADD_COMMENT, {
        canonicalUrl: normalized,
        conversationId,
        quoteText,
        commentText,
        locator: locator ?? null,
      } as any);
      if (!res?.ok) throw new Error('failed to add comment');
      const id = Number(res?.data?.id);
      if (!Number.isFinite(id) || id <= 0) throw new Error('failed to add comment');
      return { id };
    },
    async addReply({ canonicalUrl, conversationId, parentId, commentText }) {
      if (!rt?.send) throw new Error('missing runtime for replying comment');
      const normalized = canonicalizeArticleUrl(canonicalUrl);
      if (!normalized) throw new Error('missing canonicalUrl for replying comment');
      const res = await rt.send(COMMENTS_MESSAGE_TYPES.ADD_COMMENT, {
        canonicalUrl: normalized,
        conversationId,
        parentId,
        quoteText: '',
        commentText,
      } as any);
      if (!res?.ok) throw new Error('failed to reply comment');
    },
    async delete({ id }) {
      if (!rt?.send) throw new Error('missing runtime for deleting comment');
      const res = await rt.send(COMMENTS_MESSAGE_TYPES.DELETE_COMMENT, { id } as any);
      if (!res?.ok) throw new Error('failed to delete comment');
    },
    async migrateTargetKey({ fromTargetKey, toTargetKey, conversationId }) {
      const fromCanonicalUrl = urlFromTargetKey(fromTargetKey);
      const toCanonicalUrl = urlFromTargetKey(toTargetKey);
      const from = canonicalizeArticleUrl(fromCanonicalUrl);
      const to = canonicalizeArticleUrl(toCanonicalUrl);
      if (!from || !to || from === to) return;
      if (!rt?.send) return;
      await rt.send(COMMENTS_MESSAGE_TYPES.MIGRATE_COMMENTS_CANONICAL_URL, {
        fromCanonicalUrl: from,
        toCanonicalUrl: to,
        conversationId,
      } as any);
    },
  };
}
