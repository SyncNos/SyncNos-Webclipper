import type { CSSProperties } from 'react';
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
const TRIGGER_MAX_BARS = 7;
const TRIGGER_CLASS = [
  'tw-grid tw-h-11 tw-w-9 tw-place-items-center tw-border-0 tw-bg-transparent tw-p-0 tw-shadow-none',
  'focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)]',
].join(' ');
const PANEL_LIST_CLASS = 'tw-flex tw-max-h-[60vh] tw-flex-col tw-gap-1 tw-overflow-auto';
const TRIGGER_BARS_CLASS = 'tw-flex tw-h-9 tw-w-[18px] tw-flex-col tw-justify-center tw-gap-[3px] tw-overflow-hidden';
const TRIGGER_BAR_CLASS =
  'tw-h-[2px] tw-flex-none tw-rounded-[var(--radius-inline)] tw-bg-[var(--text-secondary)] tw-transition-[opacity,width,background-color] tw-duration-150';
const PANEL_ENTRY_LABEL_CLASS = 'tw-min-w-0 tw-flex-1 tw-text-left';
const PANEL_ENTRY_LABEL_STYLE: CSSProperties = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  lineHeight: 1.35,
  overflow: 'hidden',
  overflowWrap: 'anywhere',
};

function toItemClass(active: boolean): string {
  return [
    buttonMenuItemClassName(),
    'tw-min-h-[50px] tw-items-start tw-text-xs',
    active ? '' : 'webclipper-btn--tone-muted',
  ]
    .filter(Boolean)
    .join(' ');
}

function toLabel(entry: ChatOutlineEntry): string {
  const text = String(entry.previewText || '').trim();
  return text ? `${entry.index}. ${text}` : `${entry.index}.`;
}

function pickTriggerEntries(entries: ChatOutlineEntry[], activeIndex: number | null): ChatOutlineEntry[] {
  if (entries.length <= TRIGGER_MAX_BARS) return entries;

  const activeEntry = entries.find((entry) => entry.index === activeIndex) || null;
  const sampleCount = activeEntry ? TRIGGER_MAX_BARS - 1 : TRIGGER_MAX_BARS;
  const picked = new Map<string, ChatOutlineEntry>();

  for (let slot = 0; slot < sampleCount; slot += 1) {
    const position = sampleCount <= 1 ? 0 : Math.round((slot * (entries.length - 1)) / (sampleCount - 1));
    const entry = entries[position];
    if (entry) picked.set(entry.messageKey, entry);
  }

  if (activeEntry) picked.set(activeEntry.messageKey, activeEntry);

  return Array.from(picked.values())
    .sort((left, right) => left.index - right.index)
    .slice(0, TRIGGER_MAX_BARS);
}

export function ChatOutlinePanel({ entries, activeIndex = null, onPickEntry }: ChatOutlinePanelProps) {
  const safeEntries = useMemo(() => (Array.isArray(entries) ? entries : []), [entries]);
  const triggerEntries = useMemo(() => pickTriggerEntries(safeEntries, activeIndex), [activeIndex, safeEntries]);
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
        {triggerEntries.map((entry) => {
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
              <span
                className={PANEL_ENTRY_LABEL_CLASS}
                style={PANEL_ENTRY_LABEL_STYLE}
                data-chat-outline-entry-label={entry.messageKey}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </ReaderRailPanel>
  );
}
