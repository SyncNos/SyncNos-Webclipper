import { CONTENT_MESSAGE_TYPES } from '@platform/messaging/message-contracts';
import {
  createDedaoGuiNotesBridgeFailureResponse,
  createDedaoGuiNotesBridgeRequest,
  isDedaoGuiNotesBridgeResponse,
  type DedaoGuiNotesBridgeResponse,
} from '@collectors/web/dedao-gui-notes-bridge-contract';

type ApiResponse<T> = {
  ok: boolean;
  data: T | null;
  error: { message: string; extra: unknown } | null;
};

function ok<T>(data: T): ApiResponse<T> {
  return { ok: true, data, error: null };
}

function err(message: unknown, extra?: unknown): ApiResponse<null> {
  return {
    ok: false,
    data: null,
    error: {
      message: String(message || 'unknown error'),
      extra: extra ?? null,
    },
  };
}

function buildRequestId() {
  return `dedao_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isDedaoArticleUrl(raw: string): boolean {
  try {
    const parsed = new URL(String(raw || ''));
    const host = String(parsed.hostname || '').toLowerCase();
    return (host === 'www.dedao.cn' || host === 'dedao.cn' || host === 'm.dedao.cn') && parsed.pathname === '/course/article';
  } catch (_error) {
    return false;
  }
}

async function requestDedaoGuiNotesFromMainWorld(timeoutMs: number): Promise<DedaoGuiNotesBridgeResponse> {
  const requestId = buildRequestId();

  console.info('[DedaoNotes][Content] main-world request', {
    requestId,
    url: location.href,
    timeoutMs,
  });

  return await new Promise<DedaoGuiNotesBridgeResponse>((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const finish = (response: DedaoGuiNotesBridgeResponse) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener('message', onMessage as EventListener);
      console.info('[DedaoNotes][Content] main-world response', {
        requestId,
        url: location.href,
        status: response.status,
        extractedCount: Array.isArray(response.notes) ? response.notes.length : 0,
      });
      resolve(response);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      const data = (event as any)?.data;
      if (!isDedaoGuiNotesBridgeResponse(data)) return;
      if (String(data.requestId || '').trim() !== requestId) return;
      finish(data);
    };

    window.addEventListener('message', onMessage as EventListener);
    timer = setTimeout(() => {
      finish(
        createDedaoGuiNotesBridgeFailureResponse({
          requestId,
          status: 'timeout',
          code: 'timeout',
          message: 'timed out waiting for main-world dedao gui notes bridge',
          recoverable: true,
        }),
      );
    }, timeoutMs);

    window.postMessage(
      createDedaoGuiNotesBridgeRequest({
        requestId,
        timeoutMs,
      }),
      '*',
    );
  });
}

export function registerDedaoGuiNotesContentHandlers() {
  const runtime = (globalThis as any).chrome?.runtime ?? (globalThis as any).browser?.runtime;
  const onMessage = runtime?.onMessage;
  if (!onMessage?.addListener) return () => {};

  const listener = (msg: any, _sender: any, sendResponse: (value: ApiResponse<any>) => void) => {
    if (!msg || typeof msg.type !== 'string') return undefined;
    if (msg.type !== CONTENT_MESSAGE_TYPES.EXTRACT_DEDAO_GUI_NOTES) return undefined;

    const timeoutMs = Math.max(200, Math.floor(Number(msg?.payload?.timeoutMs) || 1_500));

    Promise.resolve()
      .then(async () => {
        if (!isDedaoArticleUrl(location.href)) {
          return createDedaoGuiNotesBridgeFailureResponse({
            requestId: buildRequestId(),
            status: 'error',
            code: 'unexpected_error',
            message: 'not a dedao article page',
            recoverable: true,
          });
        }

        return await requestDedaoGuiNotesFromMainWorld(timeoutMs);
      })
      .then((data) => sendResponse(ok(data)))
      .catch((error) => sendResponse(err((error as any)?.message ?? error)));

    return true;
  };

  onMessage.addListener(listener);

  return () => {
    try {
      onMessage.removeListener?.(listener);
    } catch (_error) {
      // ignore remove failures
    }
  };
}
