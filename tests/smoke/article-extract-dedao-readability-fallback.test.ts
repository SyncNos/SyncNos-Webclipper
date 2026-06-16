import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

import { extractWebArticleFromCurrentPage } from '../../src/collectors/web/article-extract/engine';

function setDomGlobals(dom: JSDOM) {
  // @ts-expect-error test global
  globalThis.window = dom.window;
  // @ts-expect-error test global
  globalThis.document = dom.window.document;
  // @ts-expect-error test global
  globalThis.Node = dom.window.Node;
  // @ts-expect-error test global
  globalThis.location = dom.window.location;
  // @ts-expect-error test global
  globalThis.getComputedStyle = dom.window.getComputedStyle;
}

function clearDomGlobals() {
  // @ts-expect-error test global
  delete globalThis.window;
  // @ts-expect-error test global
  delete globalThis.document;
  // @ts-expect-error test global
  delete globalThis.Node;
  // @ts-expect-error test global
  delete globalThis.location;
  // @ts-expect-error test global
  delete globalThis.getComputedStyle;
  // @ts-expect-error test global
  delete globalThis.Readability;
}

afterEach(() => {
  clearDomGlobals();
  vi.restoreAllMocks();
});

describe('article-extract dedao readability fallback', () => {
  it('continues past a truncated readability result and recovers the main note body', async () => {
    const dedaoDom = readFileSync(resolve('.github/features/dedao-comment/dom1.md'), 'utf8');
    const dom = new JSDOM(
      `<!doctype html>
      <html>
        <head>
          <title>得到APP - 知识就是力量，知识就在得到</title>
        </head>
        <body>
          <div id="app">
            <div class="iget-ui-row" id="mainWrap">
              ${dedaoDom}
              <aside id="rightContent">
                <div class="right-content">
                  <p>联系我们：</p>
                  <p>客服电话：400-0526-000</p>
                  <p>相关链接：</p>
                  <p>得到官网</p>
                  <p>下载「得到App」</p>
                </div>
              </aside>
            </div>
          </div>
        </body>
      </html>`,
      {
        url: 'https://www.dedao.cn/knowledge/note/detail?id=AaWVPxLgY8DkXGMkJyEGXnDqwEoXJ9',
        pretendToBeVisual: true,
      },
    );

    setDomGlobals(dom);

    class MockReadability {
      parse() {
        return {
          title: '得到APP - 知识就是力量，知识就在得到',
          byline: '',
          excerpt: '',
          content: '<div><p>联系我们：</p><p>客服电话：400-0526-000</p><p>下载「得到App」</p></div>',
          textContent: '联系我们： 客服电话：400-0526-000 下载「得到App」',
        };
      }
    }

    // @ts-expect-error test global
    globalThis.Readability = MockReadability;

    const extracted = await extractWebArticleFromCurrentPage({
      stabilizationTimeoutMs: 1,
      stabilizationMinTextLength: 1,
    });

    const markdown = String(extracted.contentMarkdown || '');

    expect(markdown).toContain('万 sir 您好，我是一名自闭症孩子的妈妈。');
    expect(markdown).toContain('可能：不确定性是意义的燃料');
    expect(markdown).not.toContain('客服电话：400-0526-000');
  });
});
