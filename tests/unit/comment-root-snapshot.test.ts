import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import { captureCommentRootSnapshot } from '../../src/services/comments/locator/comment-root-snapshot';

function root(html: string): Element {
  const document = new JSDOM(html).window.document;
  return document.body.firstElementChild!;
}

describe('captureCommentRootSnapshot', () => {
  test('captures stable non-sensitive evidence only', () => {
    const value = captureCommentRootSnapshot(root('<article role="main" data-testid="story" data-secret="token"><b>Hello</b><br>world</article>'));
    expect(value).toEqual({
      textModelVersion: 'dom-text-v2',
      textLength: 11,
      textHash: expect.stringMatching(/^fnv1a32:/),
      tagName: 'article',
      role: 'main',
      dataAttributes: { 'data-testid': 'story' },
    });
    expect(JSON.stringify(value)).not.toContain('Hello');
    expect(JSON.stringify(value)).not.toContain('token');
    expect(JSON.stringify(value)).not.toContain('innerHTML');
  });

  test('is deterministic and enforces the text budget', () => {
    const element = root('<main>same text</main>');
    expect(captureCommentRootSnapshot(element)).toEqual(captureCommentRootSnapshot(element));
    expect(captureCommentRootSnapshot(element, { maxTextLength: 3 })).toBeNull();
  });
});
