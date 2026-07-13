import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { createCommentDomTextIndex } from '../../src/services/comments/locator/dom-text-index';

function fixture() {
  const html = fs.readFileSync(path.join(process.cwd(), 'tests/fixtures/comments/dom-text-model.html'), 'utf8');
  const dom = new JSDOM(html);
  return dom.window.document.getElementById('root')!;
}

describe('comment dom text index', () => {
  test('indexes visible text, br, and preserves emoji/ZWJ', () => {
    const index = createCommentDomTextIndex(fixture());
    expect(index.version).toBe('dom-text-v2');
    expect(index.text).toBe('Hello world\n 👨‍👩‍👧‍👦');
  });

  test('maps range boundaries to global offsets and back', () => {
    const root = fixture();
    const hello = root.firstChild!;
    const world = root.querySelector('span')!.firstChild!;
    const range = root.ownerDocument.createRange();
    range.setStart(hello, 2);
    range.setEnd(world, 3);
    const index = createCommentDomTextIndex(root);
    expect(index.rangeToOffsets(range)).toEqual({ start: 2, end: 9 });
    expect(index.offsetsToRange(2, 9)?.toString()).toBe('llo wor');
  });

  test('rejects invalid offsets and empty ranges', () => {
    const index = createCommentDomTextIndex(fixture());
    expect(index.offsetToBoundary(-1)).toBeNull();
    expect(index.offsetsToRange(4, 4)).toBeNull();
    expect(index.offsetsToRange(0, index.text.length + 1)).toBeNull();
  });
});
