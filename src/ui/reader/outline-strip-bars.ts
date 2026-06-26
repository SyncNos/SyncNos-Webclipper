export const OUTLINE_STRIP_BAR_LEVEL_1 = 1;
export const OUTLINE_STRIP_BAR_LEVEL_2 = 2;

export const OUTLINE_STRIP_CLASS = 'tw-flex tw-flex-col tw-items-end tw-gap-2 tw-py-1 tw-pr-1';
export const OUTLINE_STRIP_BUTTON_CLASS = [
  'tw-flex tw-w-full tw-justify-end tw-border-0 tw-bg-transparent tw-p-0 tw-leading-none',
  'focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)]',
].join(' ');

export function outlineStripBarClassName(active: boolean): string {
  return [
    'tw-h-[2px] tw-flex-none tw-rounded-[var(--radius-inline)] tw-transition-[opacity,background-color] tw-duration-150',
    active ? 'tw-bg-[var(--text-primary)] tw-opacity-100' : 'tw-bg-[var(--text-secondary)] tw-opacity-40',
  ].join(' ');
}
