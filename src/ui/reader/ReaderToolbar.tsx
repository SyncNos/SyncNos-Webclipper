import { useCallback, useEffect, useRef, useState } from 'react';
import { Palette, Pause, Play, Square, Volume2 } from 'lucide-react';

import { buttonFilledClassName, buttonTintClassName } from '@ui/shared/button-styles';
import { useIsNarrowScreen } from '@ui/shared/hooks/useIsNarrowScreen';
import { t } from '@i18n';
import { TextLayoutPanel } from '@ui/reader/TextLayoutPanel';
import { ThemePanel } from '@ui/reader/ThemePanel';
import { NarrationPanel } from '@ui/reader/NarrationPanel';
import { ArticleOutlineMinimap, type ArticleOutlineMinimapState } from '@ui/reader/ArticleOutlineMinimap';
import { ReaderRailPanel } from '@ui/reader/ReaderRailPanel';
import type { ReaderOutlineDomEntry } from '@ui/reader/article-outline-dom';
import type { ReaderPrefs } from '@services/protocols/reader-prefs';
import type { ReaderTtsState } from '@services/reader/tts/reader-tts-engine';

// Structural feature flags (mirror conversation-kinds `view.readerFeatures`). Kept
// structural so ArticleReaderView's ReaderFeatures type is assignable without a
// cross-module value import.
export type ReaderToolbarFeatures = { textLayout: boolean; theme: boolean; narration: boolean };

// Narration surface owned by ArticleReaderView (useReaderNarration), passed down so
// the toolbar controls and the sentence highlight share one engine instance.
export type ReaderToolbarNarration = {
  state: ReaderTtsState;
  isPlaying: boolean;
  error: string | null;
  webSpeechAvailable: boolean;
  pause: () => void;
  stop: () => void;
  toggle: () => void;
};

export type ReaderToolbarProps = {
  features: ReaderToolbarFeatures;
  prefs: ReaderPrefs;
  update: (patch: Partial<ReaderPrefs>) => void | Promise<void>;
  narration: ReaderToolbarNarration;
  outline?:
    | (ArticleOutlineMinimapState & {
        onPickEntry: (entry: ReaderOutlineDomEntry) => void;
      })
    | null;
  className?: string;
};

type OpenPanel = 'text' | 'theme' | 'narration' | 'outline' | null;

const LABELS = {
  toolbarAria: t('readerToolbarAria'),
  text: t('readerTextLayoutButton'),
  theme: t('readerThemeButton'),
  narration: t('readerNarrationButton'),
  outline: '目录',
  play: t('readerNarrationPlay'),
  reading: t('readerNarrationReading'),
  pause: t('readerNarrationPause'),
  stop: t('readerNarrationStop'),
} as const;

const PANEL_CLOSE_DELAY_MS = 160;
const RAIL_BUTTON_BASE_CLASS = 'webclipper-btn--icon-xl tw-leading-none';
const railTextButtonClassName = (active: boolean) =>
  [
    active ? buttonFilledClassName() : buttonTintClassName(),
    RAIL_BUTTON_BASE_CLASS,
    'tw-text-[15px] tw-font-black',
  ].join(' ');
const railIconButtonClassName = (active: boolean) =>
  [active ? buttonFilledClassName() : buttonTintClassName(), RAIL_BUTTON_BASE_CLASS].join(' ');
const narrationTransportButtonClassName = (active: boolean) =>
  [active ? buttonFilledClassName() : buttonTintClassName(), RAIL_BUTTON_BASE_CLASS].join(' ');

/**
 * ReaderToolbar — the reader rail control surface: text & layout, theme, and
 * read-aloud. The rail is vertical, the panels float left on desktop and drop
 * below on narrow screens, and only one panel can be open at a time.
 */
export function ReaderToolbar({ features, prefs, update, narration, outline, className }: ReaderToolbarProps) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const narrow = useIsNarrowScreen({ breakpointPx: 720 });

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const openNow = useCallback(
    (panel: Exclude<OpenPanel, null>) => {
      clearCloseTimer();
      setOpenPanel(panel);
    },
    [clearCloseTimer],
  );

  const togglePanel = useCallback(
    (panel: Exclude<OpenPanel, null>) => {
      clearCloseTimer();
      setOpenPanel((current) => (current === panel ? null : panel));
    },
    [clearCloseTimer],
  );

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setOpenPanel(null);
    }, PANEL_CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(
    () => () => {
      clearCloseTimer();
    },
    [clearCloseTimer],
  );

  useEffect(() => {
    if (!openPanel) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      clearCloseTimer();
      setOpenPanel(null);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [clearCloseTimer, openPanel]);

  if (!features.textLayout && !features.theme && !features.narration && !outline?.entries.length) return null;

  const narrationTriggerActive = openPanel === 'narration' || narration.isPlaying || narration.state === 'loading';
  const narrationActionLabel =
    narration.state === 'loading' ? LABELS.reading : narration.isPlaying ? LABELS.pause : LABELS.play;
  const NarrationActionIcon = narration.state === 'loading' || narration.isPlaying ? Pause : Play;
  const handleOutlinePick = outline
    ? (entry: ReaderOutlineDomEntry) => {
        outline.onPickEntry(entry);
        setOpenPanel(null);
      }
    : null;

  return (
    <div
      role="toolbar"
      aria-orientation="vertical"
      aria-label={LABELS.toolbarAria}
      className={[
        'webclipper-reader-toolbar tw-sticky tw-top-5 tw-flex tw-w-fit tw-flex-col tw-items-start tw-gap-2',
        className || '',
      ]
        .join(' ')
        .trim()}
    >
      {features.textLayout ? (
        <ReaderRailPanel
          id="text"
          label={LABELS.text}
          open={openPanel === 'text'}
          narrow={narrow}
          panelTitle={LABELS.text}
          onMouseEnter={() => openNow('text')}
          onMouseLeave={scheduleClose}
          trigger={
            <button
              type="button"
              data-reader-rail-trigger="text"
              aria-label={LABELS.text}
              aria-haspopup="menu"
              aria-expanded={openPanel === 'text'}
              title={LABELS.text}
              className={railTextButtonClassName(openPanel === 'text')}
              onClick={() => togglePanel('text')}
            >
              Aa
            </button>
          }
        >
          <TextLayoutPanel prefs={prefs} update={update} />
        </ReaderRailPanel>
      ) : null}

      {features.theme ? (
        <ReaderRailPanel
          id="theme"
          label={LABELS.theme}
          open={openPanel === 'theme'}
          narrow={narrow}
          onMouseEnter={() => openNow('theme')}
          onMouseLeave={scheduleClose}
          trigger={
            <button
              type="button"
              data-reader-rail-trigger="theme"
              aria-label={LABELS.theme}
              aria-haspopup="menu"
              aria-expanded={openPanel === 'theme'}
              title={LABELS.theme}
              className={railIconButtonClassName(openPanel === 'theme')}
              onClick={() => togglePanel('theme')}
            >
              <Palette size={18} strokeWidth={2.25} />
            </button>
          }
        >
          <ThemePanel prefs={prefs} update={update} />
        </ReaderRailPanel>
      ) : null}

      {features.narration ? (
        <ReaderRailPanel
          id="narration"
          label={LABELS.narration}
          open={openPanel === 'narration'}
          narrow={narrow}
          panelTitle={LABELS.narration}
          onMouseEnter={() => openNow('narration')}
          onMouseLeave={scheduleClose}
          trigger={
            <button
              type="button"
              data-reader-rail-trigger="narration"
              aria-label={LABELS.narration}
              aria-haspopup="menu"
              aria-expanded={openPanel === 'narration'}
              title={LABELS.narration}
              className={railIconButtonClassName(narrationTriggerActive)}
              onClick={() => togglePanel('narration')}
            >
              <Volume2 size={18} strokeWidth={2.25} />
            </button>
          }
        >
          <div className="tw-flex tw-flex-col tw-gap-3">
            <div className="tw-flex tw-gap-1.5">
              <button
                type="button"
                className={narrationTransportButtonClassName(true)}
                aria-label={narrationActionLabel}
                title={narrationActionLabel}
                aria-pressed={narration.isPlaying || narration.state === 'loading'}
                onClick={narration.toggle}
              >
                <NarrationActionIcon size={18} strokeWidth={2.25} />
              </button>
              <button
                type="button"
                className={narrationTransportButtonClassName(false)}
                aria-label={LABELS.stop}
                title={LABELS.stop}
                onClick={narration.stop}
                disabled={narration.state === 'idle'}
              >
                <Square size={18} strokeWidth={2.25} />
              </button>
            </div>
            <NarrationPanel
              prefs={prefs}
              update={update}
              error={narration.error}
              webSpeechAvailable={narration.webSpeechAvailable}
            />
          </div>
        </ReaderRailPanel>
      ) : null}

      {outline?.entries.length ? (
        handleOutlinePick ? (
          <ArticleOutlineMinimap
            entries={outline.entries}
            activeIndex={outline.activeIndex}
            open={openPanel === 'outline'}
            narrow={narrow}
            className="tw-mt-2 tw-pt-2 tw-border-t tw-border-[var(--border)]"
            onMouseEnter={() => openNow('outline')}
            onMouseLeave={scheduleClose}
            onPickEntry={handleOutlinePick}
          />
        ) : null
      ) : null}
    </div>
  );
}
