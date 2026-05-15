import { describe, expect, it } from 'vitest';

import { normalizeConvertedBlocksPreorder } from '@services/sync/feishu/docx/convert-api';

describe('feishu convert blocks preorder normalization', () => {
  it('reorders blocks into parent-before-children (preorder) when ids exist', () => {
    const input = {
      blocks: [
        { block_id: 'c', children: [] },
        { block_id: 'a', children: ['b', 'c'] },
        { block_id: 'b', children: [] },
      ],
      firstLevelBlockIds: ['a'],
    };

    const normalized = normalizeConvertedBlocksPreorder(input as any);
    const ids = normalized.blocks.map((b: any) => String(b?.block_id || ''));
    expect(ids.slice(0, 3)).toEqual(['a', 'b', 'c']);
    expect(normalized.firstLevelBlockIds).toEqual(['a']);
  });

  it('keeps firstLevelBlockIds even when blocks have no ids (best-effort)', () => {
    const input = {
      blocks: [{ block_type: 2, text: { elements: [{ text_run: { content: 'hi' } }] } }],
      firstLevelBlockIds: ['tmp1'],
    };

    const normalized = normalizeConvertedBlocksPreorder(input as any);
    expect(normalized.firstLevelBlockIds).toEqual(['tmp1']);
    expect(normalized.blocks.length).toBe(1);
  });
});

