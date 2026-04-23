import { COMMENTS_MESSAGE_TYPES, UI_EVENT_TYPES } from '@platform/messaging/message-contracts';
import {
  addComment,
  attachOrphanCommentsToConversation,
  deleteCommentById,
  getCommentDeleteContextById,
  listCommentsByCanonicalUrl,
  listCommentsByConversationId,
  migrateCommentsCanonicalUrl,
} from '@services/comments/data/storage';
import { storageGet } from '@services/shared/storage';
import {
  ABOUT_YOU_USER_NAME_STORAGE_KEY,
  DEFAULT_ABOUT_YOU_USER_NAME,
  normalizeUserName,
} from '@services/shared/user-profile';
import { canonicalizeCommentTargetUrl } from '@services/url-cleaning/comment-target-url';

type AnyRouter = {
  ok: (data: unknown) => any;
  err: (message: string, extra?: unknown) => any;
  register: (type: string, handler: (msg: any) => Promise<any> | any) => void;
  eventsHub?: { broadcast: (type: string, payload: unknown) => void };
};

export function registerCommentsHandlers(router: AnyRouter) {
  router.register(COMMENTS_MESSAGE_TYPES.LIST_COMMENTS, async (msg) => {
    const canonicalUrl = canonicalizeCommentTargetUrl(msg?.canonicalUrl);
    const conversationId = Number(msg?.conversationId);

    // Canonical URL is preferred. When unavailable, fall back to conversationId
    // so legacy contexts can still load comments.
    if (canonicalUrl) {
      const items = await listCommentsByCanonicalUrl(canonicalUrl);
      return router.ok(items);
    }

    if (Number.isFinite(conversationId) && conversationId > 0) {
      const items = await listCommentsByConversationId(conversationId);
      return router.ok(items);
    }

    return router.err('missing canonicalUrl or conversationId');
  });

  router.register(COMMENTS_MESSAGE_TYPES.ADD_COMMENT, async (msg) => {
    const canonicalUrl = canonicalizeCommentTargetUrl(msg?.canonicalUrl);
    const commentTargetKey = String(msg?.commentTargetKey || '').trim();
    if (!canonicalUrl && !commentTargetKey) return router.err('missing canonicalUrl');

    const local = await storageGet([ABOUT_YOU_USER_NAME_STORAGE_KEY]);
    const authorName = normalizeUserName(local?.[ABOUT_YOU_USER_NAME_STORAGE_KEY]) || DEFAULT_ABOUT_YOU_USER_NAME;

    const comment = await addComment({
      parentId: msg?.parentId != null ? Number(msg.parentId) : null,
      conversationId: msg?.conversationId ? Number(msg.conversationId) : null,
      canonicalUrl,
      commentTargetKey,
      authorName,
      quoteText: msg?.quoteText ?? '',
      commentText: String(msg?.commentText || ''),
      locator: msg?.parentId ? null : (msg?.locator ?? null),
    });

    if (comment.conversationId) {
      router.eventsHub?.broadcast(UI_EVENT_TYPES.CONVERSATIONS_CHANGED, {
        reason: 'commentAdded',
        conversationId: comment.conversationId,
      });
    }

    return router.ok(comment);
  });

  router.register(COMMENTS_MESSAGE_TYPES.DELETE_COMMENT, async (msg) => {
    const id = Number(msg?.id);
    if (!Number.isFinite(id) || id <= 0) return router.err('invalid id');
    const context = await getCommentDeleteContextById(id);
    const ok = await deleteCommentById(id);
    if (ok) {
      const conversationId = Number(context?.conversationId);
      if (Number.isFinite(conversationId) && conversationId > 0) {
        router.eventsHub?.broadcast(UI_EVENT_TYPES.CONVERSATIONS_CHANGED, {
          reason: 'commentDeleted',
          conversationId,
        });
      } else {
        router.eventsHub?.broadcast(UI_EVENT_TYPES.CONVERSATIONS_CHANGED, {
          reason: 'commentDeleted',
        });
      }
    }
    return router.ok({ ok });
  });

  router.register(COMMENTS_MESSAGE_TYPES.ATTACH_ORPHAN_COMMENTS, async (msg) => {
    const canonicalUrl = canonicalizeCommentTargetUrl(msg?.canonicalUrl);
    const conversationId = Number(msg?.conversationId);
    if (!canonicalUrl) return router.err('missing canonicalUrl');
    if (!Number.isFinite(conversationId) || conversationId <= 0) return router.err('invalid conversationId');
    const res = await attachOrphanCommentsToConversation(canonicalUrl, conversationId);
    router.eventsHub?.broadcast(UI_EVENT_TYPES.CONVERSATIONS_CHANGED, {
      reason: 'commentAttached',
      conversationId,
    });
    return router.ok(res);
  });

  router.register(COMMENTS_MESSAGE_TYPES.MIGRATE_COMMENTS_CANONICAL_URL, async (msg) => {
    const fromCanonicalUrl = canonicalizeCommentTargetUrl(msg?.fromCanonicalUrl);
    const toCanonicalUrl = canonicalizeCommentTargetUrl(msg?.toCanonicalUrl);
    const conversationId = msg?.conversationId != null ? Number(msg.conversationId) : null;
    if (!fromCanonicalUrl) return router.err('missing fromCanonicalUrl');
    if (!toCanonicalUrl) return router.err('missing toCanonicalUrl');

    const res = await migrateCommentsCanonicalUrl(fromCanonicalUrl, toCanonicalUrl);
    if (conversationId != null && Number.isFinite(conversationId) && conversationId > 0) {
      router.eventsHub?.broadcast(UI_EVENT_TYPES.CONVERSATIONS_CHANGED, {
        reason: 'commentsMigrated',
        conversationId,
        fromCanonicalUrl,
        toCanonicalUrl,
      });
    } else {
      router.eventsHub?.broadcast(UI_EVENT_TYPES.CONVERSATIONS_CHANGED, {
        reason: 'commentsMigrated',
        fromCanonicalUrl,
        toCanonicalUrl,
      });
    }
    return router.ok(res);
  });
}
