// Framework-agnostic narration engine for the reader.
//
// P4-T1 lands the pure, deterministic core: sentence segmentation + the shared
// type surface. The stateful ReaderTtsEngine (Web tier + lifecycle) arrives in
// P4-T2, and the AI tier in P5-T1. Keeping this file free of React/DOM imports
// lets the segmentation logic be unit-tested in the node test environment.

export type ReaderTtsState = 'idle' | 'loading' | 'playing' | 'paused';

export type ReaderTtsSentence = {
  index: number;
  text: string;
  /** Character offset into the original source text (for DOM mapping if needed). */
  start: number;
  end: number;
};

export type ReaderTtsListeners = {
  onState?: (state: ReaderTtsState) => void;
  onSentence?: (index: number, sentence: ReaderTtsSentence | null) => void;
  onError?: (error: Error) => void;
};

// Greedy run of non-terminator chars followed by any trailing terminators.
// Terminators: Latin . ! ? plus CJK fullwidth \u3002 \uff01 \uff1f \uff0e and newline.
const SENTENCE_BREAK_RE = /[^.!?\u3002\uff01\uff1f\uff0e\n]+[.!?\u3002\uff01\uff1f\uff0e\n]*/g;

/**
 * Split source text into sentences with CJK + Latin punctuation awareness.
 *
 * - Empty / whitespace-only input -> `[]`.
 * - Text with no terminator punctuation -> a single trimmed sentence (fallback).
 * - `start`/`end` are character offsets into the original (untrimmed) source so
 *   callers can map a sentence back onto DOM ranges later.
 */
export function buildSentences(source: string): ReaderTtsSentence[] {
  const text = String(source || '');
  if (!text.trim()) return [];
  const out: ReaderTtsSentence[] = [];
  SENTENCE_BREAK_RE.lastIndex = 0;
  let match: RegExpExecArray | null = null;
  let index = 0;
  while ((match = SENTENCE_BREAK_RE.exec(text)) != null) {
    const raw = match[0];
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const start = match.index + (raw.length - raw.trimStart().length);
    out.push({ index: index++, text: trimmed, start, end: start + trimmed.length });
  }
  if (!out.length) {
    const trimmed = text.trim();
    out.push({ index: 0, text: trimmed, start: 0, end: trimmed.length });
  }
  return out;
}
