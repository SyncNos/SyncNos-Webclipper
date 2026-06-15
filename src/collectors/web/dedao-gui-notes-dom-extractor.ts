import {
  dedupeDedaoGuiNotes,
  normalizeDedaoGuiNote,
  normalizeDedaoGuiText,
  type DedaoGuiNote,
} from './dedao-gui-notes-model';

export const DEDAO_GUI_NOTE_MARKER_SELECTOR = 'text.em-highlight-tag-text';
export const DEDAO_GUI_NOTE_CONTENT_SELECTOR = '.notes-edit-content';
const DEFAULT_WAIT_TIMEOUT_MS = 1_200;
const DEFAULT_WAIT_INTERVAL_MS = 50;

export type DedaoGuiNoteRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type DedaoGuiNotePoint = {
  x: number;
  y: number;
};

export type DedaoGuiNoteMarker = {
  index: number;
  text: string;
  rect: DedaoGuiNoteRect;
  visitKey: string;
  element: Element;
  candidatePoints: DedaoGuiNotePoint[];
};

export type DedaoGuiNoteInteractionResult = Partial<DedaoGuiNote> & {
  opened?: boolean;
  failureReason?: string;
};

export type DedaoGuiNotesExtractorOptions = {
  document?: Document;
  waitTimeoutMs?: number;
  pollIntervalMs?: number;
  clickMarker?: (marker: DedaoGuiNoteMarker) => Promise<DedaoGuiNoteInteractionResult | null | undefined>;
  readCurrentNote?: (ctx: { document: Document; marker: DedaoGuiNoteMarker }) => Promise<DedaoGuiNoteInteractionResult | null | undefined>;
  closeCurrentNote?: (ctx: { document: Document; marker: DedaoGuiNoteMarker }) => Promise<void> | void;
};

function toFiniteNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function rectFromDomRect(rect: DOMRect | DOMRectReadOnly | ClientRect | null | undefined): DedaoGuiNoteRect {
  return {
    top: toFiniteNumber(rect?.top),
    left: toFiniteNumber(rect?.left),
    right: toFiniteNumber(rect?.right),
    bottom: toFiniteNumber(rect?.bottom),
    width: Math.max(0, toFiniteNumber(rect?.width)),
    height: Math.max(0, toFiniteNumber(rect?.height)),
  };
}

function roundCoord(value: number): number {
  return Math.round(toFiniteNumber(value) * 10) / 10;
}

function buildVisitKey(text: string, rect: DedaoGuiNoteRect) {
  return [
    normalizeDedaoGuiText(text),
    roundCoord(rect.left),
    roundCoord(rect.top),
    roundCoord(rect.width),
    roundCoord(rect.height),
  ].join('|');
}

export function buildDedaoGuiMarkerCandidatePoints(rect: DedaoGuiNoteRect): DedaoGuiNotePoint[] {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const leftEdge = rect.left - Math.max(6, rect.width * 0.6);
  const underlineY = rect.top - Math.max(8, rect.height * 0.4);
  const upperY = rect.top - Math.max(2, rect.height * 0.15);

  return [
    { x: centerX, y: centerY },
    { x: rect.left + rect.width * 0.1, y: centerY },
    { x: rect.right - rect.width * 0.1, y: centerY },
    { x: leftEdge, y: centerY },
    { x: leftEdge, y: underlineY },
    { x: centerX, y: upperY },
    { x: rect.left + rect.width * 0.25, y: underlineY },
    { x: rect.right - rect.width * 0.25, y: underlineY },
    { x: centerX, y: underlineY },
  ].map((point) => ({
    x: roundCoord(point.x),
    y: roundCoord(point.y),
  }));
}

function isUsableMarker(el: Element | null): el is Element {
  if (!el) return false;
  const text = normalizeDedaoGuiText(el.textContent || '');
  if (!text) return false;
  if (text !== '笔记') return false;
  const rect = rectFromDomRect((el as any).getBoundingClientRect?.());
  return rect.width > 0 && rect.height > 0;
}

export function collectDedaoGuiNoteMarkers(doc: Document = document): DedaoGuiNoteMarker[] {
  const nodes = Array.from(doc.querySelectorAll(DEDAO_GUI_NOTE_MARKER_SELECTOR));
  const markers: DedaoGuiNoteMarker[] = [];
  const seenVisitKeys = new Set<string>();

  for (const [index, node] of nodes.entries()) {
    if (!isUsableMarker(node)) continue;
    const text = normalizeDedaoGuiText(node.textContent || '');
    const rect = rectFromDomRect((node as any).getBoundingClientRect?.());
    const visitKey = buildVisitKey(text, rect);
    if (seenVisitKeys.has(visitKey)) continue;
    seenVisitKeys.add(visitKey);

    markers.push({
      index,
      text,
      rect,
      visitKey,
      element: node,
      candidatePoints: buildDedaoGuiMarkerCandidatePoints(rect),
    });
  }

  return markers;
}

function dispatchMouseSequence(target: EventTarget, point?: DedaoGuiNotePoint) {
  const view = (globalThis as any).window;
  const eventInit = {
    bubbles: true,
    cancelable: true,
    composed: true,
    clientX: point ? Math.round(point.x) : 0,
    clientY: point ? Math.round(point.y) : 0,
    view,
  };

  for (const type of ['pointerdown', 'mousedown', 'mouseup', 'click']) {
    const EventCtor = type.startsWith('pointer') ? (globalThis as any).PointerEvent || MouseEvent : MouseEvent;
    target.dispatchEvent(new EventCtor(type, eventInit));
  }
}

function resolveClickTargets(doc: Document, marker: DedaoGuiNoteMarker): EventTarget[] {
  const targets: EventTarget[] = [];
  const seen = new Set<EventTarget>();

  const add = (candidate: EventTarget | null | undefined) => {
    if (!candidate || seen.has(candidate)) return;
    seen.add(candidate);
    targets.push(candidate);
  };

  add(marker.element);
  add((marker.element as any).ownerSVGElement);

  const pointApi = (doc as any).elementsFromPoint;
  if (typeof pointApi === 'function') {
    for (const point of marker.candidatePoints) {
      const hits = pointApi.call(doc, point.x, point.y);
      if (!Array.isArray(hits)) continue;
      for (const hit of hits) add(hit);
    }
  }

  return targets;
}

function defaultReadQuoteText(doc: Document, marker: DedaoGuiNoteMarker): string {
  const selection = doc.defaultView?.getSelection?.();
  const fromSelection = normalizeDedaoGuiText(selection?.toString?.());
  if (fromSelection) return fromSelection;

  const articleTextNode = marker.element.closest?.('svg')?.previousElementSibling;
  const fromNearby = normalizeDedaoGuiText((articleTextNode as any)?.textContent || '');
  return fromNearby;
}

async function waitForNoteContent(
  doc: Document,
  timeoutMs: number,
  pollIntervalMs: number,
): Promise<HTMLElement | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    const node = doc.querySelector(DEDAO_GUI_NOTE_CONTENT_SELECTOR) as HTMLElement | null;
    const text = normalizeDedaoGuiText(node?.innerText || node?.textContent || '');
    if (node && text) return node;
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
  return null;
}

async function defaultClickMarker(
  marker: DedaoGuiNoteMarker,
  options: Required<Pick<DedaoGuiNotesExtractorOptions, 'document' | 'waitTimeoutMs' | 'pollIntervalMs'>>,
): Promise<DedaoGuiNoteInteractionResult | null> {
  const clickTargets = resolveClickTargets(options.document, marker);
  for (const target of clickTargets) {
    dispatchMouseSequence(target, marker.candidatePoints[0]);
  }

  const noteNode = await waitForNoteContent(options.document, options.waitTimeoutMs, options.pollIntervalMs);
  if (!noteNode) {
    return {
      opened: false,
      failureReason: 'note_content_not_found',
    };
  }

  return {
    opened: true,
    markerText: marker.text,
    commentText: normalizeDedaoGuiText(noteNode.innerText || noteNode.textContent || ''),
    quoteText: defaultReadQuoteText(options.document, marker),
  };
}

async function defaultReadCurrentNote({
  document: doc,
  marker,
}: {
  document: Document;
  marker: DedaoGuiNoteMarker;
}): Promise<DedaoGuiNoteInteractionResult | null> {
  const noteNode = doc.querySelector(DEDAO_GUI_NOTE_CONTENT_SELECTOR) as HTMLElement | null;
  if (!noteNode) return null;
  const commentText = normalizeDedaoGuiText(noteNode.innerText || noteNode.textContent || '');
  if (!commentText) return null;
  return {
    opened: true,
    markerText: marker.text,
    commentText,
    quoteText: defaultReadQuoteText(doc, marker),
  };
}

export async function extractDedaoGuiNotesFromDocument(
  options: DedaoGuiNotesExtractorOptions = {},
): Promise<DedaoGuiNote[]> {
  const doc = options.document || document;
  const waitTimeoutMs = Math.max(100, Math.floor(Number(options.waitTimeoutMs) || DEFAULT_WAIT_TIMEOUT_MS));
  const pollIntervalMs = Math.max(10, Math.floor(Number(options.pollIntervalMs) || DEFAULT_WAIT_INTERVAL_MS));
  const clickMarker =
    options.clickMarker ||
    ((marker: DedaoGuiNoteMarker) =>
      defaultClickMarker(marker, {
        document: doc,
        waitTimeoutMs,
        pollIntervalMs,
      }));
  const readCurrentNote = options.readCurrentNote || defaultReadCurrentNote;
  const closeCurrentNote = options.closeCurrentNote || (() => {});

  const markers = collectDedaoGuiNoteMarkers(doc);
  const collected: DedaoGuiNote[] = [];
  const visitedMarkerKeys = new Set<string>();

  for (const marker of markers) {
    if (visitedMarkerKeys.has(marker.visitKey)) continue;
    visitedMarkerKeys.add(marker.visitKey);

    const clicked = (await clickMarker(marker)) || null;
    const openedNote = (await readCurrentNote({ document: doc, marker })) || null;

    const merged = {
      markerText: marker.text,
      ...clicked,
      ...openedNote,
      quoteText:
        normalizeDedaoGuiText(openedNote?.quoteText) ||
        normalizeDedaoGuiText(clicked?.quoteText) ||
        defaultReadQuoteText(doc, marker),
      commentText:
        normalizeDedaoGuiText(openedNote?.commentText) || normalizeDedaoGuiText(clicked?.commentText),
      externalId: normalizeDedaoGuiText(openedNote?.externalId) || normalizeDedaoGuiText(clicked?.externalId),
      range: normalizeDedaoGuiText(openedNote?.range) || normalizeDedaoGuiText(clicked?.range),
    };

    const normalized = normalizeDedaoGuiNote(merged);
    if (normalized) collected.push(normalized);

    await closeCurrentNote({ document: doc, marker });
  }

  return dedupeDedaoGuiNotes(collected);
}
