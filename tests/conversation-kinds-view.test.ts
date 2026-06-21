import { describe, expect, it } from 'vitest';

import { conversationKinds } from '@services/protocols/conversation-kinds';

describe('conversation kind view facet', () => {
  it('chat conversations use the chat renderer with no reader features', () => {
    const def = conversationKinds.pick({});
    expect(def).not.toBeNull();
    expect(def?.id).toBe('chat');
    expect(def?.view.renderer).toBe('chat');
    expect(def?.view.readerFeatures).toEqual({
      textLayout: false,
      theme: false,
      narration: false,
    });
  });

  it('article conversations use the article renderer with all reader features', () => {
    const def = conversationKinds.pick({ sourceType: 'article' });
    expect(def?.id).toBe('article');
    expect(def?.view.renderer).toBe('article');
    expect(def?.view.readerFeatures).toEqual({
      textLayout: true,
      theme: true,
      narration: true,
    });
  });

  it('video conversations reuse the article renderer with all reader features', () => {
    const def = conversationKinds.pick({ sourceType: 'video' });
    expect(def?.id).toBe('video');
    expect(def?.view.renderer).toBe('article');
    expect(def?.view.readerFeatures).toEqual({
      textLayout: true,
      theme: true,
      narration: true,
    });
  });

  it('every registered kind declares a valid view facet', () => {
    for (const def of conversationKinds.list()) {
      expect(['chat', 'article']).toContain(def.view.renderer);
      expect(typeof def.view.readerFeatures.textLayout).toBe('boolean');
      expect(typeof def.view.readerFeatures.theme).toBe('boolean');
      expect(typeof def.view.readerFeatures.narration).toBe('boolean');
    }
  });
});
