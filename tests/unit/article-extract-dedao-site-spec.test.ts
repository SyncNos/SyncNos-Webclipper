// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { extractBySiteSpec } from '@collectors/web/article-extract/site-spec-extractor';
import { DEDAO_NOTE_DETAIL_SITE_SPEC } from '@collectors/web/article-fetch-sites/dedao-note-detail';

describe('article-extract dedao site spec', () => {
  it('keeps note body and source card while removing recommendations and comments', () => {
    document.body.innerHTML = `<div id="app">${readFileSync(resolve('.github/features/dedao-comment/完整的DOM.md'), 'utf8')}</div>`;
    document.title = '得到APP - 知识就是力量，知识就在得到';

    const res = extractBySiteSpec(
      DEDAO_NOTE_DETAIL_SITE_SPEC,
      'https://www.dedao.cn/knowledge/note/detail?id=AaWVPxLgY8DkXGMkJyEGXnDqwEoXJ9',
    );

    expect(res).toBeTruthy();
    expect(res?.author).toBe('angie焕捷');
    expect(res?.publishedAt).toBe('03-23');
    expect(String(res?.textContent || '')).toContain('万 sir 您好，我是一名自闭症孩子的妈妈。');
    expect(String(res?.textContent || '')).toContain('可能：不确定性是意义的燃料');
    expect(String(res?.textContent || '')).not.toContain('关注他们，获取更多优质内容');
    expect(String(res?.textContent || '')).not.toContain('添加评论');
    expect(String(res?.textContent || '')).not.toContain('在 AI 年代，做成这件事情真的不难。');
    expect(String(res?.contentHTML || '')).toContain('source-card');
    expect(String(res?.contentHTML || '')).not.toContain('forward-comment-like');
    expect(String(res?.contentHTML || '')).not.toContain('write-comment');
  });
});
