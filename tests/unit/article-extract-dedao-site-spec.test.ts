// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { htmlToMarkdownTurndown } from '@collectors/web/article-extract/markdown-turndown';
import { extractBySiteSpec } from '@collectors/web/article-extract/site-spec-extractor';
import { DEDAO_NOTE_DETAIL_SITE_SPEC } from '@collectors/web/article-fetch-sites/dedao-note-detail';
import { buildDedaoNoteInnerHtml } from '../helpers/dedao-note-fixture';

describe('article-extract dedao site spec', () => {
  it('keeps note body, source card, and comment discussion while removing avatars and noisy UI', () => {
    document.body.innerHTML = `<div id="app">${buildDedaoNoteInnerHtml()}</div>`;
    document.title = '得到APP - 知识就是力量，知识就在得到';

    const res = extractBySiteSpec(
      DEDAO_NOTE_DETAIL_SITE_SPEC,
      'https://www.dedao.cn/knowledge/note/detail?id=AaWVPxLgY8DkXGMkJyEGXnDqwEoXJ9',
    );

    expect(res).toBeTruthy();
    expect(res?.author).toBe('作者示例');
    expect(res?.publishedAt).toBe('03-23');
    expect(String(res?.textContent || '')).toContain('正文段落一：这是用于抽取回归测试的示例内容。');
    expect(String(res?.textContent || '')).toContain('正文段落二：抽取器应该保留这段核心文本。');
    expect(String(res?.textContent || '')).toContain('评论区示例：这条讨论内容应该被保留下来。');
    expect(String(res?.textContent || '')).not.toContain('关注他们，获取更多优质内容');
    expect(String(res?.textContent || '')).not.toContain('添加评论');
    expect(String(res?.textContent || '')).not.toContain('转发 3');
    expect(String(res?.contentHTML || '')).toContain('source-card');
    expect(String(res?.contentHTML || '')).not.toContain('write-comment');
    expect(String(res?.contentHTML || '')).not.toContain('forward-list');
    expect(String(res?.contentHTML || '')).not.toContain('like-list');
    expect(String(res?.contentHTML || '')).not.toContain('uploader/image/avatar');

    const markdown = htmlToMarkdownTurndown(
      String(res?.contentHTML || ''),
      'https://www.dedao.cn/knowledge/note/detail?id=AaWVPxLgY8DkXGMkJyEGXnDqwEoXJ9',
    );
    expect(markdown).toContain('正文段落一：这是用于抽取回归测试的示例内容。');
    expect(markdown).not.toContain('* * *');
    expect(markdown).not.toContain('\n---\n');
  });
});
