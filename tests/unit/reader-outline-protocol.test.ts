import { describe, expect, it } from 'vitest';

import {
  pickReaderOutlineActiveIndex,
  readerOutlineLevelToMinimapToken,
  readerOutlineLevelToMinimapWidth,
  type ReaderOutlineCandidate,
} from '../../src/services/protocols/reader-outline';

function candidate(index: number, top: number, bottom: number): ReaderOutlineCandidate {
  return {
    index,
    level: 2,
    id: `sec-${index}`,
    title: `Section ${index}`,
    rect: { top, bottom },
  };
}

describe('reader-outline protocol', () => {
  it('maps heading levels to minimap tokens and widths', () => {
    expect(readerOutlineLevelToMinimapToken(1)).toBe('lvl-1');
    expect(readerOutlineLevelToMinimapToken(2)).toBe('lvl-2');
    expect(readerOutlineLevelToMinimapToken(3)).toBe('lvl-3');

    expect(readerOutlineLevelToMinimapWidth(1)).toBe(22);
    expect(readerOutlineLevelToMinimapWidth(2)).toBe(15);
    expect(readerOutlineLevelToMinimapWidth(3)).toBe(9);
  });

  it('picks the latest heading that crossed the spy line', () => {
    const active = pickReaderOutlineActiveIndex({
      viewportRect: { top: 0, bottom: 600 },
      candidates: [candidate(0, 24, 60), candidate(1, 118, 164), candidate(2, 240, 300)],
    });

    expect(active).toBe(1);
  });

  it('falls back to the first heading when none crossed the spy line yet', () => {
    const active = pickReaderOutlineActiveIndex({
      viewportRect: { top: 0, bottom: 600 },
      candidates: [candidate(0, 220, 260), candidate(1, 360, 420)],
    });

    expect(active).toBe(0);
  });

  it('returns null when there are no headings', () => {
    expect(pickReaderOutlineActiveIndex({ viewportRect: { top: 0, bottom: 600 }, candidates: [] })).toBeNull();
  });
});
