import type { ArticleCommentDto } from '@services/comments/domain/comment-dto';
import type { CommentThreadGraph } from '@services/comments/domain/comment-thread-graph';

export type CommentSidebarOpenInput = {
  focusComposer?: boolean;
  source?: string;
};

export type CommentSidebarItem = ArticleCommentDto;
export type CommentSidebarThreadGraph = CommentThreadGraph<CommentSidebarItem>;

export type CommentSaveResult = void | boolean | { ok: boolean; createdRootId?: number | null };

export type CommentSidebarComposerSelectionRequest = {
  trigger: 'button' | 'auto';
};

export type CommentSidebarHandlers = {
  onSave?: (text: string) => CommentSaveResult | Promise<CommentSaveResult>;
  onReply?: (parentId: number, text: string) => void | Promise<void>;
  onDelete?: (id: number) => void | Promise<void>;
  onClose?: () => void;
  onComposerSelectionRequest?: (input: CommentSidebarComposerSelectionRequest) => void | Promise<void>;
  onComposerQuoteClearRequest?: () => void | Promise<void>;
};

export type CommentSidebarPanelApi = {
  open: (input?: { focusComposer?: boolean }) => void;
  close: () => void;
  isOpen: () => boolean;
  setBusy: (busy: boolean) => void;
  setQuoteText: (text: string) => void;
  setComments: (items: CommentSidebarItem[]) => void;
  setHandlers: (handlers: CommentSidebarHandlers) => void;
};

export type CommentSidebarSessionSnapshot = {
  attached: boolean;
  isOpen: boolean;
  busy: boolean;
  openRequested: boolean;
  focusRequested: boolean;
  focusComposerSignal: number;
  quoteText: string;
  commentCount: number;
  hasHandlers: boolean;
  lastOpenSource: string | null;
};

export type CommentSidebarSession = {
  attachPanel: (panel: CommentSidebarPanelApi) => void;
  detachPanel: () => void;
  subscribe: (listener: () => void) => () => void;
  requestOpen: (input?: CommentSidebarOpenInput) => void;
  requestClose: () => void;
  setQuoteText: (text: string) => void;
  setBusy: (busy: boolean) => void;
  setComments: (items: CommentSidebarItem[]) => void;
  setHandlers: (handlers: CommentSidebarHandlers) => void;
  getSnapshot: () => CommentSidebarSessionSnapshot;
};
