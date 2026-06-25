import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ChatOutlineEntry } from '@ui/conversations/chat-outline/outline-entries';
import { ReaderRailPanel } from '@ui/reader/ReaderRailPanel';
import { buttonMenuItemClassName } from '@ui/shared/button-styles';

export type ChatOutlinePanelProps = {
  entries: ChatOutlineEntry[];
  activeIndex?: number | null;
  onPickEntry?: (entry: ChatOutlineEntry) => void;
};

const CLOSE_DELAY_MS = 160;
const OUTLINE_LABEL = 'Outline';
const TRIGGER_CLASS = [
  'tw-grid tw-h-11 tw-w-9 tw-place-items-center tw-border-0 tw-bg-transparent tw-p-0 tw-shadow-none',
  'focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)]',
].join(' ');
const PANEL_LIST_CLASS = 'tw-flex tw-max-h-[60vh] tw-flex-col tw-gap-1 tw-overflow-auto';
const TRIGGER_BARS_CLASS = 'tw-flex tw-h-7 tw-w-[18px] tw-flex-col tw-justify-center tw-gap-1 tw-overflow-hidden';
const TRIGGER_BAR_CLASS =
  'tw-h-[2px] tw-rounded-[var(--radius-inline)] tw-bg-[var(--text-secondary)] tw-transition-[opacity,width,background-color] tw-duration-150';

function toItemClass(active: boolean): string {
  return [
    buttonMenuItemClassName(),
    'tw-min-h-8 tw-items-center tw-text-xs',
    active ? '' : 'webclipper-btn--tone-muted',
  ]
    .filter(Boolean)
    .join(' ');
}

function toLabel(entry: ChatOutlineEntry): string {
  const text = String(entry.previewText || '').trim();
  return text ? `${entry.index}. ${text}` : `${entry.index}.`;
}

export function ChatOutlinePanel({ entries, activeIndex = null, onPickEntry }: ChatOutlinePanelProps) {
  const safeEntries = useMemo(() => (Array.isArray(entries) ? entries : []), [entries]);
  const [open, setOpen] = useState(false);
  const handleButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current == null) return;
    globalThis.window?.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);
  const openPanel = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = globalThis.window?.setTimeout(() => {
      closeTimerRef.current = null;
      setOpen(false);
    }, CLOSE_DELAY_MS);
  }, [cancelClose]);
  const closePanelAndFocusHandle = useCallback(() => {
    cancelClose();
    setOpen(false);
    const focusHandle = () => {
      handleButtonRef.current?.focus();
    };
    if (typeof globalThis.window?.requestAnimationFrame === 'function') {
      globalThis.window.requestAnimationFrame(focusHandle);
      return;
    }
    focusHandle();
  }, [cancelClose]);

  useEffect(() => {
    return () => cancelClose();
  }, [cancelClose]);

  if (!safeEntries.length) return null;

  const trigger = (
    <button
      ref={handleButtonRef}
      type="button"
      aria-label={OUTLINE_LABEL}
      className={TRIGGER_CLASS}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPanel();
          return;
        }
        if (event.key !== 'Escape') return;
        event.preventDefault();
        closePanelAndFocusHandle();
      }}
    >
      <span className={TRIGGER_BARS_CLASS} aria-hidden="true" data-chat-outline-trigger-bars={safeEntries.length}>
        {safeEntries.map((entry) => {
          const isActive = Number(activeIndex) === entry.index;
          return (
            <span
              key={entry.messageKey}
              className={[
                TRIGGER_BAR_CLASS,
                isActive ? 'tw-w-[18px] tw-bg-[var(--text-primary)] tw-opacity-100' : 'tw-w-[14px] tw-opacity-50',
              ].join(' ')}
              data-chat-outline-trigger-bar={entry.messageKey}
              data-chat-outline-trigger-active={isActive ? 'true' : 'false'}
            />
          );
        })}
      </span>
    </button>
  );

  return (
    <ReaderRailPanel
      id="chat-outline"
      label={OUTLINE_LABEL}
      open={open}
      narrow={false}
      className="tw-absolute tw-right-0 tw-top-2 tw-z-30"
      trigger={trigger}
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
    >
      <div className={PANEL_LIST_CLASS}>
        {safeEntries.map((entry) => {
          const isActive = Number(activeIndex) === entry.index;
          const label = toLabel(entry);
          return (
            <button
              key={entry.messageKey}
              type="button"
              className={toItemClass(isActive)}
              title={label}
              aria-checked={isActive ? 'true' : undefined}
              onClick={() => onPickEntry?.(entry)}
              data-chat-outline-entry={entry.messageKey}
              data-chat-outline-active={isActive ? 'true' : 'false'}
            >
              {label}
            </button>
          );
        })}
      </div>
    </ReaderRailPanel>
  );
}
