import type { ArticleComment, ArticleCommentLocator } from '@services/comments/domain/models';
import { normalizeArticleCommentLocator } from '@services/comments/domain/comment-locator';
import { canonicalizeArticleUrl } from '@services/url-cleaning/http-url';

export type ArticleCommentDto = ArticleComment;
export type ArticleCommentListRequestDto = { canonicalUrl?: string; conversationId?: number | null };
export type ArticleCommentAddRequestDto = {
  canonicalUrl: string;
  conversationId: number | null;
  parentId: number | null;
  quoteText: string;
  commentText: string;
  locator: ArticleCommentLocator | null;
};
export type ArticleCommentDeleteRequestDto = { id: number };

function positiveInt(value: unknown): number | null {
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export function parseArticleCommentDto(value: unknown): ArticleCommentDto | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  const id = positiveInt(row.id);
  const canonicalUrl = canonicalizeArticleUrl(row.canonicalUrl);
  const commentText = String(row.commentText ?? '').trim();
  const createdAt = Number(row.createdAt);
  const updatedAt = Number(row.updatedAt);
  if (!id || !canonicalUrl || !commentText || !Number.isFinite(createdAt) || !Number.isFinite(updatedAt)) return null;
  return {
    id,
    parentId: positiveInt(row.parentId),
    conversationId: positiveInt(row.conversationId),
    canonicalUrl,
    authorName: row.authorName == null ? null : String(row.authorName),
    quoteText: String(row.quoteText ?? ''),
    commentText,
    locator: normalizeArticleCommentLocator(row.locator),
    createdAt,
    updatedAt,
  };
}

export function parseArticleCommentDtos(value: unknown): ArticleCommentDto[] {
  if (!Array.isArray(value)) return [];
  return value.map(parseArticleCommentDto).filter((item): item is ArticleCommentDto => !!item);
}

export function serializeArticleCommentDto(value: ArticleComment): ArticleCommentDto {
  return {
    ...value,
    authorName: value.authorName ?? null,
    locator: normalizeArticleCommentLocator(value.locator),
  };
}

export function parseArticleCommentAddRequest(value: unknown): ArticleCommentAddRequestDto | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  const canonicalUrl = canonicalizeArticleUrl(row.canonicalUrl);
  const commentText = String(row.commentText ?? '').trim();
  if (!canonicalUrl || !commentText) return null;
  const parentId = positiveInt(row.parentId);
  return {
    canonicalUrl,
    conversationId: positiveInt(row.conversationId),
    parentId,
    quoteText: parentId ? '' : String(row.quoteText ?? ''),
    commentText,
    locator: parentId ? null : normalizeArticleCommentLocator(row.locator),
  };
}
