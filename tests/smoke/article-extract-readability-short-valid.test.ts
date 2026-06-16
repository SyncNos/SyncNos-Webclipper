import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

vi.mock('../../src/collectors/web/article-extract/defuddle', () => {
  return {
    extractByDefuddle() {
      return null;
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
  vi.restoreAllMocks();
});

describe('article-extract readability short valid', () => {
  it('keeps a correct short readability result even when the surrounding app shell is long', async () => {
    const validArticleText =
      'Short article body. '.repeat(20) +
      'This should stay on the readability path instead of falling back to the noisy shell.';
    const hugeComments = Array.from({ length: 80 }, (_, index) => `Comment ${index + 1}: ${'reply '.repeat(12)}`).join(
      '',
    );
    const dom = new JSDOM(
      `<!doctype html>
      <html>
        <head><title>Long Shell App</title></head>
        <body>
          <div id="app">
            <div class="layout-shell">
              <div class="article-column">
                <div class="article-card">
                  <p>${validArticleText}</p>
                </div>
              </div>
              <aside class="sidebar-column">
                <p>Extra related links</p>
              </aside>
              <section class="comments-column">
                <p>${hugeComments}</p>
              </section>
            </div>
          </div>
        </body>
      </html>`,
      { url: 'https://example.com/app-shell', pretendToBeVisual: true },
    );

    setDomGlobals(dom);

    class MockReadability {
      parse() {
        return {
          title: 'Readable Article',
          byline: '',
          excerpt: '',
          content: `<div><p>${validArticleText}</p></div>`,
          textContent: validArticleText,
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

    expect(markdown).toContain('Short article body.');
    expect(markdown).toContain('This should stay on the readability path');
    expect(markdown).not.toContain('Comment 1:');
  });
});
