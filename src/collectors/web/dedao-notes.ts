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
