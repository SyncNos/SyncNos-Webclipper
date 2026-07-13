export type CommentMarkerTone = 'passive' | 'active';

type MarkerEntry = { range: Range; tone: CommentMarkerTone; elements: HTMLElement[] };

export type CommentRangeMarkerRegistry = {
  replace(commentId: number, range: Range, tone?: CommentMarkerTone): void;
  remove(commentId: number): void;
  setActive(commentId: number | null): void;
  refresh(): void;
  dispose(): void;
  size(): number;
};

export function createCommentRangeMarkerRegistry(input: {
  document: Document;
  window?: Window;
  host?: HTMLElement;
}): CommentRangeMarkerRegistry {
  const doc = input.document;
  const win = input.window || doc.defaultView || undefined;
  const host = input.host || doc.body;
  const layer = doc.createElement('div');
  layer.className = 'webclipper-comment-range-markers';
  layer.setAttribute('aria-hidden', 'true');
  host.appendChild(layer);
  const entries = new Map<number, MarkerEntry>();
  let activeId: number | null = null;
  let rafId: number | null = null;
  let disposed = false;

  const clearElements = (entry: MarkerEntry) => {
    for (const element of entry.elements) element.remove();
    entry.elements = [];
  };

  const renderEntry = (commentId: number, entry: MarkerEntry) => {
    clearElements(entry);
    const rects = Array.from(entry.range.getClientRects());
    for (const rect of rects) {
      if (rect.width <= 0 || rect.height <= 0) continue;
      const element = doc.createElement('div');
      element.className = `webclipper-comment-range-marker is-${entry.tone}`;
      element.dataset.commentId = String(commentId);
      element.style.left = `${rect.left + (win?.scrollX || 0)}px`;
      element.style.top = `${rect.top + (win?.scrollY || 0)}px`;
      element.style.width = `${rect.width}px`;
      element.style.height = `${rect.height}px`;
      layer.appendChild(element);
      entry.elements.push(element);
    }
  };

  const refresh = () => {
    if (disposed) return;
    if (rafId != null && win?.cancelAnimationFrame) win.cancelAnimationFrame(rafId);
    const run = () => {
      rafId = null;
      for (const [commentId, entry] of entries) renderEntry(commentId, entry);
    };
    rafId = win?.requestAnimationFrame ? win.requestAnimationFrame(run) : (run(), null);
  };

  const onGeometryChange = () => refresh();
  win?.addEventListener('resize', onGeometryChange);
  win?.addEventListener('scroll', onGeometryChange, true);

  return {
    replace(commentId, range, tone = commentId === activeId ? 'active' : 'passive') {
      if (disposed) return;
      const previous = entries.get(commentId);
      if (previous) clearElements(previous);
      entries.set(commentId, { range: range.cloneRange(), tone, elements: [] });
      refresh();
    },
    remove(commentId) {
      const entry = entries.get(commentId);
      if (!entry) return;
      clearElements(entry);
      entries.delete(commentId);
      if (activeId === commentId) activeId = null;
    },
    setActive(commentId) {
      activeId = commentId;
      for (const [id, entry] of entries) entry.tone = id === commentId ? 'active' : 'passive';
      refresh();
    },
    refresh,
    dispose() {
      if (disposed) return;
      disposed = true;
      if (rafId != null && win?.cancelAnimationFrame) win.cancelAnimationFrame(rafId);
      win?.removeEventListener('resize', onGeometryChange);
      win?.removeEventListener('scroll', onGeometryChange, true);
      for (const entry of entries.values()) clearElements(entry);
      entries.clear();
      layer.remove();
    },
    size: () => entries.size,
  };
}
