import type { ReaderTtsSentence } from '@services/reader/tts/reader-tts-engine';
import {
  collectReaderSentenceTextSegments,
  findReaderSentenceRangeByIndex,
  pickFirstVisibleSentenceIndex,
  type ReaderSentenceCandidate,
  type ReaderSentenceRectLike,
} from '@ui/reader/reader-sentence-dom';
import {
  publishReaderPerformanceStats,
  readReaderPerformanceClock,
} from '@ui/reader/reader-performance-debug';

export const READER_SENTENCE_SOURCE_ATTR = 'data-reader-sentence-source';
export const READER_SENTENCE_INDEX_ATTR = 'data-reader-sentence-index';
export const READER_SENTENCE_DECORATION_STATUS_ATTR = 'data-reader-sentence-decoration';
export const READER_SENTENCE_DECORATION_PENDING = 'pending';
export const READER_SENTENCE_DECORATION_READY = 'ready';
export const READER_SENTENCE_CLASS = 'reader-tts-sentence';
export const READER_CURRENT_SENTENCE_CLASS = 'reader-tts-sentence-active';
export const READER_INITIAL_SENTENCE_DECORATION_BATCH_SIZE = 48;
export const READER_REDECORATE_SETTLE_MS = 180;
export const READER_EAGER_DECORATION_SENTENCE_LIMIT = 400;
export const READER_EAGER_DECORATION_SOURCE_LENGTH_LIMIT = 16000;

function unwrapReaderSentenceSpan(span: HTMLElement): void {
  const parent = span.parentNode;
  if (!parent) return;
  while (span.firstChild && span.parentNode === parent) {
    parent.insertBefore(span.firstChild, span);
  }
  if (span.parentNode === parent) {
    parent.removeChild(span);
  }
}

export function clearReaderSentenceDecorations(root: HTMLElement): void {
  const spans = Array.from(root.querySelectorAll<HTMLElement>(`[${READER_SENTENCE_INDEX_ATTR}]`));
  spans.forEach((span) => unwrapReaderSentenceSpan(span));
  root.removeAttribute(READER_SENTENCE_SOURCE_ATTR);
  root.removeAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR);
  root.normalize();
}

export function decorateReaderSentenceRangeBatch(
  root: HTMLElement,
  sentences: ReaderTtsSentence[],
  startIndex: number,
  endIndex: number,
): number {
  const startedAt = readReaderPerformanceClock();
  const segments = collectReaderSentenceTextSegments(root);
  for (let index = endIndex - 1; index >= startIndex; index -= 1) {
    const sentence = sentences[index];
    const range = findReaderSentenceRangeByIndex(root, sentences, index, segments);
    if (!range) continue;

    const fragment = range.extractContents();
    if (!fragment.childNodes.length) continue;

    const span = (root.ownerDocument ?? globalThis.document)?.createElement('span');
    if (!span) continue;
    span.className = READER_SENTENCE_CLASS;
    span.setAttribute(READER_SENTENCE_INDEX_ATTR, String(sentence.index));
    span.appendChild(fragment);
    range.insertNode(span);
  }
  return Math.max(0, readReaderPerformanceClock() - startedAt);
}

export function decorateReaderSentenceSpans(root: HTMLElement, source: string, sentences: ReaderTtsSentence[]): void {
  const doc = root.ownerDocument ?? globalThis.document;
  if (!doc) return;
  if (!sentences.length) {
    root.setAttribute(READER_SENTENCE_SOURCE_ATTR, source);
    root.setAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR, READER_SENTENCE_DECORATION_READY);
    return;
  }
  const batchDuration = decorateReaderSentenceRangeBatch(root, sentences, 0, sentences.length);
  root.setAttribute(READER_SENTENCE_SOURCE_ATTR, source);
  root.setAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR, READER_SENTENCE_DECORATION_READY);
  publishReaderPerformanceStats((current) => ({
    ...current,
    decorateMode: 'sync',
    decoratePasses: current.decoratePasses + 1,
    decorateBatches: current.decorateBatches + 1,
    decorateLastBatchDurationMs: batchDuration,
    decorateLastDurationMs: batchDuration,
    decorateTotalDurationMs: current.decorateTotalDurationMs + batchDuration,
    decorateMaxBatchDurationMs: Math.max(current.decorateMaxBatchDurationMs, batchDuration),
  }));
}

export function decorateReaderSentenceSpansProgressively(
  root: HTMLElement,
  source: string,
  sentences: ReaderTtsSentence[],
  requestFrame: (cb: FrameRequestCallback) => number,
  cancelFrame: ((id: number) => void) | undefined,
  onProgress: () => void,
): () => void {
  let cancelled = false;
  let rafId = 0;
  let nextIndex = 0;

  root.setAttribute(READER_SENTENCE_SOURCE_ATTR, source);
  root.setAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR, READER_SENTENCE_DECORATION_PENDING);

  const step = () => {
    if (cancelled) return;
    const batchEnd = Math.min(nextIndex + READER_INITIAL_SENTENCE_DECORATION_BATCH_SIZE, sentences.length);
    const batchDuration = decorateReaderSentenceRangeBatch(root, sentences, nextIndex, batchEnd);
    nextIndex = batchEnd;
    publishReaderPerformanceStats((current) => ({
      ...current,
      decorateMode: 'progressive',
      decorateBatches: current.decorateBatches + 1,
      decorateLastBatchDurationMs: batchDuration,
      decorateTotalDurationMs: current.decorateTotalDurationMs + batchDuration,
      decorateMaxBatchDurationMs: Math.max(current.decorateMaxBatchDurationMs, batchDuration),
    }));
    if (nextIndex >= sentences.length) {
      root.setAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR, READER_SENTENCE_DECORATION_READY);
      publishReaderPerformanceStats((current) => ({
        ...current,
        decoratePasses: current.decoratePasses + 1,
        decorateLastDurationMs: current.decorateLastDurationMs + 0,
      }));
      onProgress();
      return;
    }
    onProgress();
    rafId = requestFrame(() => step());
  };

  step();
  return () => {
    cancelled = true;
    if (rafId !== 0) cancelFrame?.(rafId);
  };
}

function readReaderSentenceViewportRect(root: HTMLElement): ReaderSentenceRectLike {
  const view = root.ownerDocument?.defaultView ?? globalThis.window ?? null;
  const height = Number(view?.innerHeight);
  if (!Number.isFinite(height) || height <= 0) return { top: 0, bottom: 0 };
  return { top: 0, bottom: height };
}

function readReaderSentenceCandidates(root: HTMLElement): ReaderSentenceCandidate[] {
  return Array.from(root.querySelectorAll<HTMLElement>(`[${READER_SENTENCE_INDEX_ATTR}]`))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const index = Number(element.getAttribute(READER_SENTENCE_INDEX_ATTR));
      return {
        index: Number.isFinite(index) ? Math.trunc(index) : -1,
        rect: { top: rect.top, bottom: rect.bottom },
      } satisfies ReaderSentenceCandidate;
    })
    .filter((candidate) => candidate.index >= 0);
}

export function readFirstVisibleReaderSentenceIndex(root: HTMLElement): number {
  return pickFirstVisibleSentenceIndex(readReaderSentenceCandidates(root), readReaderSentenceViewportRect(root));
}
