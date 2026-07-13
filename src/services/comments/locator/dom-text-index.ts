export const COMMENT_DOM_TEXT_MODEL_VERSION = 'dom-text-v2' as const;

type TextSegment = {
  node: Node;
  start: number;
  end: number;
  text: string;
  kind: 'text' | 'br';
};

export type CommentDomTextIndex = {
  version: typeof COMMENT_DOM_TEXT_MODEL_VERSION;
  root: Element;
  text: string;
  segments: readonly TextSegment[];
  boundaryToOffset(node: Node, offset: number): number | null;
  offsetToBoundary(offset: number, affinity?: 'start' | 'end'): { node: Node; offset: number } | null;
  rangeToOffsets(range: Range): { start: number; end: number } | null;
  offsetsToRange(start: number, end: number): Range | null;
};

function isHiddenElement(element: Element): boolean {
  if (element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true') return true;
  const style = (element as HTMLElement).style;
  return style?.display === 'none' || style?.visibility === 'hidden';
}

function collectSegments(root: Element): TextSegment[] {
  const segments: TextSegment[] = [];
  let cursor = 0;

  const visit = (node: Node, hidden: boolean) => {
    if (node.nodeType === 1) {
      const element = node as Element;
      const nextHidden = hidden || isHiddenElement(element);
      if (nextHidden) return;
      if (element.tagName.toLowerCase() === 'br') {
        segments.push({ node: element, start: cursor, end: cursor + 1, text: '\n', kind: 'br' });
        cursor += 1;
        return;
      }
      for (const child of Array.from(node.childNodes)) visit(child, false);
      return;
    }
    if (hidden || node.nodeType !== 3) return;
    const text = String(node.nodeValue ?? '').replace(/\r\n?/g, '\n');
    if (!text) return;
    segments.push({ node, start: cursor, end: cursor + text.length, text, kind: 'text' });
    cursor += text.length;
  };

  visit(root, false);
  return segments;
}

function clampOffset(value: number, max: number): number | null {
  if (!Number.isSafeInteger(value) || value < 0 || value > max) return null;
  return value;
}

export function createCommentDomTextIndex(root: Element): CommentDomTextIndex {
  const segments = collectSegments(root);
  const text = segments.map((segment) => segment.text).join('');

  const boundaryToOffset = (node: Node, offset: number): number | null => {
    if (!Number.isSafeInteger(offset) || offset < 0) return null;
    const direct = segments.find((segment) => segment.node === node);
    if (direct) {
      if (direct.kind === 'br') return offset === 0 ? direct.start : offset === 1 ? direct.end : null;
      return offset <= direct.text.length ? direct.start + offset : null;
    }

    if (node.nodeType === 1) {
      const element = node as Element;
      if (offset > element.childNodes.length) return null;
      if (offset === element.childNodes.length) {
        const inside = segments.filter((segment) => element.contains(segment.node));
        return inside.length ? inside[inside.length - 1]!.end : null;
      }
      const child = element.childNodes[offset];
      const first = segments.find(
        (segment) => child === segment.node || (child.nodeType === 1 && (child as Element).contains(segment.node)),
      );
      return first?.start ?? null;
    }
    return null;
  };

  const offsetToBoundary = (offset: number, affinity: 'start' | 'end' = 'start') => {
    const normalized = clampOffset(offset, text.length);
    if (normalized == null || !segments.length) return null;
    if (normalized === text.length) {
      const last = segments[segments.length - 1]!;
      return last.kind === 'text'
        ? { node: last.node, offset: last.text.length }
        : {
            node: last.node.parentNode || root,
            offset: Array.prototype.indexOf.call((last.node.parentNode || root).childNodes, last.node) + 1,
          };
    }
    const segment = segments.find(
      (item) => normalized >= item.start && (normalized < item.end || (affinity === 'end' && normalized === item.end)),
    );
    if (!segment) return null;
    if (segment.kind === 'text')
      return { node: segment.node, offset: Math.max(0, Math.min(segment.text.length, normalized - segment.start)) };
    const parent = segment.node.parentNode || root;
    const index = Array.prototype.indexOf.call(parent.childNodes, segment.node);
    return { node: parent, offset: normalized <= segment.start ? index : index + 1 };
  };

  const rangeToOffsets = (range: Range) => {
    const start = boundaryToOffset(range.startContainer, range.startOffset);
    const end = boundaryToOffset(range.endContainer, range.endOffset);
    return start == null || end == null || end < start ? null : { start, end };
  };

  const offsetsToRange = (start: number, end: number): Range | null => {
    if (start < 0 || end <= start || end > text.length) return null;
    const startBoundary = offsetToBoundary(start, 'start');
    const endBoundary = offsetToBoundary(end, 'end');
    if (!startBoundary || !endBoundary) return null;
    const range = root.ownerDocument.createRange();
    range.setStart(startBoundary.node, startBoundary.offset);
    range.setEnd(endBoundary.node, endBoundary.offset);
    return range;
  };

  return {
    version: COMMENT_DOM_TEXT_MODEL_VERSION,
    root,
    text,
    segments,
    boundaryToOffset,
    offsetToBoundary,
    rangeToOffsets,
    offsetsToRange,
  };
}
