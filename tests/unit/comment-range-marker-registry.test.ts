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
    const registry = createCommentRangeMarkerRegistry({
      document: dom.window.document,
      window: dom.window as unknown as Window,
    });
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
    expect(layer.style.zIndex).toBe('2147483600');
    expect(layer.style.pointerEvents).toBe('none');
    expect(layer.style.getPropertyValue('--webclipper-comment-marker-accent')).toBe('rgb(1 2 3)');
    expect(marker.style.position).toBe('absolute');
    expect(marker.style.pointerEvents).toBe('none');
    expect(marker.style.borderRadius).toBe('0px');
    expect(marker.dataset.tone).toBe('passive');
    expect(marker.style.top).toBe('19px');
    expect(marker.style.height).toBe('1px');
    expect(marker.style.background).toContain('62%');
    expect(marker.style.boxShadow).toBe('');
    expect(marker.style.opacity).toBe('0.78');

    registry.setActive(1);
    registry.refresh();
    const active = dom.window.document.querySelector('[data-comment-id="1"]') as HTMLElement;
    expect(active.dataset.tone).toBe('active');
    expect(active.style.top).toBe('18px');
    expect(active.style.height).toBe('2px');
    expect(active.style.background).toContain('88%');
    expect(active.style.boxShadow).toBe('');
    expect(active.style.opacity).toBe('1');
  });

  test('uses native text highlights for app ranges so browser clipping and stacking stay authoritative', () => {
    const dom = new JSDOM('<html><head></head><body><aside id="panel"></aside><p>hello world</p></body></html>', {
      url: 'https://example.com/',
    });
    const registered = new Map<string, { priority: number; ranges: AbstractRange[] }>();
    class FakeHighlight {
      priority = 0;
      type = 'highlight' as const;
      readonly ranges: AbstractRange[];

      constructor(...ranges: AbstractRange[]) {
        this.ranges = ranges;
      }

      forEach(callback: (value: AbstractRange, key: AbstractRange, parent: Highlight) => void) {
        for (const range of this.ranges) callback(range, range, this as unknown as Highlight);
      }
    }
    Object.defineProperty(dom.window, 'CSS', {
      configurable: true,
      value: {
        highlights: {
          set(name: string, highlight: FakeHighlight) {
            registered.set(name, { priority: highlight.priority, ranges: highlight.ranges });
          },
          delete(name: string) {
            return registered.delete(name);
          },
        },
      },
    });
    Object.defineProperty(dom.window, 'Highlight', { configurable: true, value: FakeHighlight });
    const styleSource = dom.window.document.querySelector('#panel')!;
    (styleSource as HTMLElement).style.setProperty('--panel-accent', 'rgb(1 2 3)');
    const registry = createCommentRangeMarkerRegistry({
      document: dom.window.document,
      window: dom.window as unknown as Window,
      styleSource,
      renderMode: 'native',
    });

    registry.replace(1, fakeRange(dom.window.document, 10));

    expect(dom.window.document.querySelector('.webclipper-comment-range-markers')).toBeNull();
    const style = dom.window.document.querySelector('[data-webclipper-comment-highlights]') as HTMLStyleElement;
    expect(style.textContent).toContain('::highlight(webclipper-comment-passive-');
    expect(style.textContent).toContain('text-decoration-line: underline');
    expect(style.textContent).toContain('text-decoration-thickness: 1px');
    expect(Array.from(registered.keys()).some((name) => name.includes('passive'))).toBe(true);

    registry.setActive(1);
    const active = Array.from(registered.entries()).find(([name]) => name.includes('active'));
    expect(active?.[1].priority).toBe(1);
    expect(active?.[1].ranges).toHaveLength(1);

    registry.dispose();
    expect(registered.size).toBe(0);
    expect(dom.window.document.querySelector('[data-webclipper-comment-highlights]')).toBeNull();
  });

  test('does not fall back to a global overlay when native highlights are unavailable', () => {
    const dom = new JSDOM('<body></body>', { url: 'https://example.com/' });
    const registry = createCommentRangeMarkerRegistry({
      document: dom.window.document,
      window: dom.window as unknown as Window,
      renderMode: 'native',
    });

    registry.replace(1, fakeRange(dom.window.document, 10));

    expect(dom.window.document.querySelector('.webclipper-comment-range-markers')).toBeNull();
    expect(dom.window.document.querySelector('[data-webclipper-comment-highlights]')).toBeNull();
    registry.dispose();
  });

  test('switches active/passive state', () => {
    const dom = new JSDOM('<body></body>', { url: 'https://example.com/' });
    const registry = createCommentRangeMarkerRegistry({
      document: dom.window.document,
      window: dom.window as unknown as Window,
    });
    registry.replace(1, fakeRange(dom.window.document, 10));
    registry.replace(2, fakeRange(dom.window.document, 20));
    registry.setActive(2);
    registry.refresh();
    expect(dom.window.document.querySelector('[data-comment-id="1"]')?.className).toContain('is-passive');
    expect(dom.window.document.querySelector('[data-comment-id="2"]')?.className).toContain('is-active');
  });

  test('dispose removes listeners, entries, and DOM rects', () => {
    const dom = new JSDOM('<body></body>', { url: 'https://example.com/' });
    const registry = createCommentRangeMarkerRegistry({
      document: dom.window.document,
      window: dom.window as unknown as Window,
    });
    registry.replace(1, fakeRange(dom.window.document, 10));
    registry.refresh();
    registry.dispose();
    expect(registry.size()).toBe(0);
    expect(dom.window.document.querySelector('.webclipper-comment-range-markers')).toBeNull();
  });
  test('refreshes geometry from observed roots and disconnects on dispose', () => {
    const dom = new JSDOM('<body><main id="source"></main><section id="scroll"></section></body>', {
      url: 'https://example.com/',
    });
    const sourceRoot = dom.window.document.querySelector('#source')!;
    const scrollRoot = dom.window.document.querySelector('#scroll')!;
    let left = 10;
    const range = {
      cloneRange: () => range,
      getClientRects: () => [{ left, top: 10, right: left + 20, bottom: 20, width: 20, height: 10 }],
    } as unknown as Range;
    const observed: Element[] = [];
    let disconnected = 0;
    let notifyResize = () => {};
    class FakeResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this as unknown as ResizeObserver);
      }
      observe(element: Element) {
        observed.push(element);
      }
      unobserve() {}
      disconnect() {
        disconnected += 1;
      }
    }
    Object.defineProperty(dom.window, 'ResizeObserver', {
      configurable: true,
      value: FakeResizeObserver,
    });

    const registry = createCommentRangeMarkerRegistry({
      document: dom.window.document,
      window: dom.window as unknown as Window,
      getGeometryRoots: () => [sourceRoot, scrollRoot],
    });
    registry.replace(1, range);
    registry.refresh();
    expect(observed).toEqual([sourceRoot, scrollRoot]);
    expect((dom.window.document.querySelector('[data-comment-id="1"]') as HTMLElement).style.left).toBe('10px');

    left = 44;
    notifyResize();
    expect((dom.window.document.querySelector('[data-comment-id="1"]') as HTMLElement).style.left).toBe('44px');

    registry.dispose();
    expect(disconnected).toBe(1);
  });
});
