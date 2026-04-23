import {
  addArticleComment,
  deleteArticleCommentById,
  listArticleCommentsByCanonicalUrl,
  listArticleCommentsByConversationId,
  migrateArticleCommentsCanonicalUrl,
} from '@services/comments/client/repo';

import type {
  CommentsSidebarAdapter,
  CommentsSidebarEnsureContextInput,
  CommentsSidebarContext,
} from '@services/comments/sidebar/comments-sidebar-adapter';

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

function canonicalUrlFromContext(input: {
  commentTargetKey: string;
  canonicalUrlFallback?: string | null;
}): string {
  return urlFromTargetKey(input.commentTargetKey) || safeString(input.canonicalUrlFallback);
}

export function createCommentsSidebarAppAdapter(): CommentsSidebarAdapter {
  return {
    async list({ commentTargetKey, conversationId, canonicalUrlFallback }) {
      const id = normalizeConversationId(conversationId);
      if (isConvoTargetKey(commentTargetKey) && id) {
        const items = await listArticleCommentsByConversationId(id);
        return (Array.isArray(items) ? items : []).map((c: any) => ({
          id: Number(c?.id),
          parentId: c?.parentId != null ? Number(c.parentId) : null,
          authorName: (c as any)?.authorName != null ? String((c as any).authorName) : null,
          createdAt: Number(c?.createdAt) || null,
          quoteText: String(c?.quoteText || ''),
          commentText: String(c?.commentText || ''),
          locator: (c as any)?.locator ?? null,
        }));
      }

      const canonicalUrl = canonicalUrlFromContext({ commentTargetKey, canonicalUrlFallback });
      if (!canonicalUrl) return [];
      const items = await listArticleCommentsByCanonicalUrl(canonicalUrl);
      return (Array.isArray(items) ? items : []).map((c: any) => ({
        id: Number(c?.id),
        parentId: c?.parentId != null ? Number(c.parentId) : null,
        authorName: (c as any)?.authorName != null ? String((c as any).authorName) : null,
        createdAt: Number(c?.createdAt) || null,
        quoteText: String(c?.quoteText || ''),
        commentText: String(c?.commentText || ''),
        locator: (c as any)?.locator ?? null,
      }));
    },
    async addRoot({ canonicalUrl, conversationId, quoteText, commentText, locator }) {
      const res = await addArticleComment({
        canonicalUrl,
        conversationId: normalizeConversationId(conversationId),
        quoteText,
        commentText,
        locator: locator ?? null,
      });
      return { id: Number(res?.id) };
    },
    async addReply({ canonicalUrl, conversationId, parentId, commentText }) {
      await addArticleComment({
        canonicalUrl,
        conversationId: normalizeConversationId(conversationId),
        parentId,
        quoteText: '',
        commentText,
        locator: null,
      });
    },
    async delete({ id }) {
      const ok = await deleteArticleCommentById(id);
      if (!ok) throw new Error('failed to delete comment');
    },
    async migrateTargetKey({ fromTargetKey, toTargetKey, conversationId }) {
      const fromCanonicalUrl = urlFromTargetKey(fromTargetKey);
      const toCanonicalUrl = urlFromTargetKey(toTargetKey);
      if (!fromCanonicalUrl || !toCanonicalUrl || fromCanonicalUrl === toCanonicalUrl) return;
      return migrateArticleCommentsCanonicalUrl({
        fromCanonicalUrl,
        toCanonicalUrl,
        conversationId: normalizeConversationId(conversationId),
      });
    },
    async ensureContext(input?: CommentsSidebarEnsureContextInput): Promise<CommentsSidebarContext> {
      const targetKey = safeString(input?.commentTargetKeyFallback);
      const canonicalUrlFallback =
        safeString(input?.canonicalUrlFallback) || urlFromTargetKey(targetKey) || null;
      return {
        commentTargetKey: targetKey,
        conversationId: null,
        canonicalUrl: canonicalUrlFallback,
      };
    },
  };
}
