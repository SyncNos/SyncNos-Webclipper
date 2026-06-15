export type DedaoExtractedNote = {
  externalId: string;
  quoteText: string;
  commentText: string;
  range?: string;
  articleId?: string | number;
  articleTitle?: string;
};

type WalkState = {
  seen: WeakSet<object>;
  results: DedaoExtractedNote[];
};

const MAX_ARRAY_ITEMS = 200;
const MAX_OBJECT_KEYS = 40;
const MAX_DEPTH = 5;
const FALLBACK_CLICK_WAIT_MS = 220;
const FALLBACK_CLOSE_WAIT_MS = 120;

function safeText(value: unknown): string {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeExternalId(item: any): string {
  return safeText(item?.logId) || safeText(item?.feedId) || safeText(item?.id);
}

function normalizeNoteCandidate(item: any): DedaoExtractedNote | null {
  if (!item || typeof item !== 'object') return null;

  const logType = safeText(item?.logType);
  const commentText = safeText(item?.note);
  const quoteText = safeText(item?.content);
  const externalId = normalizeExternalId(item);

  if (logType && logType !== 'note') return null;
  if (!commentText || !quoteText || !externalId) return null;

  const extra = item?.extra && typeof item.extra === 'object' ? item.extra : null;
  const articleId = extra?.articleId ?? item?.articleId ?? item?.detailId;
  const articleTitle = safeText(extra?.articleTitle || item?.articleTitle);
  const range = safeText(item?.range);

  return {
    externalId,
    quoteText,
    commentText,
    range: range || undefined,
    articleId: articleId == null ? undefined : articleId,
    articleTitle: articleTitle || undefined,
  };
}

function pushCandidate(results: DedaoExtractedNote[], candidate: DedaoExtractedNote | null) {
  if (!candidate) return;
  if (results.some((item) => item.externalId === candidate.externalId)) return;
  results.push(candidate);
}

function collectChildCandidates(value: unknown): unknown[] {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) return value.slice(0, MAX_ARRAY_ITEMS);

  const out: unknown[] = [];
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((key) => /note|notes|log|feed|marker|comment|article|list|data|children|refs|props/i.test(key))
    .slice(0, MAX_OBJECT_KEYS);
  for (const key of keys) out.push(obj[key]);
  return out;
}

function walkDedaoNotes(value: unknown, depth: number, state: WalkState) {
  if (!value || typeof value !== 'object' || depth > MAX_DEPTH) return;
  if (state.seen.has(value as object)) return;
  state.seen.add(value as object);

  if (Array.isArray(value)) {
    for (const item of value.slice(0, MAX_ARRAY_ITEMS)) {
      pushCandidate(state.results, normalizeNoteCandidate(item));
      walkDedaoNotes(item, depth + 1, state);
    }
    return;
  }

  pushCandidate(state.results, normalizeNoteCandidate(value));

  const nextValues = collectChildCandidates(value);
  for (const next of nextValues) {
    walkDedaoNotes(next, depth + 1, state);
  }
}

function getVueRoots(doc: Document): any[] {
  const roots: any[] = [];
  const elements = Array.from(doc.querySelectorAll('.iget-rich-text-panel-container, .editor-show, .article-body'));
  for (const el of elements) {
    const vm = (el as any)?.__vue__;
    if (vm) roots.push(vm);
  }
  return roots;
}

export function isDedaoArticleLikePage(loc: Location | URL | { hostname?: string; pathname?: string; href?: string }): boolean {
  const hostname = safeText((loc as any)?.hostname).toLowerCase();
  if (!hostname || !hostname.endsWith('dedao.cn')) return false;
  const pathname = safeText((loc as any)?.pathname);
  return pathname.length > 1;
}

export function extractDedaoNotesFromDocument(doc: Document, loc: Location | URL): DedaoExtractedNote[] {
  if (!doc || !isDedaoArticleLikePage(loc)) return [];

  const state: WalkState = {
    seen: new WeakSet<object>(),
    results: [],
  };

  const roots = getVueRoots(doc);
  for (const root of roots) {
    walkDedaoNotes(root, 0, state);
    walkDedaoNotes(root?._data, 0, state);
    walkDedaoNotes(root?.$children, 0, state);
    walkDedaoNotes(root?.$refs, 0, state);
    walkDedaoNotes(root?.$props, 0, state);
  }

  return state.results;
}

function collectMarkerTargets(doc: Document): Element[] {
  const candidates = Array.from(doc.querySelectorAll('text.em-highlight-tag-text, text, .em-highlight-tag-text'));
  const out: Element[] = [];
  const seen = new Set<Element>();

  for (const el of candidates) {
    const text = safeText((el as any)?.textContent || '');
    if (text !== '笔记') continue;
    const target = (el as any)?.closest?.('svg, g, text') || el;
    if (!target || seen.has(target)) continue;
    seen.add(target);
    out.push(target);
  }

  return out;
}

function normalizeNoteFromMarkerPayload(payload: any, doc: Document): DedaoExtractedNote | null {
  if (!payload || typeof payload !== 'object') return null;
  const normalized = normalizeNoteCandidate({
    ...payload?.meta,
    content: payload?.content,
    range: payload?.range,
    id: payload?.id,
  });
  if (normalized?.commentText) return normalized;

  const fallbackText = safeText(doc.querySelector('.notes-edit-content')?.textContent || '');
  if (!fallbackText) return null;

  const externalId = safeText(payload?.meta?.logId) || safeText(payload?.meta?.feedId) || safeText(payload?.id);
  const quoteText = safeText(payload?.content);
  if (!externalId || !quoteText) return null;

  return {
    externalId,
    quoteText,
    commentText: fallbackText,
    range: safeText(payload?.range) || undefined,
    articleId: payload?.meta?.extra?.articleId ?? payload?.meta?.detailId,
    articleTitle: safeText(payload?.meta?.extra?.articleTitle || ''),
  };
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}

async function closeOpenNoteModal(doc: Document) {
  const closeBtn = doc.querySelector('.note-close-btn') as HTMLElement | null;
  if (!closeBtn) return;
  try {
    closeBtn.click();
  } catch (_error) {
    try {
      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    } catch (_error2) {
      // ignore
    }
  }
  await wait(FALLBACK_CLOSE_WAIT_MS);
}

function clickElement(el: Element) {
  const target = el as any;
  const attempts = [target, target?.parentElement, target?.ownerSVGElement].filter(Boolean);
  for (const node of attempts) {
    try {
      if (typeof node.click === 'function') {
        node.click();
        return;
      }
    } catch (_error) {
      // ignore
    }
    try {
      node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      return;
    } catch (_error) {
      // ignore
    }
  }
}

export async function extractDedaoNotesByMarkerFallback(doc: Document, loc: Location | URL): Promise<DedaoExtractedNote[]> {
  if (!doc || !isDedaoArticleLikePage(loc)) return [];

  const markerTargets = collectMarkerTargets(doc);
  console.info('[DedaoNotes] marker fallback scan', {
    url: String((loc as any)?.href || ''),
    markerCount: markerTargets.length,
  });
  if (!markerTargets.length) return [];

  const results: DedaoExtractedNote[] = [];
  const seenIds = new Set<string>();
  const originalConsoleLog = console.log.bind(console);
  let lastPayload: any = null;
  let triggerCount = 0;

  console.log = function (...args: any[]) {
    try {
      if (args[0] === 'markerLineClick' && args[1] && typeof args[1] === 'object') {
        lastPayload = args[1];
        triggerCount += 1;
      }
    } catch (_error) {
      // ignore
    }
    return originalConsoleLog(...args);
  };

  try {
    for (const target of markerTargets) {
      lastPayload = null;
      clickElement(target);
      await wait(FALLBACK_CLICK_WAIT_MS);

      const note = normalizeNoteFromMarkerPayload(lastPayload, doc);
      console.info('[DedaoNotes] marker click result', {
        text: safeText((target as any)?.textContent || ''),
        hadPayload: Boolean(lastPayload),
        externalId: note?.externalId || '',
        quoteLen: note?.quoteText?.length || 0,
        commentLen: note?.commentText?.length || 0,
      });
      if (note && !seenIds.has(note.externalId)) {
        seenIds.add(note.externalId);
        results.push(note);
      }

      await closeOpenNoteModal(doc);
    }
  } finally {
    console.log = originalConsoleLog;
  }

  console.info('[DedaoNotes] marker fallback done', {
    url: String((loc as any)?.href || ''),
    markerCount: markerTargets.length,
    markerLineClickCount: triggerCount,
    extractedCount: results.length,
  });

  return results;
}

export async function extractDedaoNotesFromPage(doc: Document, loc: Location | URL): Promise<DedaoExtractedNote[]> {
  const direct = extractDedaoNotesFromDocument(doc, loc);
  console.info('[DedaoNotes] direct read result', {
    url: String((loc as any)?.href || ''),
    extractedCount: direct.length,
  });
  if (direct.length) return direct;
  return await extractDedaoNotesByMarkerFallback(doc, loc);
}
