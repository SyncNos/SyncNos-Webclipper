import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

vi.mock('../../src/collectors/web/article-extract/defuddle', () => {
  return {
    extractByDefuddle() {
      return {
        title: 'Mock Title',
        author: '',
        publishedAt: '',
        excerpt: '',
        contentHTML: '<html><body><p>FIRST_ONLY</p></body></html>',
        textContent: 'FIRST_ONLY',
      };
    },
  };
});

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
});

describe('article-extract defuddle partial fallback', () => {
  it('avoids truncated defuddle result on long-form marketing pages', async () => {
    const dom = new JSDOM(
      `<!doctype html>
      <html>
        <head><title>Mock Marketing Page</title></head>
        <body>
          <main>
            <h1>Heading</h1>
            <p>FIRST_ONLY</p>
            <h2>More Content</h2>
            <p>${'SECOND_BLOCK '.repeat(2000)}</p>
          </main>
        </body>
      </html>`,
      { url: 'https://example.com/values', pretendToBeVisual: true },
    );

    setDomGlobals(dom);
    const extracted = await extractWebArticleFromCurrentPage({
      stabilizationTimeoutMs: 1,
      stabilizationMinTextLength: 1,
    });

    const markdown = String(extracted.contentMarkdown || '');
    const text = String(extracted.textContent || '');

    expect(text.length).toBeGreaterThan(10_000);
    expect(markdown).toContain('FIRST\\_ONLY');
    expect(markdown).toContain('SECOND\\_BLOCK');
  });
});
