import { useLayoutEffect } from 'react';

type UseCommentNoticeInput = {
  message: string;
  visible: boolean;
  onExpired?: () => void;
  timeoutMs?: number;
};

export function useCommentNotice({ message, visible, onExpired, timeoutMs = 1600 }: UseCommentNoticeInput) {
  const normalizedMessage = String(message || '').trim();
  const isVisible = visible && Boolean(normalizedMessage);

  useLayoutEffect(() => {
    if (!isVisible || typeof onExpired !== 'function') return;
    const timer = globalThis.setTimeout(onExpired, Math.max(0, timeoutMs));
    return () => globalThis.clearTimeout(timer);
  }, [isVisible, normalizedMessage, onExpired, timeoutMs]);

  return { message: normalizedMessage, visible: isVisible };
}
