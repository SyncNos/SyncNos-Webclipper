import type { ReaderTtsSentence } from '@services/reader/tts/reader-tts-engine';

const FORBIDDEN_SENTENCE_DECORATION_SELECTOR = 'script, style, pre, code, kbd, samp, select, textarea, button';

export type ReaderSentenceRectLike = {
  top: number;
  bottom: number;
};

export type ReaderSentenceCandidate = {
  index: number;
  rect: ReaderSentenceRectLike;
};

export type ReaderSentenceTextSegment = {
  node: Text;
  start: number;
  end: number;
};

type ReaderSentencePoint = {
  node: Text;
  offset: number;
};

function normalizeRect(rect: ReaderSentenceRectLike | null | undefined): ReaderSentenceRectLike | null {
  if (!rect || !Number.isFinite(rect.top) || !Number.isFinite(rect.bottom) || rect.bottom < rect.top) {
    return null;
  }
  return { top: rect.top, bottom: rect.bottom };
}

function normalizeCandidates(candidates: ReaderSentenceCandidate[]): ReaderSentenceCandidate[] {
  if (!Array.isArray(candidates) || !candidates.length) return [];
  return candidates
    .map((candidate) => {
      const rect = normalizeRect(candidate.rect);
      if (!rect) return null;
      return {
        index: Number(candidate.index),
        rect,
      } satisfies ReaderSentenceCandidate;
    })
    .filter((candidate): candidate is ReaderSentenceCandidate => !!candidate && Number.isFinite(candidate.index))
    .sort((left, right) => left.index - right.index);
}

function isForbiddenSentenceContainer(element: Element | null): boolean {
  if (!element) return true;
  return Boolean(element.closest(FORBIDDEN_SENTENCE_DECORATION_SELECTOR));
}

export function collectReaderSentenceTextSegments(root: HTMLElement): ReaderSentenceTextSegment[] {
  const segments: ReaderSentenceTextSegment[] = [];
  let offset = 0;

  const visit = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!isReaderSentenceDecoratableTextNode(node)) return;
      const text = node.textContent ?? '';
      if (!text) return;
      const start = offset;
      offset += text.length;
      segments.push({ node: node as Text, start, end: offset });
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const element = node as Element;
    if (isForbiddenSentenceContainer(element)) return;

    for (const child of Array.from(element.childNodes)) {
      visit(child);
    }
  };

  visit(root);
  return segments;
}

function resolvePointAtOffset(
  segments: ReaderSentenceTextSegment[],
  offset: number,
  preferEnd: boolean,
): ReaderSentencePoint | null {
  if (!segments.length || !Number.isFinite(offset) || offset < 0) return null;

  const totalLength = segments[segments.length - 1]?.end ?? 0;
  if (offset > totalLength) return null;

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    if (offset < segment.end) {
      return {
        node: segment.node,
        offset: Math.max(0, offset - segment.start),
      };
    }
    if (offset === segment.end) {
      if (preferEnd || index === segments.length - 1) {
        return { node: segment.node, offset: segment.node.data.length };
      }
    }
  }

  const last = segments[segments.length - 1];
  return last ? { node: last.node, offset: last.node.data.length } : null;
}

export function isReaderSentenceDecoratableTextNode(node: Node | null): node is Text {
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const text = node.textContent ?? '';
  if (!text) return false;
  return !isForbiddenSentenceContainer(node.parentElement);
}

export function findReaderSentenceRange(
  root: HTMLElement,
  sentence: ReaderTtsSentence,
  segments?: ReaderSentenceTextSegment[],
): Range | null {
  if (!root || !sentence) return null;
  const doc = root.ownerDocument ?? (typeof document !== 'undefined' ? document : null);
  if (!doc) return null;

  const resolvedSegments = segments ?? collectReaderSentenceTextSegments(root);
  const start = resolvePointAtOffset(resolvedSegments, sentence.start, false);
  const end = resolvePointAtOffset(resolvedSegments, sentence.end, true);
  if (!start || !end) return null;

  const range = doc.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);
  return range;
}

export function findReaderSentenceRangeByIndex(
  root: HTMLElement,
  sentences: ReaderTtsSentence[],
  sentenceIndex: number,
  segments?: ReaderSentenceTextSegment[],
): Range | null {
  const sentence = Array.isArray(sentences) ? sentences[sentenceIndex] : null;
  if (!sentence) return null;
  return findReaderSentenceRange(root, sentence, segments);
}

export function findReaderSentenceElementAtOffset(
  root: HTMLElement,
  sentence: ReaderTtsSentence,
  offset: number = sentence.start,
  segments?: ReaderSentenceTextSegment[],
): HTMLElement | null {
  if (!root || !sentence) return null;
  const resolvedSegments = segments ?? collectReaderSentenceTextSegments(root);
  const point = resolvePointAtOffset(resolvedSegments, offset, false);
  return point?.node.parentElement ?? null;
}

export function findReaderSentenceIndexFromTarget(target: EventTarget | null): number | null {
  if (!target) return null;
  const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
  const decorated = element?.closest('[data-reader-sentence-index]') ?? null;
  if (!decorated) return null;
  const raw = decorated.getAttribute('data-reader-sentence-index');
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : null;
}

export function pickFirstVisibleSentenceIndex(
  items: ReaderSentenceCandidate[],
  viewportRect: ReaderSentenceRectLike,
): number {
  const candidates = normalizeCandidates(items);
  const viewport = normalizeRect(viewportRect);
  if (!candidates.length || !viewport) return 0;

  let lastAboveIndex: number | null = null;
  for (const candidate of candidates) {
    const { top, bottom } = candidate.rect;
    if (bottom > viewport.top && top < viewport.bottom) {
      return candidate.index;
    }
    if (bottom <= viewport.top) {
      lastAboveIndex = candidate.index;
    }
  }

  return lastAboveIndex ?? candidates[0].index;
}

function readViewportRect(root: HTMLElement): ReaderSentenceRectLike {
  const view = root.ownerDocument?.defaultView ?? globalThis.window ?? null;
  const height = Number(view?.innerHeight);
  if (!Number.isFinite(height) || height <= 0) return { top: 0, bottom: 0 };
  return { top: 0, bottom: height };
}

export function readFirstVisibleSentenceIndexFromSentences(
  root: HTMLElement,
  sentences: ReaderTtsSentence[],
): number {
  if (!root || !Array.isArray(sentences) || !sentences.length) return 0;

  const segments = collectReaderSentenceTextSegments(root);
  const candidates = sentences
    .map((sentence) => {
      const range = findReaderSentenceRange(root, sentence, segments);
      if (!range || typeof range.getBoundingClientRect !== 'function') return null;
      const rect = range.getBoundingClientRect();
      if (!Number.isFinite(rect.top) || !Number.isFinite(rect.bottom)) return null;
      return {
        index: sentence.index,
        rect: { top: rect.top, bottom: rect.bottom },
      } satisfies ReaderSentenceCandidate;
    })
    .filter((candidate): candidate is ReaderSentenceCandidate => candidate !== null);

  return pickFirstVisibleSentenceIndex(candidates, readViewportRect(root));
}
