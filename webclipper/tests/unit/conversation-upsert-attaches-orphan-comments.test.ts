import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/services/conversations/data/storage', () => ({
  hasConversation: vi.fn(async () => false),
}));

vi.mock('../../src/services/conversations/data/write', () => ({
  writeConversationSnapshot: vi.fn(async (payload: any) => ({ id: 123, ...(payload || {}) })),
}));

const attachOrphanCommentsToConversation = vi.fn(async () => ({ updated: 0 }));
const migrateArticleCommentsCanonicalUrl = vi.fn(async () => ({ updated: 0 }));

vi.mock('../../src/services/comments/data/storage', () => ({
  attachOrphanCommentsToConversation: (...args: any[]) => attachOrphanCommentsToConversation(...args),
  migrateArticleCommentsCanonicalUrl: (...args: any[]) => migrateArticleCommentsCanonicalUrl(...args),
}));

import { registerConversationHandlers } from '../../src/services/conversations/background/handlers';

function createTestRouter() {
  const handlers = new Map<string, (msg: any) => Promise<any>>();
  return {
    handlers,
    register: (type: string, handler: (msg: any) => Promise<any>) => handlers.set(type, handler),
    ok: (data: unknown) => ({ ok: true, data, error: null }),
    err: (message: string, extra?: unknown) => ({ ok: false, data: null, error: { message, extra } }),
    eventsHub: { broadcast: vi.fn() },
  };
}

describe('upsertConversation orphan comments attach', () => {
  it('attaches orphans and migrates url variants for video conversations', async () => {
    const router = createTestRouter();
    registerConversationHandlers(router as any);

    const handler = router.handlers.get('upsertConversation');
    expect(handler).toBeTruthy();

    await handler!({
      payload: {
        sourceType: 'video',
        source: 'video',
        conversationKey: 'video:https://youtu.be/dQw4w9WgXcQ?t=12',
        url: 'https://youtu.be/dQw4w9WgXcQ?t=12',
        title: 'x',
      },
    });

    expect(attachOrphanCommentsToConversation).toHaveBeenCalled();
    expect(migrateArticleCommentsCanonicalUrl).toHaveBeenCalled();

    const calledUrls = attachOrphanCommentsToConversation.mock.calls.map((c) => String(c?.[0] || ''));
    expect(calledUrls.some((u) => u.includes('youtube.com/watch'))).toBe(true);
  });

  it('attaches orphans for chat conversations by normalized url', async () => {
    attachOrphanCommentsToConversation.mockClear();
    migrateArticleCommentsCanonicalUrl.mockClear();

    const router = createTestRouter();
    registerConversationHandlers(router as any);
    const handler = router.handlers.get('upsertConversation');
    expect(handler).toBeTruthy();

    await handler!({
      payload: {
        sourceType: 'chat',
        source: 'chatgpt',
        conversationKey: 'c-1',
        url: 'https://chatgpt.com/c/1#hash',
        title: 'x',
      },
    });

    expect(attachOrphanCommentsToConversation).toHaveBeenCalledWith('https://chatgpt.com/c/1', 123);
  });
});

