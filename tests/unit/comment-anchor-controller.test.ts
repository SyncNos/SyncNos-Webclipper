import { describe, expect, test } from 'vitest';

import { createCommentAnchorController } from '../../src/ui/comments/comment-anchor-controller';

const locator = {
  v: 1 as const,
  env: 'app' as const,
  quote: { type: 'TextQuoteSelector' as const, exact: 'x' },
  position: { type: 'TextPositionSelector' as const, start: 0, end: 1 },
};

function registry() {
  const calls: string[] = [];
  return {
    calls,
    value: {
      replace: (id: number, _range: Range, tone?: string) => calls.push(`replace:${id}:${tone}`),
      remove: (id: number) => calls.push(`remove:${id}`),
      setActive: (id: number | null) => calls.push(`active:${id}`),
      refresh: () => {},
      dispose: () => calls.push('dispose'),
      size: () => 0,
    },
  };
}

describe('comment anchor controller', () => {
  test('prioritizes active roots and syncs exact markers', async () => {
    const markers = registry();
    const order: number[] = [];
    const controller = createCommentAnchorController({
      getRoots: () => [{} as Element],
      registry: markers.value,
      resolve: async ({ locator: current }) => {
        order.push(current.position.start);
        return { ok: true as const, range: {} as Range, root: {} as Element, rootIndex: 0 };
      },
    });
    await controller.sync([
      { commentId: 1, locator },
      { commentId: 2, locator: { ...locator, position: { ...locator.position, start: 2, end: 3 } } },
    ], 2);
    expect(order).toEqual([2, 0]);
    expect(markers.calls).toContain('replace:2:active');
    expect(markers.calls).toContain('replace:1:passive');
  });

  test('drops stale completion after a new generation starts', async () => {
    const markers = registry();
    let release: (() => void) | null = null;
    const controller = createCommentAnchorController({
      getRoots: () => [{} as Element],
      registry: markers.value,
      resolve: () => new Promise((resolve) => {
        release = () => resolve({ ok: true, range: {} as Range, root: {} as Element, rootIndex: 0 });
      }),
    });
    const pending = controller.sync([{ commentId: 1, locator }]);
    controller.reset();
    release?.();
    await pending;
    expect(markers.calls.some((call) => call.startsWith('replace:1'))).toBe(false);
  });

  test('dispose aborts work and tears down the registry once', () => {
    const markers = registry();
    const controller = createCommentAnchorController({
      getRoots: () => [],
      registry: markers.value,
      resolve: () => ({ ok: false, reason: 'quote_not_found' }),
    });
    controller.dispose();
    controller.dispose();
    expect(markers.calls.filter((call) => call === 'dispose')).toHaveLength(1);
  });
});
