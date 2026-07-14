import { normalizeCommentThreadGraph } from '@services/comments/domain/comment-thread-graph';
import type { ArticleCommentDto } from '@services/comments/domain/comment-dto';

export function computeArticleCommentThreadCount(comments: unknown): number {
  return normalizeCommentThreadGraph(Array.isArray(comments) ? (comments as ArticleCommentDto[]) : []).threads.length;
}
