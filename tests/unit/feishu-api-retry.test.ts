import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchFeishuJson } from '@services/sync/feishu/feishu-api';

describe('feishu-api retry', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error test global
    globalThis.fetch = originalFetch;
    if (vi.isFakeTimers()) vi.useRealTimers();
  });

  it('retries on 429 using retry-after header (GET only)', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    let call = 0;
    const fetchMock = vi.fn(async () => {
      call += 1;
      if (call === 1) {
        return new Response(JSON.stringify({ code: 99991400, msg: 'rate limited' }), {
          status: 429,
          headers: { 'Retry-After': '1', 'content-type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ code: 0, msg: 'ok', data: { ok: true } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });
    // @ts-expect-error test global
    globalThis.fetch = fetchMock;

    const promise = fetchFeishuJson('/retry-429', { method: 'GET' }, { accessToken: 't', baseUrl: 'https://example.com', retry: { attempts: 3 } });

    await vi.advanceTimersByTimeAsync(1000);
    await expect(promise).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries on transient fetch errors (GET only)', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    let call = 0;
    const fetchMock = vi.fn(async () => {
      call += 1;
      if (call === 1) throw new Error('network error');
      return new Response(JSON.stringify({ code: 0, msg: 'ok', data: { value: 1 } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });
    // @ts-expect-error test global
    globalThis.fetch = fetchMock;

    const promise = fetchFeishuJson('/retry-network', { method: 'GET' }, { accessToken: 't', baseUrl: 'https://example.com', retry: { attempts: 2 } });

    await vi.advanceTimersByTimeAsync(300);
    await expect(promise).resolves.toEqual({ value: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry for POST even when retry is configured', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify({ code: 99991400, msg: 'rate limited' }), {
        status: 429,
        headers: { 'Retry-After': '1', 'content-type': 'application/json' },
      });
    });
    // @ts-expect-error test global
    globalThis.fetch = fetchMock;

    await expect(
      fetchFeishuJson('/no-retry-post', { method: 'POST' }, { accessToken: 't', baseUrl: 'https://example.com', retry: { attempts: 3 } }),
    ).rejects.toMatchObject({ extra: { status: 429 } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

