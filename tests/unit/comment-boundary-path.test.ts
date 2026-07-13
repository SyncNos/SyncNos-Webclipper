import { JSDOM } from 'jsdom';
import { describe, expect, test } from 'vitest';

import {
  captureCommentBoundaryPath,
  encodeCommentNodePath,
  restoreCommentBoundaryRange,
  restoreCommentRootFromDocumentPath,
} from '../../src/services/comments/locator/comment-boundary-path';

function fixture() {
  const document = new JSDOM('<main><article><p>Hello <b>world</b></p></article></main>').window.document;
  return { document, main: document.querySelector('main')!, article: document.querySelector('article')! };
}

describe('comment boundary paths', () => {
  test('round-trips text boundaries relative to the selected root', () => {
    const { article } = fixture();
    const hello = article.querySelector('p')!.firstChild!;
    const world = article.querySelector('b')!.firstChild!;
    const range = article.ownerDocument.createRange();
    range.setStart(hello, 1);
    range.setEnd(world, 3);
    const path = captureCommentBoundaryPath(article, range)!;
    expect(path.start.path).toEqual([0, 0]);
    expect(path.end.path).toEqual([0, 1, 0]);
    expect(restoreCommentBoundaryRange(article, path)?.toString()).toBe('ello wor');
  });

  test('encodes an optional document-relative root path', () => {
    const { main, article } = fixture();
    expect(encodeCommentNodePath(main, article)).toEqual([0]);
  });

  test('document-relative root restore requires evidence validation', () => {
    const { main, article } = fixture();
    const expected = { textModelVersion: 'dom-text-v2', textLength: 11, textHash: 'hash' } as const;
    let validated: Element | null = null;
    const reject = (candidate: Element) => {
      validated = candidate;
      return false;
    };
    expect(
      restoreCommentRootFromDocumentPath({
        documentRoot: main,
        path: [0],
        expectedEvidence: expected,
        validateEvidence: reject,
      }),
    ).toBeNull();
    expect(validated).toBe(article);
    expect(
      restoreCommentRootFromDocumentPath({
        documentRoot: main,
        path: [0],
        expectedEvidence: expected,
        validateEvidence: () => true,
      }),
    ).toBe(article);
  });

  test('rejects invalid and over-budget paths', () => {
    const { main } = fixture();
    expect(
      restoreCommentRootFromDocumentPath({
        documentRoot: main,
        path: [99],
        expectedEvidence: { textModelVersion: 'dom-text-v2', textLength: 0, textHash: 'x' },
        validateEvidence: () => true,
      }),
    ).toBeNull();
    expect(encodeCommentNodePath(main, {} as Node)).toBeNull();
  });
});
