import { describe, it, expect } from 'vitest';
import { buildSentences } from '@services/reader/tts/reader-tts-engine';

describe('buildSentences', () => {
  it('returns [] for empty or whitespace-only input', () => {
    expect(buildSentences('')).toEqual([]);
    expect(buildSentences('   ')).toEqual([]);
    expect(buildSentences('\n\t  \n')).toEqual([]);
    // non-string coercion guard
    expect(buildSentences(undefined as unknown as string)).toEqual([]);
  });

  it('falls back to a single sentence when there is no terminator punctuation', () => {
    const out = buildSentences('just some plain text');
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ index: 0, text: 'just some plain text' });
  });

  it('splits on CJK fullwidth punctuation', () => {
    const out = buildSentences('\u7b2c\u4e00\u53e5\u3002\u7b2c\u4e8c\u53e5\uff01\u7b2c\u4e09\u53e5\uff1f');
    expect(out.map((s) => s.text)).toEqual([
      '\u7b2c\u4e00\u53e5\u3002',
      '\u7b2c\u4e8c\u53e5\uff01',
      '\u7b2c\u4e09\u53e5\uff1f',
    ]);
    expect(out.map((s) => s.index)).toEqual([0, 1, 2]);
  });

  it('splits mixed Latin + CJK sentences', () => {
    const out = buildSentences('Hello world. \u4f60\u597d\u4e16\u754c\u3002How are you?');
    expect(out.map((s) => s.text)).toEqual(['Hello world.', '\u4f60\u597d\u4e16\u754c\u3002', 'How are you?']);
  });

  it('treats newlines as sentence breaks', () => {
    const out = buildSentences('Line one\nLine two\nLine three');
    expect(out.map((s) => s.text)).toEqual(['Line one', 'Line two', 'Line three']);
  });

  it('records trimmed char offsets into the original source', () => {
    const out = buildSentences('  \u4f60\u597d\u3002\u4e16\u754c\u3002');
    expect(out).toHaveLength(2);
    // leading two spaces skipped: first sentence starts at offset 2
    expect(out[0]).toMatchObject({ index: 0, text: '\u4f60\u597d\u3002', start: 2, end: 5 });
    expect(out[1]).toMatchObject({ index: 1, text: '\u4e16\u754c\u3002', start: 5, end: 8 });
  });
});
