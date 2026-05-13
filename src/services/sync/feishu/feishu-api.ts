type FeishuApiErrorExtra = {
  status: number;
  code?: number | string;
  requestId?: string;
  retryAfterMs?: number;
};

export type FeishuApiError = Error & { extra?: FeishuApiErrorExtra };

const FEISHU_API_BASE_URL = 'https://open.feishu.cn/open-apis';

function readRequestId(headers: Headers): string {
  const candidates = [
    headers.get('X-Request-Id'),
    headers.get('Request-Id'),
    headers.get('X-Tt-Logid'),
    headers.get('x-tt-logid'),
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean);
  return candidates[0] || '';
}

function parseRetryAfterMs(headers: Headers): number | undefined {
  const retryAfter = String(headers.get('Retry-After') || '').trim();
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds > 0) return Math.round(seconds * 1000);
  }

  const resetSeconds = String(headers.get('x-ogw-ratelimit-reset') || '').trim();
  if (resetSeconds) {
    const seconds = Number(resetSeconds);
    if (Number.isFinite(seconds) && seconds > 0) return Math.round(seconds * 1000);
  }

  return undefined;
}

function toApiError(message: string, extra: FeishuApiErrorExtra): FeishuApiError {
  const error = new Error(String(message || 'Feishu API error')) as FeishuApiError;
  error.extra = extra;
  return error;
}

export async function fetchFeishuJson<T>(
  path: string,
  init: RequestInit,
  opts: { accessToken: string; baseUrl?: string },
): Promise<T> {
  const baseUrl = opts.baseUrl ? String(opts.baseUrl) : FEISHU_API_BASE_URL;
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init?.headers || {});
  headers.set('Authorization', `Bearer ${String(opts.accessToken || '').trim()}`);
  headers.set('Accept', 'application/json');
  if (init?.body && !headers.get('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  const res = await fetch(url, { ...(init || {}), headers });
  const requestId = readRequestId(res.headers);
  const retryAfterMs = parseRetryAfterMs(res.headers);

  const text = await res.text().catch(() => '');
  const status = Number(res.status) || 0;
  const json = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return null;
        }
      })()
    : null;

  const code = json && typeof json === 'object' ? ((json as any).code ?? (json as any).error_code) : undefined;
  const msg =
    json && typeof json === 'object' ? String((json as any).msg ?? (json as any).message ?? '') : String(text || '');

  if (!res.ok) {
    throw toApiError(msg || `HTTP ${status}`, { status, code, requestId: requestId || undefined, retryAfterMs });
  }

  // Standard envelope: { code:0, msg:'ok', data:{...} }
  if (json && typeof json === 'object' && Object.prototype.hasOwnProperty.call(json, 'code')) {
    const apiCode = Number((json as any).code);
    if (Number.isFinite(apiCode) && apiCode !== 0) {
      throw toApiError(msg || 'Feishu API error', {
        status,
        code: (json as any).code,
        requestId: requestId || undefined,
        retryAfterMs,
      });
    }
    return ((json as any).data ?? null) as T;
  }

  if (json != null) return json as T;
  throw toApiError('Invalid JSON response', { status, code, requestId: requestId || undefined, retryAfterMs });
}

