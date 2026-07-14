import { afterEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import { clampSidebarWidthPxForViewport, installSidebarResize } from '@ui/comments/resize';

describe('clampSidebarWidthPxForViewport', () => {
  it('clamps to min width for tiny viewports', () => {
    expect(clampSidebarWidthPxForViewport(100, { isOverlay: false, viewportWidth: 600 })).toBe(320);
    expect(clampSidebarWidthPxForViewport(100, { isOverlay: true, viewportWidth: 340 })).toBe(320);
  });

  it('clamps to max width respecting overlay/non-overlay caps', () => {
    expect(clampSidebarWidthPxForViewport(900, { isOverlay: false, viewportWidth: 1200 })).toBe(720);
    expect(clampSidebarWidthPxForViewport(900, { isOverlay: true, viewportWidth: 800 })).toBe(720);
  });

  it('keeps width when already in allowed range', () => {
    expect(clampSidebarWidthPxForViewport(500, { isOverlay: false, viewportWidth: 1200 })).toBe(500);
    expect(clampSidebarWidthPxForViewport(420, { isOverlay: true, viewportWidth: 900 })).toBe(420);
  });
});

describe('installSidebarResize lifecycle', () => {
  afterEach(() => {
    delete (globalThis as any).window;
    delete (globalThis as any).document;
    delete (globalThis as any).HTMLElement;
    delete (globalThis as any).addEventListener;
    delete (globalThis as any).removeEventListener;
    delete (globalThis as any).innerWidth;
  });

  it('cleans an active drag exactly once and ignores events after disposal', () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
    Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
    Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
    Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
    Object.defineProperty(globalThis, 'addEventListener', {
      configurable: true,
      value: dom.window.addEventListener.bind(dom.window),
    });
    Object.defineProperty(globalThis, 'removeEventListener', {
      configurable: true,
      value: dom.window.removeEventListener.bind(dom.window),
    });
    Object.defineProperty(globalThis, 'innerWidth', { configurable: true, writable: true, value: 1200 });

    const panel = document.createElement('div');
    const handle = document.createElement('div');
    document.body.append(panel, handle);
    (handle as any).setPointerCapture = () => {};
    (handle as any).releasePointerCapture = () => {};

    const controller = installSidebarResize({
      panelEl: panel,
      handleEl: handle,
      isOverlay: false,
      readPanelWidthPx: () => 420,
    });
    const down = new dom.window.MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 780 });
    Object.defineProperty(down, 'pointerId', { value: 7 });
    handle.dispatchEvent(down);
    expect(panel.getAttribute('data-resizing')).toBe('1');

    controller.cleanup();
    controller.cleanup();
    expect(panel.getAttribute('data-resizing')).toBeNull();
    const widthAfterCleanup = panel.style.getPropertyValue('--webclipper-comments-panel-width');

    const move = new dom.window.MouseEvent('pointermove', { bubbles: true, clientX: 600 });
    Object.defineProperty(move, 'pointerId', { value: 7 });
    dom.window.dispatchEvent(move);
    expect(panel.style.getPropertyValue('--webclipper-comments-panel-width')).toBe(widthAfterCleanup);
  });
});
