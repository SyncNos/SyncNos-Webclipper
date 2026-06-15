import { describe, expect, it } from 'vitest';

import {
  buildDedaoGuiNoteContentKey,
  dedupeDedaoGuiNotes,
  isValidDedaoGuiNote,
  normalizeDedaoGuiNote,
  normalizeDedaoGuiText,
} from '../../src/collectors/web/dedao-gui-notes-model';
import {
  DEDAO_GUI_NOTES_BRIDGE_TYPES,
  createDedaoGuiNotesBridgeFailureResponse,
  createDedaoGuiNotesBridgeRequest,
  createDedaoGuiNotesBridgeSuccessResponse,
  isDedaoGuiNotesBridgeResponse,
} from '../../src/collectors/web/dedao-gui-notes-bridge-contract';

describe('dedao gui notes model', () => {
  it('normalizes whitespace and rejects empty note payloads', () => {
    expect(normalizeDedaoGuiText('  a \r\n\r\n b  ')).toBe('a\n\n b');

    expect(
      normalizeDedaoGuiNote({
        externalId: ' 123 ',
        quoteText: '   ',
        commentText: ' has body ',
      }),
    ).toBeNull();

    expect(
      normalizeDedaoGuiNote({
        externalId: ' 123 ',
        quoteText: ' quote ',
        commentText: '\n comment \n',
        range: ' 1:1,1:2 ',
      }),
    ).toEqual({
      externalId: '123',
      quoteText: 'quote',
      commentText: 'comment',
      range: '1:1,1:2',
    });

    expect(isValidDedaoGuiNote({ quoteText: 'a', commentText: 'b' })).toBe(true);
    expect(isValidDedaoGuiNote({ quoteText: 'a', commentText: '' })).toBe(false);
  });

  it('dedupes by external id first and falls back to content key', () => {
    const deduped = dedupeDedaoGuiNotes([
      { externalId: 'abc', quoteText: 'q1', commentText: 'c1' },
      { externalId: 'abc', quoteText: 'q1 changed', commentText: 'c1 changed' },
      { externalId: '', quoteText: 'q2', commentText: 'c2' },
      { externalId: '', quoteText: ' q2 ', commentText: ' c2 ' },
      { externalId: '', quoteText: 'q3', commentText: 'c3' },
      { externalId: '', quoteText: '', commentText: 'c4' },
    ]);

    expect(deduped).toEqual([
      { externalId: 'abc', quoteText: 'q1', commentText: 'c1' },
      { externalId: '', quoteText: 'q2', commentText: 'c2' },
      { externalId: '', quoteText: 'q3', commentText: 'c3' },
    ]);

    expect(buildDedaoGuiNoteContentKey({ quoteText: ' q ', commentText: ' c ' })).toBe('q::c');
  });
});

describe('dedao gui notes bridge contract', () => {
  it('creates normalized request payloads', () => {
    const request = createDedaoGuiNotesBridgeRequest({ requestId: ' req-1 ', timeoutMs: 1500.9 });
    expect(request).toEqual({
      __syncnos: true,
      type: DEDAO_GUI_NOTES_BRIDGE_TYPES.REQUEST,
      requestId: 'req-1',
      timeoutMs: 1500,
    });
  });

  it('encodes success, empty, and failure responses', () => {
    const success = createDedaoGuiNotesBridgeSuccessResponse({
      requestId: 'req-1',
      notes: [{ externalId: 'x', quoteText: 'quote', commentText: 'comment' }],
    });
    expect(success).toMatchObject({
      __syncnos: true,
      type: DEDAO_GUI_NOTES_BRIDGE_TYPES.RESPONSE,
      requestId: 'req-1',
      ok: true,
      status: 'success',
    });
    expect(isDedaoGuiNotesBridgeResponse(success)).toBe(true);

    const empty = createDedaoGuiNotesBridgeSuccessResponse({ requestId: 'req-2', notes: [] });
    expect(empty).toEqual({
      __syncnos: true,
      type: DEDAO_GUI_NOTES_BRIDGE_TYPES.RESPONSE,
      requestId: 'req-2',
      ok: true,
      status: 'empty',
      notes: [],
      error: null,
    });
    expect(isDedaoGuiNotesBridgeResponse(empty)).toBe(true);

    const failure = createDedaoGuiNotesBridgeFailureResponse({
      requestId: 'req-3',
      status: 'malformed_payload',
      message: 'bad payload',
      recoverable: false,
    });
    expect(failure).toEqual({
      __syncnos: true,
      type: DEDAO_GUI_NOTES_BRIDGE_TYPES.RESPONSE,
      requestId: 'req-3',
      ok: false,
      status: 'malformed_payload',
      notes: [],
      error: {
        code: 'malformed_payload',
        message: 'bad payload',
        recoverable: false,
      },
    });
    expect(isDedaoGuiNotesBridgeResponse(failure)).toBe(true);
    expect(isDedaoGuiNotesBridgeResponse({ __syncnos: true, type: 'wrong' })).toBe(false);
  });
});
