import { buttonFilledClassName, buttonTintClassName } from '@ui/shared/button-styles';
import { READER_THEMES, type ReaderPrefs, type ReaderTheme } from '@services/protocols/reader-prefs';
import { t } from '@i18n';

// Presentational, fully controlled. The owning surface (P6 ReaderToolbar) supplies
// `prefs` and an `update` that persists the patch via the reader-prefs view-model.
export type ThemePanelProps = {
  prefs: ReaderPrefs;
  update: (patch: Partial<ReaderPrefs>) => void | Promise<void>;
  className?: string;
};

const THEME_LABELS: Record<ReaderTheme, string> = {
  system: t('readerThemeSystem'),
  light: t('readerThemeLight'),
  sepia: t('readerThemeSepia'),
  dark: t('readerThemeDark'),
  black: t('readerThemeBlack'),
};

/**
 * ThemePanel — switches the reader-local theme stored in `reader_prefs_v1.theme`.
 * `system` follows the OS appearance (no data-reader-theme attribute on the reader
 * root); the other four scope the [data-reader-theme=...] token overrides. Only the
 * reader container recolors; the rest of the app is untouched.
 */
export function ThemePanel({ prefs, update, className }: ThemePanelProps) {
  const selectTheme = (theme: ReaderTheme) => {
    if (theme === prefs.theme) return;
    void update({ theme });
  };

  return (
    <div className={['tw-flex tw-flex-col tw-gap-1', className].filter(Boolean).join(' ')}>
      <div className="tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">{t('readerThemeLabel')}</div>
      <div className="tw-flex tw-flex-wrap tw-gap-1.5" role="radiogroup" aria-label={t('readerThemeAria')}>
        {READER_THEMES.map((theme) => {
          const active = theme === prefs.theme;
          return (
            <button
              key={theme}
              type="button"
              role="radio"
              aria-checked={active}
              className={[active ? buttonFilledClassName() : buttonTintClassName(), 'tw-flex-1'].join(' ')}
              onClick={() => selectTheme(theme)}
            >
              {THEME_LABELS[theme]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
