export type SelectionTextExtractResult = {
  text: string;
  method: 'selection_toString' | 'range_toString' | 'clone_textContent' | 'none';
};

export type SelectionTextExtractOptions = {
  trim?: boolean;
  maxLen?: number;
};

function normalizeText(raw: unknown, options?: SelectionTextExtractOptions): string {
  const trimmed = options?.trim !== false;
  const maxLen = Number(options?.maxLen);
  let text = String(raw ?? '');
  if (trimmed) text = text.trim();
  if (Number.isFinite(maxLen) && maxLen > 0 && text.length > maxLen) {
    text = text.slice(0, Math.floor(maxLen));
  }
  return text;
}

function safeGetRangeFromSelection(selection: Selection): Range | null {
  try {
    if (Number(selection.rangeCount || 0) <= 0) return null;
    return selection.getRangeAt(0) || null;
  } catch (_e) {
    return null;
  }
}

function safeBuildRangeFromStaticRange(staticRange: any): Range | null {
  try {
    const doc = (globalThis as any).document as Document | undefined;
    if (!doc || typeof (doc as any).createRange !== 'function') return null;
    if (!staticRange) return null;
    const startContainer = (staticRange as any).startContainer as Node | null | undefined;
    const endContainer = (staticRange as any).endContainer as Node | null | undefined;
    const startOffset = Number((staticRange as any).startOffset);
    const endOffset = Number((staticRange as any).endOffset);
    if (!startContainer || !endContainer) return null;
    if (!Number.isFinite(startOffset) || startOffset < 0) return null;
    if (!Number.isFinite(endOffset) || endOffset < 0) return null;
    const range = doc.createRange();
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
    return range;
  } catch (_e) {
    return null;
  }
}

function safeGetComposedRangeFromSelection(selection: Selection): Range | null {
  const anySel = selection as any;
  const getComposedRanges = anySel?.getComposedRanges;
  if (typeof getComposedRanges !== 'function') return null;
  try {
    const list = getComposedRanges.call(selection);
    const first = Array.isArray(list) && list.length ? list[0] : null;
    const range = safeBuildRangeFromStaticRange(first);
    return range;
  } catch (_e) {
    return null;
  }
}

export function extractSelectionText(
  selection: Selection | null | undefined,
  options?: SelectionTextExtractOptions,
): SelectionTextExtractResult {
  const sel = selection || null;
  if (!sel) return { text: '', method: 'none' };

  // Prefer composed ranges when available to better handle shadow DOM boundaries.
  // When shadow roots aren't provided, the API may re-scope endpoints to the host element,
  // which is still useful for extracting user-visible text.
  const composedRange = safeGetComposedRangeFromSelection(sel);
  if (composedRange) {
    try {
      const viaComposedRange = normalizeText((composedRange as any).toString?.(), options);
      if (viaComposedRange) return { text: viaComposedRange, method: 'range_toString' };
    } catch (_e) {
      // ignore and fallback
    }
    try {
      const fragment = composedRange.cloneContents?.();
      const viaClone = normalizeText(fragment?.textContent, options);
      if (viaClone) return { text: viaClone, method: 'clone_textContent' };
    } catch (_e) {
      // ignore and fallback
    }
  }

  try {
    const viaSelection = normalizeText(sel.toString?.(), options);
    if (viaSelection) return { text: viaSelection, method: 'selection_toString' };
  } catch (_e) {
    // ignore and fallback
  }

  const range = safeGetRangeFromSelection(sel);
  if (!range) return { text: '', method: 'none' };

  try {
    const viaRange = normalizeText((range as any).toString?.(), options);
    if (viaRange) return { text: viaRange, method: 'range_toString' };
  } catch (_e) {
    // ignore and fallback
  }

  try {
    const fragment = range.cloneContents?.();
    const viaClone = normalizeText(fragment?.textContent, options);
    if (viaClone) return { text: viaClone, method: 'clone_textContent' };
  } catch (_e) {
    // ignore
  }

  return { text: '', method: 'none' };
}

function safeGetIframeSelectionFromDocument(doc: Document | null | undefined): Selection | null {
  const documentRef = doc || null;
  if (!documentRef) return null;
  const active = documentRef.activeElement as HTMLElement | null;
  if (!active) return null;
  if (String(active.tagName || '').toUpperCase() !== 'IFRAME') return null;
  const frame = active as unknown as HTMLIFrameElement;
  try {
    const win = frame.contentWindow;
    if (!win || typeof win.getSelection !== 'function') return null;
    return win.getSelection();
  } catch (_e) {
    return null;
  }
}

export function extractUserSelectionText(options?: SelectionTextExtractOptions): SelectionTextExtractResult {
  try {
    const win = (globalThis as any).window as Window | undefined;
    const selection = win?.getSelection?.();
    const primary = extractSelectionText(selection || null, options);
    if (primary.text) return primary;
    const doc = (globalThis as any).document as Document | undefined;
    const frameSelection = safeGetIframeSelectionFromDocument(doc);
    if (!frameSelection) return primary;
    return extractSelectionText(frameSelection, options);
  } catch (_e) {
    return { text: '', method: 'none' };
  }
}

export function isSelectionLikelyWithinRoot(selection: Selection | null | undefined, root: Element | null): boolean {
  if (!selection || !root || Number(selection.rangeCount || 0) !== 1) return false;
  try {
    const range = selection.getRangeAt(0);
    if (!range || range.collapsed) return false;
    const start = range.startContainer;
    const end = range.endContainer;
    if (!start || !end) return false;
    const ownerDocument = root.ownerDocument;
    if (start.ownerDocument !== ownerDocument || end.ownerDocument !== ownerDocument) return false;
    const rootTree = root.getRootNode?.() || ownerDocument;
    if ((start.getRootNode?.() || start.ownerDocument) !== rootTree) return false;
    if ((end.getRootNode?.() || end.ownerDocument) !== rootTree) return false;
    return (start === root || root.contains(start)) && (end === root || root.contains(end));
  } catch (_e) {
    return false;
  }
}
