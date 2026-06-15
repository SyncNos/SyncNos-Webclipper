import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import {
  extractDedaoNotesByMarkerFallback,
  extractDedaoNotesFromDocument,
  extractDedaoNotesFromPage,
  isDedaoArticleLikePage,
} from '@collectors/web/dedao-notes';

describe('dedao notes extraction', () => {
  it('recognizes dedao article-like urls', () => {
    expect(isDedaoArticleLikePage(new URL('https://m.dedao.cn/article/abc'))).toBe(true);
    expect(isDedaoArticleLikePage(new URL('https://www.dedao.cn/foo'))).toBe(true);
    expect(isDedaoArticleLikePage(new URL('https://example.com/foo'))).toBe(false);
    expect(isDedaoArticleLikePage(new URL('https://m.dedao.cn/'))).toBe(false);
  });

  it('extracts note candidates from vue roots', () => {
    const dom = new JSDOM(
      `
        <body>
          <div class="iget-rich-text-panel-container"></div>
        </body>
      `,
      { url: 'https://m.dedao.cn/article/demo', pretendToBeVisual: true },
    );
    const root = dom.window.document.querySelector('.iget-rich-text-panel-container') as any;
    root.__vue__ = {
      _data: {
        noteItems: [
          {
            logType: 'note',
            logId: '3736122978992164',
            content: '原文摘录A',
            note: '笔记A',
            range: '9:41,9:85',
            extra: { articleId: 120061, articleTitle: '主动高认知负荷：注意力的 Pro 模式' },
          },
          {
            logType: 'note',
            feedId: 3736122978992165,
            content: '原文摘录B',
            note: '笔记B',
            detailId: 120061,
            extra: { articleId: 120061, articleTitle: '主动高认知负荷：注意力的 Pro 模式' },
          },
          {
            logType: 'note',
            logId: '3736122978992164',
            content: '原文摘录A',
            note: '笔记A',
            extra: { articleId: 120061 },
          },
        ],
      },
    };

    const notes = extractDedaoNotesFromDocument(dom.window.document, dom.window.location);

    expect(notes).toEqual([
      {
        externalId: '3736122978992164',
        quoteText: '原文摘录A',
        commentText: '笔记A',
        range: '9:41,9:85',
        articleId: 120061,
        articleTitle: '主动高认知负荷：注意力的 Pro 模式',
      },
      {
        externalId: '3736122978992165',
        quoteText: '原文摘录B',
        commentText: '笔记B',
        range: undefined,
        articleId: 120061,
        articleTitle: '主动高认知负荷：注意力的 Pro 模式',
      },
    ]);
  });

  it('falls back to marker clicks when direct read is empty', async () => {
    const dom = new JSDOM(
      `
        <body>
          <svg>
            <text class="em-highlight-tag-text">笔记</text>
          </svg>
          <button class="note-close-btn"></button>
          <div class="notes-edit-content"></div>
        </body>
      `,
      { url: 'https://m.dedao.cn/article/demo', pretendToBeVisual: true },
    );

    // @ts-expect-error test globals
    globalThis.window = dom.window;
    // @ts-expect-error test globals
    globalThis.document = dom.window.document;
    // @ts-expect-error test globals
    globalThis.location = dom.window.location;
    // @ts-expect-error test globals
    globalThis.MouseEvent = dom.window.MouseEvent;

    const marker = dom.window.document.querySelector('text.em-highlight-tag-text') as any;
    marker.addEventListener('click', () => {
      const content = dom.window.document.querySelector('.notes-edit-content') as HTMLElement;
      content.textContent = '弹层笔记正文';
      console.log('markerLineClick', {
        id: 'q5bw6jAgEnwxVpe0XvxN284rdZ0kom',
        content: '原文摘录C',
        range: '9:41,9:85',
        meta: {
          logType: 'note',
          logId: '3736122978992164',
          note: '笔记C',
          extra: { articleId: 120061, articleTitle: '主动高认知负荷：注意力的 Pro 模式' },
        },
      });
    });

    const notes = await extractDedaoNotesByMarkerFallback(dom.window.document, dom.window.location);
    expect(notes).toEqual([
      {
        externalId: '3736122978992164',
        quoteText: '原文摘录C',
        commentText: '笔记C',
        range: '9:41,9:85',
        articleId: 120061,
        articleTitle: '主动高认知负荷：注意力的 Pro 模式',
      },
    ]);

    const notesViaPage = await extractDedaoNotesFromPage(dom.window.document, dom.window.location);
    expect(notesViaPage).toEqual(notes);
  });
});
