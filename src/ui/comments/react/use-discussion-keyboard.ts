import { useCallback, type KeyboardEvent as ReactKeyboardEvent } from 'react';

export function isDiscussionSubmitShortcut(event: {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  isComposing?: boolean;
}): boolean {
  return (
    !event.isComposing && event.key === 'Enter' && (event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey
  );
}

type UseDiscussionKeyboardInput = {
  openMenu: boolean;
  confirmDelete: boolean;
  activeReply: boolean;
  closeMenu: () => void;
  clearDeleteConfirm: () => void;
  closeActiveReply: () => void;
  closePanel: () => void;
};

export function useDiscussionKeyboard(input: UseDiscussionKeyboardInput) {
  return useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (event.nativeEvent.isComposing || event.key !== 'Escape') return;
      if (input.openMenu) {
        event.preventDefault();
        event.stopPropagation();
        input.closeMenu();
        return;
      }
      if (input.confirmDelete) {
        event.preventDefault();
        event.stopPropagation();
        input.clearDeleteConfirm();
        return;
      }
      if (input.activeReply) {
        event.preventDefault();
        event.stopPropagation();
        input.closeActiveReply();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      input.closePanel();
    },
    [input],
  );
}
