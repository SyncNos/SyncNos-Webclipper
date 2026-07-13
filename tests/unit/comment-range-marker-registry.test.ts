import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { createCommentRangeMarkerRegistry } from '../../src/ui/comments/range-marker-registry';

function fakeRange(document: Document, left: number): Range {
  return {
    cloneRange: () => fakeRange(document, left),
    getClientRects: () => [{ left, top: 10, right: left + 20, bottom: 20, width: 20, height: 10 }],
  } as unknown as Range;
}

describe('comment range marker registry', () => {
  test('atomically replaces markers for the same comment', () => {
    const dom = new JSDOM('<body></body>', { url: 'https://example.com/' });
    const registry = createCommentRangeMarkerRegistry({ document: dom.window.document, window: dom.window as unknown as Window });
    registry.replace(1, fakeRange(dom.window.document, 10));
    registry.refresh();
    registry.replace(1, fakeRange(dom.window.document, 30));
    registry.refresh();
    const markers = dom.window.document.querySelectorAll('[data-comment-id="1"]');
    expect(markers).toHaveLength(1);
    expect((markers[0] as HTMLElement).style.left).toBe('30px');
  });

  test('switches active/passive state', () => {
    const dom = new JSDOM('<body></body>', { url: 'https://example.com/' });
    const registry = createCommentRangeMarkerRegistry({ document: dom.window.document, window: dom.window as unknown as Window });
    registry.replace(1, fakeRange(dom.window.document, 10));
    registry.replace(2, fakeRange(dom.window.document, 20));
    registry.setActive(2);
    registry.refresh();
    expect(dom.window.document.querySelector('[data-comment-id="1"]')?.className).toContain('is-passive');
    expect(dom.window.document.querySelector('[data-comment-id="2"]')?.className).toContain('is-active');
  });

  test('dispose removes listeners, entries, and DOM rects', () => {
    const dom = new JSDOM('<body></body>', { url: 'https://example.com/' });
    const registry = createCommentRangeMarkerRegistry({ document: dom.window.document, window: dom.window as unknown as Window });
    registry.replace(1, fakeRange(dom.window.document, 10));
    registry.refresh();
    registry.dispose();
    expect(registry.size()).toBe(0);
    expect(dom.window.document.querySelector('.webclipper-comment-range-markers')).toBeNull();
  });
});
