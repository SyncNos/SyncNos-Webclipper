export type CommentRect = { top: number; bottom: number; left: number; right: number; width?: number; height?: number };
export type CommentScrollContainer = {
  getRect: () => CommentRect;
  getScrollTop: () => number;
  getScrollHeight: () => number;
  getClientHeight: () => number;
  scrollTo: (top: number, behavior: ScrollBehavior) => void;
};

function minimalVerticalDelta(target: CommentRect, viewport: CommentRect): number {
  if (target.top < viewport.top) return target.top - viewport.top;
  if (target.bottom > viewport.bottom) return target.bottom - viewport.bottom;
  return 0;
}

export function scrollExactCommentRange(input: {
  range: Range;
  containers: readonly CommentScrollContainer[];
  viewportRect: CommentRect;
  reducedMotion?: boolean;
}): { scrolled: number } {
  const rect = input.range.getBoundingClientRect();
  let target: CommentRect = { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
  let scrolled = 0;
  for (const container of input.containers) {
    const viewport = container.getRect();
    const delta = minimalVerticalDelta(target, viewport);
    if (!delta) continue;
    const maxTop = Math.max(0, container.getScrollHeight() - container.getClientHeight());
    const nextTop = Math.max(0, Math.min(maxTop, container.getScrollTop() + delta));
    const applied = nextTop - container.getScrollTop();
    if (!applied) continue;
    container.scrollTo(nextTop, input.reducedMotion ? 'auto' : 'smooth');
    target = { ...target, top: target.top - applied, bottom: target.bottom - applied };
    scrolled += 1;
  }
  const viewportDelta = minimalVerticalDelta(target, input.viewportRect);
  if (viewportDelta && input.containers.length) {
    const outer = input.containers[input.containers.length - 1]!;
    const maxTop = Math.max(0, outer.getScrollHeight() - outer.getClientHeight());
    const current = outer.getScrollTop();
    const nextTop = Math.max(0, Math.min(maxTop, current + viewportDelta));
    if (nextTop !== current) {
      outer.scrollTo(nextTop, input.reducedMotion ? 'auto' : 'smooth');
      scrolled += 1;
    }
  }
  return { scrolled };
}
