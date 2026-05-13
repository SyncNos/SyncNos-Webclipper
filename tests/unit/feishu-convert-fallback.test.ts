import { afterEach, describe, expect, it, vi } from 'vitest';

const backgroundStorageMocks = vi.hoisted(() => ({
  getSyncMappingByConversation: vi.fn(),
  getMessagesByConversationId: vi.fn(),
  patchSyncMapping: vi.fn(),
}));

vi.mock('@services/conversations/background/storage', () => ({
  backgroundStorage: {
    getSyncMappingByConversation: backgroundStorageMocks.getSyncMappingByConversation,
    getMessagesByConversationId: backgroundStorageMocks.getMessagesByConversationId,
    patchSyncMapping: backgroundStorageMocks.patchSyncMapping,
  },
}));

const tokenMocks = vi.hoisted(() => ({
  getFeishuOAuthToken: vi.fn(),
  setFeishuOAuthToken: vi.fn(),
}));

vi.mock('@services/sync/feishu/auth/token-store', () => ({
  getFeishuOAuthToken: tokenMocks.getFeishuOAuthToken,
  setFeishuOAuthToken: tokenMocks.setFeishuOAuthToken,
}));

const jobStoreMocks = vi.hoisted(() => ({
  abortRunningJobIfFromOtherInstance: vi.fn(),
  isRunningJob: vi.fn(),
  setJob: vi.fn(),
  getJob: vi.fn(),
}));

vi.mock('@services/sync/feishu/feishu-sync-job-store.ts', () => ({
  default: {
    abortRunningJobIfFromOtherInstance: jobStoreMocks.abortRunningJobIfFromOtherInstance,
    isRunningJob: jobStoreMocks.isRunningJob,
    setJob: jobStoreMocks.setJob,
    getJob: jobStoreMocks.getJob,
  },
}));

vi.mock('@services/integrations/chatwith/chatwith-settings', () => ({
  formatConversationMarkdownForExternalOutput: vi.fn(async () => '# Title\n\nhello'),
}));

const fetchFeishuJsonMock = vi.hoisted(() => vi.fn());

vi.mock('@services/sync/feishu/feishu-api', () => ({
  fetchFeishuJson: fetchFeishuJsonMock,
}));

function setupChromeStorage(initial: Record<string, unknown> = {}) {
  const store: Record<string, unknown> = { ...initial };
  // @ts-expect-error test global
  globalThis.chrome = {
    runtime: { lastError: null },
    storage: {
      local: {
        get(keys: any, cb: (res: Record<string, unknown>) => void) {
          const list = Array.isArray(keys) ? keys : typeof keys === 'string' ? [keys] : Object.keys(keys || {});
          const out: Record<string, unknown> = {};
          for (const k of list) out[k] = Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
          cb(out);
        },
        set(payload: Record<string, unknown>, cb: () => void) {
          for (const [k, v] of Object.entries(payload || {})) store[k] = v;
          cb && cb();
        },
        remove(keys: any, cb: () => void) {
          const list = Array.isArray(keys) ? keys : typeof keys === 'string' ? [keys] : [];
          for (const k of list) delete store[k];
          cb && cb();
        },
      },
    },
  };
  return store;
}

async function loadModule(rel: string) {
  const mod = await import(/* @vite-ignore */ rel);
  return (mod as any).default || mod;
}

afterEach(() => {
  vi.clearAllMocks();
  // @ts-expect-error cleanup
  delete globalThis.chrome;
});

describe('feishu convert fallback', () => {
  it('uses descendant insertion when convert succeeds', async () => {
    setupChromeStorage();
    tokenMocks.getFeishuOAuthToken.mockResolvedValue({ accessToken: 't', expiresAt: Date.now() + 60_000 });
    jobStoreMocks.abortRunningJobIfFromOtherInstance.mockResolvedValue(null);
    jobStoreMocks.isRunningJob.mockReturnValue(false);

    backgroundStorageMocks.getSyncMappingByConversation.mockResolvedValue({
      conversation: { id: 1, title: 't' },
      mapping: { feishuDocId: '' },
    });
    backgroundStorageMocks.getMessagesByConversationId.mockResolvedValue([]);

    fetchFeishuJsonMock.mockImplementation(async (path: string) => {
      if (path === '/docx/v1/documents') return { document: { document_id: 'doc1' } };
      if (path.includes('/children?page_size=')) return { items: [] };
      if (path.endsWith('/descendant')) return { ok: true };
      if (path === '/docx/v1/documents/blocks/convert')
        return { blocks: [{ block_type: 2, text: { elements: [{ text_run: { content: 'hi' } }] } }], first_level_block_ids: ['tmp1'] };
      throw new Error(`unexpected path: ${path}`);
    });

    const orch = await loadModule('@services/sync/feishu/feishu-sync-orchestrator.ts');
    const res = await orch.syncConversations({ conversationIds: [1], instanceId: 'x' });
    expect(res.okCount).toBe(1);

    const paths = fetchFeishuJsonMock.mock.calls.map((c) => String(c[0] || ''));
    expect(paths).toContain('/docx/v1/documents/blocks/convert');
    expect(paths.some((p) => p.endsWith('/descendant'))).toBe(true);
  });

  it('falls back to text blocks when convert is permission denied', async () => {
    setupChromeStorage();
    tokenMocks.getFeishuOAuthToken.mockResolvedValue({ accessToken: 't', expiresAt: Date.now() + 60_000 });
    jobStoreMocks.abortRunningJobIfFromOtherInstance.mockResolvedValue(null);
    jobStoreMocks.isRunningJob.mockReturnValue(false);

    backgroundStorageMocks.getSyncMappingByConversation.mockResolvedValue({
      conversation: { id: 1, title: 't' },
      mapping: { feishuDocId: '' },
    });
    backgroundStorageMocks.getMessagesByConversationId.mockResolvedValue([]);

    fetchFeishuJsonMock.mockImplementation(async (path: string) => {
      if (path === '/docx/v1/documents') return { document: { document_id: 'doc1' } };
      if (path.includes('/children?page_size=')) return { items: [] };
      if (path.endsWith('/children') && !path.includes('batch_delete')) return { ok: true };
      if (path === '/docx/v1/documents/blocks/convert') {
        const err: any = new Error('forbidden');
        err.extra = { status: 403 };
        throw err;
      }
      throw new Error(`unexpected path: ${path}`);
    });

    const orch = await loadModule('@services/sync/feishu/feishu-sync-orchestrator.ts');
    const res = await orch.syncConversations({ conversationIds: [1], instanceId: 'x' });
    expect(res.okCount).toBe(1);

    const calls = fetchFeishuJsonMock.mock.calls.map((c) => ({ path: String(c[0] || ''), init: c[1] as any }));
    const paths = calls.map((c) => c.path);
    expect(paths).toContain('/docx/v1/documents/blocks/convert');
    expect(paths.some((p) => p.endsWith('/descendant'))).toBe(false);
    expect(calls.some((c) => c.path.endsWith('/children') && String(c.init?.method || 'GET').toUpperCase() === 'POST')).toBe(
      true,
    );
  });
});
