import type { ArticleCommentRootEvidence } from '@services/comments/domain/comment-locator';
import { createCommentDomTextIndex } from '@services/comments/locator/dom-text-index';

export const COMMENT_ROOT_SNAPSHOT_DEFAULT_MAX_TEXT_LENGTH = 200_000;
const SAFE_DATA_ATTRIBUTES = ['data-testid', 'data-id', 'data-message-id', 'data-node-id'] as const;

function stableHash(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}

export function captureCommentRootSnapshot(
  root: Element,
  options?: { maxTextLength?: number; dataAttributes?: readonly string[] },
): ArticleCommentRootEvidence | null {
  const index = createCommentDomTextIndex(root);
  const requestedBudget = Number(options?.maxTextLength ?? COMMENT_ROOT_SNAPSHOT_DEFAULT_MAX_TEXT_LENGTH);
  const maxTextLength = Number.isSafeInteger(requestedBudget) && requestedBudget >= 0
    ? requestedBudget
    : COMMENT_ROOT_SNAPSHOT_DEFAULT_MAX_TEXT_LENGTH;
  if (index.text.length > maxTextLength) return null;

  const allowed = options?.dataAttributes || SAFE_DATA_ATTRIBUTES;
  const dataAttributes: Record<string, string> = {};
  for (const name of allowed) {
    if (!name.startsWith('data-')) continue;
    const value = root.getAttribute(name);
    if (value != null && value.length <= 256) dataAttributes[name] = value;
  }

  const role = root.getAttribute('role');
  return {
    textModelVersion: 'dom-text-v2',
    textLength: index.text.length,
    textHash: stableHash(index.text),
    tagName: root.tagName.toLowerCase(),
    ...(role ? { role } : {}),
    ...(Object.keys(dataAttributes).length ? { dataAttributes } : {}),
  };
}
