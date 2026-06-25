import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  type ReaderOutlineCandidate,
  readerOutlineLevelToMinimapToken,
  readerOutlineLevelToMinimapWidth,
  pickReaderOutlineActiveIndex,
} from '@services/protocols/reader-outline';
import { buildReaderOutlineDomEntries, type ReaderOutlineDomEntry } from '@ui/reader/article-outline-dom';
import { publishReaderPerformanceStats } from '@ui/reader/reader-performance-debug';
import { ReaderRailPanel, readerRailItemButtonClassName } from '@ui/reader/ReaderRailPanel';

export type ArticleOutlineMinimapState = {
  entries: ReaderOutlineDomEntry[];
  activeIndex: number | null;
};

export type ArticleOutlineMinimapProps = ArticleOutlineMinimapState & {
  open: boolean;
  narrow: boolean;
  className?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPickStripEntry: (entry: ReaderOutlineDomEntry) => void;
  onPickPanelEntry: (entry: ReaderOutlineDomEntry) => void;
};

const OUTLINE_LABEL = '目录';
const ENTRY_MINIMAP_BUTTON_CLASS = [
  'tw-flex tw-w-full tw-justify-end tw-border-0 tw-bg-transparent tw-p-0 tw-leading-none',
  'focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)]',
].join(' ');
const STRIP_CLASS = 'tw-flex tw-flex-col tw-items-end tw-gap-2 tw-py-1 tw-pr-1';
const PANEL_LIST_CLASS = 'tw-flex tw-max-h-[60vh] tw-flex-col tw-gap-1 tw-overflow-auto';
const OUTLINE_REBUILD_SETTLE_MS = 180;

function readViewportRect(): ReaderOutlineCandidate['rect'] {
  const view = globalThis.window ?? null;
  const height = Number(view?.innerHeight);
  if (!Number.isFinite(height) || height <= 0) return { top: 0, bottom: 0 };
  return { top: 0, bottom: height };
}

function readCurrentCandidates(entries: ReaderOutlineDomEntry[]): ReaderOutlineCandidate[] {
  return entries.map((entry) => {
    const rect = entry.element.getBoundingClientRect();
    return {
      index: entry.index,
      level: entry.level,
      id: entry.id,
      title: entry.title,
      rect: { top: rect.top, bottom: rect.bottom },
    } satisfies ReaderOutlineCandidate;
  });
}

function toItemClass(active: boolean, level: number): string {
  return readerRailItemButtonClassName(active, level >= 3 ? 2 : level === 2 ? 1 : 0);
}

function toStripBarClass(active: boolean): string {
  return [
    'tw-h-0.5 tw-rounded-[var(--radius-inline)] tw-transition-[opacity,background-color] tw-duration-150',
    active ? 'tw-bg-[var(--text-primary)] tw-opacity-100' : 'tw-bg-[var(--text-secondary)] tw-opacity-40',
  ].join(' ');
}

function renderOutlineItem(
  entry: ReaderOutlineDomEntry,
  activeIndex: number | null,
  onPickStripEntry: (entry: ReaderOutlineDomEntry) => void,
  onPickPanelEntry: (entry: ReaderOutlineDomEntry) => void,
  kind: 'strip' | 'panel',
): ReactNode {
  const active = activeIndex === entry.index;
  const token = readerOutlineLevelToMinimapToken(entry.level);
  const width = readerOutlineLevelToMinimapWidth(entry.level);

  if (kind === 'strip') {
    return (
      <button
        key={entry.id}
        type="button"
        aria-label={entry.title}
        title={entry.title}
        data-reader-outline-entry={entry.id}
        data-reader-outline-level={token}
        data-reader-outline-active={active ? 'true' : 'false'}
        className={ENTRY_MINIMAP_BUTTON_CLASS}
        onClick={() => onPickStripEntry(entry)}
      >
        <span className={toStripBarClass(active)} style={{ width: `${width}px` }} />
      </button>
    );
  }

  return (
    <button
      key={entry.id}
      type="button"
      aria-label={entry.title}
      title={entry.title}
      data-reader-outline-entry={entry.id}
      data-reader-outline-level={token}
      data-reader-outline-active={active ? 'true' : 'false'}
      className={toItemClass(active, entry.level)}
      aria-checked={active ? 'true' : undefined}
      onClick={() => onPickPanelEntry(entry)}
    >
      {entry.title}
    </button>
  );
}

export function useArticleOutlineMinimap(root: HTMLElement | null): ArticleOutlineMinimapState {
  const [entries, setEntries] = useState<ReaderOutlineDomEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const entriesRef = useRef<ReaderOutlineDomEntry[]>([]);
  const activeIndexRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingKindRef = useRef<'entries' | 'active' | null>(null);

  const syncActiveIndex = useCallback((currentEntries: ReaderOutlineDomEntry[] = entriesRef.current) => {
    const candidates = readCurrentCandidates(currentEntries);
    const nextActiveIndex = candidates.length
      ? pickReaderOutlineActiveIndex({ viewportRect: readViewportRect(), candidates })
      : null;
    publishReaderPerformanceStats((current) => ({
      ...current,
      outlineEntries: currentEntries.length,
      outlineActiveRecalcCount: current.outlineActiveRecalcCount + 1,
    }));
    if (nextActiveIndex === activeIndexRef.current) return;
    activeIndexRef.current = nextActiveIndex;
    setActiveIndex(nextActiveIndex);
  }, []);

  const rebuild = useCallback(() => {
    if (!root) {
      entriesRef.current = [];
      activeIndexRef.current = null;
      setEntries([]);
      setActiveIndex(null);
      return;
    }

    const nextEntries = buildReaderOutlineDomEntries(root);
    publishReaderPerformanceStats((current) => ({
      ...current,
      outlineEntries: nextEntries.length,
      outlineRebuildCount: current.outlineRebuildCount + 1,
    }));

    entriesRef.current = nextEntries;
    setEntries(nextEntries);
    if (!nextEntries.length) {
      activeIndexRef.current = null;
      setActiveIndex(null);
      return;
    }
    syncActiveIndex(nextEntries);
  }, [root, syncActiveIndex]);

  useEffect(() => {
    if (!root) {
      entriesRef.current = [];
      activeIndexRef.current = null;
      setEntries([]);
      setActiveIndex(null);
      return;
    }

    const win = root.ownerDocument?.defaultView ?? globalThis.window ?? null;
    const observerCtor = win?.MutationObserver ?? globalThis.MutationObserver;
    let disposed = false;
    let rebuildTimer: ReturnType<typeof setTimeout> | null = null;

    const clearRebuildTimer = () => {
      if (rebuildTimer === null) return;
      clearTimeout(rebuildTimer);
      rebuildTimer = null;
    };

    const schedule = (kind: 'entries' | 'active') => {
      if (disposed) return;
      pendingKindRef.current = pendingKindRef.current === 'entries' || kind === 'entries' ? 'entries' : 'active';
      if (!win?.requestAnimationFrame) {
        const nextKind = pendingKindRef.current;
        pendingKindRef.current = null;
        if (nextKind === 'entries') rebuild();
        else syncActiveIndex();
        return;
      }
      if (rafRef.current != null) return;
      rafRef.current = win.requestAnimationFrame(() => {
        const nextKind = pendingKindRef.current;
        pendingKindRef.current = null;
        rafRef.current = null;
        if (nextKind === 'entries') rebuild();
        else syncActiveIndex();
      });
    };

    const onScroll = () => schedule('active');
    const onResize = () => schedule('active');
    const onMutation = () => {
      clearRebuildTimer();
      rebuildTimer = setTimeout(() => {
        rebuildTimer = null;
        schedule('entries');
      }, OUTLINE_REBUILD_SETTLE_MS);
    };

    const observer =
      observerCtor != null
        ? new observerCtor(() => {
            onMutation();
          })
        : null;

    if (observer) {
      observer.observe(root, { childList: true, subtree: true, characterData: true });
    }

    const scrollTarget: EventTarget = win || root;
    scrollTarget.addEventListener?.('scroll', onScroll, { passive: true });
    win?.addEventListener?.('resize', onResize, { passive: true });
    schedule('entries');

    return () => {
      disposed = true;
      observer?.disconnect();
      scrollTarget.removeEventListener?.('scroll', onScroll);
      win?.removeEventListener?.('resize', onResize);
      clearRebuildTimer();
      if (rafRef.current != null) {
        win?.cancelAnimationFrame?.(rafRef.current);
        rafRef.current = null;
      }
      pendingKindRef.current = null;
    };
  }, [rebuild, root, syncActiveIndex]);

  return { entries, activeIndex };
}

export function ArticleOutlineMinimap({
  entries,
  activeIndex,
  open,
  narrow,
  className,
  onMouseEnter,
  onMouseLeave,
  onPickStripEntry,
  onPickPanelEntry,
}: ArticleOutlineMinimapProps) {
  const safeEntries = useMemo(() => (Array.isArray(entries) ? entries : []), [entries]);
  const outlineTrigger = useMemo(() => {
    return (
      <nav className={STRIP_CLASS} aria-label={OUTLINE_LABEL}>
        {safeEntries.map((entry) => renderOutlineItem(entry, activeIndex, onPickStripEntry, onPickPanelEntry, 'strip'))}
      </nav>
    );
  }, [activeIndex, onPickPanelEntry, onPickStripEntry, safeEntries]);

  if (!safeEntries.length) return null;

  return (
    <ReaderRailPanel
      id="outline"
      label={OUTLINE_LABEL}
      open={open}
      narrow={narrow}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      trigger={outlineTrigger}
    >
      <div className={PANEL_LIST_CLASS}>
        {safeEntries.map((entry) => renderOutlineItem(entry, activeIndex, onPickStripEntry, onPickPanelEntry, 'panel'))}
      </div>
    </ReaderRailPanel>
  );
}
