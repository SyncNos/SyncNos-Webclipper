import { normalizePositiveInt } from '@services/shared/numbers';
import { canonicalizeArticleUrl } from '@services/url-cleaning/http-url';

export type CommentContextIdentityInput = {
  canonicalUrl?: string | null;
  conversationId?: number | null;
} | null | undefined;

export type CommentContextIdentity = {
  canonicalUrl: string;
  conversationId: number | null;
};

export type CommentContextTransitionKind =
  | 'same'
  | 'attach-orphan'
  | 'url-migrate'
  | 'conversation-change'
  | 'invalid';

export type CommentContextTransition = {
  kind: CommentContextTransitionKind;
  previous: CommentContextIdentity | null;
  next: CommentContextIdentity | null;
};

export function normalizeCommentContextIdentity(input: CommentContextIdentityInput): CommentContextIdentity | null {
  if (!input) return null;
  const canonicalUrl = canonicalizeArticleUrl(input.canonicalUrl);
  if (!canonicalUrl) return null;
  return {
    canonicalUrl,
    conversationId: normalizePositiveInt(input.conversationId),
  };
}

export function buildCommentContextIdentityKey(input: CommentContextIdentityInput): string {
  const identity = normalizeCommentContextIdentity(input);
  return identity ? JSON.stringify([identity.canonicalUrl, identity.conversationId]) : '';
}

export function classifyCommentContextTransition(
  previousInput: CommentContextIdentityInput,
  nextInput: CommentContextIdentityInput,
): CommentContextTransition {
  const previous = normalizeCommentContextIdentity(previousInput);
  const next = normalizeCommentContextIdentity(nextInput);

  if (!next) return { kind: 'invalid', previous, next: null };
  if (!previous) return { kind: 'conversation-change', previous: null, next };

  if (previous.canonicalUrl === next.canonicalUrl && previous.conversationId === next.conversationId) {
    return { kind: 'same', previous, next };
  }
  if (
    previous.canonicalUrl === next.canonicalUrl &&
    previous.conversationId == null &&
    next.conversationId != null
  ) {
    return { kind: 'attach-orphan', previous, next };
  }
  if (
    previous.canonicalUrl !== next.canonicalUrl &&
    previous.conversationId != null &&
    previous.conversationId === next.conversationId
  ) {
    return { kind: 'url-migrate', previous, next };
  }
  return { kind: 'conversation-change', previous, next };
}
