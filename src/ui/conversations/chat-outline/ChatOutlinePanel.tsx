import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ChatOutlineEntry } from '@ui/conversations/chat-outline/outline-entries';
import { ReaderRailPanel } from '@ui/reader/ReaderRailPanel';

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
const PANEL_LIST_CLASS = 'tw-flex tw-max-h-[60vh] tw-flex-col tw-gap-1 tw-overflow-auto tw-px-0.5';
const ENTRY_BUTTON_CLASS = [
  'tw-w-full tw-border tw-border-[var(--border)] tw-bg-[var(--bg-card)] tw-px-3 tw-py-1.5 tw-text-left tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]',
  'hover:tw-bg-[var(--bg-sunken)] hover:tw-text-[var(--text-primary)]',
  'focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)]',
].join(' ');
const ENTRY_ACTIVE_CLASS = 'tw-border-[#dfe3ff] tw-bg-[#f6f7ff] tw-text-[#3b48ff]';

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
      <span className="tw-grid tw-h-4 tw-w-[14px] tw-content-center tw-gap-[6px]" aria-hidden="true">
        <span className="tw-h-[2.4px] tw-rounded-[var(--radius-inline)] tw-bg-[var(--text-secondary)] tw-opacity-80" />
        <span className="tw-h-[2.4px] tw-rounded-[var(--radius-inline)] tw-bg-[var(--text-secondary)] tw-opacity-80" />
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
              className={[ENTRY_BUTTON_CLASS, isActive ? ENTRY_ACTIVE_CLASS : ''].filter(Boolean).join(' ')}
              title={label}
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
