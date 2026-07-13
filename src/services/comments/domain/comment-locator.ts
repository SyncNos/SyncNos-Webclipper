export type ArticleCommentLocatorEnv = 'inpage' | 'app';
export type ArticleCommentSurfaceHint = ArticleCommentLocatorEnv | 'unknown';
export type ArticleCommentTextModelVersion = 'dom-text-v2';

export type ArticleCommentTextQuoteSelector = {
  type: 'TextQuoteSelector';
  exact: string;
  prefix?: string;
  suffix?: string;
};

export type ArticleCommentTextPositionSelector = {
  type: 'TextPositionSelector';
  start: number;
  end: number;
};

export type ArticleCommentBoundaryPoint = {
  path: number[];
  offset: number;
};

export type ArticleCommentBoundaryPath = {
  start: ArticleCommentBoundaryPoint;
  end: ArticleCommentBoundaryPoint;
};

export type ArticleCommentRootEvidence = {
  textModelVersion: ArticleCommentTextModelVersion;
  textLength: number;
  textHash: string;
  tagName?: string;
  role?: string;
  dataAttributes?: Record<string, string>;
};

export type ArticleCommentLocatorV1 = {
  v: 1;
  env: ArticleCommentLocatorEnv;
  quote: ArticleCommentTextQuoteSelector;
  position: ArticleCommentTextPositionSelector;
};

export type ArticleCommentLocatorV2 = {
  v: 2;
  textModelVersion: ArticleCommentTextModelVersion;
  surfaceHint: ArticleCommentSurfaceHint;
  quote: ArticleCommentTextQuoteSelector;
  position: ArticleCommentTextPositionSelector;
  boundaryPath: ArticleCommentBoundaryPath;
  rootEvidence: ArticleCommentRootEvidence;
  documentRelativeRootPath?: number[];
};

export type ArticleCommentLocator = ArticleCommentLocatorV1 | ArticleCommentLocatorV2;

export type ArticleCommentLocatorParseReason =
  | 'not_object'
  | 'unsupported_version'
  | 'invalid_env'
  | 'invalid_surface_hint'
  | 'invalid_text_model_version'
  | 'invalid_quote'
  | 'invalid_position'
  | 'invalid_boundary_path'
  | 'invalid_root_evidence'
  | 'invalid_document_root_path';

export type ArticleCommentLocatorParseResult =
  | { ok: true; value: ArticleCommentLocator; reason: null }
  | { ok: false; value: null; reason: ArticleCommentLocatorParseReason };

export type ArticleCommentAnchorResolveReason =
  | 'missing_locator'
  | 'missing_root'
  | 'unsupported_version'
  | 'root_mismatch'
  | 'path_mismatch'
  | 'position_mismatch'
  | 'quote_not_found'
  | 'ambiguous_quote'
  | 'exact_mismatch'
  | 'budget_exceeded';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export const COMMENT_LOCATOR_BUDGET = Object.freeze({
  exact: 20000,
  context: 512,
  pathSegments: 128,
  attributes: 12,
  attributeLength: 256,
});

function parseQuote(value: unknown): ArticleCommentTextQuoteSelector | null {
  if (
    !isRecord(value) ||
    value.type !== 'TextQuoteSelector' ||
    typeof value.exact !== 'string' ||
    !value.exact ||
    value.exact.length > COMMENT_LOCATOR_BUDGET.exact
  )
    return null;
  if (
    value.prefix != null &&
    (typeof value.prefix !== 'string' || value.prefix.length > COMMENT_LOCATOR_BUDGET.context)
  )
    return null;
  if (
    value.suffix != null &&
    (typeof value.suffix !== 'string' || value.suffix.length > COMMENT_LOCATOR_BUDGET.context)
  )
    return null;
  return {
    type: 'TextQuoteSelector',
    exact: value.exact,
    ...(typeof value.prefix === 'string' ? { prefix: value.prefix } : {}),
    ...(typeof value.suffix === 'string' ? { suffix: value.suffix } : {}),
  };
}

function parsePosition(value: unknown): ArticleCommentTextPositionSelector | null {
  if (!isRecord(value) || value.type !== 'TextPositionSelector') return null;
  const start = Number(value.start);
  const end = Number(value.end);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end <= start) return null;
  return { type: 'TextPositionSelector', start, end };
}

function parsePathArray(value: unknown): number[] | null {
  if (!Array.isArray(value) || !value.length || value.length > COMMENT_LOCATOR_BUDGET.pathSegments) return null;
  const path = value.map(Number);
  return path.every((part) => Number.isSafeInteger(part) && part >= 0) ? path : null;
}

function parseBoundaryPoint(value: unknown): ArticleCommentBoundaryPoint | null {
  if (!isRecord(value)) return null;
  const path = parsePathArray(value.path);
  const offset = Number(value.offset);
  if (!path || !Number.isSafeInteger(offset) || offset < 0) return null;
  return { path, offset };
}

function parseBoundaryPath(value: unknown): ArticleCommentBoundaryPath | null {
  if (!isRecord(value)) return null;
  const start = parseBoundaryPoint(value.start);
  const end = parseBoundaryPoint(value.end);
  return start && end ? { start, end } : null;
}

function parseRootEvidence(value: unknown): ArticleCommentRootEvidence | null {
  if (!isRecord(value) || value.textModelVersion !== 'dom-text-v2') return null;
  const textLength = Number(value.textLength);
  if (!Number.isSafeInteger(textLength) || textLength < 0 || typeof value.textHash !== 'string' || !value.textHash)
    return null;
  const attrEntries = isRecord(value.dataAttributes) ? Object.entries(value.dataAttributes) : [];
  if (attrEntries.length > COMMENT_LOCATOR_BUDGET.attributes) return null;
  if (
    attrEntries.some(
      ([key, item]) =>
        key.length > COMMENT_LOCATOR_BUDGET.attributeLength ||
        typeof item !== 'string' ||
        item.length > COMMENT_LOCATOR_BUDGET.attributeLength,
    )
  )
    return null;
  const attrs = attrEntries.length ? Object.fromEntries(attrEntries) : undefined;
  return {
    textModelVersion: 'dom-text-v2',
    textLength,
    textHash: value.textHash,
    ...(typeof value.tagName === 'string' ? { tagName: value.tagName } : {}),
    ...(typeof value.role === 'string' ? { role: value.role } : {}),
    ...(attrs && Object.keys(attrs).length ? { dataAttributes: attrs as Record<string, string> } : {}),
  };
}

export function parseArticleCommentLocator(value: unknown): ArticleCommentLocatorParseResult {
  if (!isRecord(value)) return { ok: false, value: null, reason: 'not_object' };
  if (value.v === 1) {
    if (value.env !== 'inpage' && value.env !== 'app') return { ok: false, value: null, reason: 'invalid_env' };
    const quote = parseQuote(value.quote);
    if (!quote) return { ok: false, value: null, reason: 'invalid_quote' };
    const position = parsePosition(value.position);
    if (!position) return { ok: false, value: null, reason: 'invalid_position' };
    return { ok: true, value: { v: 1, env: value.env, quote, position }, reason: null };
  }
  if (value.v !== 2) return { ok: false, value: null, reason: 'unsupported_version' };
  if (value.textModelVersion !== 'dom-text-v2') return { ok: false, value: null, reason: 'invalid_text_model_version' };
  if (value.surfaceHint !== 'inpage' && value.surfaceHint !== 'app' && value.surfaceHint !== 'unknown') {
    return { ok: false, value: null, reason: 'invalid_surface_hint' };
  }
  const quote = parseQuote(value.quote);
  if (!quote) return { ok: false, value: null, reason: 'invalid_quote' };
  const position = parsePosition(value.position);
  if (!position) return { ok: false, value: null, reason: 'invalid_position' };
  const boundaryPath = parseBoundaryPath(value.boundaryPath);
  if (!boundaryPath) return { ok: false, value: null, reason: 'invalid_boundary_path' };
  const rootEvidence = parseRootEvidence(value.rootEvidence);
  if (!rootEvidence) return { ok: false, value: null, reason: 'invalid_root_evidence' };
  let documentRelativeRootPath: number[] | undefined;
  if (value.documentRelativeRootPath != null) {
    documentRelativeRootPath = parsePathArray(value.documentRelativeRootPath) ?? undefined;
    if (!documentRelativeRootPath) return { ok: false, value: null, reason: 'invalid_document_root_path' };
  }
  return {
    ok: true,
    value: {
      v: 2,
      textModelVersion: 'dom-text-v2',
      surfaceHint: value.surfaceHint,
      quote,
      position,
      boundaryPath,
      rootEvidence,
      ...(documentRelativeRootPath ? { documentRelativeRootPath } : {}),
    },
    reason: null,
  };
}

export function normalizeArticleCommentLocator(value: unknown): ArticleCommentLocator | null {
  const parsed = parseArticleCommentLocator(value);
  return parsed.ok ? parsed.value : null;
}
