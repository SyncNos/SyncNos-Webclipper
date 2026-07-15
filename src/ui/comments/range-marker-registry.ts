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

const MARKER_ACCENT_VAR = '--webclipper-comment-marker-accent';
const DEFAULT_MARKER_ACCENT = 'rgb(255 198 173)';

export function createCommentRangeMarkerRegistry(input: {
  document: Document;
  window?: Window;
  host?: HTMLElement;
  styleSource?: Element;
  getGeometryRoots?: () => readonly Element[];
}): CommentRangeMarkerRegistry {
  const doc = input.document;
  const win = input.window || doc.defaultView || undefined;
  const host = input.host || doc.body || doc.documentElement;
  const layer = doc.createElement('div');
  layer.className = 'webclipper-comment-range-markers';
  layer.setAttribute('aria-hidden', 'true');
  layer.style.position = 'absolute';
  layer.style.inset = '0';
  layer.style.zIndex = '2147483600';
  layer.style.pointerEvents = 'none';
  layer.style.setProperty(MARKER_ACCENT_VAR, DEFAULT_MARKER_ACCENT);
  host.appendChild(layer);
  const entries = new Map<number, MarkerEntry>();
  let activeId: number | null = null;
  let rafId: number | null = null;
  let disposed = false;
  let resizeObserver: ResizeObserver | null = null;
  let observedGeometryRoots = new Set<Element>();

  const syncVisualTokens = () => {
    if (!input.styleSource || !win?.getComputedStyle) return;
    try {
      const styles = win.getComputedStyle(input.styleSource);
      const accent = styles.getPropertyValue('--panel-accent').trim() || styles.getPropertyValue('--accent').trim();
      if (accent) layer.style.setProperty(MARKER_ACCENT_VAR, accent);
    } catch (_error) {
      // Keep the registry-owned fallbacks when the host style is unavailable.
    }
  };

  const clearElements = (entry: MarkerEntry) => {
    for (const element of entry.elements) element.remove();
    entry.elements = [];
  };

  const applyMarkerStyles = (element: HTMLElement, tone: CommentMarkerTone) => {
    element.style.position = 'absolute';
    element.style.boxSizing = 'border-box';
    element.style.pointerEvents = 'none';
    element.style.borderRadius = '0';
    element.dataset.tone = tone;
    element.style.background = `color-mix(in srgb, var(${MARKER_ACCENT_VAR}) ${tone === 'active' ? '88%' : '62%'}, transparent)`;
    element.style.opacity = tone === 'active' ? '1' : '0.78';
    element.style.transition = 'background-color 120ms ease, opacity 120ms ease';
  };

  const renderEntry = (commentId: number, entry: MarkerEntry) => {
    clearElements(entry);
    let rects: DOMRect[] = [];
    try {
      rects = Array.from(entry.range.getClientRects?.() || []) as DOMRect[];
    } catch (_error) {
      rects = [];
    }
    for (const rect of rects) {
      if (rect.width <= 0 || rect.height <= 0) continue;
      const element = doc.createElement('div');
      element.className = `webclipper-comment-range-marker is-${entry.tone}`;
      element.dataset.commentId = String(commentId);
      applyMarkerStyles(element, entry.tone);
      const thickness = entry.tone === 'active' ? 2 : 1;
      element.style.left = `${rect.left + (win?.scrollX || 0)}px`;
      element.style.top = `${rect.bottom + (win?.scrollY || 0) - thickness}px`;
      element.style.width = `${rect.width}px`;
      element.style.height = `${thickness}px`;
      layer.appendChild(element);
      entry.elements.push(element);
    }
  };

  const syncGeometryObservers = () => {
    const ResizeObserverCtor = (win as (Window & { ResizeObserver?: typeof ResizeObserver }) | undefined)
      ?.ResizeObserver;
    if (!ResizeObserverCtor || !input.getGeometryRoots) return;
    let nextRoots: Element[] = [];
    try {
      nextRoots = Array.from(input.getGeometryRoots() || []).filter(
        (root, index, roots): root is Element => Boolean(root) && roots.indexOf(root) === index,
      );
    } catch (_error) {
      nextRoots = [];
    }
    const unchanged =
      nextRoots.length === observedGeometryRoots.size && nextRoots.every((root) => observedGeometryRoots.has(root));
    if (unchanged) return;
    resizeObserver?.disconnect();
    const observer = resizeObserver || new ResizeObserverCtor(() => refresh());
    resizeObserver = observer;
    observedGeometryRoots = new Set(nextRoots);
    for (const root of nextRoots) observer.observe(root);
  };

  const refresh = () => {
    if (disposed) return;
    syncGeometryObservers();
    if (rafId != null && win?.cancelAnimationFrame) win.cancelAnimationFrame(rafId);
    const run = () => {
      rafId = null;
      syncVisualTokens();
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
      resizeObserver?.disconnect();
      resizeObserver = null;
      observedGeometryRoots.clear();
      win?.removeEventListener('scroll', onGeometryChange, true);
      for (const entry of entries.values()) clearElements(entry);
      entries.clear();
      layer.remove();
    },
    size: () => entries.size,
  };
}
