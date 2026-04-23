import type { CommentSidebarItem } from '@services/comments/sidebar/comment-sidebar-contract';
import type { ArticleCommentLocator } from '@services/comments/domain/models';

export type CommentsSidebarContext = {
  commentTargetKey: string;
  conversationId: number | null;
  canonicalUrl?: string | null;
};

export type CommentsSidebarEnsureContextInput = {
  tabId?: number | null;
  commentTargetKeyFallback?: string;
  canonicalUrlFallback?: string;
  ensureConversationForTarget?: boolean;
};

export type CommentsSidebarAddRootResult = {
  id: number;
};

export type CommentsSidebarAdapter = {
  list: (input: {
    commentTargetKey: string;
    conversationId: number | null;
    canonicalUrlFallback?: string | null;
  }) => Promise<CommentSidebarItem[]>;
  addRoot: (input: {
    commentTargetKey: string;
    canonicalUrl: string;
    conversationId: number | null;
    quoteText: string;
    commentText: string;
    locator?: ArticleCommentLocator | null;
  }) => Promise<CommentsSidebarAddRootResult>;
  addReply: (input: {
    commentTargetKey: string;
    canonicalUrl: string;
    conversationId: number | null;
    parentId: number;
    commentText: string;
  }) => Promise<void>;
  delete: (input: { id: number }) => Promise<void>;
  migrateTargetKey?: (input: {
    fromTargetKey: string;
    toTargetKey: string;
    conversationId: number | null;
  }) => Promise<void | { updated: number }>;
  ensureContext?: (input?: CommentsSidebarEnsureContextInput) => Promise<CommentsSidebarContext>;
};

