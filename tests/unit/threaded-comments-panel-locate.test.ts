import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

vi.mock('../../src/ui/i18n', () => ({
  t: (key: string) => key,
}));

vi.mock('@services/comments/locator/resolve-comment-anchor', () => ({
  resolveCommentAnchor: vi.fn(),
}));

import { resolveCommentAnchor } from '@services/comments/locator/resolve-comment-anchor';
import { mountThreadedCommentsPanel } from '@ui/comments';
import { getCommentSidebarPanelTestDriver } from '../helpers/comment-sidebar-panel-driver';

const locator = {
  v: 1 as const,
  env: 'inpage' as const,
  quote: { type: 'TextQuoteSelector' as const, exact: 'world' },
  position: { type: 'TextPositionSelector' as const, start: 6, end: 11 },
};

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });

  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
  Object.defineProperty(globalThis, 'MutationObserver', { configurable: true, value: dom.window.MutationObserver });
  Object.defineProperty(globalThis, 'getComputedStyle', {
    configurable: true,
    value: dom.window.getComputedStyle.bind(dom.window),
  });
}

function cleanupDom() {
  delete (globalThis as any).window;
  delete (globalThis as any).document;
  delete (globalThis as any).navigator;
  delete (globalThis as any).HTMLElement;
  delete (globalThis as any).Node;
  delete (globalThis as any).MutationObserver;
  delete (globalThis as any).getComputedStyle;
}

async function flushReactScheduler() {
  await Promise.resolve();
  await new Promise<void>((resolve) => {
    if (typeof setImmediate === 'function') {
      setImmediate(resolve);
      return;
    }
    setTimeout(resolve, 0);
  });
  await Promise.resolve();
}

function createResolvedRange(article: HTMLElement): Range {
  const textNode = article.firstChild as Text;
  const range = {
    startContainer: textNode,
    commonAncestorContainer: textNode,
    cloneRange: () => range,
    getBoundingClientRect: () => ({ top: 150, bottom: 170, left: 10, right: 60, width: 50, height: 20 }),
    getClientRects: () => [{ top: 150, bottom: 170, left: 10, right: 60, width: 50, height: 20 }],
  } as unknown as Range;
  return range;
}

function createScrollRoot(): HTMLElement {
  const root = document.createElement('div');
  root.style.overflowY = 'auto';
  Object.defineProperty(root, 'scrollHeight', { configurable: true, value: 1000 });
  Object.defineProperty(root, 'clientHeight', { configurable: true, value: 100 });
  Object.defineProperty(root, 'scrollTop', { configurable: true, writable: true, value: 0 });
  root.getBoundingClientRect = () => ({
    top: 0,
    bottom: 100,
    left: 0,
    right: 400,
    width: 400,
    height: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  (root as any).scrollTo = vi.fn((input: ScrollToOptions) => {
    root.scrollTop = Number(input.top || 0);
  });
  return root;
}

describe('Threaded comments panel locate', () => {
  beforeEach(() => {
    setupDom();
    (resolveCommentAnchor as any).mockReset?.();
  });

  afterEach(async () => {
    await flushReactScheduler();
    cleanupDom();
  });

  it('resolves an exact range, scrolls the explicit surface, and activates its marker', async () => {
    const scrollRoot = createScrollRoot();
    const article = document.createElement('article');
    article.textContent = 'Hello world';
    scrollRoot.appendChild(article);
    document.body.appendChild(scrollRoot);
    const range = createResolvedRange(article);
    (resolveCommentAnchor as any).mockReturnValue({ ok: true, range, root: article, rootIndex: 0 });

    const host = document.createElement('div');
    document.body.appendChild(host);
    const mounted = mountThreadedCommentsPanel(host, {
      overlay: false,
      showHeader: false,
      variant: 'sidebar',
      getLocatorSurfaceRoots: () => ({ sourceRoot: article, scrollRoot }),
    });

    getCommentSidebarPanelTestDriver(mounted.api).setComments([
      {
        id: 1,
        parentId: null,
        createdAt: 1000,
        quoteText: 'world',
        commentText: 'root',
        locator,
      },
      {
        id: 2,
        parentId: 1,
        createdAt: 1100,
        commentText: 'reply',
        locator: null,
      },
    ]);
    await flushReactScheduler();

    const panel = host.querySelector('webclipper-threaded-comments-panel') as HTMLElement;
    const rootComment = panel.shadowRoot!.querySelector('.webclipper-inpage-comments-panel__comment') as HTMLElement;
    rootComment.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    await flushReactScheduler();

    expect(resolveCommentAnchor).toHaveBeenCalled();
    expect((scrollRoot as any).scrollTo).toHaveBeenCalledWith({ top: 70, behavior: 'smooth' });
    expect(document.querySelector('[data-comment-id="1"]')?.className).toContain('is-active');

    const beforeReplyClick = (resolveCommentAnchor as any).mock.calls.length;
    const replyBody = panel.shadowRoot!.querySelector(
      '.webclipper-inpage-comments-panel__reply > .webclipper-inpage-comments-panel__text',
    ) as HTMLElement;
    replyBody.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    await flushReactScheduler();
    expect(resolveCommentAnchor).toHaveBeenCalledTimes(beforeReplyClick);

    mounted.cleanup();
    expect(document.querySelector('.webclipper-comment-range-markers')).toBeNull();
  });

  it('does not invoke the resolver when the surface root is missing', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);

    const mounted = mountThreadedCommentsPanel(host, {
      overlay: false,
      showHeader: false,
      variant: 'sidebar',
      getLocatorSurfaceRoots: () => null,
    });

    getCommentSidebarPanelTestDriver(mounted.api).setComments([
      {
        id: 1,
        parentId: null,
        createdAt: 1000,
        quoteText: 'world',
        commentText: 'root',
        locator,
      },
    ]);
    await flushReactScheduler();

    const panel = host.querySelector('webclipper-threaded-comments-panel') as HTMLElement;
    const rootComment = panel.shadowRoot!.querySelector('.webclipper-inpage-comments-panel__comment') as HTMLElement;
    rootComment.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    await flushReactScheduler();

    expect(resolveCommentAnchor).not.toHaveBeenCalled();
    expect(document.querySelector('[data-comment-id="1"]')).toBeNull();

    mounted.cleanup();
  });
});
