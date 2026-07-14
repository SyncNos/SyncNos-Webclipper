import type {
  CommentSidebarHostActions,
  CommentSidebarHostSnapshot,
} from '@services/comments/sidebar/comment-sidebar-contract';
import type { ThreadedCommentsPanelChatWithConfig, ThreadedCommentsPanelCommentChatWithConfig } from '../types';

export type ThreadedCommentsPanelSnapshot = CommentSidebarHostSnapshot & {
  noticeMessage: string;
  noticeVisible: boolean;
  hasFocusWithinPanel: boolean;
  pendingFocusRootId: number | null;
};

export type ThreadLocateResult = { ok: true } | { ok: false; reason: string };

export type ThreadedCommentsPanelProps = {
  variant: 'sidebar';
  fullWidth?: boolean;
  surfaceBg?: string;
  showHeader: boolean;
  showCollapseButton: boolean;
  chatWith?: ThreadedCommentsPanelChatWithConfig | null;
  snapshot: ThreadedCommentsPanelSnapshot;
  actions: CommentSidebarHostActions;
  onRequestClose: () => void;
  setPendingFocusRootId?: (rootId: number | null) => void;
  locateThreadRoot?: (rootId: number) => Promise<ThreadLocateResult>;
  onActiveRootChange?: (rootId: number | null) => void;
  onLocateFailed?: (reason: string) => void;
  commentChatWith?: ThreadedCommentsPanelCommentChatWithConfig | null;
  showNotice?: (message: string) => void;
  onNoticeExpired?: () => void;
};
