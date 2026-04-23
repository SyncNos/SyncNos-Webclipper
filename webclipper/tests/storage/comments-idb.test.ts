import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { IDBKeyRange, indexedDB } from 'fake-indexeddb';

import {
  __closeDbForTests,
  addComment,
  attachOrphanCommentsToConversation,
  deleteCommentById,
  hasAnyCommentsForCanonicalUrl,
  listCommentsByCanonicalUrl,
  listCommentsByConversationId,
  migrateCommentsCanonicalUrl,
} from '@services/comments/data/storage-idb';

function reqToPromise<T = unknown>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('indexedDB request failed'));
  });
}

async function deleteDb(name: string) {
  const req = indexedDB.deleteDatabase(name);
  await reqToPromise(req as unknown as IDBRequest<unknown>);
}

beforeEach(async () => {
  await __closeDbForTests();

  // @ts-expect-error test global
  globalThis.indexedDB = indexedDB;
  // @ts-expect-error test global
  globalThis.IDBKeyRange = IDBKeyRange;
  await deleteDb('webclipper');
});

afterEach(async () => {
  await __closeDbForTests();
});

describe('comments storage-idb', () => {
  it('adds, lists by canonicalUrl, and deletes', async () => {
    const url = 'https://example.com/a#hash';

    const c1 = await addComment({
      conversationId: null,
      canonicalUrl: url,
      quoteText: 'q',
      commentText: 'hello',
      createdAt: 10,
    });
    const c2 = await addComment({
      conversationId: 123,
      canonicalUrl: 'https://example.com/a',
      quoteText: '',
      commentText: 'world',
      createdAt: 11,
    });

    const list = await listCommentsByCanonicalUrl('https://example.com/a');
    expect(list.map((c) => c.id)).toEqual([c1.id, c2.id]);
    expect(list[0].canonicalUrl).toBe('https://example.com/a');

    const byConvo = await listCommentsByConversationId(123);
    expect(byConvo.map((c) => c.id)).toEqual([c2.id]);

    const ok = await deleteCommentById(c1.id);
    expect(ok).toBe(true);

    const after = await listCommentsByCanonicalUrl('https://example.com/a');
    expect(after.map((c) => c.id)).toEqual([c2.id]);
  });

  it('supports replies and cascades delete on root', async () => {
    const url = 'https://example.com/thread';
    const root = await addComment({
      parentId: null,
      conversationId: null,
      canonicalUrl: url,
      quoteText: 'quote',
      commentText: 'root',
      createdAt: 10,
    });
    const reply1 = await addComment({
      parentId: root.id,
      conversationId: null,
      canonicalUrl: url,
      quoteText: '',
      commentText: 'reply',
      createdAt: 11,
    });

    const list = await listCommentsByCanonicalUrl(url);
    const byId = new Map(list.map((c) => [c.id, c]));
    expect(byId.get(root.id)?.parentId).toBe(null);
    expect(byId.get(reply1.id)?.parentId).toBe(root.id);

    await deleteCommentById(root.id);
    const after = await listCommentsByCanonicalUrl(url);
    expect(after.length).toBe(0);
  });

  it('hasAnyForCanonicalUrl returns true when exists', async () => {
    const url = 'https://example.com/a';
    expect(await hasAnyCommentsForCanonicalUrl(url)).toBe(false);
    await addComment({ conversationId: null, canonicalUrl: url, commentText: 'x' });
    expect(await hasAnyCommentsForCanonicalUrl(url)).toBe(true);
  });

  it('attaches orphan comments to conversation', async () => {
    const url = 'https://example.com/a';
    const orphan1 = await addComment({
      conversationId: null,
      canonicalUrl: url,
      commentText: 'a',
      createdAt: 1,
    });
    const orphan2 = await addComment({
      conversationId: null,
      canonicalUrl: url,
      commentText: 'b',
      createdAt: 2,
    });
    const already = await addComment({ conversationId: 9, canonicalUrl: url, commentText: 'c', createdAt: 3 });

    const res = await attachOrphanCommentsToConversation(url, 42);
    expect(res.updated).toBe(2);

    const list = await listCommentsByCanonicalUrl(url);
    const byId = new Map(list.map((c) => [c.id, c]));
    expect(byId.get(orphan1.id)?.conversationId).toBe(42);
    expect(byId.get(orphan2.id)?.conversationId).toBe(42);
    expect(byId.get(already.id)?.conversationId).toBe(9);
  });

  it('migrates canonicalUrl and merges into existing thread', async () => {
    const fromUrl = 'https://example.com/a?utm_source=x';
    const toUrl = 'https://example.com/a';

    const c1 = await addComment({ conversationId: 1, canonicalUrl: fromUrl, commentText: 'a', createdAt: 1 });
    const c2 = await addComment({ conversationId: null, canonicalUrl: fromUrl, commentText: 'b', createdAt: 2 });
    const existing = await addComment({
      conversationId: 2,
      canonicalUrl: toUrl,
      commentText: 'c',
      createdAt: 3,
    });

    const res = await migrateCommentsCanonicalUrl(fromUrl, toUrl);
    expect(res.updated).toBe(2);

    const afterTo = await listCommentsByCanonicalUrl(toUrl);
    expect(afterTo.map((c) => c.id)).toEqual([c1.id, c2.id, existing.id]);
    expect(afterTo.every((c) => c.canonicalUrl === toUrl)).toBe(true);

    const afterFrom = await listCommentsByCanonicalUrl(fromUrl);
    expect(afterFrom.length).toBe(0);
  });
});
