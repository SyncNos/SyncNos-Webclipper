import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import { extractDedaoNotesFromDocument, isDedaoArticleLikePage } from '@collectors/web/dedao-notes';

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
});
