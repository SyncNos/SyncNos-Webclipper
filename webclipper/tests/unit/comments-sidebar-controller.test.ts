import { describe, expect, it, vi } from 'vitest';

import { createCommentsSidebarController } from '../../src/services/comments/sidebar/comments-sidebar-controller';
import { createCommentSidebarSession } from '../../src/services/comments/sidebar/comment-sidebar-session';

function createMockPanel() {
  let open = false;
  let busy = false;
  let quoteText = '';
  let comments: any[] = [];
  let handlers: any = {};
  let focusCount = 0;

  const api = {
    open: (input?: { focusComposer?: boolean }) => {
      open = true;
      if (input?.focusComposer) focusCount += 1;
    },
    close: () => {
      open = false;
      try {
        handlers?.onClose?.();
      } catch (_e) {
        // ignore
      }
    },
    isOpen: () => open,
    setBusy: (next: boolean) => {
      busy = !!next;
    },
    setQuoteText: (next: string) => {
      quoteText = String(next || '');
    },
    setComments: (items: any[]) => {
      comments = Array.isArray(items) ? items : [];
    },
    setHandlers: (next: any) => {
      handlers = next || {};
    },
  };

  return {
    api,
    getState: () => ({ open, busy, quoteText, comments, handlers, focusCount }),
  };
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('comments-sidebar-controller', () => {
  it('opens: sets quote, requests open, ensures context, and refreshes comments', async () => {
    const panel = createMockPanel();
    const session = createCommentSidebarSession(panel.api as any);

    const adapter = {
      list: vi.fn(async () => [{ id: 1, parentId: null, commentText: 'hi', quoteText: '', createdAt: 1 }]),
      addRoot: vi.fn(async () => ({ id: 1 })),
      addReply: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
      ensureContext: vi.fn(async () => ({
        commentTargetKey: 'url:https://example.com/a',
        canonicalUrl: 'https://example.com/a',
        conversationId: 21,
      })),
    };

    const controller = createCommentsSidebarController({
      session,
      adapter: adapter as any,
    });

    await controller.open({
      selectionText: 'Quoted',
      focusComposer: true,
      source: 'test',
      ensureContext: true,
      ensureContextInput: {
        canonicalUrlFallback: 'https://example.com/fallback',
        commentTargetKeyFallback: 'url:https://example.com/fallback',
        ensureConversationForTarget: true,
      },
    });

    const snapshot = session.getSnapshot();
    expect(snapshot.quoteText).toBe('Quoted');
    expect(snapshot.isOpen).toBe(true);
    expect(adapter.ensureContext).toHaveBeenCalledTimes(1);
    expect(adapter.list).toHaveBeenCalledWith({
      commentTargetKey: 'url:https://example.com/a',
      conversationId: 21,
      canonicalUrlFallback: 'https://example.com/a',
    });
    expect(panel.getState().focusCount).toBe(1);
    expect(panel.getState().comments.length).toBe(1);
  });

  it('save root: returns structured result, refreshes list, and clears composer quote', async () => {
    const panel = createMockPanel();
    const session = createCommentSidebarSession(panel.api as any);

    const adapter = {
      list: vi.fn(async () => []),
      addRoot: vi.fn(async () => ({ id: 91 })),
      addReply: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
      ensureContext: vi.fn(async () => ({
        commentTargetKey: 'url:https://example.com/a',
        canonicalUrl: 'https://example.com/a',
        conversationId: 21,
      })),
    };

    createCommentsSidebarController({ session, adapter: adapter as any });

    session.setQuoteText('Quoted');

    const handlers = panel.getState().handlers;
    expect(typeof handlers.onSave).toBe('function');

    const res = await handlers.onSave('Hello');
    expect(res).toEqual({ ok: true, createdRootId: 91 });
    expect(adapter.addRoot).toHaveBeenCalledWith({
      commentTargetKey: 'url:https://example.com/a',
      canonicalUrl: 'https://example.com/a',
      conversationId: 21,
      quoteText: 'Quoted',
      commentText: 'Hello',
      locator: null,
    });
    expect(adapter.list).toHaveBeenCalled();
    expect(session.getSnapshot().quoteText).toBe('');
  });

  it('updates quote and locator from composer selection requests', async () => {
    const panel = createMockPanel();
    const session = createCommentSidebarSession(panel.api as any);

    const locator = {
      env: 'inpage',
      quote: { exact: 'Quoted from page' },
      position: { start: 0, end: 16 },
      v: 1,
    };

    const adapter = {
      list: vi.fn(async () => []),
      addRoot: vi.fn(async () => ({ id: 51 })),
      addReply: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
      ensureContext: vi.fn(async () => ({
        commentTargetKey: 'url:https://example.com/a',
        canonicalUrl: 'https://example.com/a',
        conversationId: 21,
      })),
    };

    const resolveComposerSelection = vi
      .fn()
      .mockResolvedValueOnce({ selectionText: 'Quoted from page', locator })
      .mockResolvedValueOnce({ selectionText: '', locator: null });

    createCommentsSidebarController({
      session,
      adapter: adapter as any,
      resolveComposerSelection,
    });

    const handlers = panel.getState().handlers;
    expect(typeof handlers.onComposerSelectionRequest).toBe('function');

    await handlers.onComposerSelectionRequest({ trigger: 'button' });
    expect(resolveComposerSelection).toHaveBeenNthCalledWith(1, { trigger: 'button' });
    expect(session.getSnapshot().quoteText).toBe('Quoted from page');

    await handlers.onSave('root comment');
    expect(adapter.addRoot).toHaveBeenLastCalledWith({
      commentTargetKey: 'url:https://example.com/a',
      canonicalUrl: 'https://example.com/a',
      conversationId: 21,
      quoteText: 'Quoted from page',
      commentText: 'root comment',
      locator,
    });
    expect(session.getSnapshot().quoteText).toBe('');

    await handlers.onComposerSelectionRequest({ trigger: 'button' });
    expect(resolveComposerSelection).toHaveBeenNthCalledWith(2, { trigger: 'button' });
    expect(session.getSnapshot().quoteText).toBe('');
  });

  it('ignores stale composer selection responses and keeps latest result', async () => {
    const panel = createMockPanel();
    const session = createCommentSidebarSession(panel.api as any);

    const adapter = {
      list: vi.fn(async () => []),
      addRoot: vi.fn(async () => ({ id: 1 })),
      addReply: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
      ensureContext: vi.fn(async () => ({
        commentTargetKey: 'url:https://example.com/a',
        canonicalUrl: 'https://example.com/a',
        conversationId: 1,
      })),
    };

    const slow = createDeferred<{ selectionText: string; locator: unknown | null }>();
    const fast = createDeferred<{ selectionText: string; locator: unknown | null }>();

    const resolveComposerSelection = vi
      .fn()
      .mockImplementationOnce(() => slow.promise)
      .mockImplementationOnce(() => fast.promise);

    createCommentsSidebarController({
      session,
      adapter: adapter as any,
      resolveComposerSelection,
    });

    const handlers = panel.getState().handlers;
    const oldRequest = handlers.onComposerSelectionRequest({ trigger: 'button' });
    const newRequest = handlers.onComposerSelectionRequest({ trigger: 'button' });

    fast.resolve({ selectionText: 'new quote', locator: null });
    await newRequest;
    expect(session.getSnapshot().quoteText).toBe('new quote');

    slow.resolve({ selectionText: 'old quote', locator: null });
    await oldRequest;
    expect(session.getSnapshot().quoteText).toBe('new quote');
  });

  it('clears pending locator when context switches before save', async () => {
    const panel = createMockPanel();
    const session = createCommentSidebarSession(panel.api as any);

    const adapter = {
      list: vi.fn(async () => []),
      addRoot: vi.fn(async () => ({ id: 66 })),
      addReply: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
    };

    const locatorFromA = {
      env: 'inpage',
      quote: { exact: 'Quote A' },
      position: { start: 0, end: 6 },
      v: 1,
    };

    const resolveComposerSelection = vi.fn().mockResolvedValue({
      selectionText: 'Quote A',
      locator: locatorFromA,
    });

    const controller = createCommentsSidebarController({
      session,
      adapter: adapter as any,
      resolveComposerSelection,
    });

    controller.setContext({ commentTargetKey: 'url:https://example.com/a', canonicalUrl: 'https://example.com/a', conversationId: 1 });

    const handlers = panel.getState().handlers;
    await handlers.onComposerSelectionRequest({ trigger: 'button' });
    expect(session.getSnapshot().quoteText).toBe('Quote A');

    controller.setContext({ commentTargetKey: 'url:https://example.com/b', canonicalUrl: 'https://example.com/b', conversationId: 2 });
    expect(session.getSnapshot().quoteText).toBe('');

    await handlers.onSave('comment in b');
    expect(adapter.addRoot).toHaveBeenLastCalledWith({
      commentTargetKey: 'url:https://example.com/b',
      canonicalUrl: 'https://example.com/b',
      conversationId: 2,
      quoteText: '',
      commentText: 'comment in b',
      locator: null,
    });
  });

  it('setContext: ignores stale refresh results from previous context', async () => {
    const panel = createMockPanel();
    const session = createCommentSidebarSession(panel.api as any);
    const deferredA = createDeferred<any[]>();
    const deferredB = createDeferred<any[]>();

    const adapter = {
      list: vi.fn(({ commentTargetKey }: { commentTargetKey: string }) => {
        if (commentTargetKey.includes('/a')) return deferredA.promise;
        return deferredB.promise;
      }),
      addRoot: vi.fn(async () => ({ id: 1 })),
      addReply: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
    };

    const controller = createCommentsSidebarController({ session, adapter: adapter as any });

    controller.setContext({ commentTargetKey: 'url:https://example.com/a', canonicalUrl: 'https://example.com/a', conversationId: 1 });
    controller.setContext({ commentTargetKey: 'url:https://example.com/b', canonicalUrl: 'https://example.com/b', conversationId: 2 });

    deferredB.resolve([{ id: 2, parentId: null, commentText: 'B', quoteText: '', createdAt: 2 }]);
    await vi.waitFor(() => {
      expect(panel.getState().comments[0]?.commentText).toBe('B');
    });

    deferredA.resolve([{ id: 1, parentId: null, commentText: 'A', quoteText: '', createdAt: 1 }]);
    await Promise.resolve();
    await Promise.resolve();
    expect(panel.getState().comments[0]?.commentText).toBe('B');
  });
});

