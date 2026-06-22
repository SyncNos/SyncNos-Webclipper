import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import type { CSSProperties } from 'react';

import { t } from '@i18n';
import { readerPrefsToCssVars } from '@services/protocols/reader-prefs';
import { buildSentences, type ReaderTtsSentence } from '@services/reader/tts/reader-tts-engine';
import type { DetailViewSharedProps } from '@ui/conversations/views/detail-view-props';
import {
  collectReaderSentenceTextSegments,
  findReaderSentenceIndexFromTarget,
  findReaderSentenceRangeByIndex,
  pickFirstVisibleSentenceIndex,
  type ReaderSentenceCandidate,
  type ReaderSentenceRectLike,
} from '@ui/reader/reader-sentence-dom';
import { useArticleOutlineMinimap } from '@ui/reader/ArticleOutlineMinimap';
import type { ReaderOutlineDomEntry } from '@ui/reader/article-outline-dom';
import { ReaderToolbar } from '@ui/reader/ReaderToolbar';
import { useReaderNarration } from '@viewmodels/reader/useReaderNarration';
import { useReaderPrefs } from '@viewmodels/reader/useReaderPrefs';
import { ChatMessageBubble } from '@ui/shared/ChatMessageBubble';

export type ReaderFeatures = { textLayout: boolean; theme: boolean; narration: boolean };

// readerFeatures is wired in for the P4 toolbar button visibility; the text-layout
// piece itself is always active via the `--reader-*` variables below.
export type ArticleReaderViewProps = DetailViewSharedProps & { readerFeatures?: ReaderFeatures };

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
const READER_SHELL_CLASS = 'tw-flex tw-w-full tw-items-start tw-gap-4';
const READER_MAIN_CLASS = 'tw-min-w-0 tw-flex-1 tw-max-w-full';
const READER_RAIL_CLASS = 'tw-flex-none tw-shrink-0 tw-self-start';

const READER_SENTENCE_SOURCE_ATTR = 'data-reader-sentence-source';
const READER_SENTENCE_INDEX_ATTR = 'data-reader-sentence-index';
const READER_SENTENCE_DECORATION_STATUS_ATTR = 'data-reader-sentence-decoration';
const READER_SENTENCE_DECORATION_PENDING = 'pending';
const READER_SENTENCE_DECORATION_READY = 'ready';
const READER_SENTENCE_CLASS = 'reader-tts-sentence';
const READER_CURRENT_SENTENCE_CLASS = 'reader-tts-sentence-active';
const READER_INITIAL_SENTENCE_DECORATION_BATCH_SIZE = 48;

function unwrapReaderSentenceSpan(span: HTMLElement): void {
  const parent = span.parentNode;
  if (!parent) return;
  while (span.firstChild && span.parentNode === parent) {
    parent.insertBefore(span.firstChild, span);
  }
  if (span.parentNode === parent) {
    parent.removeChild(span);
  }
}

function clearReaderSentenceDecorations(root: HTMLElement): void {
  const spans = Array.from(root.querySelectorAll<HTMLElement>(`[${READER_SENTENCE_INDEX_ATTR}]`));
  spans.forEach((span) => unwrapReaderSentenceSpan(span));
  root.removeAttribute(READER_SENTENCE_SOURCE_ATTR);
  root.removeAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR);
  root.normalize();
}

function decorateReaderSentenceRangeBatch(
  root: HTMLElement,
  sentences: ReaderTtsSentence[],
  startIndex: number,
  endIndex: number,
): void {
  const segments = collectReaderSentenceTextSegments(root);
  for (let index = endIndex - 1; index >= startIndex; index -= 1) {
    const sentence = sentences[index];
    const range = findReaderSentenceRangeByIndex(root, sentences, index, segments);
    if (!range) continue;

    const fragment = range.extractContents();
    if (!fragment.childNodes.length) continue;

    const span = (root.ownerDocument ?? globalThis.document)?.createElement('span');
    if (!span) continue;
    span.className = READER_SENTENCE_CLASS;
    span.setAttribute(READER_SENTENCE_INDEX_ATTR, String(sentence.index));
    span.appendChild(fragment);
    range.insertNode(span);
  }
}

function decorateReaderSentenceSpans(root: HTMLElement, source: string, sentences: ReaderTtsSentence[]): void {
  const doc = root.ownerDocument ?? globalThis.document;
  if (!doc) return;
  if (!sentences.length) {
    root.setAttribute(READER_SENTENCE_SOURCE_ATTR, source);
    root.setAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR, READER_SENTENCE_DECORATION_READY);
    return;
  }
  decorateReaderSentenceRangeBatch(root, sentences, 0, sentences.length);
  root.setAttribute(READER_SENTENCE_SOURCE_ATTR, source);
  root.setAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR, READER_SENTENCE_DECORATION_READY);
}

function decorateReaderSentenceSpansProgressively(
  root: HTMLElement,
  source: string,
  sentences: ReaderTtsSentence[],
  requestFrame: (cb: FrameRequestCallback) => number,
  cancelFrame: ((id: number) => void) | undefined,
  onProgress: () => void,
): () => void {
  let cancelled = false;
  let rafId = 0;
  let nextIndex = 0;

  root.setAttribute(READER_SENTENCE_SOURCE_ATTR, source);
  root.setAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR, READER_SENTENCE_DECORATION_PENDING);

  const step = () => {
    if (cancelled) return;
    const batchEnd = Math.min(nextIndex + READER_INITIAL_SENTENCE_DECORATION_BATCH_SIZE, sentences.length);
    decorateReaderSentenceRangeBatch(root, sentences, nextIndex, batchEnd);
    nextIndex = batchEnd;
    if (nextIndex >= sentences.length) {
      root.setAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR, READER_SENTENCE_DECORATION_READY);
      onProgress();
      return;
    }
    onProgress();
    rafId = requestFrame(() => step());
  };

  step();
  return () => {
    cancelled = true;
    if (rafId !== 0) cancelFrame?.(rafId);
  };
}

function readReaderSentenceViewportRect(root: HTMLElement): ReaderSentenceRectLike {
  const view = root.ownerDocument?.defaultView ?? globalThis.window ?? null;
  const height = Number(view?.innerHeight);
  if (!Number.isFinite(height) || height <= 0) return { top: 0, bottom: 0 };
  return { top: 0, bottom: height };
}

function readReaderSentenceCandidates(root: HTMLElement): ReaderSentenceCandidate[] {
  return Array.from(root.querySelectorAll<HTMLElement>(`[${READER_SENTENCE_INDEX_ATTR}]`))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const index = Number(element.getAttribute(READER_SENTENCE_INDEX_ATTR));
      return {
        index: Number.isFinite(index) ? Math.trunc(index) : -1,
        rect: { top: rect.top, bottom: rect.bottom },
      } satisfies ReaderSentenceCandidate;
    })
    .filter((candidate) => candidate.index >= 0);
}

function readFirstVisibleSentenceIndex(root: HTMLElement): number {
  return pickFirstVisibleSentenceIndex(readReaderSentenceCandidates(root), readReaderSentenceViewportRect(root));
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
  readerFeatures,
}: ArticleReaderViewProps) {
  // readerFeatures gates each toolbar piece; chat conversations pass all-false (or
  // omit it), so the toolbar renders nothing over the chat view.
  const features = readerFeatures ?? { textLayout: false, theme: false, narration: false };
  const { prefs, update } = useReaderPrefs();
  const readerVars = readerPrefsToCssVars(prefs) as CSSProperties;
  // P3-T2: reader-local theme. `system` follows the OS via the global tokens, so
  // we deliberately omit the attribute (undefined -> React renders no attribute);
  // any explicit theme scopes the [data-reader-theme=...] token overrides.
  const readerThemeAttr = prefs.theme === 'system' ? undefined : prefs.theme;

  // P4-T3: narration over the rendered article text. Capturing the source from
  // the rendered DOM keeps the engine's sentence offsets aligned with the text
  // nodes we highlight below.
  const narrationRootRef = useRef<HTMLDivElement | null>(null);
  const [outlineRoot, setOutlineRoot] = useState<HTMLDivElement | null>(null);
  const lastHighlightRef = useRef<HTMLElement | null>(null);
  const sourceFromDomRef = useRef('');
  const activeSentenceRef = useRef<ReaderTtsSentence | null>(null);
  const [narrationSource, setNarrationSource] = useState('');
  const [sentenceDomRevision, setSentenceDomRevision] = useState(0);
  const sentenceCountRef = useRef(0);
  const outline = useArticleOutlineMinimap(outlineRoot);
  const narration = useReaderNarration(narrationSource, prefs.tts);
  const { activeSentence } = narration;

  useEffect(() => {
    activeSentenceRef.current = activeSentence;
  }, [activeSentence]);

  const clearActiveHighlight = useCallback(() => {
    const previous = lastHighlightRef.current;
    if (!previous) return;
    previous.classList.remove(READER_CURRENT_SENTENCE_CLASS);
    lastHighlightRef.current = null;
  }, []);

  const applyActiveHighlight = useCallback(
    (sentence: ReaderTtsSentence | null) => {
      clearActiveHighlight();
      const root = narrationRootRef.current;
      if (!features.narration || !root || !sentence) return;
      const target = root.querySelector<HTMLElement>(`[${READER_SENTENCE_INDEX_ATTR}="${sentence.index}"]`);
      if (!target) return;
      target.classList.add(READER_CURRENT_SENTENCE_CLASS);
      lastHighlightRef.current = target;
    },
    [clearActiveHighlight, features.narration],
  );

  // React effect order matters here: keep the active sentence ref fresh before
  // any decoration pass tries to restore the current highlight.
  useEffect(() => {
    applyActiveHighlight(activeSentence);
  }, [activeSentence, applyActiveHighlight]);

  // Combine the external messages-root ref with our local highlight ref.
  const assignMessagesRoot = useCallback(
    (node: HTMLDivElement | null) => {
      narrationRootRef.current = node;
      setOutlineRoot(node);
      const ref = setMessagesRootRef as unknown;
      if (typeof ref === 'function') {
        (ref as (value: HTMLDivElement | null) => void)(node);
      } else if (ref && typeof ref === 'object') {
        (ref as { current: HTMLDivElement | null }).current = node;
      }
    },
    [setMessagesRootRef],
  );

  const handleOutlinePick = useCallback((entry: ReaderOutlineDomEntry) => {
    try {
      entry.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (_error) {
      entry.element.scrollIntoView();
    }
  }, []);

  const outlinePayload = useMemo(
    () =>
      outline.entries.length
        ? {
            ...outline,
            onPickStripEntry: handleOutlinePick,
            onPickPanelEntry: handleOutlinePick,
          }
        : null,
    [handleOutlinePick, outline],
  );

  // Capture the rendered article text whenever the messages change.
  useEffect(() => {
    const currentSource = narrationRootRef.current?.textContent ?? '';
    sourceFromDomRef.current = currentSource;
    setNarrationSource(currentSource);
  }, [detail]);

  // Re-capture DOM source after mutations and nudge sentence decoration if the
  // current text is unchanged but the sentence spans were rewritten externally.
  useEffect(() => {
    const root = narrationRootRef.current;
    if (!root || !features.narration) {
      sourceFromDomRef.current = '';
      sentenceCountRef.current = 0;
      setNarrationSource('');
      return;
    }

    const win = root.ownerDocument?.defaultView ?? globalThis.window;
    const observerCtor = win?.MutationObserver ?? globalThis.MutationObserver;
    let disposed = false;
    let rafId = 0;

    const syncFromDom = () => {
      if (disposed) return;

      const currentSource = root.textContent ?? '';
      const previousSource = sourceFromDomRef.current;
      const sourceChanged = currentSource !== previousSource;
      let sentenceCount = sentenceCountRef.current;
      if (sourceChanged) {
        sentenceCount = buildSentences(currentSource).length;
        sourceFromDomRef.current = currentSource;
        sentenceCountRef.current = sentenceCount;
        setNarrationSource(currentSource);
      }

      const decoratedSource = root.getAttribute(READER_SENTENCE_SOURCE_ATTR) ?? '';
      const decoratedCount = root.querySelectorAll(`[${READER_SENTENCE_INDEX_ATTR}]`).length;
      const decorationPending =
        root.getAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR) === READER_SENTENCE_DECORATION_PENDING;
      const needsRedecorate =
        !decorationPending && (decoratedSource !== currentSource || decoratedCount !== sentenceCount);
      if (!sourceChanged && needsRedecorate) {
        setSentenceDomRevision((value) => value + 1);
      }
    };

    const scheduleSync = () => {
      if (disposed) return;
      if (!win?.requestAnimationFrame) {
        syncFromDom();
        return;
      }
      if (rafId !== 0) return;
      rafId = win.requestAnimationFrame(() => {
        rafId = 0;
        syncFromDom();
      });
    };

    if (!observerCtor) {
      scheduleSync();
      return () => {
        disposed = true;
        if (rafId !== 0 && win?.cancelAnimationFrame) win.cancelAnimationFrame(rafId);
      };
    }

    const observer = new observerCtor(() => scheduleSync());
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    scheduleSync();
    return () => {
      disposed = true;
      observer.disconnect();
      if (rafId !== 0 && win?.cancelAnimationFrame) win.cancelAnimationFrame(rafId);
    };
  }, [detail, features.narration]);

  // Sentence decorations are reversible: rebuild them from the current DOM text
  // and restore the active highlight after each capture / mutation pass.
  useEffect(() => {
    const root = narrationRootRef.current;
    if (!root) return;

    if (!features.narration) {
      sentenceCountRef.current = 0;
      clearReaderSentenceDecorations(root);
      applyActiveHighlight(null);
      return;
    }

    const win = root.ownerDocument?.defaultView ?? globalThis.window;
    let disposed = false;
    let rafId = 0;
    let cancelProgressiveDecoration: (() => void) | null = null;

    const runDecoration = () => {
      if (disposed) return;

      const sentences = buildSentences(narrationSource);
      sentenceCountRef.current = sentences.length;
      const decoratedSource = root.getAttribute(READER_SENTENCE_SOURCE_ATTR) ?? '';
      const decoratedCount = root.querySelectorAll(`[${READER_SENTENCE_INDEX_ATTR}]`).length;
      const decorationReady =
        root.getAttribute(READER_SENTENCE_DECORATION_STATUS_ATTR) === READER_SENTENCE_DECORATION_READY;
      const isUpToDate = decorationReady && decoratedSource === narrationSource && decoratedCount === sentences.length;
      if (!isUpToDate) {
        cancelProgressiveDecoration?.();
        cancelProgressiveDecoration = null;
        clearReaderSentenceDecorations(root);
        const shouldProgressivelyDecorate =
          shouldDeferInitialDecoration &&
          sentences.length > READER_INITIAL_SENTENCE_DECORATION_BATCH_SIZE &&
          !!win?.requestAnimationFrame;
        if (shouldProgressivelyDecorate && win?.requestAnimationFrame) {
          cancelProgressiveDecoration = decorateReaderSentenceSpansProgressively(
            root,
            narrationSource,
            sentences,
            win.requestAnimationFrame.bind(win),
            win.cancelAnimationFrame?.bind(win),
            () => applyActiveHighlight(activeSentenceRef.current),
          );
        } else {
          decorateReaderSentenceSpans(root, narrationSource, sentences);
        }
      }

      applyActiveHighlight(activeSentenceRef.current);
    };

    // Defer only the first wrapping pass so the page can paint before we mutate
    // the whole article; later rebuilds keep their existing synchronous behavior.
    const shouldDeferInitialDecoration = root.querySelectorAll(`[${READER_SENTENCE_INDEX_ATTR}]`).length === 0;
    if (!win?.requestAnimationFrame || !shouldDeferInitialDecoration) {
      runDecoration();
      return () => {
        disposed = true;
      };
    }

    rafId = win.requestAnimationFrame(runDecoration);
    return () => {
      disposed = true;
      cancelProgressiveDecoration?.();
      if (rafId !== 0 && win?.cancelAnimationFrame) win.cancelAnimationFrame(rafId);
    };
  }, [activeSentenceRef, applyActiveHighlight, features.narration, narrationSource, sentenceDomRevision]);

  const getFirstVisibleSentenceIndex = useCallback(() => {
    if (!features.narration) return 0;
    const root = narrationRootRef.current;
    if (!root) return 0;
    return readFirstVisibleSentenceIndex(root);
  }, [features.narration]);

  const toolbarNarration = useMemo(
    () => ({
      ...narration,
      play: () => {
        const firstVisibleIndex = getFirstVisibleSentenceIndex();
        const requestedIndex = narration.hasCursor ? narration.activeIndex : firstVisibleIndex;
        narration.play(requestedIndex >= 0 ? requestedIndex : firstVisibleIndex);
      },
      toggle: () => {
        narration.toggle(getFirstVisibleSentenceIndex());
      },
    }),
    [getFirstVisibleSentenceIndex, narration],
  );

  const handleSentenceClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!features.narration) return;

      const targetElement =
        event.target instanceof Element
          ? event.target
          : event.target instanceof Node
            ? event.target.parentElement
            : null;
      if (targetElement?.closest('a')) return;

      const index = findReaderSentenceIndexFromTarget(event.target);
      if (index == null) return;

      if (narration.state === 'idle') {
        narration.seek(index);
        return;
      }

      narration.play(index);
    },
    [features.narration, narration],
  );

  return (
    <div
      className={READER_SHELL_CLASS}
      style={readerVars}
      data-reader-shell="article"
      data-reader-theme={readerThemeAttr}
    >
      <div className={READER_MAIN_CLASS} data-reader-main="article-main">
        {listError ? <p className="tw-mt-2 tw-text-sm tw-font-semibold tw-text-[var(--error)]">{listError}</p> : null}
        {loadingDetail ? (
          <p className="tw-mt-2 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">{t('loadingDots')}</p>
        ) : null}
        {detailError ? (
          <p className="tw-mt-2 tw-text-sm tw-font-semibold tw-text-[var(--error)]">{detailError}</p>
        ) : null}

        {detail?.messages?.length ? (
          <div
            ref={assignMessagesRoot}
            className="tw-mt-3 tw-grid tw-w-full tw-gap-2.5 tw-mx-auto"
            style={READER_COLUMN_STYLE}
            data-reader-sentence-root="true"
            onClick={handleSentenceClick}
          >
            {detail.messages.map((m: any) => {
              const text = String((m as any).contentMarkdown || (m as any).contentText || '');
              const messageConversationId = Number((m as any).conversationId || (selected as any)?.id || activeId);

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

      <aside className={READER_RAIL_CLASS} data-reader-rail="article-rail">
        <ReaderToolbar
          features={features}
          prefs={prefs}
          update={update}
          narration={toolbarNarration}
          outline={outlinePayload}
        />
      </aside>
    </div>
  );
}
