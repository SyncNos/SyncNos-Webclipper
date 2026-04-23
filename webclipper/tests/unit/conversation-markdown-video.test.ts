import { describe, expect, it } from 'vitest';

import { formatConversationMarkdown } from '@services/conversations/domain/markdown';

describe('formatConversationMarkdown (video)', () => {
  it('exports transcript without injecting role headings', () => {
    const markdown = formatConversationMarkdown(
      {
        title: 'Video',
        source: 'video',
        sourceType: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      } as any,
      [
        {
          role: 'transcript',
          contentMarkdown: '00:00 Hello\n00:01 World',
        } as any,
      ],
    );

    expect(markdown).toContain('# Video');
    expect(markdown).toContain('00:00 Hello');
    expect(markdown).not.toContain('## transcript');
    expect(markdown).not.toContain('### transcript');
  });
});

