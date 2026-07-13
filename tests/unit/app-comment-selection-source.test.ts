import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { createAppCommentSelectionSource } from '../../src/ui/comments/app-comment-selection-source';

describe('app comment selection source', () => {
  test('reads selection from the source ownerDocument and emits V2', () => {
    const document = new JSDOM('<main><article>hello world</article></main>').window.document;
    const sourceRoot = document.querySelector('article')!;
    const range = document.createRange();
    range.setStart(sourceRoot.firstChild!, 6);
    range.setEnd(sourceRoot.firstChild!, 11);
    const selection = { rangeCount: 1, getRangeAt: () => range } as unknown as Selection;
    const read = createAppCommentSelectionSource({
      getSurfaceRoots: () => ({ sourceRoot, scrollRoot: document.querySelector('main')! }),
      getSelection: () => selection,
    });
    expect(read()).toMatchObject({ selectionText: 'world', locator: { v: 2, surfaceHint: 'app' } });
  });

  test('rejects missing, collapsed, outside, and excluded selections', () => {
    const document = new JSDOM(
      '<main><article>inside</article><aside>outside</aside><section id="panel">panel</section></main>',
    ).window.document;
    const sourceRoot = document.querySelector('article')!;
    const outside = document.querySelector('aside')!.firstChild!;
    const panel = document.querySelector('#panel')!;
    const make = (range: Range | null) =>
      createAppCommentSelectionSource({
        getSurfaceRoots: () => ({ sourceRoot, scrollRoot: document.querySelector('main')! }),
        getSelection: () => (range ? ({ rangeCount: 1, getRangeAt: () => range } as unknown as Selection) : null),
        getExcludedRoots: () => [panel],
      })();
    expect(make(null)).toEqual({ selectionText: '', locator: null });
    const collapsed = document.createRange();
    collapsed.setStart(sourceRoot.firstChild!, 1);
    collapsed.collapse(true);
    expect(make(collapsed)).toEqual({ selectionText: '', locator: null });
    const external = document.createRange();
    external.selectNodeContents(outside);
    expect(make(external)).toEqual({ selectionText: '', locator: null });
  });
});
