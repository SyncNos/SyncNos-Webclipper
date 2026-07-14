import { useCallback, useLayoutEffect, useRef } from 'react';

export function resizeTextareaToContent(textarea: HTMLTextAreaElement | null | undefined): void {
  if (!textarea) return;
  try {
    textarea.style.overflowY = 'hidden';
    textarea.style.height = '0px';
    textarea.style.height = `${Math.max(0, Number(textarea.scrollHeight || 0) || 0)}px`;
  } catch (_error) {
    // A detached test DOM may not expose layout metrics.
  }
}

export function useAutosizeTextarea(value: string) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const setRef = useCallback((node: HTMLTextAreaElement | null) => {
    ref.current = node;
    resizeTextareaToContent(node);
  }, []);
  useLayoutEffect(() => resizeTextareaToContent(ref.current), [value]);
  return { ref, setRef, resize: () => resizeTextareaToContent(ref.current) };
}
