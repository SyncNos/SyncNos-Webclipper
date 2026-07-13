import type { ArticleCommentDto } from '@services/comments/domain/comment-dto';
import { normalizeArticleCommentLocator } from '@services/comments/domain/comment-locator';
import type { ArticleCommentLocator } from '@services/comments/domain/models';

export type CommentSidebarItem = ArticleCommentDto;

export type CommentSidebarLoadStatus = 'idle' | 'loading' | 'ready' | 'stale_error';

export type CommentSidebarLoadError = {
  code: string;
  message: string;
};

export type CommentSaveResult = void | boolean | { ok: boolean; createdRootId?: number | null };

export type CommentSidebarComposerSelectionRequest = {
  trigger: 'button' | 'auto';
};

export type CommentSidebarComposerAttachment = {
  displayQuote: string;
  locator: ArticleCommentLocator | null;
  selectionRevision: number;
};

export type CommentSidebarHostSnapshot = {
  open: boolean;
  busy: boolean;
  composerAttachment: CommentSidebarComposerAttachment;
  comments: CommentSidebarItem[];
  focusComposerSignal: number;
  lastOpenSource: string | null;
  loadStatus: CommentSidebarLoadStatus;
  loadError: CommentSidebarLoadError | null;
};

export type CommentSidebarHostActionCallbacks = {
  onSave?: (text: string) => CommentSaveResult | Promise<CommentSaveResult>;
  onReply?: (parentId: number, text: string) => void | Promise<void>;
  onDelete?: (id: number) => void | Promise<void>;
  onClose?: () => void;
  onComposerSelectionRequest?: (input: CommentSidebarComposerSelectionRequest) => void | Promise<void>;
  onComposerQuoteClearRequest?: () => void | Promise<void>;
  onRetry?: () => void | Promise<void>;
};

export type CommentSidebarHostActions = {
  save: (text: string) => CommentSaveResult | Promise<CommentSaveResult>;
  reply: (parentId: number, text: string) => void | Promise<void>;
  delete: (id: number) => void | Promise<void>;
  close: () => void;
  requestComposerSelection: (input: CommentSidebarComposerSelectionRequest) => void | Promise<void>;
  clearComposerAttachment: () => void | Promise<void>;
  retry: () => void | Promise<void>;
};

function cloneAttachment(input?: Partial<CommentSidebarComposerAttachment> | null): CommentSidebarComposerAttachment {
  const revision = Number(input?.selectionRevision);
  return {
    displayQuote: String(input?.displayQuote ?? '').replace(/\r\n?/g, '\n'),
    locator: normalizeArticleCommentLocator(input?.locator),
    selectionRevision: Number.isSafeInteger(revision) && revision >= 0 ? revision : 0,
  };
}

function cloneItems(items: CommentSidebarItem[] | null | undefined): CommentSidebarItem[] {
  return Array.isArray(items)
    ? items.map((item) => ({
        ...item,
        locator: normalizeArticleCommentLocator(item.locator),
      }))
    : [];
}

export function createCommentSidebarHostSnapshot(
  input: Partial<CommentSidebarHostSnapshot> = {},
): CommentSidebarHostSnapshot {
  const focusComposerSignal = Number(input.focusComposerSignal);
  const source = String(input.lastOpenSource ?? '').trim();
  return {
    open: input.open === true,
    busy: input.busy === true,
    composerAttachment: cloneAttachment(input.composerAttachment),
    comments: cloneItems(input.comments),
    focusComposerSignal:
      Number.isSafeInteger(focusComposerSignal) && focusComposerSignal >= 0 ? focusComposerSignal : 0,
    lastOpenSource: source || null,
    loadStatus: ['idle', 'loading', 'ready', 'stale_error'].includes(String(input.loadStatus))
      ? (input.loadStatus as CommentSidebarLoadStatus)
      : 'idle',
    loadError:
      input.loadError && typeof input.loadError === 'object'
        ? { code: String(input.loadError.code || 'unknown'), message: String(input.loadError.message || '') }
        : null,
  };
}

export function createCommentSidebarHostActions(
  readCallbacks: () => CommentSidebarHostActionCallbacks,
): CommentSidebarHostActions {
  const read = () => readCallbacks?.() || {};
  return Object.freeze({
    save: (text: string) => read().onSave?.(text),
    reply: (parentId: number, text: string) => read().onReply?.(parentId, text),
    delete: (id: number) => read().onDelete?.(id),
    close: () => read().onClose?.(),
    requestComposerSelection: (input: CommentSidebarComposerSelectionRequest) =>
      read().onComposerSelectionRequest?.(input),
    clearComposerAttachment: () => read().onComposerQuoteClearRequest?.(),
    retry: () => read().onRetry?.(),
  });
}
