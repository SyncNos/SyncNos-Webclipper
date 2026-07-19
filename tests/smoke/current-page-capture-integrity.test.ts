import { describe, expect, it, vi } from 'vitest';

import { createCurrentPageCaptureService } from '@services/bootstrap/current-page-capture';

function chatSnapshot(options?: { completeness?: 'complete' | 'partial'; verified?: boolean; source?: string }) {
  return {
    conversation: {
      sourceType: 'chat',
      source: options?.source || 'chatgpt',
      conversationKey: 'conversation-1',
      title: 'Conversation',
      url: 'https://chatgpt.com/c/conversation-1',
    },
    messages: [{ messageKey: 'm1', role: 'user', contentText: 'hello', sequence: 0 }],
    captureMeta: {
      completeness: options?.completeness || 'complete',
      identityVerified: options?.verified !== false,
    },
  };
}

function createHarness(input: { collectorId: string; snapshot?: any; prepare?: () => any; article?: any }) {
  const calls: Array<{ type: string; payload?: any }> = [];
  const capture = vi.fn(() => input.snapshot);
  const runtime = {
    send: vi.fn(async (type: string, payload?: any) => {
      calls.push({ type, payload });
      if (type === 'fetchActiveTabArticle') {
        return { ok: true, data: input.article || { conversationId: 9, title: 'Article', isNew: true } };
      }
      if (type === 'upsertConversation') return { ok: true, data: { id: 7, __isNew: true } };
      if (type === 'syncConversationMessages') return { ok: true, data: { upserted: 1 } };
      return { ok: true, data: {} };
    }),
  };
  const collector: any = { capture };
  if (input.prepare) collector.prepareManualCapture = input.prepare;
  const service = createCurrentPageCaptureService({
    runtime,
    collectorsRegistry: {
      pickActive: () => ({ id: input.collectorId, collector }),
      list: () => [],
    },
  });
  return { service, calls, capture, runtime };
}

describe('current page capture integrity routing', () => {
  it('persists explicit complete capture as snapshot in write order', async () => {
    const harness = createHarness({ collectorId: 'chatgpt', snapshot: chatSnapshot() });

    await harness.service.captureCurrentPage();

    expect(harness.calls.map((call) => call.type)).toEqual(['upsertConversation', 'syncConversationMessages']);
    expect(harness.calls[1].payload).toMatchObject({ mode: 'snapshot', diff: null });
  });

  it('persists verified partial capture as append with normalized diff', async () => {
    const harness = createHarness({
      collectorId: 'chatgpt',
      snapshot: chatSnapshot({ completeness: 'partial' }),
    });

    await harness.service.captureCurrentPage();

    expect(harness.calls.map((call) => call.type)).toEqual(['upsertConversation', 'syncConversationMessages']);
    expect(harness.calls[1].payload).toMatchObject({
      mode: 'append',
      diff: { added: ['m1'], updated: [], removed: [] },
    });
    expect(harness.calls[1].payload.messages[0]).toMatchObject({
      captureSequencePolicy: 'preserve-existing-tail',
    });
  });

  it.each([
    ['unverified', chatSnapshot({ verified: false })],
    ['missing metadata', { ...chatSnapshot(), captureMeta: undefined }],
    ['unsafe partial', { ...chatSnapshot({ completeness: 'partial' }), messages: [{ contentText: 'no key' }] }],
  ])('sends no write for invalid virtual output: %s', async (_label, snapshot) => {
    const harness = createHarness({ collectorId: 'chatgpt', snapshot });

    await expect(harness.service.captureCurrentPage()).rejects.toThrow();

    expect(harness.calls).toEqual([]);
  });

  it('routes unresolved Deep Research placeholders to protective append', async () => {
    const placeholder = 'Deep Research (iframe): https://example.web-sandbox.oaiusercontent.com/report';
    const harness = createHarness({
      collectorId: 'chatgpt',
      snapshot: {
        ...chatSnapshot(),
        messages: [
          {
            messageKey: 'm1',
            role: 'assistant',
            contentText: placeholder,
            contentMarkdown: placeholder,
            sequence: 0,
          },
        ],
      },
    });

    await harness.service.captureCurrentPage();

    const sync = harness.calls.find((call) => call.type === 'syncConversationMessages');
    expect(sync?.payload).toMatchObject({ mode: 'append' });
    expect(sync?.payload.messages[0]).toMatchObject({
      captureMergePolicy: 'preserve-existing-content',
    });
  });

  it('keeps legacy non-virtual collectors compatible', async () => {
    const snapshot = { ...chatSnapshot({ source: 'gemini' }), captureMeta: undefined };
    const harness = createHarness({ collectorId: 'gemini', snapshot });

    await harness.service.captureCurrentPage();

    expect(harness.calls[1].payload).toMatchObject({ mode: 'snapshot', diff: null });
  });

  it('keeps article capture unchanged', async () => {
    const harness = createHarness({ collectorId: 'web', snapshot: null });

    const result = await harness.service.captureCurrentPage();

    expect(result).toMatchObject({ kind: 'article', conversationId: 9, title: 'Article' });
    expect(harness.calls.map((call) => call.type)).toEqual(['fetchActiveTabArticle']);
    expect(harness.capture).not.toHaveBeenCalled();
  });
});
