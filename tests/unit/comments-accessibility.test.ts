import { act, createElement, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

import type { CommentSidebarItem } from '@services/comments/sidebar/comment-sidebar-contract';
import { CommentOverflowMenu } from '@ui/comments/react/CommentOverflowMenu';
import { CommentThread } from '@ui/comments/react/CommentThread';
import { ReplyComposer } from '@ui/comments/react/ReplyComposer';
import { RootCommentComposer } from '@ui/comments/react/RootCommentComposer';

const rootComment: CommentSidebarItem = {
  id: 7,
  parentId: null,
  conversationId: 21,
  canonicalUrl: 'https://example.com/article',
  authorName: 'Ada',
  quoteText: '',
  commentText: 'Accessible comment',
  locator: null,
  createdAt: 1,
  updatedAt: 1,
};

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
  Object.defineProperty(globalThis, 'Event', { configurable: true, value: dom.window.Event });
  Object.defineProperty(globalThis, 'KeyboardEvent', { configurable: true, value: dom.window.KeyboardEvent });
  Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true });
}

function OverflowHarness() {
  const [open, setOpen] = useState(false);
  return createElement(CommentOverflowMenu, {
    targetLabel: 'Comment actions',
    open,
    actions: [
      { id: 'reply', label: 'Reply' },
      { id: 'delete', label: 'Delete', destructive: true },
    ],
    onToggle: () => setOpen((value) => !value),
    onAction: () => {},
  });
}

describe('comments accessibility', () => {
  let root: Root | null = null;

  beforeEach(() => {
    setupDom();
  });

  afterEach(() => {
    act(() => root?.unmount());
    root = null;
  });

  it('exposes named composer controls and shortcut descriptions', () => {
    const rootMarkup = renderToStaticMarkup(
      createElement(RootCommentComposer, {
        value: '',
        disabled: false,
        onChange: () => {},
        onSubmit: () => {},
      }),
    );
    const replyMarkup = renderToStaticMarkup(
      createElement(ReplyComposer, {
        rootId: 7,
        value: '',
        disabled: false,
        onChange: () => {},
        onSubmit: () => {},
        onCancel: () => {},
      }),
    );

    expect(rootMarkup).toContain('role="group"');
    expect(rootMarkup).toContain('aria-label="New comment"');
    expect(rootMarkup).toContain('aria-label="Write a comment"');
    expect(rootMarkup).toContain('aria-describedby=');
    expect(rootMarkup).toContain('Ctrl/⌘ + Enter to submit');
    expect(replyMarkup).toContain('aria-label="Reply composer"');
    expect(replyMarkup).toContain('aria-label="Write a reply"');
  });

  it('exposes the active thread as a keyboard-operable current list item', () => {
    const onActivate = vi.fn();
    const host = document.getElementById('root')!;
    root = createRoot(host);
    act(() => {
      root!.render(
        createElement(CommentThread, {
          root: rootComment,
          replies: [],
          active: true,
          busy: false,
          openMenuId: null,
          rootMenuActions: [],
          getReplyMenuActions: () => [],
          onActivate,
          onRootMenuToggle: () => {},
          onReplyMenuToggle: () => {},
          onMenuAction: () => {},
        }),
      );
    });

    const thread = host.querySelector<HTMLElement>('[data-thread-root-id="7"]');
    expect(thread?.getAttribute('role')).toBe('listitem');
    expect(thread?.getAttribute('aria-current')).toBe('true');
    expect(thread?.getAttribute('tabindex')).toBe('0');
    act(() => {
      thread?.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });
    expect(onActivate).toHaveBeenCalledWith(7);
  });

  it('links the overflow trigger to its menu and ignores Escape', () => {
    const host = document.getElementById('root')!;
    root = createRoot(host);
    act(() => root!.render(createElement(OverflowHarness)));

    const trigger = host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!;
    const menuId = trigger.getAttribute('aria-controls');
    expect(menuId).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    act(() => {
      trigger.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    });
    const menu = host.querySelector<HTMLElement>(`#${menuId}`)!;
    const firstItem = menu.querySelector<HTMLButtonElement>('[role="menuitem"]')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(firstItem);

    const escape = new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    act(() => {
      firstItem.dispatchEvent(escape);
    });
    expect(escape.defaultPrevented).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(firstItem);
  });

  it('keeps visible focus styles and does not suppress textarea outlines', () => {
    const css = readFileSync(new URL('../../src/ui/styles/inpage-comments-panel.css', import.meta.url), 'utf8');
    expect(css).toContain('.webclipper-inpage-comments-panel__thread:focus-visible');
    const textareaRule = css.match(
      /\.webclipper-inpage-comments-panel__composer-textarea,[\s\S]*?\.webclipper-inpage-comments-panel__reply-textarea\s*\{([\s\S]*?)\}/,
    )?.[1];
    expect(textareaRule).toBeTruthy();
    expect(textareaRule).not.toMatch(/outline\s*:\s*(?:0|none)/);
  });
});
