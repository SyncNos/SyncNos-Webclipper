import type { Conversation, ConversationDetail } from '@services/conversations/domain/models';
import { formatConversationMarkdown } from '@services/conversations/domain/markdown';
import { normalizeStandaloneImageCaptionLines } from '@services/sync/shared/markdown-image-normalizer';

/**
 * Feishu DocX sync requires the original markdown (including image references),
 * otherwise Convert + image upgrade cannot work.
 *
 * NOTE: Do not reuse `formatConversationMarkdownForExternalOutput()` here since it
 * intentionally strips internal image URLs (data URLs / syncnos-asset://) into placeholders.
 */
export async function formatConversationMarkdownForFeishuDocxSync(
  conversation: Conversation,
  detail: ConversationDetail,
): Promise<string> {
  const raw = formatConversationMarkdown(conversation, (detail?.messages || []) as any);
  return normalizeStandaloneImageCaptionLines(raw);
}

export default {
  formatConversationMarkdownForFeishuDocxSync,
};

