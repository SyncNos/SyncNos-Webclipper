import { storageGet, storageRemove, storageSet } from '@platform/storage/local';
import { tabsRemove } from '@platform/webext/tabs';
import { webNavigationOnCommittedAddListener } from '@platform/webext/web-navigation';
import { setFeishuOAuthToken, type FeishuOAuthTokenV1 } from '@services/sync/feishu/auth/token-store';

declare const __SYNCNOS_FEISHU_OAUTH_CLIENT_ID__: string | undefined;
declare const __SYNCNOS_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL__: string | undefined;

const DEFAULT_FEISHU_OAUTH_CLIENT_ID =
  (typeof __SYNCNOS_FEISHU_OAUTH_CLIENT_ID__ === 'string' ? __SYNCNOS_FEISHU_OAUTH_CLIENT_ID__ : '') ||
  'cli_aa8e3c9970cb5cb5';
const DEFAULT_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL =
  (typeof __SYNCNOS_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL__ === 'string'
    ? __SYNCNOS_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL__
    : '') || 'https://syncnos-feishu-oauth.chiimagnus.workers.dev/feishu/oauth/exchange';

const KEY_CLIENT_ID = 'feishu_oauth_client_id';
const KEY_CLIENT_SECRET = 'feishu_oauth_client_secret';
const KEY_TOKEN_EXCHANGE_PROXY_URL = 'feishu_oauth_token_exchange_proxy_url';
const KEY_PENDING_STATE = 'feishu_oauth_pending_state';
const KEY_LAST_ERROR = 'feishu_oauth_last_error';

export type FeishuOAuthDefaults = {
  authorizationUrl: string;
  redirectUri: string;
  responseType: 'code';
  scope: string;
};

export function getFeishuOAuthDefaults(): FeishuOAuthDefaults {
  return {
    authorizationUrl: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
    redirectUri: 'https://chiimagnus.github.io/syncnos-oauth/callback',
    responseType: 'code',
    scope: 'docx:document drive:drive:readonly',
  };
}

function toError(message: unknown) {
  return new Error(String(message || 'unknown error'));
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const ms = Number.isFinite(timeoutMs) ? timeoutMs : 12_000;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...(init || {}), signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function getTokenExchangeProxyUrl(): Promise<string> {
  try {
    const res = await storageGet([KEY_TOKEN_EXCHANGE_PROXY_URL]);
    const value = res?.[KEY_TOKEN_EXCHANGE_PROXY_URL] ? String(res[KEY_TOKEN_EXCHANGE_PROXY_URL]) : '';
    const normalized = value.trim();
    return normalized || DEFAULT_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL;
  } catch (_e) {
    return DEFAULT_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL;
  }
}

async function exchangeFeishuCodeForToken(code: string, { fetchImpl = fetch }: { fetchImpl?: typeof fetch } = {}) {
  const proxyUrl = await getTokenExchangeProxyUrl();
  if (!proxyUrl) throw toError('token exchange proxy url not configured');

  let lastErr: any = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const res = await (fetchImpl === fetch
        ? fetchWithTimeout(
            proxyUrl,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: JSON.stringify({ code, redirectUri: getFeishuOAuthDefaults().redirectUri }),
            },
            12_000,
          )
        : fetchImpl(proxyUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({ code, redirectUri: getFeishuOAuthDefaults().redirectUri }),
          }));

      const text = await res.text();
      if (!res.ok) throw toError(`token exchange failed: HTTP ${res.status} ${text}`);
      const json = JSON.parse(text);
      if (!json || !json.access_token) throw toError('no access_token in response');
      return json;
    } catch (e) {
      lastErr = e;
      const msg = String((e as any)?.message || e || '');
      const transient = /aborted|timeout|network|fetch/i.test(msg);
      if (attempt >= 2 || !transient) break;

      await sleep(700);
    }
  }

  throw lastErr || toError('token exchange failed');
}

function parseQueryFromUrl(url: string) {
  try {
    const u = new URL(url);
    return {
      code: u.searchParams.get('code') || '',
      state: u.searchParams.get('state') || '',
      error: u.searchParams.get('error') || '',
    };
  } catch (_e) {
    return { code: '', state: '', error: 'invalid_url' };
  }
}

async function removeTab(tabId: number) {
  try {
    await tabsRemove(Number(tabId));
  } catch (_e) {
    // ignore
  }
}

export async function ensureDefaultFeishuOAuthClientId(): Promise<void> {
  try {
    const res = await storageGet([KEY_CLIENT_ID]);
    const currentId = res?.[KEY_CLIENT_ID] ? String(res[KEY_CLIENT_ID]) : '';
    if (!currentId && DEFAULT_FEISHU_OAUTH_CLIENT_ID) {
      await storageSet({ [KEY_CLIENT_ID]: DEFAULT_FEISHU_OAUTH_CLIENT_ID });
    }
    await storageRemove([KEY_CLIENT_SECRET]);
  } catch (_e) {
    // ignore (best-effort)
  }
}

export async function ensureDefaultFeishuOAuthProxyUrl(): Promise<void> {
  try {
    const res = await storageGet([KEY_TOKEN_EXCHANGE_PROXY_URL]);
    const current = res?.[KEY_TOKEN_EXCHANGE_PROXY_URL] ? String(res[KEY_TOKEN_EXCHANGE_PROXY_URL]) : '';
    if (!current && DEFAULT_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL) {
      await storageSet({ [KEY_TOKEN_EXCHANGE_PROXY_URL]: DEFAULT_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL });
    }
  } catch (_e) {
    // ignore (best-effort)
  }
}

export type FeishuOAuthCallbackDetails = {
  url: string;
  tabId?: number;
};

export async function handleFeishuOAuthCallbackNavigation(
  details: FeishuOAuthCallbackDetails,
  { fetchImpl = fetch, now = () => Date.now() }: { fetchImpl?: typeof fetch; now?: () => number } = {},
): Promise<boolean> {
  const cfg = getFeishuOAuthDefaults();
  const url = String(details?.url || '');
  if (!url || !url.startsWith(cfg.redirectUri)) return false;

  const { code, state, error } = parseQueryFromUrl(url);
  if (error) {
    await storageRemove([KEY_PENDING_STATE]);
    await storageSet({ [KEY_LAST_ERROR]: error });
    return true;
  }
  if (!code || !state) return false;

  const res = await storageGet([KEY_PENDING_STATE]);
  const pending = res?.[KEY_PENDING_STATE] ? String(res[KEY_PENDING_STATE]) : '';
  if (!pending || pending !== state) return false;

  try {
    const tokenJson = await exchangeFeishuCodeForToken(code, { fetchImpl });
    const expiresInSeconds = Number(tokenJson.expires_in) || 0;
    const nowMs = now();
    const token: FeishuOAuthTokenV1 = {
      accessToken: String(tokenJson.access_token || ''),
      refreshToken: String(tokenJson.refresh_token || ''),
      expiresAt: expiresInSeconds > 0 ? nowMs + expiresInSeconds * 1000 : nowMs,
      createdAt: nowMs,
    };
    await setFeishuOAuthToken(token);
    await storageRemove([KEY_PENDING_STATE]);
    await storageSet({ [KEY_LAST_ERROR]: '' });
    await removeTab(Number(details?.tabId));
  } catch (e) {
    await storageRemove([KEY_PENDING_STATE]);
    await storageSet({
      [KEY_LAST_ERROR]: (e as any)?.message ? String((e as any).message) : String(e || 'token exchange failed'),
    });
  }

  return true;
}

export function setupFeishuOAuthNavigationListener(): void {
  webNavigationOnCommittedAddListener((details: any) => {
    handleFeishuOAuthCallbackNavigation({
      url: String(details?.url || ''),
      tabId: Number(details?.tabId),
    }).catch(() => {});
  });
}
