import { describe, expect, it, vi } from 'vitest';

import { importDedaoArticleNotes } from '../../src/services/web-article/dedao-note-import';

describe('dedao note import service', () => {
  it('dedupes bridge duplicates and skips existing root comments', async () => {
    const addRootComment = vi.fn(async ({ canonicalUrl, conversationId, quoteText, commentText }) => ({
      id: 9,
      parentId: null,
      conversationId,
      canonicalUrl,
      quoteText,
      commentText,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

    const summary = await importDedaoArticleNotes(
      {
        canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
        conversationId: 42,
      },
      {
        extractNotes: vi.fn(async () => ({
          __syncnos: true,
          type: 'SYNCNOS_DEDAO_GUI_NOTES_RESPONSE',
          requestId: 'req-1',
          ok: true,
          status: 'success',
          error: null,
          notes: [
            { externalId: 'a', quoteText: '摘录一', commentText: '笔记一' },
            { externalId: 'a', quoteText: '摘录一', commentText: '笔记一' },
            { externalId: '', quoteText: '摘录二', commentText: '笔记二' },
          ],
        })),
        listExisting: vi.fn(async () => [
          {
            id: 1,
            parentId: null,
            conversationId: 42,
            canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
            quoteText: '摘录一',
            commentText: '笔记一',
            createdAt: 1,
            updatedAt: 1,
          },
          {
            id: 2,
            parentId: 1,
            conversationId: 42,
            canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
            quoteText: '',
            commentText: '回复',
            createdAt: 1,
            updatedAt: 1,
          },
        ]),
        addRootComment,
      },
    );

    expect(summary).toEqual({
      canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
      conversationId: 42,
      bridgeStatus: 'success',
      extractedCount: 2,
      importedCount: 1,
      skippedDuplicates: 1,
      existingRootCount: 1,
      errorMessage: '',
    });
    expect(addRootComment).toHaveBeenCalledTimes(1);
    expect(addRootComment).toHaveBeenCalledWith({
      canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
      conversationId: 42,
      quoteText: '摘录二',
      commentText: '笔记二',
    });
  });

  it('returns empty summary when bridge reports empty', async () => {
    const summary = await importDedaoArticleNotes(
      {
        canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
        conversationId: 42,
      },
      {
        extractNotes: vi.fn(async () => ({
          __syncnos: true,
          type: 'SYNCNOS_DEDAO_GUI_NOTES_RESPONSE',
          requestId: 'req-1',
          ok: true,
          status: 'empty',
          error: null,
          notes: [],
        })),
      },
    );

    expect(summary.bridgeStatus).toBe('empty');
    expect(summary.importedCount).toBe(0);
    expect(summary.extractedCount).toBe(0);
  });

  it('fails open when bridge throws or returns an error response', async () => {
    const thrown = await importDedaoArticleNotes(
      {
        canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
        conversationId: 42,
      },
      {
        extractNotes: vi.fn(async () => {
          throw new Error('bridge unavailable');
        }),
      },
    );
    expect(thrown).toMatchObject({
      bridgeStatus: 'failed_open',
      importedCount: 0,
      errorMessage: 'bridge unavailable',
    });

    const errored = await importDedaoArticleNotes(
      {
        canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
        conversationId: 42,
      },
      {
        extractNotes: vi.fn(async () => ({
          __syncnos: true,
          type: 'SYNCNOS_DEDAO_GUI_NOTES_RESPONSE',
          requestId: 'req-2',
          ok: false,
          status: 'timeout',
          notes: [],
          error: {
            code: 'timeout',
            message: 'timed out',
            recoverable: true,
          },
        })),
      },
    );

    expect(errored).toMatchObject({
      bridgeStatus: 'timeout',
      importedCount: 0,
      errorMessage: 'timed out',
    });
  });

  it('preserves malformed payload semantics and fails open on repo errors', async () => {
    const malformed = await importDedaoArticleNotes(
      {
        canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
        conversationId: 42,
      },
      {
        extractNotes: vi.fn(async () => ({
          __syncnos: true,
          type: 'SYNCNOS_DEDAO_GUI_NOTES_RESPONSE',
          requestId: 'req-3',
          ok: false,
          status: 'malformed_payload',
          notes: [],
          error: {
            code: 'malformed_payload',
            message: 'bad payload',
            recoverable: true,
          },
        })),
      },
    );
    expect(malformed).toMatchObject({
      bridgeStatus: 'malformed_payload',
      importedCount: 0,
      errorMessage: 'bad payload',
    });

    const repoFailure = await importDedaoArticleNotes(
      {
        canonicalUrl: 'https://www.dedao.cn/course/article?id=1',
        conversationId: 42,
      },
      {
        extractNotes: vi.fn(async () => ({
          __syncnos: true,
          type: 'SYNCNOS_DEDAO_GUI_NOTES_RESPONSE',
          requestId: 'req-4',
          ok: true,
          status: 'success',
          error: null,
          notes: [{ externalId: 'n-1', quoteText: '摘录', commentText: '笔记' }],
        })),
        listExisting: vi.fn(async () => {
          throw new Error('comments repo unavailable');
        }),
      },
    );

    expect(repoFailure).toMatchObject({
      bridgeStatus: 'failed_open',
      importedCount: 0,
      errorMessage: 'comments repo unavailable',
    });
  });
});
