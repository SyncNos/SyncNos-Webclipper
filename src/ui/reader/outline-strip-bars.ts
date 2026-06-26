export const OUTLINE_STRIP_BAR_LEVEL_1 = 1;
export const OUTLINE_STRIP_BAR_LEVEL_2 = 2;

export function outlineStripBarClassName(active: boolean): string {
  return [
    'tw-h-[2px] tw-flex-none tw-rounded-[var(--radius-inline)] tw-transition-[opacity,background-color] tw-duration-150',
    active ? 'tw-bg-[var(--text-primary)] tw-opacity-100' : 'tw-bg-[var(--text-secondary)] tw-opacity-40',
  ].join(' ');
}
