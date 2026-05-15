import { describe, expect, it } from 'vitest';

import { formatConversationMarkdownForFeishuDocxSync } from '@services/sync/feishu/docx/feishu-docx-markdown';

describe('feishu docx markdown formatter', () => {
  it('keeps internal image references (data url / syncnos-asset)', async () => {
    const markdown = [
      '# Title',
      '',
      '![d](data:image/png;base64,AAAA)',
      '',
      '![a](syncnos-asset://123)',
      '',
    ].join('\n');

    const out = await formatConversationMarkdownForFeishuDocxSync(
      { id: 1, source: 'x', conversationKey: 'k', title: 't' } as any,
      {
        conversationId: 1,
        messages: [
          {
            id: 1,
            conversationId: 1,
            messageKey: 'm1',
            role: 'user',
            contentMarkdown: markdown,
          } as any,
        ],
      } as any,
    );

    expect(out).toContain('data:image/png;base64,AAAA');
    expect(out).toContain('syncnos-asset://123');
    expect(out).not.toContain('[Image omitted]');
  });

  it('normalizes standalone image caption lines', async () => {
    const markdown = ['![alt](https://example.com/a.png)Caption'].join('\n');
    const out = await formatConversationMarkdownForFeishuDocxSync(
      { id: 1, source: 'x', conversationKey: 'k', title: 't' } as any,
      {
        conversationId: 1,
        messages: [
          {
            id: 1,
            conversationId: 1,
            messageKey: 'm1',
            role: 'assistant',
            contentMarkdown: markdown,
          } as any,
        ],
      } as any,
    );

    expect(out).toContain('![alt](https://example.com/a.png)\n\nCaption');
  });
});

