import { useState } from 'react';

import { MenuPopover } from '@ui/shared/MenuPopover';
import { buttonFilledClassName, buttonTintClassName } from '@ui/shared/button-styles';
import { t } from '@i18n';
import { TextLayoutPanel } from '@ui/reader/TextLayoutPanel';
import { ThemePanel } from '@ui/reader/ThemePanel';
import { NarrationPanel } from '@ui/reader/NarrationPanel';
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
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggle: () => void;
};

export type ReaderToolbarProps = {
  features: ReaderToolbarFeatures;
  prefs: ReaderPrefs;
  update: (patch: Partial<ReaderPrefs>) => void | Promise<void>;
  narration: ReaderToolbarNarration;
  className?: string;
};

type OpenPanel = 'text' | 'theme' | 'narration' | null;

const LABELS = {
  toolbarAria: t('readerToolbarAria'),
  text: t('readerTextLayoutButton'),
  theme: t('readerThemeButton'),
  narration: t('readerNarrationButton'),
  play: t('readerNarrationPlay'),
  reading: t('readerNarrationReading'),
  pause: t('readerNarrationPause'),
  stop: t('readerNarrationStop'),
} as const;

const triggerButtonClassName = buttonTintClassName();
const controlButtonClassName = [buttonTintClassName(), 'tw-flex-1'].join(' ');

/**
 * ReaderToolbar — the P6 reader "three-piece" control surface: text & layout,
 * theme, and read-aloud. Purely presentational; `prefs`/`update` come from the
 * reader-prefs view-model and `narration` from useReaderNarration, both owned by
 * ArticleReaderView so the toolbar and the read-only sentence highlight share a
 * single engine.
 *
 * Each piece renders only when the conversation kind enables it via
 * `features.{textLayout,theme,narration}`. Chat conversations set all three false,
 * so the toolbar renders nothing and never appears over the chat view.
 */
export function ReaderToolbar({ features, prefs, update, narration, className }: ReaderToolbarProps) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);

  if (!features.textLayout && !features.theme && !features.narration) return null;

  const setOpen = (panel: Exclude<OpenPanel, null>, next: boolean) => setOpenPanel(next ? panel : null);
  const narrationLabel = narration.state === 'loading' ? LABELS.reading : narration.isPlaying ? LABELS.pause : LABELS.play;

  return (
    <div
      role="toolbar"
      aria-label={LABELS.toolbarAria}
      className={[
        'webclipper-reader-toolbar tw-flex tw-flex-wrap tw-items-center tw-gap-1.5',
        'tw-rounded-[var(--radius-pill)] tw-border tw-border-[var(--border)]',
        'tw-bg-[var(--bg-card)] tw-px-2 tw-py-1.5',
        className || '',
      ]
        .join(' ')
        .trim()}
    >
      {features.textLayout ? (
        <MenuPopover
          open={openPanel === 'text'}
          onOpenChange={(next) => setOpen('text', next)}
          ariaLabel={LABELS.text}
          align="start"
          panelMinWidth={260}
          trigger={(triggerProps) => (
            <button {...triggerProps} className={triggerButtonClassName} aria-label={LABELS.text}>
              Aa
            </button>
          )}
        >
          <TextLayoutPanel prefs={prefs} update={update} />
        </MenuPopover>
      ) : null}

      {features.theme ? (
        <MenuPopover
          open={openPanel === 'theme'}
          onOpenChange={(next) => setOpen('theme', next)}
          ariaLabel={LABELS.theme}
          align="start"
          panelMinWidth={240}
          trigger={(triggerProps) => (
            <button {...triggerProps} className={triggerButtonClassName}>
              {LABELS.theme}
            </button>
          )}
        >
          <ThemePanel prefs={prefs} update={update} />
        </MenuPopover>
      ) : null}

      {features.narration ? (
        <MenuPopover
          open={openPanel === 'narration'}
          onOpenChange={(next) => setOpen('narration', next)}
          ariaLabel={LABELS.narration}
          align="end"
          panelMinWidth={264}
          trigger={(triggerProps) => (
            <button
              {...triggerProps}
              className={narration.isPlaying ? buttonFilledClassName() : triggerButtonClassName}
            >
              {narration.state === 'loading' ? LABELS.reading : LABELS.narration}
            </button>
          )}
        >
          <div className="tw-flex tw-flex-col tw-gap-3">
            <div className="tw-flex tw-gap-1.5">
              <button
                type="button"
                className={controlButtonClassName}
                aria-pressed={narration.isPlaying}
                onClick={narration.toggle}
              >
                {narrationLabel}
              </button>
              <button
                type="button"
                className={controlButtonClassName}
                onClick={narration.stop}
                disabled={narration.state === 'idle'}
              >
                {LABELS.stop}
              </button>
            </div>
            <NarrationPanel
              prefs={prefs}
              update={update}
              error={narration.error}
              webSpeechAvailable={narration.webSpeechAvailable}
            />
          </div>
        </MenuPopover>
      ) : null}
    </div>
  );
}
