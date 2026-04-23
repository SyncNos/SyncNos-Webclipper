import * as idb from '@services/comments/data/storage-idb';

export async function addComment(payload: any) {
  return await idb.addComment(payload);
}

export async function listCommentsByCanonicalUrl(canonicalUrl: string) {
  return await idb.listCommentsByCanonicalUrl(canonicalUrl);
}

export async function listCommentsByConversationId(conversationId: number) {
  return await idb.listCommentsByConversationId(conversationId);
}

export async function getCommentDeleteContextById(id: number) {
  return await idb.getCommentDeleteContextById(id);
}

export async function deleteCommentById(id: number) {
  return await idb.deleteCommentById(id);
}

export async function hasAnyCommentsForCanonicalUrl(canonicalUrl: string) {
  return await idb.hasAnyCommentsForCanonicalUrl(canonicalUrl);
}

export async function attachOrphanCommentsToConversation(canonicalUrl: string, conversationId: number) {
  return await idb.attachOrphanCommentsToConversation(canonicalUrl, conversationId);
}

export async function migrateCommentsCanonicalUrl(
  fromCanonicalUrl: string,
  toCanonicalUrl: string,
): Promise<{ updated: number }> {
  return await idb.migrateCommentsCanonicalUrl(fromCanonicalUrl, toCanonicalUrl);
}
