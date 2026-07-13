import type { ArticleCommentLocator } from '@services/comments/domain/comment-locator';
import type { ResolveCommentAnchorResult } from '@services/comments/locator/resolve-comment-anchor';
import type { CommentRangeMarkerRegistry } from '@ui/comments/range-marker-registry';

export type CommentAnchorItem = { commentId: number; locator: ArticleCommentLocator | null | undefined };

export function createCommentAnchorController(input: {
  getRoots: () => readonly Element[];
  resolve: (request: {
    locator: ArticleCommentLocator;
    roots: readonly Element[];
    signal: AbortSignal;
    generation: number;
  }) => Promise<ResolveCommentAnchorResult> | ResolveCommentAnchorResult;
  registry: CommentRangeMarkerRegistry;
  maxItems?: number;
}) {
  let generation = 0;
  let abortController: AbortController | null = null;
  let activeCommentId: number | null = null;
  let disposed = false;

  const nextGeneration = () => {
    generation += 1;
    abortController?.abort();
    abortController = new AbortController();
    return { generation, signal: abortController.signal };
  };

  const clear = () => {
    nextGeneration();
    input.registry.dispose();
  };

  const sync = async (items: readonly CommentAnchorItem[], nextActiveId?: number | null) => {
    if (disposed) return;
    if (nextActiveId !== undefined) activeCommentId = nextActiveId;
    const run = nextGeneration();
    const roots = input.getRoots();
    const limited = items
      .filter((item) => !!item.locator)
      .sort((left, right) => Number(right.commentId === activeCommentId) - Number(left.commentId === activeCommentId))
      .slice(0, Math.max(1, Math.floor(Number(input.maxItems ?? 100) || 1)));

    for (const item of limited) {
      if (run.signal.aborted || run.generation !== generation || disposed) return;
      const result = await input.resolve({ locator: item.locator!, roots, signal: run.signal, generation: run.generation });
      if (run.signal.aborted || run.generation !== generation || disposed) return;
      if (result.ok) input.registry.replace(item.commentId, result.range, item.commentId === activeCommentId ? 'active' : 'passive');
      else input.registry.remove(item.commentId);
    }
    input.registry.setActive(activeCommentId);
  };

  const locate = async (item: CommentAnchorItem): Promise<Range | null> => {
    if (disposed || !item.locator) return null;
    activeCommentId = item.commentId;
    const run = nextGeneration();
    const result = await input.resolve({ locator: item.locator, roots: input.getRoots(), signal: run.signal, generation: run.generation });
    if (run.signal.aborted || run.generation !== generation || disposed || !result.ok) return null;
    input.registry.replace(item.commentId, result.range, 'active');
    input.registry.setActive(item.commentId);
    return result.range;
  };

  return {
    sync,
    locate,
    setActive(commentId: number | null) {
      activeCommentId = commentId;
      input.registry.setActive(commentId);
    },
    reset() {
      nextGeneration();
      activeCommentId = null;
      input.registry.setActive(null);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      clear();
    },
    getGeneration: () => generation,
  };
}
