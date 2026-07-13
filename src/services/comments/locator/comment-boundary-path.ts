import type { ArticleCommentBoundaryPath, ArticleCommentRootEvidence } from '@services/comments/domain/comment-locator';

const MAX_PATH_SEGMENTS = 128;

export function encodeCommentNodePath(root: Node, node: Node): number[] | null {
  if (root === node) return [];
  const path: number[] = [];
  let cursor: Node | null = node;
  while (cursor && cursor !== root) {
    const parent: Node | null = cursor.parentNode;
    if (!parent) return null;
    const index = Array.prototype.indexOf.call(parent.childNodes, cursor);
    if (index < 0) return null;
    path.push(index);
    if (path.length > MAX_PATH_SEGMENTS) return null;
    cursor = parent;
  }
  return cursor === root ? path.reverse() : null;
}

export function restoreCommentNodePath(root: Node, path: readonly number[]): Node | null {
  if (!Array.isArray(path) || path.length > MAX_PATH_SEGMENTS) return null;
  let cursor: Node = root;
  for (const part of path) {
    if (!Number.isSafeInteger(part) || part < 0 || part >= cursor.childNodes.length) return null;
    cursor = cursor.childNodes[part]!;
  }
  return cursor;
}

export function captureCommentBoundaryPath(root: Element, range: Range): ArticleCommentBoundaryPath | null {
  const startPath = encodeCommentNodePath(root, range.startContainer);
  const endPath = encodeCommentNodePath(root, range.endContainer);
  if (!startPath || !endPath) return null;
  return {
    start: { path: startPath, offset: range.startOffset },
    end: { path: endPath, offset: range.endOffset },
  };
}

export function restoreCommentBoundaryRange(root: Element, path: ArticleCommentBoundaryPath): Range | null {
  const startNode = restoreCommentNodePath(root, path.start.path);
  const endNode = restoreCommentNodePath(root, path.end.path);
  if (!startNode || !endNode) return null;
  try {
    const range = root.ownerDocument.createRange();
    range.setStart(startNode, path.start.offset);
    range.setEnd(endNode, path.end.offset);
    return range.collapsed ? null : range;
  } catch (_error) {
    return null;
  }
}

export function restoreCommentRootFromDocumentPath(input: {
  documentRoot: Element;
  path: readonly number[];
  expectedEvidence: ArticleCommentRootEvidence;
  validateEvidence: (root: Element, expected: ArticleCommentRootEvidence) => boolean;
}): Element | null {
  const node = restoreCommentNodePath(input.documentRoot, input.path);
  if (!node || node.nodeType !== 1) return null;
  const element = node as Element;
  return input.validateEvidence(element, input.expectedEvidence) ? element : null;
}
