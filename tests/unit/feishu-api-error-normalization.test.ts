import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchFeishuJson } from '@services/sync/feishu/feishu-api';

describe('feishu-api error normalization', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error test global
    globalThis.fetch = originalFetch;
  });

  it('throws error with status/code/requestId/retryAfterMs on non-2xx responses', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify({ code: 999, msg: 'rate limited' }), {
        status: 429,
        headers: {
          'Retry-After': '2',
          'X-Tt-Logid': 'req_123',
          'content-type': 'application/json',
        },
      });
    });
    // @ts-expect-error test global
    globalThis.fetch = fetchMock;

    let err: any = null;
    try {
      await fetchFeishuJson('/unit-test', { method: 'GET' }, { accessToken: 'token', baseUrl: 'https://example.com' });
    } catch (e) {
      err = e;
    }

    expect(err).toBeTruthy();
    expect(err.message).toContain('rate limited');
    expect(err.extra?.status).toBe(429);
    expect(err.extra?.code).toBe(999);
    expect(err.extra?.requestId).toBe('req_123');
    expect(err.extra?.retryAfterMs).toBe(2000);
  });

  it('treats {code!=0} envelopes as errors even on HTTP 200', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify({ code: 19001, msg: 'invalid token', data: null }), {
        status: 200,
        headers: { 'X-Request-Id': 'req_200', 'content-type': 'application/json' },
      });
    });
    // @ts-expect-error test global
    globalThis.fetch = fetchMock;

    await expect(
      fetchFeishuJson('/unit-test-2', { method: 'GET' }, { accessToken: 'token', baseUrl: 'https://example.com' }),
    ).rejects.toMatchObject({
      extra: { status: 200, code: 19001, requestId: 'req_200' },
    });
  });
});
