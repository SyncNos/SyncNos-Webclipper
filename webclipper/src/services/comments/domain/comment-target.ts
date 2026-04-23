import { canonicalizeCommentTargetUrl } from '@services/url-cleaning/comment-target-url';

export type ConversationKindId = 'article' | 'video' | 'chat' | 'unknown';

export function pickConversationKindIdFromConversation(conversation: any): ConversationKindId {
  if (!conversation) return 'unknown';
  const sourceType = String(conversation?.sourceType || '').trim().toLowerCase();
  if (sourceType === 'article') return 'article';
  if (sourceType === 'video') return 'video';
  return 'chat';
}

export type CommentTargetKey = string;

function asKeyPart(value: unknown): string {
  return encodeURIComponent(String(value || '').trim());
}

export function buildOrphanCommentTargetKeyFromLocation(href: unknown): CommentTargetKey {
  const url = canonicalizeCommentTargetUrl(href);
  if (!url) return '';
  return `url:${url}`;
}

export function buildCommentTargetKeyFromConversation(conversation: any): CommentTargetKey {
  if (!conversation) return '';

  const kindId = pickConversationKindIdFromConversation(conversation);
  const url = String(conversation?.url || '').trim();

  if (kindId === 'chat') {
    const source = String(conversation?.source || '').trim();
    const conversationKey = String(conversation?.conversationKey || '').trim();
    if (source && conversationKey) {
      return `convo:${asKeyPart(source)}:${asKeyPart(conversationKey)}`;
    }
    const fallback = canonicalizeCommentTargetUrl(url);
    return fallback ? `url:${fallback}` : '';
  }

  if (kindId === 'video') {
    const canonical = canonicalizeCommentTargetUrl(url);
    return canonical ? `url:${canonical}` : '';
  }

  if (kindId === 'article') {
    const canonical = canonicalizeCommentTargetUrl(url);
    return canonical ? `url:${canonical}` : '';
  }

  const canonical = canonicalizeCommentTargetUrl(url);
  return canonical ? `url:${canonical}` : '';
}
