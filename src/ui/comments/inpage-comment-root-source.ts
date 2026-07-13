import type { ArticleCommentLocator } from '@services/comments/domain/comment-locator';
import { restoreCommentRootFromDocumentPath } from '@services/comments/locator/comment-boundary-path';
import { isCommentRootEvidenceMatch } from '@services/comments/locator/comment-root-evidence';
import { captureCommentAnchor } from '@services/comments/locator/capture-comment-anchor';
import type { CommentLocatorSurfaceRoots } from '@ui/comments/types';

function asElement(node: Node | null): Element | null {
  if (!node) return null;
  return node.nodeType === 1 ? (node as Element) : node.parentElement;
}

function commonElement(start: Node, end: Node): Element | null {
  const startAncestors = new Set<Element>();
  let cursor: Element | null = asElement(start);
  while (cursor) {
    startAncestors.add(cursor);
    cursor = cursor.parentElement;
  }
  cursor = asElement(end);
  while (cursor) {
    if (startAncestors.has(cursor)) return cursor;
    cursor = cursor.parentElement;
  }
  return null;
}

function pickScrollRoot(root: Element): Element {
  let cursor: Element | null = root;
  while (cursor) {
    const style = cursor.ownerDocument.defaultView?.getComputedStyle?.(cursor);
    if (style && /(auto|scroll)/.test(`${style.overflowY} ${style.overflow}`)) return cursor;
    cursor = cursor.parentElement;
  }
  return root.ownerDocument.documentElement;
}

export function createInpageCommentRootSource(input: {
  document: Document;
  getPanelRoot?: () => Element | null;
  maxCandidates?: number;
}) {
  const doc = input.document;
  const maxCandidates = Math.max(1, Math.floor(Number(input.maxCandidates ?? 8) || 1));

  const capture = (selection: Selection | null | undefined): CommentLocatorSurfaceRoots | null => {
    if (!selection || selection.rangeCount !== 1) return null;
    let range: Range;
    try {
      range = selection.getRangeAt(0);
    } catch (_error) {
      return null;
    }
    if (
      !range ||
      range.collapsed ||
      range.startContainer.ownerDocument !== doc ||
      range.endContainer.ownerDocument !== doc
    )
      return null;
    const root = commonElement(range.startContainer, range.endContainer);
    if (!root || root === doc.body || root === doc.documentElement) return null;
    const panel = input.getPanelRoot?.();
    if (panel && (panel.contains(range.startContainer) || panel.contains(range.endContainer))) return null;
    return { sourceRoot: root, scrollRoot: pickScrollRoot(root) };
  };

  const captureAnchor = (selection: Selection | null | undefined) => {
    const roots = capture(selection);
    if (!roots || !selection || selection.rangeCount !== 1) return null;
    try {
      return captureCommentAnchor({
        root: roots.sourceRoot,
        range: selection.getRangeAt(0),
        surfaceHint: 'inpage',
        documentRoot: doc.documentElement,
      });
    } catch (_error) {
      return null;
    }
  };

  const locate = (locator: ArticleCommentLocator): Element[] => {
    const results: Element[] = [];
    const add = (candidate: Element | null) => {
      if (!candidate || candidate === doc.body || candidate === doc.documentElement) return;
      if (results.includes(candidate)) return;
      if (locator.v === 2 && !isCommentRootEvidenceMatch(candidate, locator.rootEvidence)) return;
      results.push(candidate);
    };

    if (locator.v === 2 && locator.documentRelativeRootPath) {
      add(
        restoreCommentRootFromDocumentPath({
          documentRoot: doc.documentElement,
          path: locator.documentRelativeRootPath,
          expectedEvidence: locator.rootEvidence,
          validateEvidence: isCommentRootEvidenceMatch,
        }),
      );
    }

    const candidates = doc.querySelectorAll(
      'article, main, [role="main"], [data-testid], [data-message-id], [data-node-id]',
    );
    for (const candidate of Array.from(candidates)) {
      if (results.length >= maxCandidates) break;
      add(candidate);
    }
    return results.slice(0, maxCandidates);
  };

  return { capture, captureAnchor, locate };
}
