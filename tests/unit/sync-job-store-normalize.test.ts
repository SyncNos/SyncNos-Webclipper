import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/platform/storage/local', () => {
  return {
    storageGet: async () => ({}),
    storageSet: async () => {},
  };
});

describe('normalizeSyncJobSnapshot', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes feishu job snapshots (finished -> done, ids, counts)', async () => {
    const { normalizeSyncJobSnapshot } = await import('@services/sync/sync-job-store');

    const snapshot = normalizeSyncJobSnapshot('feishu', {
      id: 'job_1',
      status: 'finished',
      startedAt: 1,
      updatedAt: 2,
      finishedAt: 3,
      conversationIds: [1, '2', -1, 0, 2],
      perConversation: [
        { conversationId: '1', ok: true, appended: 1, at: 10 },
        { conversationId: 2, ok: false, error: 'no permission', at: 11 },
      ],
    });

    expect(snapshot).toBeTruthy();
    expect(snapshot!.provider).toBe('feishu');
    expect(snapshot!.id).toBe('job_1');
    expect(snapshot!.status).toBe('done');
    expect(snapshot!.conversationIds).toEqual([1, 2]);
    expect(snapshot!.okCount).toBe(1);
    expect(snapshot!.failCount).toBe(1);
    expect(snapshot!.updatedAt).toBe(2);
  });
});

