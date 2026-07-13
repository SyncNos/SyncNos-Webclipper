import type { ArticleCommentLocator } from '@services/comments/domain/comment-locator';
import type { CommentSidebarPanelApi } from '@services/comments/sidebar/comment-sidebar-contract';

export type ThreadedCommentsPanelApi = CommentSidebarPanelApi;

import type {
  CommentOptionalAction,
  CommentPanelOptionalActionConfig,
  CommentThreadOptionalActionConfig,
  CommentThreadOptionalActionContext,
} from '@viewmodels/comments/useCommentOptionalActions';

export type ThreadedCommentsPanelChatWithAction = CommentOptionalAction;
export type ThreadedCommentsPanelChatWithConfig = CommentPanelOptionalActionConfig;
export type ThreadedCommentsPanelCommentChatWithContext = CommentThreadOptionalActionContext;
export type ThreadedCommentsPanelCommentChatWithConfig = CommentThreadOptionalActionConfig;

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
  surface?: 'app-wide' | 'app-narrow' | 'inpage';
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
