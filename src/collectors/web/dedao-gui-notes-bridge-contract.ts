import type { DedaoGuiNote } from './dedao-gui-notes-model';

export const DEDAO_GUI_NOTES_BRIDGE_TYPES = {
  REQUEST: 'SYNCNOS_DEDAO_GUI_NOTES_REQUEST',
  RESPONSE: 'SYNCNOS_DEDAO_GUI_NOTES_RESPONSE',
} as const;

export type DedaoGuiNotesBridgeRequest = {
  __syncnos: true;
  type: (typeof DEDAO_GUI_NOTES_BRIDGE_TYPES)['REQUEST'];
  requestId: string;
  timeoutMs?: number;
};

export type DedaoGuiNotesBridgeError = {
  code: 'empty' | 'timeout' | 'malformed_payload' | 'unexpected_error';
  message: string;
  recoverable: boolean;
};

type DedaoGuiNotesBridgeResponseBase = {
  __syncnos: true;
  type: (typeof DEDAO_GUI_NOTES_BRIDGE_TYPES)['RESPONSE'];
  requestId: string;
};

export type DedaoGuiNotesBridgeSuccessResponse = DedaoGuiNotesBridgeResponseBase & {
  ok: true;
  status: 'success';
  notes: DedaoGuiNote[];
  error: null;
};

export type DedaoGuiNotesBridgeEmptyResponse = DedaoGuiNotesBridgeResponseBase & {
  ok: true;
  status: 'empty';
  notes: [];
  error: null;
};

export type DedaoGuiNotesBridgeFailureResponse = DedaoGuiNotesBridgeResponseBase & {
  ok: false;
  status: 'timeout' | 'malformed_payload' | 'error';
  notes: [];
  error: DedaoGuiNotesBridgeError;
};

export type DedaoGuiNotesBridgeResponse =
  | DedaoGuiNotesBridgeSuccessResponse
  | DedaoGuiNotesBridgeEmptyResponse
  | DedaoGuiNotesBridgeFailureResponse;

export function createDedaoGuiNotesBridgeRequest(input?: {
  requestId?: unknown;
  timeoutMs?: unknown;
}): DedaoGuiNotesBridgeRequest {
  const requestId = String(input?.requestId || '').trim();
  if (!requestId) {
    throw new Error('dedao gui notes bridge requestId is required');
  }

  const timeoutMsRaw = Number(input?.timeoutMs);
  const timeoutMs = Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 0 ? Math.floor(timeoutMsRaw) : undefined;

  return {
    __syncnos: true,
    type: DEDAO_GUI_NOTES_BRIDGE_TYPES.REQUEST,
    requestId,
    ...(timeoutMs ? { timeoutMs } : {}),
  };
}

export function createDedaoGuiNotesBridgeSuccessResponse(input: {
  requestId: unknown;
  notes: DedaoGuiNote[];
}): DedaoGuiNotesBridgeSuccessResponse | DedaoGuiNotesBridgeEmptyResponse {
  const requestId = String(input?.requestId || '').trim();
  if (!requestId) {
    throw new Error('dedao gui notes bridge response requestId is required');
  }

  const notes = Array.isArray(input?.notes) ? input.notes : [];
  if (!notes.length) {
    return {
      __syncnos: true,
      type: DEDAO_GUI_NOTES_BRIDGE_TYPES.RESPONSE,
      requestId,
      ok: true,
      status: 'empty',
      notes: [],
      error: null,
    };
  }

  return {
    __syncnos: true,
    type: DEDAO_GUI_NOTES_BRIDGE_TYPES.RESPONSE,
    requestId,
    ok: true,
    status: 'success',
    notes,
    error: null,
  };
}

export function createDedaoGuiNotesBridgeFailureResponse(input: {
  requestId: unknown;
  status: DedaoGuiNotesBridgeFailureResponse['status'];
  code?: DedaoGuiNotesBridgeError['code'];
  message?: unknown;
  recoverable?: boolean;
}): DedaoGuiNotesBridgeFailureResponse {
  const requestId = String(input?.requestId || '').trim();
  if (!requestId) {
    throw new Error('dedao gui notes bridge response requestId is required');
  }

  const status = input?.status;
  if (status !== 'timeout' && status !== 'malformed_payload' && status !== 'error') {
    throw new Error('invalid dedao gui notes bridge failure status');
  }

  const defaultCode: DedaoGuiNotesBridgeError['code'] =
    status === 'timeout' ? 'timeout' : status === 'malformed_payload' ? 'malformed_payload' : 'unexpected_error';

  return {
    __syncnos: true,
    type: DEDAO_GUI_NOTES_BRIDGE_TYPES.RESPONSE,
    requestId,
    ok: false,
    status,
    notes: [],
    error: {
      code: input?.code || defaultCode,
      message: String(input?.message || status),
      recoverable: input?.recoverable ?? true,
    },
  };
}

export function isDedaoGuiNotesBridgeResponse(value: unknown): value is DedaoGuiNotesBridgeResponse {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.__syncnos !== true) return false;
  if (candidate.type !== DEDAO_GUI_NOTES_BRIDGE_TYPES.RESPONSE) return false;
  if (!String(candidate.requestId || '').trim()) return false;
  if (typeof candidate.ok !== 'boolean') return false;
  if (!Array.isArray(candidate.notes)) return false;
  if (candidate.ok === true) {
    return candidate.status === 'success' || candidate.status === 'empty';
  }
  return candidate.status === 'timeout' || candidate.status === 'malformed_payload' || candidate.status === 'error';
}
