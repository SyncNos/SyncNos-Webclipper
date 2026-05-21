import { afterEach, describe, expect, it } from 'vitest';

import { countWords, countWordsFromMessages } from '@services/shared/word-count';

const originalSegmenter = (Intl as any).Segmenter;

afterEach(() => {
  (Intl as any).Segmenter = originalSegmenter;
});

describe('word-count', () => {
  it('counts words with Intl.Segmenter when available', () => {
    expect(countWords('Hello world')).toBe(2);
  });

  it('falls back to whitespace splitting when Segmenter is unavailable', () => {
    (Intl as any).Segmenter = undefined;
    expect(countWords('a  b')).toBe(2);
  });

  it('prefers contentText over contentMarkdown when aggregating messages', () => {
    expect(
      countWordsFromMessages([
        {
          contentText: 'a b',
          contentMarkdown: '00:01 a b',
        },
      ]),
    ).toBe(2);
  });

  it('uses contentMarkdown when contentText is empty', () => {
    expect(countWordsFromMessages([{ contentText: '' }, { contentMarkdown: 'x y' }])).toBe(2);
  });
});

