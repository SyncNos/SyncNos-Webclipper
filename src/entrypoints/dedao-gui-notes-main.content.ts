import {
  DEDAO_GUI_NOTES_BRIDGE_TYPES,
  createDedaoGuiNotesBridgeFailureResponse,
  createDedaoGuiNotesBridgeSuccessResponse,
  type DedaoGuiNotesBridgeRequest,
  type DedaoGuiNotesBridgeResponse,
} from '@collectors/web/dedao-gui-notes-bridge-contract';
import { extractDedaoGuiNotesFromDocument } from '@collectors/web/dedao-gui-notes-dom-extractor';

export const DEDAO_GUI_NOTES_MAIN_WORLD_MATCHES = [
  'https://www.dedao.cn/course/article*',
  'https://dedao.cn/course/article*',
  'https://m.dedao.cn/course/article*',
  'http://www.dedao.cn/course/article*',
  'http://dedao.cn/course/article*',
  'http://m.dedao.cn/course/article*',
] as const;

const DEFAULT_BRIDGE_TIMEOUT_MS = 1_500;

type RequestParseResult =
  | { ok: true; request: DedaoGuiNotesBridgeRequest }
  | { ok: false; requestId: string; reason: string }
  | { ok: false; requestId: ''; reason: string };

export function isDedaoArticleUrl(raw: string): boolean {
  try {
    const parsed = new URL(String(raw || ''));
    const host = String(parsed.hostname || '').toLowerCase();
    const isDedaoHost = host === 'www.dedao.cn' || host === 'dedao.cn' || host === 'm.dedao.cn';
    return isDedaoHost && parsed.pathname === '/course/article';
  } catch (_error) {
    return false;
  }
}

function parseBridgeRequest(data: unknown): RequestParseResult {
  if (!data || typeof data !== 'object') return { ok: false, requestId: '', reason: 'payload must be object' };
  const candidate = data as Record<string, unknown>;
  if (candidate.__syncnos !== true) return { ok: false, requestId: '', reason: 'payload must be syncnos event' };
  if (candidate.type !== DEDAO_GUI_NOTES_BRIDGE_TYPES.REQUEST) {
    return { ok: false, requestId: '', reason: 'payload type mismatch' };
  }

  const requestId = String(candidate.requestId || '').trim();
  if (!requestId) return { ok: false, requestId: '', reason: 'requestId is required' };

  const timeoutMsRaw = Number(candidate.timeoutMs);
  if (candidate.timeoutMs != null && (!Number.isFinite(timeoutMsRaw) || timeoutMsRaw <= 0)) {
    return { ok: false, requestId, reason: 'timeoutMs must be positive finite number' };
  }

  return {
    ok: true,
    request: {
      __syncnos: true,
      type: DEDAO_GUI_NOTES_BRIDGE_TYPES.REQUEST,
      requestId,
      ...(candidate.timeoutMs != null ? { timeoutMs: Math.floor(timeoutMsRaw) } : {}),
    },
  };
}

async function withTimeout<T>(task: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      task,
      new Promise<T>((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error('timed out waiting for dedao gui notes extraction')), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function executeDedaoGuiNotesBridgeRequest(
  request: DedaoGuiNotesBridgeRequest,
  deps: {
    document?: Document;
    locationHref?: string;
    extractNotes?: typeof extractDedaoGuiNotesFromDocument;
  } = {},
): Promise<DedaoGuiNotesBridgeResponse> {
  const locationHref = String(deps.locationHref || globalThis.location?.href || '');
  if (!isDedaoArticleUrl(locationHref)) {
    return createDedaoGuiNotesBridgeFailureResponse({
      requestId: request.requestId,
      status: 'error',
      code: 'unexpected_error',
      message: 'dedao gui notes bridge is only available on dedao article pages',
      recoverable: true,
    });
  }

  const extractNotes = deps.extractNotes || extractDedaoGuiNotesFromDocument;
  const timeoutMs = Math.max(100, Math.floor(Number(request.timeoutMs) || DEFAULT_BRIDGE_TIMEOUT_MS));

  try {
    const notes = await withTimeout(
      extractNotes({
        document: deps.document || document,
        waitTimeoutMs: timeoutMs,
      }),
      timeoutMs,
    );
    return createDedaoGuiNotesBridgeSuccessResponse({
      requestId: request.requestId,
      notes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || 'unknown error');
    const isTimeout = /timed out/i.test(message);
    return createDedaoGuiNotesBridgeFailureResponse({
      requestId: request.requestId,
      status: isTimeout ? 'timeout' : 'error',
      code: isTimeout ? 'timeout' : 'unexpected_error',
      message,
      recoverable: true,
    });
  }
}

export function createDedaoGuiNotesMainWorldListener(deps: {
  document?: Document;
  locationHref?: string;
  postMessage?: (response: DedaoGuiNotesBridgeResponse) => void;
  extractNotes?: typeof extractDedaoGuiNotesFromDocument;
  debugLog?: (event: string, payload: Record<string, unknown>) => void;
} = {}) {
  const debugLog = deps.debugLog || null;
  const postMessage =
    deps.postMessage ||
    ((response: DedaoGuiNotesBridgeResponse) => {
      window.postMessage(response, '*');
    });

  return async function onMessage(event: MessageEvent) {
    if (event.source !== window) return;

    const parsed = parseBridgeRequest((event as any)?.data);
    if (!parsed.ok) {
      if (!parsed.requestId) return;
      debugLog?.('bridge_malformed', { requestId: parsed.requestId, reason: parsed.reason });
      postMessage(
        createDedaoGuiNotesBridgeFailureResponse({
          requestId: parsed.requestId,
          status: 'malformed_payload',
          code: 'malformed_payload',
          message: parsed.reason,
          recoverable: true,
        }),
      );
      return;
    }

    debugLog?.('bridge_request', { requestId: parsed.request.requestId, timeoutMs: parsed.request.timeoutMs || null });
    const response = await executeDedaoGuiNotesBridgeRequest(parsed.request, {
      document: deps.document || document,
      locationHref: deps.locationHref || globalThis.location?.href || '',
      extractNotes: deps.extractNotes,
    });
    debugLog?.('bridge_response', {
      requestId: response.requestId,
      ok: response.ok,
      status: response.status,
      extractedCount: response.notes.length,
    });
    postMessage(response);
  };
}

export default defineContentScript({
  matches: [...DEDAO_GUI_NOTES_MAIN_WORLD_MATCHES],
  runAt: 'document_idle',
  world: 'MAIN',
  main() {
    if (!isDedaoArticleUrl(window.location.href)) return;
    const listener = createDedaoGuiNotesMainWorldListener();
    window.addEventListener('message', (event: Event) => {
      void listener(event as MessageEvent);
    });
  },
});
