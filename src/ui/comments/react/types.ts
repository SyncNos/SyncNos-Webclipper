import type {
  CommentSidebarHostActions,
  CommentSidebarHostSnapshot,
} from '@services/comments/sidebar/comment-sidebar-contract';
import type { CommentLocatorSurfaceRoots, ThreadedCommentsPanelCommentChatWithConfig } from '../types';

export type ThreadedCommentsPanelSnapshot = CommentSidebarHostSnapshot & {
  escapeSignal: number;
  noticeMessage: string;
  noticeVisible: boolean;
  hasFocusWithinPanel: boolean;
  pendingFocusRootId: number | null;
  shortcutSubmit: {
    signal: number;
    kind: 'composer' | 'reply';
    rootId: number | null;
    text: string;
  } | null;
};

export type ThreadLocateResult = { ok: true } | { ok: false; reason: string };

export type ThreadedCommentsPanelProps = {
  variant: 'sidebar';
  fullWidth?: boolean;
  surfaceBg?: string;
  showHeader: boolean;
  showCollapseButton: boolean;
  showHeaderChatWith: boolean;
  snapshot: ThreadedCommentsPanelSnapshot;
  actions: CommentSidebarHostActions;
  onRequestClose: () => void;
  onHeaderChatWithRootChange?: (el: HTMLDivElement | null) => void;
  setPendingFocusRootId?: (rootId: number | null) => void;
  locateThreadRoot?: (rootId: number) => Promise<ThreadLocateResult>;
  getLocatorSurfaceRoots?: () => CommentLocatorSurfaceRoots | null;
  onLocateFailed?: (reason: string) => void;
  commentChatWith?: ThreadedCommentsPanelCommentChatWithConfig | null;
  showNotice?: (message: string) => void;
};
