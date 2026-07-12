import {
  addArticleComment,
  deleteArticleCommentById,
  listArticleCommentsByCanonicalUrl,
  migrateArticleCommentsCanonicalUrl,
} from '@services/comments/client/repo';
import { canonicalizeArticleUrl } from '@services/url-cleaning/http-url';

import type { ArticleCommentsSidebarAdapter } from '@services/comments/sidebar/article-comments-sidebar-adapter';

export function createArticleCommentsSidebarAppAdapter(): ArticleCommentsSidebarAdapter {
  return {
    async list({ canonicalUrl }) {
      const normalized = canonicalizeArticleUrl(canonicalUrl);
      if (!normalized) return [];
      const items = await listArticleCommentsByCanonicalUrl(normalized);
      return items;
    },
    async addRoot({ canonicalUrl, conversationId, quoteText, commentText, locator }) {
      const normalized = canonicalizeArticleUrl(canonicalUrl);
      if (!normalized) throw new Error('missing canonicalUrl');
      const comment = await addArticleComment({
        canonicalUrl: normalized,
        conversationId,
        parentId: null,
        quoteText,
        commentText,
        locator: locator ?? null,
      });
      const id = Number(comment?.id);
      if (!Number.isFinite(id) || id <= 0) {
        throw new Error('failed to add article comment');
      }
      return { id };
    },
    async addReply({ canonicalUrl, conversationId, parentId, commentText }) {
      const normalized = canonicalizeArticleUrl(canonicalUrl);
      if (!normalized) throw new Error('missing canonicalUrl');
      await addArticleComment({
        canonicalUrl: normalized,
        conversationId,
        parentId,
        quoteText: '',
        commentText,
      });
    },
    async delete({ id }) {
      const ok = await deleteArticleCommentById(id);
      if (!ok) throw new Error('failed to delete article comment');
    },
    async migrateCanonicalUrl({ fromCanonicalUrl, toCanonicalUrl, conversationId }) {
      const from = canonicalizeArticleUrl(fromCanonicalUrl);
      const to = canonicalizeArticleUrl(toCanonicalUrl);
      if (!from || !to || from === to) return;
      await migrateArticleCommentsCanonicalUrl({
        fromCanonicalUrl: from,
        toCanonicalUrl: to,
        conversationId,
      });
    },
  };
}
