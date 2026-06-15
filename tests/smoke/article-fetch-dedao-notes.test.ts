import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const storageMocks = {
  hasConversation: vi.fn(),
  upsertConversation: vi.fn(),
  syncConversationMessages: vi.fn(),
};

const settingsMocks = {
  storageGet: vi.fn(),
  storageSet: vi.fn(),
};

const imageInlineMocks = {
  inlineChatImagesInMessages: vi.fn(),
};

const dedaoImportMocks = {
  importDedaoArticleNotes: vi.fn(),
};

vi.mock('@services/url-cleaning/tracking-param-cleaner', () => ({
  cleanTrackingParamsUrl: async (url: string) => url,
}));

vi.mock('@services/conversations/data/storage', () => ({
  hasConversation: storageMocks.hasConversation,
  upsertConversation: storageMocks.upsertConversation,
  syncConversationMessages: storageMocks.syncConversationMessages,
}));

vi.mock('@platform/storage/local', () => ({
  storageGet: settingsMocks.storageGet,
  storageSet: settingsMocks.storageSet,
}));

vi.mock('@services/conversations/data/image-inline', () => ({
  inlineChatImagesInMessages: imageInlineMocks.inlineChatImagesInMessages,
}));

vi.mock('@services/web-article/dedao-note-import', () => ({
  importDedaoArticleNotes: dedaoImportMocks.importDedaoArticleNotes,
}));

async function loadArticleFetchModule() {
  const mod = await import('../../src/collectors/web/article-fetch.ts');
  return mod;
}

beforeEach(() => {
  vi.resetModules();
  storageMocks.hasConversation.mockResolvedValue(false);
  storageMocks.upsertConversation.mockImplementation(async (payload: any) => ({ id: 11, ...payload }));
  storageMocks.syncConversationMessages.mockResolvedValue({ upserted: 1, deleted: 0 });
  settingsMocks.storageGet.mockResolvedValue({ web_article_cache_images_enabled: false });
  settingsMocks.storageSet.mockResolvedValue(undefined);
  imageInlineMocks.inlineChatImagesInMessages.mockImplementation(async (input: any) => ({
    messages: input.messages,
    inlinedCount: 0,
    downloadedCount: 0,
    fromCacheCount: 0,
    inlinedBytes: 0,
    warningFlags: [],
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
  storageMocks.hasConversation.mockReset();
  storageMocks.upsertConversation.mockReset();
  storageMocks.syncConversationMessages.mockReset();
  settingsMocks.storageGet.mockReset();
  settingsMocks.storageSet.mockReset();
  imageInlineMocks.inlineChatImagesInMessages.mockReset();
  dedaoImportMocks.importDedaoArticleNotes.mockReset();
  // @ts-expect-error cleanup
  delete globalThis.chrome;
});

function installChromeForUrl(url: string, noteResponse?: any) {
  const sendMessage = vi.fn((tabId: number, msg: any, cb: (res: any) => void) => {
    if (msg?.type === 'extractWebArticle') {
      cb({
        ok: true,
        data: {
          ok: true,
          title: 'Dedao Title',
          author: 'Author',
          publishedAt: '2026-06-15',
          excerpt: '',
          contentHTML: '<p>正文</p>',
          contentMarkdown: '正文',
          textContent: '正文',
          warningFlags: [],
        },
      });
      return;
    }

    if (msg?.type === 'extractDedaoGuiNotes') {
      cb({
        ok: true,
        data: noteResponse || {
          __syncnos: true,
          type: 'SYNCNOS_DEDAO_GUI_NOTES_RESPONSE',
          requestId: 'req-1',
          ok: true,
          status: 'empty',
          notes: [],
          error: null,
        },
      });
      return;
    }

    cb({ ok: false, error: { message: `unexpected message ${msg?.type}`, extra: null } });
  });

  // @ts-expect-error test global
  globalThis.chrome = {
    runtime: { lastError: null },
    tabs: {
      query: (_query: any, cb: (tabs: any[]) => void) => cb([{ id: 77, url, title: 'Tab Title' }]),
      sendMessage,
    },
    scripting: {
      executeScript: vi.fn((details: any, cb: (results: any[]) => void) => cb(Array.isArray(details?.files) ? [{}] : [])),
    },
  };

  return { sendMessage };
}

describe('article fetch dedao notes smoke', () => {
  it('triggers dedao note import on dedao article pages', async () => {
    const { sendMessage } = installChromeForUrl('https://www.dedao.cn/course/article?id=1');
    dedaoImportMocks.importDedaoArticleNotes.mockImplementation(async (input: any, deps: any) => {
      const response = await deps.extractNotes();
      expect(response.status).toBe('empty');
      return {
        canonicalUrl: input.canonicalUrl,
        conversationId: input.conversationId,
        bridgeStatus: 'empty',
        extractedCount: 0,
        importedCount: 0,
        skippedDuplicates: 0,
        existingRootCount: 0,
        errorMessage: '',
      };
    });

    const mod = await loadArticleFetchModule();
    const result = await mod.fetchActiveTabArticle();

    expect(result.conversationId).toBe(11);
    expect(dedaoImportMocks.importDedaoArticleNotes).toHaveBeenCalledTimes(1);
    expect(sendMessage.mock.calls.some((call) => call[1]?.type === 'extractDedaoGuiNotes')).toBe(true);
  });

  it('skips dedao note import on non-dedao pages', async () => {
    installChromeForUrl('https://example.com/post');
    const mod = await loadArticleFetchModule();
    await mod.fetchActiveTabArticle();

    expect(dedaoImportMocks.importDedaoArticleNotes).not.toHaveBeenCalled();
  });

  it('keeps article capture successful when dedao import fails open', async () => {
    installChromeForUrl('https://www.dedao.cn/course/article?id=2', {
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
    });
    dedaoImportMocks.importDedaoArticleNotes.mockRejectedValue(new Error('import exploded'));

    const mod = await loadArticleFetchModule();
    const result = await mod.fetchActiveTabArticle();

    expect(result.url).toBe('https://www.dedao.cn/course/article?id=2');
    expect(result.conversationId).toBe(11);
    expect(storageMocks.syncConversationMessages).toHaveBeenCalledTimes(1);
  });
});
