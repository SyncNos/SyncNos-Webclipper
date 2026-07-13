import { useEffect, useRef } from 'react';

import {
  mountThreadedCommentsPanel,
  type ThreadedCommentsPanelApi,
  type ThreadedCommentsPanelChatWithAction,
  type ThreadedCommentsPanelCommentChatWithConfig,
  type CommentLocatorSurfaceRoots,
} from '@ui/comments';
import type { CommentSidebarSession } from '@services/comments/sidebar/comment-sidebar-contract';

export type ArticleCommentsSectionProps = {
  sidebarSession: CommentSidebarSession;
  containerClassName?: string;
  getLocatorSurfaceRoots: () => CommentLocatorSurfaceRoots | null;
  resolveChatWithActions?: () => Promise<ThreadedCommentsPanelChatWithAction[]>;
  resolveChatWithSingleActionLabel?: () => Promise<string | null>;
  commentChatWith?: ThreadedCommentsPanelCommentChatWithConfig | null;
  fullWidth?: boolean;
};

export function ArticleCommentsSection(props: ArticleCommentsSectionProps) {
  return <ArticleCommentsPanelMount {...props} />;
}

function ArticleCommentsPanelMount({
  sidebarSession,
  containerClassName,
  getLocatorSurfaceRoots,
  resolveChatWithActions,
  resolveChatWithSingleActionLabel,
  commentChatWith,
  fullWidth,
}: {
  sidebarSession: CommentSidebarSession;
  containerClassName?: string;
  getLocatorSurfaceRoots: () => CommentLocatorSurfaceRoots | null;
  resolveChatWithActions?: () => Promise<ThreadedCommentsPanelChatWithAction[]>;
  resolveChatWithSingleActionLabel?: () => Promise<string | null>;
  commentChatWith?: ThreadedCommentsPanelCommentChatWithConfig | null;
  fullWidth?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<ThreadedCommentsPanelApi | null>(null);
  const locatorSurfaceRootsGetterRef = useRef<() => CommentLocatorSurfaceRoots | null>(
    typeof getLocatorSurfaceRoots === 'function' ? getLocatorSurfaceRoots : () => null,
  );
  const resolveChatWithActionsRef = useRef<typeof resolveChatWithActions>(
    typeof resolveChatWithActions === 'function' ? resolveChatWithActions : undefined,
  );
  const resolveChatWithSingleActionLabelRef = useRef<typeof resolveChatWithSingleActionLabel>(
    typeof resolveChatWithSingleActionLabel === 'function' ? resolveChatWithSingleActionLabel : undefined,
  );
  const commentChatWithRef = useRef<ThreadedCommentsPanelCommentChatWithConfig | null>(
    commentChatWith && typeof commentChatWith.resolveActions === 'function' ? commentChatWith : null,
  );
  const hasSidebarChatWith = typeof resolveChatWithActions === 'function';
  const hasCommentChatWith = !!commentChatWith && typeof commentChatWith.resolveActions === 'function';

  useEffect(() => {
    locatorSurfaceRootsGetterRef.current =
      typeof getLocatorSurfaceRoots === 'function' ? getLocatorSurfaceRoots : () => null;
    apiRef.current?.refreshLocatorRoots();
  }, [getLocatorSurfaceRoots]);

  useEffect(() => {
    resolveChatWithActionsRef.current =
      typeof resolveChatWithActions === 'function' ? resolveChatWithActions : undefined;
  }, [resolveChatWithActions]);

  useEffect(() => {
    resolveChatWithSingleActionLabelRef.current =
      typeof resolveChatWithSingleActionLabel === 'function' ? resolveChatWithSingleActionLabel : undefined;
  }, [resolveChatWithSingleActionLabel]);

  useEffect(() => {
    commentChatWithRef.current =
      commentChatWith && typeof commentChatWith.resolveActions === 'function' ? commentChatWith : null;
  }, [commentChatWith]);

  useEffect(() => {
    if (!hostRef.current) return;
    if (apiRef.current) return;
    const host = hostRef.current;

    const mounted = mountThreadedCommentsPanel(host, {
      overlay: false,
      variant: 'sidebar',
      surface: fullWidth ? 'app-narrow' : 'app-wide',
      fullWidth,
      showHeader: true,
      showCollapseButton: true,
      surfaceBg: 'var(--bg-card)',
      locatorEnv: 'app',
      getLocatorSurfaceRoots: () => locatorSurfaceRootsGetterRef.current(),
      chatWith: hasSidebarChatWith
        ? {
            resolveActions: async () => {
              const resolver = resolveChatWithActionsRef.current;
              if (typeof resolver !== 'function') return [];
              return await resolver();
            },
            resolveSingleActionLabel: async () => {
              const resolver = resolveChatWithSingleActionLabelRef.current;
              if (typeof resolver !== 'function') return null;
              return await resolver();
            },
          }
        : null,
      commentChatWith: hasCommentChatWith
        ? {
            resolveActions: async (rootComment, context, replies) => {
              const resolver = commentChatWithRef.current?.resolveActions;
              if (typeof resolver !== 'function') return [];
              return await resolver(rootComment, context, replies);
            },
            resolveContext: async () => {
              const resolver = commentChatWithRef.current?.resolveContext;
              if (typeof resolver !== 'function') return {};
              return await resolver();
            },
          }
        : null,
      deferReactUpdates: true,
    });
    apiRef.current = mounted.api;
    const panelLease = sidebarSession.attachPanel(mounted.api as any);

    return () => {
      panelLease.dispose();
      mounted.cleanup();
      apiRef.current = null;
    };
  }, [fullWidth, hasCommentChatWith, hasSidebarChatWith, sidebarSession]);

  const sectionClassName = [containerClassName || '', 'tw-flex tw-min-h-0 tw-flex-col'].filter(Boolean).join(' ');

  return (
    <section className={sectionClassName}>
      <div ref={hostRef} className="tw-min-h-0 tw-flex-1" />
    </section>
  );
}
