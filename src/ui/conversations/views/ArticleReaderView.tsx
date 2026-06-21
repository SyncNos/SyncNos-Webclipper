import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ChatMessageBubble } from '@ui/shared/ChatMessageBubble';
import { t } from '@i18n';
import type { ChatDetailViewProps } from '@ui/conversations/views/ChatDetailView';
import { useReaderPrefs } from '@viewmodels/reader/useReaderPrefs';
import { useReaderNarration } from '@viewmodels/reader/useReaderNarration';
import { readerPrefsToCssVars } from '@services/protocols/reader-prefs';

// Props are aligned with ChatDetailView so ConversationDetailPane can dispatch
// to either renderer with the same prop bag (see P1-T5).
export type ReaderFeatures = { textLayout: boolean; theme: boolean; narration: boolean };

// readerFeatures is wired in for the P6 toolbar button visibility; the text-layout
// piece itself is always active via the `--reader-*` variables below.
export type ArticleReaderViewProps = ChatDetailViewProps & { readerFeatures?: ReaderFeatures };

// Body typography is driven entirely by the `--reader-*` CSS variables (P2-T3).
// These important arbitrary-property utilities override the ChatMessageBubble
// reading-profile preset's container-level typography so the reader text-layout
// controls win regardless of stylesheet source order. Heading scale, blockquote,
// code and link styling from the preset are intentionally preserved as structure.
// NOTE: arbitrary properties are written without the `tw-` prefix in this repo
// (see ChatMessageBubble's `[overflow-wrap:anywhere]`); `!` marks them important.
const READER_PROSE_CLASS = [
  '![font-family:var(--reader-font-family)]',
  '![font-size:var(--reader-font-size)]',
  '![line-height:var(--reader-line-height)]',
  '![letter-spacing:var(--reader-letter-spacing)]',
  '![text-align:var(--reader-text-align)]',
].join(' ');

// Centers and width-limits the reading column. Defined as a stable object so the
// JSX uses a single-brace expression (no inline object literal needed here).
const READER_COLUMN_STYLE: CSSProperties = { maxWidth: 'var(--reader-content-width)' };

// Read-only highlight helpers (P4-T3) ---------------------------------------
const READER_ACTIVE_SENTENCE_CLASS = 'reader-active-sentence';

/**
 * Find the element that contains the character at `offset` within
 * `root.textContent`. Walks text nodes only and never mutates the DOM, so it is
 * safe to call repeatedly against the rendered article body.
 */
function blockElementAtOffset(root: HTMLElement, offset: number): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let consumed = 0;
  let node: Node | null = walker.nextNode();
  while (node) {
    const length = node.textContent?.length ?? 0;
    if (offset < consumed + length) {
      return node.parentElement;
    }
    consumed += length;
    node = walker.nextNode();
  }
  return null;
}

/**
 * ArticleReaderView renders article / video conversations.
 *
 * P2-T3: the article body is laid out by reader preferences (`reader_prefs_v1`)
 * exposed as `--reader-*` CSS variables on the root node. The message column is
 * width-constrained by `--reader-content-width`, and each rendered message
 * consumes the typography variables (font family/size/line-height/letter-spacing/
 * text-align). Theme (P3) and narration (P4) build on the same view.
 */
export function ArticleReaderView({
  selected,
  activeId,
  detail,
  listError,
  loadingDetail,
  detailError,
  setMessagesRootRef,
}: ArticleReaderViewProps) {
  const { prefs } = useReaderPrefs();
  const readerVars = readerPrefsToCssVars(prefs) as CSSProperties;
  // P3-T2: reader-local theme. `system` follows the OS via the global tokens, so
  // we deliberately omit the attribute (undefined -> React renders no attribute);
  // any explicit theme scopes the [data-reader-theme=...] token overrides.
  const readerThemeAttr = prefs.theme === 'system' ? undefined : prefs.theme;

  // P4-T3: narration over the rendered article text. Capturing the source from
  // the rendered DOM keeps the engine's sentence offsets aligned with the text
  // nodes we highlight below.
  const narrationRootRef = useRef<HTMLDivElement | null>(null);
  const lastHighlightRef = useRef<HTMLElement | null>(null);
  const [narrationSource, setNarrationSource] = useState('');
  const { activeSentence } = useReaderNarration(narrationSource, prefs.tts);

  // Combine the external messages-root ref with our local highlight ref.
  const assignMessagesRoot = useCallback(
    (node: HTMLDivElement | null) => {
      narrationRootRef.current = node;
      const ref = setMessagesRootRef as unknown;
      if (typeof ref === 'function') {
        (ref as (value: HTMLDivElement | null) => void)(node);
      } else if (ref && typeof ref === 'object') {
        (ref as { current: HTMLDivElement | null }).current = node;
      }
    },
    [setMessagesRootRef],
  );

  // Capture the rendered article text whenever the messages change.
  useEffect(() => {
    setNarrationSource(narrationRootRef.current?.textContent ?? '');
  }, [detail]);

  // Read-only sentence highlight: toggle a class plus a reversible inline tint
  // on the element containing the active sentence. No markdown structure is
  // rewritten (P4 rule); the previous highlight is always restored.
  useEffect(() => {
    const clear = () => {
      const previous = lastHighlightRef.current;
      if (previous) {
        previous.classList.remove(READER_ACTIVE_SENTENCE_CLASS);
        previous.style.removeProperty('background-color');
        previous.style.removeProperty('border-radius');
        lastHighlightRef.current = null;
      }
    };
    clear();
    const root = narrationRootRef.current;
    if (!root || !activeSentence) return;
    const target = blockElementAtOffset(root, activeSentence.start);
    if (!target) return;
    target.classList.add(READER_ACTIVE_SENTENCE_CLASS);
    target.style.setProperty('background-color', 'var(--reader-highlight, rgba(250, 204, 21, 0.22))');
    target.style.setProperty('border-radius', 'var(--radius-inline, 4px)');
    lastHighlightRef.current = target;
    return clear;
  }, [activeSentence]);

  return (
    <div className="tw-flex tw-min-w-0 tw-gap-4" style={readerVars} data-reader-theme={readerThemeAttr}>
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
          <div
            ref={assignMessagesRoot}
            className="tw-mt-3 tw-grid tw-gap-2.5 tw-mx-auto tw-w-full"
            style={READER_COLUMN_STYLE}
          >
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
                  conversationId={
                    Number.isFinite(messageConversationId) && messageConversationId > 0
                      ? messageConversationId
                      : undefined
                  }
                  className={READER_PROSE_CLASS}
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
