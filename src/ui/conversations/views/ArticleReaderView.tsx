import { ChatMessageBubble } from '@ui/shared/ChatMessageBubble';
import { t } from '@i18n';
import type { ChatDetailViewProps } from '@ui/conversations/views/ChatDetailView';

// Props are aligned with ChatDetailView so ConversationDetailPane can dispatch
// to either renderer with the same prop bag (see P1-T5).
export type ArticleReaderViewProps = ChatDetailViewProps;

/**
 * ArticleReaderView renders article / video conversations.
 *
 * NOTE (P1-T4): this is intentionally a thin shell that, for now, reuses the
 * same assistant-bubble rendering as the previous article behavior so this
 * phase introduces zero visible change. P2-T3 will replace the bubble preset
 * typography with `--reader-*` CSS variables driven by reader preferences.
 */
export function ArticleReaderView({
  selected,
  activeId,
  detail,
  listError,
  loadingDetail,
  detailError,
  markdownReadingProfile,
  setMessagesRootRef,
}: ArticleReaderViewProps) {
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
              const text = String((m as any).contentMarkdown || (m as any).contentText || '');
              const messageConversationId = Number(
                (m as any).conversationId || (selected as any)?.id || activeId,
              );

              return (
                <ChatMessageBubble
                  key={String((m as any).id)}
                  role="assistant"
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
