import type { ReactNode } from 'react';

import type {
  CommentSidebarLoadError,
  CommentSidebarLoadStatus,
} from '@services/comments/sidebar/comment-sidebar-contract';

export type CommentsPanelVisualState = 'loading' | 'error' | 'empty' | 'ready' | 'stale_error';

export function resolveCommentsPanelVisualState(input: {
  loadStatus: CommentSidebarLoadStatus;
  hasComments: boolean;
}): CommentsPanelVisualState {
  if (input.loadStatus === 'loading' && !input.hasComments) return 'loading';
  if (input.loadStatus === 'stale_error') return input.hasComments ? 'stale_error' : 'error';
  return input.hasComments ? 'ready' : 'empty';
}

type CommentsPanelStateProps = {
  state: CommentsPanelVisualState;
  error: CommentSidebarLoadError | null;
  onRetry: () => void | Promise<void>;
  children: ReactNode;
};

function RetryButton({ onRetry }: { onRetry: () => void | Promise<void> }) {
  return (
    <button
      type="button"
      className="webclipper-inpage-comments-panel__state-action webclipper-btn webclipper-btn--tone-muted"
      onClick={() => void onRetry()}
    >
      Retry
    </button>
  );
}

export function CommentsPanelState({ state, error, onRetry, children }: CommentsPanelStateProps) {
  if (state === 'ready') return <>{children}</>;

  if (state === 'stale_error') {
    return (
      <>
        <div className="webclipper-inpage-comments-panel__state is-stale-error" role="status">
          <span>{error?.message || 'Comments could not be refreshed. Showing the last loaded discussion.'}</span>
          <RetryButton onRetry={onRetry} />
        </div>
        {children}
      </>
    );
  }

  if (state === 'loading') {
    return (
      <div className="webclipper-inpage-comments-panel__state is-loading" role="status" aria-live="polite">
        Loading comments…
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="webclipper-inpage-comments-panel__state is-error" role="alert">
        <span>{error?.message || 'Comments could not be loaded.'}</span>
        <RetryButton onRetry={onRetry} />
      </div>
    );
  }

  return <div className="webclipper-inpage-comments-panel__state is-empty">No comments yet</div>;
}
