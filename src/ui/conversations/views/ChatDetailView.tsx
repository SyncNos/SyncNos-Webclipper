import { ChatMessageBubble } from '@ui/shared/ChatMessageBubble';
import { t } from '@i18n';
import type { normalizeStoredMarkdownReadingProfile } from '@services/protocols/markdown-reading-profile-storage';

type MarkdownReadingProfile = ReturnType<typeof normalizeStoredMarkdownReadingProfile>;

export type ChatDetailViewProps = {
  selected: any;
  activeId: unknown;
  detail: any;
  isArticle: boolean;
  listError?: string | null;
  loadingDetail?: boolean;
  detailError?: string | null;
  markdownReadingProfile: MarkdownReadingProfile;
  outlineIndexByMessageId: Map<number, number>;
  getUserMessageRefSetter: (messageId: number) => (node: HTMLDivElement | null) => void;
  setMessagesRootRef: (node: HTMLDivElement | null) => void;
};

/**
 * ChatDetailView renders the conversation message list (chat bubbles).
 * Extracted verbatim from ConversationDetailPane so chat rendering stays identical.
 */
export function ChatDetailView({
  selected,
  activeId,
  detail,
  isArticle,
  listError,
  loadingDetail,
  detailError,
  markdownReadingProfile,
  outlineIndexByMessageId,
  getUserMessageRefSetter,
  setMessagesRootRef,
}: ChatDetailViewProps) {
  return (
    <div className="tw-flex tw-min-w-0 tw-gap-4">
      <div className="tw-min-w-0 tw-flex-1">
        {listError ? (
          <p className="tw-mt-2 tw-text-sm tw-font-semibold tw-text-[var(--error)]">{listError}</p>
        ) : null}
        {loadingDetail ? (
          <p className="tw-mt-2 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">
            {t('loadingDots')}
          </p>
        ) : null}
        {detailError ? (
          <p className="tw-mt-2 tw-text-sm tw-font-semibold tw-text-[var(--error)]">{detailError}</p>
        ) : null}

        {detail?.messages?.length ? (
          <div ref={setMessagesRootRef} className="tw-mt-3 tw-grid tw-gap-2.5">
            {detail.messages.map((m: any) => {
              const role = String((m as any).role || '')
                .trim()
                .toLowerCase();
              const rawMessageId = Number((m as any).id);
              const messageId = Number.isFinite(rawMessageId) ? Math.trunc(rawMessageId) : null;
              const outlineIndex = messageId == null ? null : outlineIndexByMessageId.get(messageId) || null;
              const text = String((m as any).contentMarkdown || (m as any).contentText || '');
              const messageConversationId = Number(
                (m as any).conversationId || (selected as any)?.id || activeId,
              );

              if (!isArticle && role === 'user' && messageId != null) {
                return (
                  <div
                    key={String((m as any).id)}
                    className="tw-min-w-0"
                    data-chat-outline-index={outlineIndex ?? undefined}
                    data-chat-outline-message-id={messageId}
                    ref={getUserMessageRefSetter(messageId)}
                  >
                    <ChatMessageBubble
                      role={(m as any).role}
                      markdown={text}
                      readingProfile={markdownReadingProfile}
                      conversationId={
                        Number.isFinite(messageConversationId) && messageConversationId > 0
                          ? messageConversationId
                          : undefined
                      }
                    />
                  </div>
                );
              }

              return (
                <ChatMessageBubble
                  key={String((m as any).id)}
                  role={isArticle ? 'assistant' : (m as any).role}
                  markdown={text}
                  readingProfile={markdownReadingProfile}
                  conversationId={
                    Number.isFinite(messageConversationId) && messageConversationId > 0
                      ? messageConversationId
                      : undefined
                  }
                />
              );
            })}
          </div>
        ) : activeId ? (
          <p className="tw-mt-3 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">{t('noMessages')}</p>
        ) : (
          <p className="tw-mt-3 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">
            {t('selectAConversation')}
          </p>
        )}
      </div>
    </div>
  );
}
