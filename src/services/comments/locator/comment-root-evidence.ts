import type { ArticleCommentRootEvidence } from '@services/comments/domain/comment-locator';
import { captureCommentRootSnapshot } from '@services/comments/locator/comment-root-snapshot';

export type CommentRootEvidenceMatch = 'matched' | 'mismatch' | 'insufficient';

export function compareCommentRootEvidence(
  root: Element,
  expected: ArticleCommentRootEvidence | null | undefined,
  options?: { lengthTolerance?: number },
): CommentRootEvidenceMatch {
  if (!expected || expected.textModelVersion !== 'dom-text-v2' || !expected.textHash) return 'insufficient';
  const actual = captureCommentRootSnapshot(root);
  if (!actual) return 'insufficient';
  const tolerance = Math.max(0, Math.floor(Number(options?.lengthTolerance ?? 0) || 0));
  if (Math.abs(actual.textLength - expected.textLength) > tolerance) return 'mismatch';
  if (actual.textHash !== expected.textHash) return 'mismatch';
  if (expected.tagName && actual.tagName !== expected.tagName.toLowerCase()) return 'mismatch';
  if (expected.role && actual.role !== expected.role) return 'mismatch';
  for (const [name, value] of Object.entries(expected.dataAttributes || {})) {
    if (actual.dataAttributes?.[name] !== value) return 'mismatch';
  }
  return 'matched';
}

export function isCommentRootEvidenceMatch(root: Element, expected: ArticleCommentRootEvidence): boolean {
  return compareCommentRootEvidence(root, expected) === 'matched';
}
