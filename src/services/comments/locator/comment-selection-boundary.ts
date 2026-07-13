export type CommentSelectionBoundaryFailure =
  | 'missing_selection'
  | 'invalid_range_count'
  | 'collapsed'
  | 'missing_boundary'
  | 'owner_document_mismatch'
  | 'dom_tree_mismatch'
  | 'outside_root'
  | 'excluded_root';

export type CommentSelectionBoundaryResult =
  | { ok: true; range: Range }
  | { ok: false; reason: CommentSelectionBoundaryFailure };

function nodeOwnerDocument(node: Node | null | undefined): Document | null {
  if (!node) return null;
  return node.nodeType === 9 ? (node as Document) : node.ownerDocument;
}

function nodeTree(node: Node): Node {
  return typeof node.getRootNode === 'function' ? node.getRootNode() : nodeOwnerDocument(node) || node;
}

function containsBoundary(root: Element, node: Node): boolean {
  return node === root || root.contains(node);
}

export function validateCommentSelectionBoundary(input: {
  selection: Selection | null | undefined;
  root: Element | null | undefined;
  excludedRoots?: readonly (Element | null | undefined)[];
}): CommentSelectionBoundaryResult {
  const selection = input.selection || null;
  const root = input.root || null;
  if (!selection || !root) return { ok: false, reason: 'missing_selection' };
  if (selection.rangeCount !== 1) return { ok: false, reason: 'invalid_range_count' };

  let range: Range;
  try {
    range = selection.getRangeAt(0);
  } catch (_error) {
    return { ok: false, reason: 'missing_boundary' };
  }
  if (!range || range.collapsed) return { ok: false, reason: 'collapsed' };

  const start = range.startContainer;
  const end = range.endContainer;
  if (!start || !end) return { ok: false, reason: 'missing_boundary' };

  const rootDocument = nodeOwnerDocument(root);
  if (!rootDocument || nodeOwnerDocument(start) !== rootDocument || nodeOwnerDocument(end) !== rootDocument) {
    return { ok: false, reason: 'owner_document_mismatch' };
  }

  const rootTree = nodeTree(root);
  if (nodeTree(start) !== rootTree || nodeTree(end) !== rootTree) {
    return { ok: false, reason: 'dom_tree_mismatch' };
  }

  if (!containsBoundary(root, start) || !containsBoundary(root, end)) {
    return { ok: false, reason: 'outside_root' };
  }

  for (const excluded of input.excludedRoots || []) {
    if (!excluded) continue;
    if (containsBoundary(excluded, start) || containsBoundary(excluded, end)) {
      return { ok: false, reason: 'excluded_root' };
    }
  }

  return { ok: true, range };
}
