import { describe, expect, test } from 'vitest';

import { validateCommentSelectionBoundary } from '../../src/services/comments/locator/comment-selection-boundary';

type FakeNode = Node & { parent?: FakeNode; tree?: Node };

function node(doc: Document, parent?: FakeNode, tree?: Node): FakeNode {
  return {
    nodeType: 3,
    ownerDocument: doc,
    parent,
    tree,
    getRootNode() {
      return this.tree || doc;
    },
  } as unknown as FakeNode;
}

function element(doc: Document, members: Node[], tree?: Node): Element {
  return {
    nodeType: 1,
    ownerDocument: doc,
    contains(candidate: Node) {
      return candidate === this || members.includes(candidate);
    },
    getRootNode() {
      return tree || doc;
    },
  } as unknown as Element;
}

function selection(range: Partial<Range>, rangeCount = 1): Selection {
  return { rangeCount, getRangeAt: () => range } as unknown as Selection;
}

describe('validateCommentSelectionBoundary', () => {
  test('accepts exactly one non-collapsed range fully inside the root', () => {
    const doc = {} as Document;
    const start = node(doc);
    const end = node(doc);
    const root = element(doc, [start, end]);
    const result = validateCommentSelectionBoundary({
      selection: selection({ startContainer: start, endContainer: end, collapsed: false }),
      root,
    });
    expect(result.ok).toBe(true);
  });

  test.each([
    [0, 'invalid_range_count'],
    [2, 'invalid_range_count'],
  ])('rejects rangeCount=%s', (rangeCount, reason) => {
    const doc = {} as Document;
    const root = element(doc, []);
    expect(validateCommentSelectionBoundary({ selection: selection({}, rangeCount), root })).toEqual({
      ok: false,
      reason,
    });
  });

  test('rejects collapsed, cross-document, cross-tree, outside, and excluded boundaries', () => {
    const doc = {} as Document;
    const otherDoc = {} as Document;
    const tree = {} as Node;
    const otherTree = {} as Node;
    const inside = node(doc, undefined, tree);
    const outside = node(doc, undefined, tree);
    const crossDoc = node(otherDoc, undefined, tree);
    const crossTree = node(doc, undefined, otherTree);
    const root = element(doc, [inside, crossDoc, crossTree], tree);
    const excluded = element(doc, [inside], tree);

    expect(
      validateCommentSelectionBoundary({
        selection: selection({ startContainer: inside, endContainer: inside, collapsed: true }),
        root,
      }),
    ).toEqual({ ok: false, reason: 'collapsed' });
    expect(
      validateCommentSelectionBoundary({
        selection: selection({ startContainer: inside, endContainer: crossDoc, collapsed: false }),
        root,
      }),
    ).toEqual({ ok: false, reason: 'owner_document_mismatch' });
    expect(
      validateCommentSelectionBoundary({
        selection: selection({ startContainer: inside, endContainer: crossTree, collapsed: false }),
        root,
      }),
    ).toEqual({ ok: false, reason: 'dom_tree_mismatch' });
    expect(
      validateCommentSelectionBoundary({
        selection: selection({ startContainer: inside, endContainer: outside, collapsed: false }),
        root,
      }),
    ).toEqual({ ok: false, reason: 'outside_root' });
    expect(
      validateCommentSelectionBoundary({
        selection: selection({ startContainer: inside, endContainer: inside, collapsed: false }),
        root,
        excludedRoots: [excluded],
      }),
    ).toEqual({ ok: false, reason: 'excluded_root' });
  });
});
