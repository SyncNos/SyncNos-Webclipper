import type { ArticleCommentLocator } from '@services/comments/domain/comment-locator';
import type { CommentSidebarItem, CommentSidebarPanelApi } from '@services/comments/sidebar/comment-sidebar-contract';

export type ThreadedCommentsPanelApi = CommentSidebarPanelApi;

export type ThreadedCommentsPanelChatWithAction = {
  id: string;
  label: string;
  disabled?: boolean;
  onTrigger?: () => void | string | Promise<void | string>;
};

export type ThreadedCommentsPanelChatWithConfig = {
  resolveActions: () => Promise<ThreadedCommentsPanelChatWithAction[]>;
  resolveSingleActionLabel?: () => Promise<string | null>;
};

export type ThreadedCommentsPanelCommentChatWithContext = {
  articleTitle?: string | null;
  canonicalUrl?: string | null;
};

export type ThreadedCommentsPanelCommentChatWithConfig = {
  resolveActions: (
    rootComment: CommentSidebarItem,
    context: ThreadedCommentsPanelCommentChatWithContext,
    replies?: CommentSidebarItem[] | null,
  ) => Promise<ThreadedCommentsPanelChatWithAction[]>;
  resolveContext?: () =>
    | ThreadedCommentsPanelCommentChatWithContext
    | Promise<ThreadedCommentsPanelCommentChatWithContext>;
};

export type CommentLocatorSurfaceRoots = {
  sourceRoot: Element;
  scrollRoot: Element;
};

export type MountOptions = {
  overlay?: boolean;
  initiallyOpen?: boolean;
  showHeader?: boolean;
  showCollapseButton?: boolean;
  variant?: 'sidebar';
  fullWidth?: boolean;
  surfaceBg?: string;
  headerDivider?: boolean;
  dockPage?: boolean;
  locatorEnv?: 'inpage' | 'app' | null;
  getLocatorSurfaceRoots?: () => CommentLocatorSurfaceRoots | null;
  getLocatorRoots?: (locator: ArticleCommentLocator) => readonly Element[];
  chatWith?: ThreadedCommentsPanelChatWithConfig | null;
  commentChatWith?: ThreadedCommentsPanelCommentChatWithConfig | null;
  deferReactUpdates?: boolean;
};
