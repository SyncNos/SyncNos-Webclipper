import { CONTENT_MESSAGE_TYPES } from '@platform/messaging/message-contracts';
import { extractDedaoNotesFromDocument, isDedaoArticleLikePage, type DedaoExtractedNote } from '@collectors/web/dedao-notes';

type ApiResponse<T> = {
  ok: boolean;
  data: T | null;
  error: { message: string; extra: unknown } | null;
};

type DedaoNotesRequestPayload = {
  __syncnos: true;
  type: 'SYNCNOS_DEDAO_NOTES_REQUEST';
  requestId: string;
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

function createRequestId(): string {
  return `dedao_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function requestDedaoNotesViaMainWorld(timeoutMs = 1_500): Promise<DedaoExtractedNote[]> {
  const requestId = createRequestId();

  return await new Promise((resolve) => {
    let settled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const finish = (notes: DedaoExtractedNote[]) => {
      if (settled) return;
      settled = true;
      try {
        window.removeEventListener('message', onMessage as any);
      } catch (_error) {
        // ignore
      }
      if (timeoutId) clearTimeout(timeoutId);
      resolve(Array.isArray(notes) ? notes : []);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      const data: any = event.data;
      if (!data || data.__syncnos !== true) return;
      if (data.type !== 'SYNCNOS_DEDAO_NOTES_RESPONSE') return;
      if (String(data.requestId || '').trim() !== requestId) return;
      finish(Array.isArray(data.notes) ? (data.notes as DedaoExtractedNote[]) : []);
    };

    window.addEventListener('message', onMessage as any);
    timeoutId = setTimeout(() => finish([]), Math.max(200, Number(timeoutMs) || 1_500));

    try {
      window.postMessage(
        {
          __syncnos: true,
          type: 'SYNCNOS_DEDAO_NOTES_REQUEST',
          requestId,
        } satisfies DedaoNotesRequestPayload,
        '*',
      );
    } catch (_error) {
      finish([]);
    }
  });
}

export function registerDedaoNotesExtractContentHandlers() {
  const runtime = (globalThis as any).chrome?.runtime ?? (globalThis as any).browser?.runtime;
  const onMessage = runtime?.onMessage;
  if (!onMessage?.addListener) return () => {};

  const listener = (msg: any, _sender: any, sendResponse: (value: ApiResponse<any>) => void) => {
    if (!msg || typeof msg.type !== 'string') return undefined;
    if (msg.type !== CONTENT_MESSAGE_TYPES.EXTRACT_DEDAO_ARTICLE_NOTES) return undefined;

    Promise.resolve()
      .then(async () => {
        if (!isDedaoArticleLikePage(location)) return [];
        const notes = await requestDedaoNotesViaMainWorld(Number(msg?.payload?.timeoutMs) || undefined);
        if (Array.isArray(notes) && notes.length) return notes;
        return extractDedaoNotesFromDocument(document, location);
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
      // ignore
    }
  };
}
