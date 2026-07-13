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

  test('owns document-level geometry and visual styles outside the panel shadow root', () => {
    const dom = new JSDOM('<body><aside id="panel"></aside></body>', { url: 'https://example.com/' });
    const styleSource = dom.window.document.querySelector('#panel')!;
    (styleSource as HTMLElement).style.setProperty('--panel-accent', 'rgb(1 2 3)');
    (styleSource as HTMLElement).style.setProperty('--radius-inline', '6px');
    const registry = createCommentRangeMarkerRegistry({
      document: dom.window.document,
      window: dom.window as unknown as Window,
      styleSource,
    });

    registry.replace(1, fakeRange(dom.window.document, 10));
    registry.refresh();

    const layer = dom.window.document.querySelector('.webclipper-comment-range-markers') as HTMLElement;
    const marker = dom.window.document.querySelector('[data-comment-id="1"]') as HTMLElement;
    expect(layer.style.position).toBe('absolute');
    expect(layer.style.pointerEvents).toBe('none');
    expect(layer.style.getPropertyValue('--webclipper-comment-marker-accent')).toBe('rgb(1 2 3)');
    expect(layer.style.getPropertyValue('--webclipper-comment-marker-radius')).toBe('6px');
    expect(marker.style.position).toBe('absolute');
    expect(marker.style.pointerEvents).toBe('none');
    expect(marker.style.borderRadius).toBe('var(--webclipper-comment-marker-radius)');
    expect(marker.style.background).toContain('18%');
    expect(marker.style.outline).toContain('1px');

    registry.setActive(1);
    registry.refresh();
    const active = dom.window.document.querySelector('[data-comment-id="1"]') as HTMLElement;
    expect(active.style.background).toContain('32%');
    expect(active.style.outline).toContain('2px');
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
