// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { extractBySiteSpec } from '@collectors/web/article-extract/site-spec-extractor';
import { XIAOHONGSHU_NOTE_SITE_SPEC } from '@collectors/web/article-fetch-sites/xiaohongshu-note';

describe('article-extract xiaohongshu', () => {
  it('extracts note text and images from hydrated DOM', () => {
    document.body.innerHTML = `
      <div id="noteContainer" class="note-container">
        <div class="author-wrapper">
          <a class="name"><span class="username">作者</span></a>
        </div>
        <div class="media-container">
          <img src="https://sns-webpic-qc.xhscdn.com/202604061902/aaa/spectrum/1040g!nd_dft_wlteh_webp_3" />
          <img src="https://sns-webpic-qc.xhscdn.com/202604061902/bbb/spectrum/1040g!nd_dft_wlteh_webp_3" />
        </div>
        <div class="content">
          <span class="note-text">这里是正文</span>
        </div>
      </div>
    `;

    const res = extractBySiteSpec(XIAOHONGSHU_NOTE_SITE_SPEC, 'https://www.xiaohongshu.com/explore/123');
    expect(res).toBeTruthy();
    expect(res?.author).toBe('作者');
    expect(Object.prototype.hasOwnProperty.call(res || {}, 'contentMarkdown')).toBe(false);
    expect(String(res?.textContent || '')).toContain('这里是正文');
    expect(String(res?.contentHTML || '')).toContain('sns-webpic-qc.xhscdn.com');
  });

  it('avoids Swiper loop duplicate slides which can invert image order', () => {
    const urlFirst = 'https://sns-webpic-qc.xhscdn.com/202604061902/aaa/spectrum/1040g!nd_dft_wlteh_webp_3';
    const urlLast = 'https://sns-webpic-qc.xhscdn.com/202604061902/bbb/spectrum/1040g!nd_dft_wlteh_webp_3';

    // Swiper loop mode clones slides at both ends; the clone at DOM start can be the last image.
    document.body.innerHTML = `
      <div id="noteContainer" class="note-container">
        <div class="media-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide swiper-slide-duplicate">
              <img src="${urlLast}" />
            </div>
            <div class="swiper-slide">
              <img src="${urlFirst}" />
            </div>
            <div class="swiper-slide">
              <img src="${urlLast}" />
            </div>
          </div>
        </div>
        <div class="content">
          <span class="note-text">这里是正文</span>
        </div>
      </div>
    `;

    const res = extractBySiteSpec(XIAOHONGSHU_NOTE_SITE_SPEC, 'https://www.xiaohongshu.com/explore/123');
    expect(res).toBeTruthy();

    const html = String(res?.contentHTML || '');
    expect(html).toContain(urlFirst);
    expect(html).toContain(urlLast);
    expect(html.indexOf(urlFirst)).toBeLessThan(html.indexOf(urlLast));
  });
});
