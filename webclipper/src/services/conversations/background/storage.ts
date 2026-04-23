import {
  clearSyncCursor,
  deleteConversationsByIds,
  getConversationById,
  getMessagesByConversationId,
  getSyncMappingByConversation,
  patchSyncMapping,
  setConversationNotionPageId,
  setSyncCursor,
  syncConversationMessages,
  upsertConversation,
} from '@services/conversations/data/storage-idb';
import {
  attachOrphanCommentsToConversation,
  listCommentsByConversationId as getCommentsByConversationId,
} from '@services/comments/data/storage';

export const backgroundStorage = {
  upsertConversation,
  syncConversationMessages,
  getConversationById,
  getMessagesByConversationId,
  deleteConversationsByIds,
  setConversationNotionPageId,
  getSyncMappingByConversation,
  patchSyncMapping,
  setSyncCursor,
  clearSyncCursor,
  getCommentsByConversationId,
  attachOrphanCommentsToConversation,
};
