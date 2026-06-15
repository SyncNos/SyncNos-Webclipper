import {
  addArticleComment,
  listArticleCommentsByCanonicalUrl,
} from '@services/comments/data/storage';
import type { ArticleComment } from '@services/comments/domain/models';
import {
  buildDedaoGuiNoteContentKey,
  dedupeDedaoGuiNotes,
  normalizeDedaoGuiText,
  type DedaoGuiNote,
} from '@collectors/web/dedao-gui-notes-model';
import type { DedaoGuiNotesBridgeResponse } from '@collectors/web/dedao-gui-notes-bridge-contract';
import { canonicalizeArticleUrl } from '@services/url-cleaning/http-url';

export type DedaoNoteImportSummary = {
  canonicalUrl: string;
  conversationId: number | null;
  bridgeStatus: 'success' | 'empty' | 'timeout' | 'malformed_payload' | 'error' | 'failed_open' | 'skipped';
  extractedCount: number;
  importedCount: number;
  skippedDuplicates: number;
  existingRootCount: number;
  errorMessage: string;
};

type ImportDeps = {
  extractNotes: () => Promise<DedaoGuiNotesBridgeResponse>;
  listExisting?: (canonicalUrl: string) => Promise<ArticleComment[]>;
  addRootComment?: (input: {
    canonicalUrl: string;
    conversationId: number | null;
    quoteText: string;
    commentText: string;
  }) => Promise<ArticleComment>;
};

function emptySummary(input: {
  canonicalUrl: string;
  conversationId: number | null;
  bridgeStatus: DedaoNoteImportSummary['bridgeStatus'];
  errorMessage?: string;
}): DedaoNoteImportSummary {
  return {
    canonicalUrl: input.canonicalUrl,
    conversationId: input.conversationId,
    bridgeStatus: input.bridgeStatus,
    extractedCount: 0,
    importedCount: 0,
    skippedDuplicates: 0,
    existingRootCount: 0,
    errorMessage: String(input.errorMessage || ''),
  };
}

function isBridgeSuccess(
  response: DedaoGuiNotesBridgeResponse,
): response is Extract<DedaoGuiNotesBridgeResponse, { ok: true; status: 'success' }> {
  return response.ok === true && response.status === 'success';
}

function isBridgeEmpty(
  response: DedaoGuiNotesBridgeResponse,
): response is Extract<DedaoGuiNotesBridgeResponse, { ok: true; status: 'empty' }> {
  return response.ok === true && response.status === 'empty';
}

export async function importDedaoArticleNotes(
  input: {
    canonicalUrl: string;
    conversationId: number | null;
  },
  deps: ImportDeps,
): Promise<DedaoNoteImportSummary> {
  const canonicalUrl = canonicalizeArticleUrl(input?.canonicalUrl) || '';
  const conversationId = input?.conversationId != null ? Number(input.conversationId) : null;
  if (!canonicalUrl) {
    return emptySummary({
      canonicalUrl: '',
      conversationId,
      bridgeStatus: 'skipped',
      errorMessage: 'missing canonical url',
    });
  }

  const listExisting = deps.listExisting || listArticleCommentsByCanonicalUrl;
  const addRootComment =
    deps.addRootComment ||
    ((next) =>
      addArticleComment({
        canonicalUrl: next.canonicalUrl,
        conversationId: next.conversationId,
        parentId: null,
        quoteText: next.quoteText,
        commentText: next.commentText,
        locator: null,
      }));

  try {
    const response = await deps.extractNotes();
    if (isBridgeEmpty(response)) {
      return emptySummary({
        canonicalUrl,
        conversationId,
        bridgeStatus: 'empty',
      });
    }

    if (!isBridgeSuccess(response)) {
      return emptySummary({
        canonicalUrl,
        conversationId,
        bridgeStatus: response.status,
        errorMessage: response.error?.message || '',
      });
    }

    const dedupedBridgeNotes = dedupeDedaoGuiNotes(response.notes);
    const existingComments = await listExisting(canonicalUrl);
    const existingRootComments = (Array.isArray(existingComments) ? existingComments : []).filter(
      (item) => item?.parentId == null,
    );
    const existingKeys = new Set(
      existingRootComments.map((item) =>
        buildDedaoGuiNoteContentKey({
          quoteText: normalizeDedaoGuiText(item?.quoteText),
          commentText: normalizeDedaoGuiText(item?.commentText),
        }),
      ),
    );

    let importedCount = 0;
    let skippedDuplicates = 0;

    for (const note of dedupedBridgeNotes) {
      const noteKey = buildDedaoGuiNoteContentKey(note);
      if (!noteKey || existingKeys.has(noteKey)) {
        skippedDuplicates += 1;
        continue;
      }

      await addRootComment({
        canonicalUrl,
        conversationId,
        quoteText: note.quoteText,
        commentText: note.commentText,
      });
      importedCount += 1;
      existingKeys.add(noteKey);
    }

    return {
      canonicalUrl,
      conversationId,
      bridgeStatus: 'success',
      extractedCount: dedupedBridgeNotes.length,
      importedCount,
      skippedDuplicates,
      existingRootCount: existingRootComments.length,
      errorMessage: '',
    };
  } catch (error) {
    return emptySummary({
      canonicalUrl,
      conversationId,
      bridgeStatus: 'failed_open',
      errorMessage: error instanceof Error ? error.message : String(error || 'unknown error'),
    });
  }
}
