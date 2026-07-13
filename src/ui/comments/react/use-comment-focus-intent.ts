import type { DiscussionAction, DiscussionFocusIntent } from '@viewmodels/comments/discussion-reducer';
import { useLayoutEffect, useRef, type Dispatch, type MutableRefObject, type RefCallback } from 'react';
import { resolvePendingFocusTarget } from './focus-rules';

type MenuTarget = 'panel' | number;

type UseCommentFocusIntentInput = {
  open: boolean;
  busy: boolean;
  focusComposerSignal: number;
  quoteText: string;
  focusIntent: DiscussionFocusIntent;
  dispatch: Dispatch<DiscussionAction>;
  composerRef: MutableRefObject<HTMLTextAreaElement | null>;
  replyRefs: MutableRefObject<Record<number, HTMLTextAreaElement | null>>;
  pendingFocusRootId: number | null;
  rootIds: ReadonlySet<number>;
  focusScopeKey: unknown;
  setPendingFocusRootId?: (rootId: number | null) => void;
};

function focusNode(node: HTMLTextAreaElement | HTMLButtonElement | null | undefined): boolean {
  if (!node) return false;
  try {
    node.focus();
    if (node instanceof HTMLTextAreaElement) {
      const value = String(node.value || '');
      node.setSelectionRange(value.length, value.length);
    }
    return true;
  } catch (_error) {
    return false;
  }
}

export function useCommentFocusIntent(input: UseCommentFocusIntentInput) {
  const lastComposerSignalRef = useRef(0);
  const lastQuoteRef = useRef('');
  const menuTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => {
    const signal = Number(input.focusComposerSignal || 0);
    if (!input.open || input.busy || !Number.isFinite(signal) || signal <= lastComposerSignalRef.current) return;
    if (focusNode(input.composerRef.current)) lastComposerSignalRef.current = signal;
  }, [input.busy, input.composerRef, input.focusComposerSignal, input.open]);

  useLayoutEffect(() => {
    if (!input.open) {
      lastQuoteRef.current = '';
      return;
    }
    const quote = String(input.quoteText || '').trim();
    if (!quote) {
      lastQuoteRef.current = '';
      return;
    }
    if (input.busy || quote === lastQuoteRef.current) return;
    if (focusNode(input.composerRef.current)) lastQuoteRef.current = quote;
  }, [input.busy, input.composerRef, input.open, input.quoteText]);

  useLayoutEffect(() => {
    if (!input.open || input.busy || !input.focusIntent) return;
    const intent = input.focusIntent;
    let focused = false;
    if (intent.kind === 'root') focused = focusNode(input.composerRef.current);
    if (intent.kind === 'reply') focused = focusNode(input.replyRefs.current[intent.rootId]);
    if (intent.kind === 'menu') focused = focusNode(menuTriggerRefs.current[String(intent.target)]);
    if (focused) input.dispatch({ type: 'consume-focus', epoch: intent.epoch });
  }, [
    input.busy,
    input.composerRef,
    input.dispatch,
    input.focusIntent,
    input.focusScopeKey,
    input.open,
    input.replyRefs,
  ]);

  useLayoutEffect(() => {
    if (!input.open || input.busy) return;
    const rootId = resolvePendingFocusTarget({
      pendingFocusRootId: input.pendingFocusRootId,
      fallbackPendingFocusRootId: null,
      hasFocusWithinPanel: true,
      existingRootIds: input.rootIds,
    });
    if (rootId == null) return;
    if (!focusNode(input.replyRefs.current[rootId])) return;
    input.setPendingFocusRootId?.(null);
  }, [
    input.busy,
    input.focusScopeKey,
    input.open,
    input.pendingFocusRootId,
    input.replyRefs,
    input.rootIds,
    input.setPendingFocusRootId,
  ]);

  const registerMenuTrigger = (target: MenuTarget): RefCallback<HTMLButtonElement> => {
    const key = String(target);
    return (node) => {
      menuTriggerRefs.current[key] = node;
    };
  };

  return { registerMenuTrigger };
}
