import type { CSSProperties, ReactNode } from 'react';

type ReaderRailPanelProps = {
  id: string;
  label: string;
  open: boolean;
  narrow: boolean;
  trigger: ReactNode;
  children: ReactNode;
  panelTitle?: ReactNode;
  className?: string;
  panelClassName?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const PANEL_BASE_CLASS = [
  'tw-absolute tw-z-30 tw-rounded-[var(--radius-control)] tw-border tw-border-[var(--border)]',
  'tw-bg-[color-mix(in_srgb,var(--bg-card)_88%,transparent)] tw-p-3 tw-text-[var(--text-primary)]',
  'tw-shadow-[0_18px_48px_rgba(0,0,0,0.18)] tw-backdrop-blur-[10px] tw-backdrop-saturate-150',
  'tw-w-[300px] tw-max-w-[78vw]',
].join(' ');

const PANEL_TITLE_CLASS = 'tw-mb-3 tw-flex tw-items-center tw-justify-between tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]';

const PANEL_CONTENT_CLASS = 'tw-flex tw-flex-col tw-gap-3';

function getPanelStyle(narrow: boolean): CSSProperties {
  if (narrow) {
    return {
      right: 0,
      top: 'calc(100% + 10px)',
      width: '300px',
      maxWidth: 'calc(100vw - 28px)',
      maxHeight: '70vh',
      overflow: 'auto',
    };
  }

  return {
    right: 'calc(100% + 10px)',
    top: 0,
  };
}

export function ReaderRailPanel({
  id,
  label,
  open,
  narrow,
  trigger,
  children,
  panelTitle,
  className,
  panelClassName,
  onMouseEnter,
  onMouseLeave,
}: ReaderRailPanelProps) {
  return (
    <div
      className={['tw-relative tw-flex tw-flex-col tw-items-start', className || ''].join(' ').trim()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-reader-rail-wrap={id}
    >
      {trigger}

      {open ? (
        <div
          role="menu"
          aria-label={label}
          data-reader-rail-panel={id}
          className={[PANEL_BASE_CLASS, panelClassName || ''].join(' ').trim()}
          style={getPanelStyle(narrow)}
        >
          {panelTitle ? <h3 className={PANEL_TITLE_CLASS}>{panelTitle}</h3> : null}
          <div className={PANEL_CONTENT_CLASS}>{children}</div>
        </div>
      ) : null}
    </div>
  );
}
