import { describe, expect, test } from 'vitest';

import { scrollExactCommentRange, type CommentScrollContainer } from '../../src/ui/comments/range-scroll-controller';

function container(rect: { top: number; bottom: number }, top = 0, height = 1000, client = 100) {
  let scrollTop = top;
  const calls: Array<{ top: number; behavior: ScrollBehavior }> = [];
  const value: CommentScrollContainer = {
    getRect: () => ({ ...rect, left: 0, right: 100 }),
    getScrollTop: () => scrollTop,
    getScrollHeight: () => height,
    getClientHeight: () => client,
    scrollTo: (next, behavior) => {
      scrollTop = next;
      calls.push({ top: next, behavior });
    },
  };
  return { value, calls };
}

describe('scrollExactCommentRange', () => {
  test('applies the minimum delta through nested scroll containers', () => {
    const inner = container({ top: 20, bottom: 120 });
    const outer = container({ top: 0, bottom: 200 });
    const range = { getBoundingClientRect: () => ({ top: 180, bottom: 200, left: 0, right: 20 }) } as Range;
    const result = scrollExactCommentRange({
      range,
      containers: [inner.value, outer.value],
      viewportRect: { top: 0, bottom: 200, left: 0, right: 200 },
    });
    expect(result.scrolled).toBe(1);
    expect(inner.calls).toEqual([{ top: 80, behavior: 'smooth' }]);
    expect(outer.calls).toEqual([]);
  });

  test('does nothing when exact range is visible', () => {
    const current = container({ top: 0, bottom: 200 });
    const range = { getBoundingClientRect: () => ({ top: 20, bottom: 40, left: 0, right: 20 }) } as Range;
    expect(
      scrollExactCommentRange({
        range,
        containers: [current.value],
        viewportRect: { top: 0, bottom: 200, left: 0, right: 200 },
      }),
    ).toEqual({ scrolled: 0 });
    expect(current.calls).toEqual([]);
  });

  test('uses auto behavior for reduced motion and clamps scroll bounds', () => {
    const current = container({ top: 0, bottom: 100 }, 890, 1000, 100);
    const range = { getBoundingClientRect: () => ({ top: 150, bottom: 170, left: 0, right: 20 }) } as Range;
    scrollExactCommentRange({
      range,
      containers: [current.value],
      viewportRect: { top: 0, bottom: 100, left: 0, right: 100 },
      reducedMotion: true,
    });
    expect(current.calls[0]).toEqual({ top: 900, behavior: 'auto' });
  });
});
