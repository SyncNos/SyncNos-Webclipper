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
  const raw = formatConversationMarkdown(conversation, (detail?.messages || []) as any, {
    // Feishu Convert renders per-message role labels as too subtle when using H2.
    // Use H1 to make "content/user/assistant" style sections more prominent in DocX.
    chatMessageHeadingLevel: 1,
    articleContentHeadingLevel: 1,
  });
  return normalizeStandaloneImageCaptionLines(raw);
}

export default {
  formatConversationMarkdownForFeishuDocxSync,
};
