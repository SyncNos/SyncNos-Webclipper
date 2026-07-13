import { describe, expect, it, vi } from 'vitest';
import { createInpageCommentsPanelController } from '../../src/services/bootstrap/inpage-comments-panel-content-handlers';

vi.mock('../../src/services/comments/sidebar/comment-sidebar-session', () => ({
  createCommentSidebarSession: () => ({}),
}));
vi.mock('../../src/services/comments/sidebar/article-comments-sidebar-inpage-adapter', () => ({
  createArticleCommentsSidebarInpageAdapter: () => ({}),
}));
const open = vi.fn(async () => {});
vi.mock('../../src/services/comments/sidebar/article-comments-sidebar-controller', () => ({
  createArticleCommentsSidebarController: (input: any) => ({
    open: (value: any) => open(value),
    resolveComposerSelection: input.resolveComposerSelection,
  }),
}));

describe('inpage comments DOM injection', () => {
  it('uses the injected DOM source without reading page globals', async () => {
    const resolveComposerSelection = vi.fn(() => ({ selectionText: 'quote', locator: { v: 2 } }));
    const controller = createInpageCommentsPanelController(null, {
      createPanelApi: () => ({}) as any,
      domSource: {
        resolveComposerSelection,
        isTopFrame: () => true,
        readPageUrl: () => 'https://example.com/article?utm_source=x',
      },
    });

    await controller.open({ tabId: 7, focusComposer: true });

    expect(open).toHaveBeenCalledWith(expect.objectContaining({
      focusComposer: true,
      source: 'inpage',
      ensureContextInput: expect.objectContaining({
        tabId: 7,
        canonicalUrlFallback: 'https://example.com/article?utm_source=x',
      }),
    }));
  });

  it('does not open from a child frame', async () => {
    open.mockClear();
    const controller = createInpageCommentsPanelController(null, {
      createPanelApi: () => ({}) as any,
      domSource: {
        resolveComposerSelection: () => ({ selectionText: '', locator: null }),
        isTopFrame: () => false,
        readPageUrl: () => 'https://example.com',
      },
    });

    await controller.open();
    expect(open).not.toHaveBeenCalled();
  });
});
