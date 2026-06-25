import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createElement } from 'react';
import ReactDOM from 'react-dom/client';
import { JSDOM } from 'jsdom';

import { ChatOutlinePanel } from '../../src/ui/conversations/chat-outline/ChatOutlinePanel';
import type { ChatOutlineEntry } from '../../src/ui/conversations/chat-outline/outline-entries';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Element', { configurable: true, value: dom.window.Element });
  Object.defineProperty(globalThis, 'MouseEvent', { configurable: true, value: dom.window.MouseEvent });
  Object.defineProperty(globalThis, 'KeyboardEvent', { configurable: true, value: dom.window.KeyboardEvent });
  Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
    configurable: true,
    value: true,
  });
}

function cleanupDom() {
  delete (globalThis as any).window;
  delete (globalThis as any).document;
  delete (globalThis as any).navigator;
  delete (globalThis as any).HTMLElement;
  delete (globalThis as any).Element;
  delete (globalThis as any).MouseEvent;
  delete (globalThis as any).KeyboardEvent;
  delete (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
}

const entries: ChatOutlineEntry[] = [
  {
    index: 1,
    messageId: 101,
    messageKey: 'u-101',
    previewText: '解释这篇文章的核心观点',
  },
  {
    index: 2,
    messageId: 102,
    messageKey: 'u-102',
    previewText: '给我一个行动清单',
  },
];

describe('ChatOutlinePanel', () => {
  let root: ReactDOM.Root | null = null;

  beforeEach(() => {
    setupDom();
    root = ReactDOM.createRoot(document.getElementById('root')!);
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = null;
    cleanupDom();
  });

  it('does not render an outline entry point when there are no entries', () => {
    act(() => {
      root!.render(createElement(ChatOutlinePanel, { entries: [] }));
    });

    expect(document.querySelector('[data-reader-rail-wrap="chat-outline"]')).toBeNull();
    expect(document.getElementById('root')?.innerHTML).toBe('');
  });

  it('uses the shared rail panel without visible chat-specific directory copy', () => {
    const onPickEntry = vi.fn();
    act(() => {
      root!.render(createElement(ChatOutlinePanel, { entries, activeIndex: 2, onPickEntry }));
    });

    const wrap = document.querySelector('[data-reader-rail-wrap="chat-outline"]') as HTMLElement | null;
    expect(wrap).toBeTruthy();

    act(() => {
      wrap!.dispatchEvent(new window.MouseEvent('mouseover', { bubbles: true, cancelable: true }));
    });

    const panel = document.querySelector('[data-reader-rail-panel="chat-outline"]') as HTMLElement | null;
    expect(panel).toBeTruthy();
    expect(document.body.textContent).not.toContain('目录');
    expect(document.body.textContent).not.toContain('用户消息');
    expect(panel?.querySelector('[data-chat-outline-active="true"]')?.textContent).toBe('2. 给我一个行动清单');

    const firstEntry = panel?.querySelector('[data-chat-outline-entry="u-101"]') as HTMLButtonElement | null;
    expect(firstEntry?.textContent).toBe('1. 解释这篇文章的核心观点');

    act(() => {
      firstEntry!.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    expect(onPickEntry).toHaveBeenCalledWith(entries[0]);
  });
});
