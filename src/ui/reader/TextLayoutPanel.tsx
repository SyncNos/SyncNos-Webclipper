import type { ReactNode } from 'react';
import { buttonTintClassName } from '@ui/shared/button-styles';
import { SelectMenu } from '@ui/shared/SelectMenu';
import {
  READER_FONT_FAMILIES,
  READER_PREFS_LIMITS,
  READER_TEXT_ALIGNS,
  READER_TYPOGRAPHY_PRESETS,
  type ReaderFontFamily,
  type ReaderPrefs,
  type ReaderTextAlign,
} from '@services/protocols/reader-prefs';

// Presentational, fully controlled. The owning surface (P6 ReaderToolbar) supplies
// `prefs` and an `update` that persists patches via the reader-prefs view-model.
export type TextLayoutPanelProps = {
  prefs: ReaderPrefs;
  update: (patch: Partial<ReaderPrefs>) => void | Promise<void>;
  className?: string;
};

// TODO(P6-T2): replace literal labels with i18n keys (kept literal now so this
// task does not depend on the locale changes scheduled for P6).
const FONT_FAMILY_LABELS: Record<ReaderFontFamily, string> = {
  serif: 'Serif',
  sans: 'Sans-serif',
  mono: 'Monospace',
};
const TEXT_ALIGN_LABELS: Record<ReaderTextAlign, string> = {
  left: 'Left',
  justify: 'Justify',
};

// Typography presets only overwrite the text-layout fields (never theme/tts).
const TYPOGRAPHY_PRESETS: Array<{ id: keyof typeof READER_TYPOGRAPHY_PRESETS; label: string }> = [
  { id: 'medium', label: 'Medium' },
  { id: 'notion', label: 'Notion' },
  { id: 'book', label: 'Book' },
];

// READER_PREFS_LIMITS only exposes min/max; step granularity is a UI concern.
const STEP = { fontSize: 1, lineHeight: 0.05, contentWidth: 10, letterSpacing: 0.005 } as const;

const rangeClassName = [
  'tw-w-full tw-cursor-pointer tw-accent-[var(--accent)]',
  'focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)]',
].join(' ');

const presetButtonClassName = [buttonTintClassName(), 'tw-flex-1'].join(' ');

function Row({ label, value, children }: { label: string; value?: string; children: ReactNode }) {
  return (
    <div className="tw-flex tw-flex-col tw-gap-1">
      <div className="tw-flex tw-items-center tw-justify-between tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">
        <span>{label}</span>
        {value ? <span className="tw-tabular-nums tw-text-[var(--text-primary)]">{value}</span> : null}
      </div>
      {children}
    </div>
  );
}

/**
 * TextLayoutPanel — adjusts the reader text-layout fields of `reader_prefs_v1`
 * (font family, size, line height, content width, letter spacing, alignment) and
 * offers one-tap typography presets. All numeric ranges are bounded by
 * `READER_PREFS_LIMITS`; the model re-clamps on write, so out-of-range values can
 * never reach the CSS variables.
 */
export function TextLayoutPanel({ prefs, update, className }: TextLayoutPanelProps) {
  return (
    <div className={['tw-flex tw-flex-col tw-gap-3', className].filter(Boolean).join(' ')}>
      <Row label="Preset">
        <div className="tw-flex tw-gap-1.5">
          {TYPOGRAPHY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={presetButtonClassName}
              onClick={() => void update({ ...READER_TYPOGRAPHY_PRESETS[preset.id] })}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </Row>

      <Row label="Font">
        <SelectMenu<ReaderFontFamily>
          ariaLabel="Reader font family"
          value={prefs.fontFamily}
          onChange={(next) => void update({ fontFamily: next })}
          options={READER_FONT_FAMILIES.map((id) => ({ value: id, label: FONT_FAMILY_LABELS[id] }))}
        />
      </Row>

      <Row label="Alignment">
        <SelectMenu<ReaderTextAlign>
          ariaLabel="Reader text alignment"
          value={prefs.textAlign}
          onChange={(next) => void update({ textAlign: next })}
          options={READER_TEXT_ALIGNS.map((id) => ({ value: id, label: TEXT_ALIGN_LABELS[id] }))}
        />
      </Row>

      <Row label="Font size" value={`${prefs.fontSize}px`}>
        <input
          type="range"
          className={rangeClassName}
          aria-label="Reader font size"
          min={READER_PREFS_LIMITS.fontSize.min}
          max={READER_PREFS_LIMITS.fontSize.max}
          step={STEP.fontSize}
          value={prefs.fontSize}
          onChange={(event) => void update({ fontSize: Number(event.target.value) })}
        />
      </Row>

      <Row label="Line height" value={prefs.lineHeight.toFixed(2)}>
        <input
          type="range"
          className={rangeClassName}
          aria-label="Reader line height"
          min={READER_PREFS_LIMITS.lineHeight.min}
          max={READER_PREFS_LIMITS.lineHeight.max}
          step={STEP.lineHeight}
          value={prefs.lineHeight}
          onChange={(event) => void update({ lineHeight: Number(event.target.value) })}
        />
      </Row>

      <Row label="Content width" value={`${prefs.contentWidth}px`}>
        <input
          type="range"
          className={rangeClassName}
          aria-label="Reader content width"
          min={READER_PREFS_LIMITS.contentWidth.min}
          max={READER_PREFS_LIMITS.contentWidth.max}
          step={STEP.contentWidth}
          value={prefs.contentWidth}
          onChange={(event) => void update({ contentWidth: Number(event.target.value) })}
        />
      </Row>

      <Row label="Letter spacing" value={`${prefs.letterSpacing.toFixed(3)}em`}>
        <input
          type="range"
          className={rangeClassName}
          aria-label="Reader letter spacing"
          min={READER_PREFS_LIMITS.letterSpacing.min}
          max={READER_PREFS_LIMITS.letterSpacing.max}
          step={STEP.letterSpacing}
          value={prefs.letterSpacing}
          onChange={(event) => void update({ letterSpacing: Number(event.target.value) })}
        />
      </Row>
    </div>
  );
}
