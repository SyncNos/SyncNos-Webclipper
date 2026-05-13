export interface Env {
  FEISHU_CLIENT_ID: string;
  FEISHU_CLIENT_SECRET: string;
}

const FEISHU_TOKEN_URL = 'https://open.feishu.cn/open-apis/authen/v2/oauth/token';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    const url = new URL(request.url);
    if (url.pathname !== '/feishu/oauth/exchange' && url.pathname !== '/feishu/oauth/refresh') {
      return withCors(new Response('Not Found', { status: 404 }));
    }

    if (request.method !== 'POST') {
      return withCors(new Response('Method Not Allowed', { status: 405 }));
    }

    if (request.headers.get('Content-Type') !== 'application/json') {
      return withCors(new Response('Expected Content-Type to be application/json', { status: 400 }));
    }

    const limitResult = await bestEffortRateLimit(request, {
      windowSeconds: 10 * 60,
      maxRequests: 60,
      keyPrefix: 'rl:feishu-oauth:',
    });
    if (!limitResult.ok) {
      const retryAfterSeconds = 'retryAfterSeconds' in limitResult ? limitResult.retryAfterSeconds : 60;
      return withCors(
        new Response('Too Many Requests', { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }),
      );
    }

    let body: any = null;
    try {
      body = await request.json();
    } catch (_e) {
      return withCors(new Response('Invalid JSON body', { status: 400 }));
    }

    const clientId = (env.FEISHU_CLIENT_ID || '').trim();
    const clientSecret = (env.FEISHU_CLIENT_SECRET || '').trim();
    if (!clientId || !clientSecret) {
      return withCors(new Response('Feishu OAuth client is not configured', { status: 500 }));
    }

    if (url.pathname === '/feishu/oauth/exchange') {
      const code = typeof body?.code === 'string' ? body.code.trim() : '';
      const redirectUri = typeof body?.redirectUri === 'string' ? body.redirectUri.trim() : '';
      if (!code) return withCors(new Response('Missing code', { status: 400 }));
      if (!redirectUri) return withCors(new Response('Missing redirectUri', { status: 400 }));
      return withCors(await exchangeToken({ clientId, clientSecret, code, redirectUri }));
    }

    const refreshToken = typeof body?.refreshToken === 'string' ? body.refreshToken.trim() : '';
    if (!refreshToken) return withCors(new Response('Missing refreshToken', { status: 400 }));
    return withCors(await refreshTokenViaGrant({ clientId, clientSecret, refreshToken }));
  },
};

async function exchangeToken(opts: {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  const res = await fetch(FEISHU_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: opts.code,
      redirect_uri: opts.redirectUri,
      client_id: opts.clientId,
      client_secret: opts.clientSecret,
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const text = json ? JSON.stringify(json) : 'Token exchange failed';
    return new Response(text, { status: res.status });
  }

  const normalized = normalizeOAuthTokenResponse(json);
  if (!normalized.ok) return new Response(normalized.message, { status: 502 });
  return new Response(JSON.stringify(normalized.data), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

async function refreshTokenViaGrant(opts: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  const res = await fetch(FEISHU_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: opts.refreshToken,
      client_id: opts.clientId,
      client_secret: opts.clientSecret,
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const text = json ? JSON.stringify(json) : 'Token refresh failed';
    return new Response(text, { status: res.status });
  }

  const normalized = normalizeOAuthTokenResponse(json);
  if (!normalized.ok) return new Response(normalized.message, { status: 502 });
  return new Response(JSON.stringify(normalized.data), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function normalizeOAuthTokenResponse(
  json: any,
):
  | { ok: true; data: { access_token: string; refresh_token?: string; expires_in?: number } }
  | { ok: false; message: string } {
  if (!json || typeof json !== 'object') return { ok: false, message: 'Invalid token response' };
  const accessToken = typeof json.access_token === 'string' ? json.access_token : '';
  if (accessToken) {
    return {
      ok: true,
      data: {
        access_token: accessToken,
        refresh_token: typeof json.refresh_token === 'string' ? json.refresh_token : undefined,
        expires_in: Number.isFinite(Number(json.expires_in)) ? Number(json.expires_in) : undefined,
      },
    };
  }

  const data = (json as any).data;
  const nestedAccess = typeof data?.access_token === 'string' ? data.access_token : '';
  if (!nestedAccess) return { ok: false, message: JSON.stringify(json) };
  return {
    ok: true,
    data: {
      access_token: nestedAccess,
      refresh_token: typeof data?.refresh_token === 'string' ? data.refresh_token : undefined,
      expires_in: Number.isFinite(Number(data?.expires_in)) ? Number(data.expires_in) : undefined,
    },
  };
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function bestEffortRateLimit(
  request: Request,
  opts: { windowSeconds: number; maxRequests: number; keyPrefix: string },
): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number }> {
  const ip =
    request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  if (!ip) return { ok: true };

  const now = Date.now();
  const windowMs = Math.max(1_000, opts.windowSeconds * 1000);
  const resetAt = now - (now % windowMs) + windowMs;
  const cacheKey = new Request(`https://rate-limit.invalid/${opts.keyPrefix}${encodeURIComponent(ip)}`);
  const cache = (caches as any)?.default as Cache | undefined;
  if (!cache) return { ok: true };

  let count = 0;
  try {
    const hit = await cache.match(cacheKey);
    if (hit) {
      const json = await hit.json().catch(() => null);
      count = json && typeof json.count === 'number' && isFinite(json.count) ? json.count : 0;
    }
  } catch (_e) {
    return { ok: true };
  }

  if (count >= opts.maxRequests) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)) };
  }

  const next = { count: count + 1 };
  const ttlSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
  await cache.put(
    cacheKey,
    new Response(JSON.stringify(next), { headers: { 'Cache-Control': `max-age=${ttlSeconds}` } }),
  );
  return { ok: true };
}

function handleOptions(request: Request) {
  const headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    const respHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    };
    return new Response(null, { headers: respHeaders });
  }
  return new Response(null, { headers: { Allow: 'POST,OPTIONS' } });
}
