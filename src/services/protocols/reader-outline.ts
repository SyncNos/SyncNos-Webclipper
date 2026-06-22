export const READER_OUTLINE_LEVELS = [1, 2, 3] as const;

export type ReaderOutlineLevel = (typeof READER_OUTLINE_LEVELS)[number];

export type ReaderOutlineMinimapToken = `lvl-${ReaderOutlineLevel}`;

export type ReaderOutlineCandidateRect = {
  top: number;
  bottom: number;
};

export type ReaderOutlineEntry = {
  index: number;
  level: ReaderOutlineLevel;
  id: string;
  title: string;
};

export type ReaderOutlineCandidate = ReaderOutlineEntry & {
  rect: ReaderOutlineCandidateRect;
};

const READER_OUTLINE_MINIMAP_WIDTHS: Record<ReaderOutlineLevel, number> = {
  1: 22,
  2: 15,
  3: 9,
};

function normalizeRect(rect: ReaderOutlineCandidateRect | null | undefined): ReaderOutlineCandidateRect | null {
  if (!rect || !Number.isFinite(rect.top) || !Number.isFinite(rect.bottom) || rect.bottom < rect.top) {
    return null;
  }
  return { top: rect.top, bottom: rect.bottom };
}

function normalizeCandidates(candidates: ReaderOutlineCandidate[]): ReaderOutlineCandidate[] {
  if (!Array.isArray(candidates) || !candidates.length) return [];
  return candidates
    .map((candidate) => {
      const rect = normalizeRect(candidate.rect);
      if (!rect) return null;
      return {
        index: Number(candidate.index),
        level: candidate.level,
        id: String(candidate.id || ''),
        title: String(candidate.title || ''),
        rect,
      } satisfies ReaderOutlineCandidate;
    })
    .filter((candidate): candidate is ReaderOutlineCandidate => {
      return !!candidate && Number.isFinite(candidate.index) && candidate.index >= 0;
    })
    .sort((left, right) => left.index - right.index);
}

function computeSpyLineY(viewportRect: ReaderOutlineCandidateRect): number {
  const height = Math.max(0, viewportRect.bottom - viewportRect.top);
  return viewportRect.top + Math.min(140, height * 0.3);
}

export function readerOutlineLevelToMinimapToken(level: ReaderOutlineLevel): ReaderOutlineMinimapToken {
  return `lvl-${level}` as ReaderOutlineMinimapToken;
}

export function readerOutlineLevelToMinimapWidth(level: ReaderOutlineLevel): number {
  return READER_OUTLINE_MINIMAP_WIDTHS[level] ?? READER_OUTLINE_MINIMAP_WIDTHS[1];
}

export function pickReaderOutlineActiveIndex(input: {
  viewportRect: ReaderOutlineCandidateRect;
  candidates: ReaderOutlineCandidate[];
}): number | null {
  const candidates = normalizeCandidates(input.candidates);
  const viewportRect = normalizeRect(input.viewportRect);
  if (!candidates.length) return null;
  if (!viewportRect) return candidates[0].index;

  const spyLineY = computeSpyLineY(viewportRect);
  let activeIndex = candidates[0].index;
  for (const candidate of candidates) {
    if (candidate.rect.top <= spyLineY) {
      activeIndex = candidate.index;
    }
  }
  return activeIndex;
}
