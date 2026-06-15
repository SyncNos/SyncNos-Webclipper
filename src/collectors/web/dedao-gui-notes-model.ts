export type DedaoGuiNote = {
  externalId: string;
  quoteText: string;
  commentText: string;
  range?: string;
  markerText?: string;
  markerVisitKey?: string;
};

export type DedaoGuiNoteInput = Partial<DedaoGuiNote> | null | undefined;

function collapseWhitespace(value: string) {
  return value.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ');
}

export function normalizeDedaoGuiText(value: unknown): string {
  const text = String(value || '').replace(/\u00a0/g, ' ').trim();
  if (!text) return '';
  return collapseWhitespace(text);
}

export function buildDedaoGuiNoteContentKey(input: Pick<DedaoGuiNote, 'quoteText' | 'commentText'>): string {
  const quoteText = normalizeDedaoGuiText(input?.quoteText);
  const commentText = normalizeDedaoGuiText(input?.commentText);
  return `${quoteText}::${commentText}`;
}

export function normalizeDedaoGuiNote(input: DedaoGuiNoteInput): DedaoGuiNote | null {
  if (!input || typeof input !== 'object') return null;

  const quoteText = normalizeDedaoGuiText(input.quoteText);
  const commentText = normalizeDedaoGuiText(input.commentText);
  if (!quoteText || !commentText) return null;

  const externalId = normalizeDedaoGuiText(input.externalId);
  const range = normalizeDedaoGuiText(input.range);
  const markerText = normalizeDedaoGuiText(input.markerText);
  const markerVisitKey = normalizeDedaoGuiText(input.markerVisitKey);

  return {
    externalId,
    quoteText,
    commentText,
    ...(range ? { range } : {}),
    ...(markerText ? { markerText } : {}),
    ...(markerVisitKey ? { markerVisitKey } : {}),
  };
}

export function isValidDedaoGuiNote(input: DedaoGuiNoteInput): input is DedaoGuiNote {
  return normalizeDedaoGuiNote(input) != null;
}

export function dedupeDedaoGuiNotes(inputs: DedaoGuiNoteInput[]): DedaoGuiNote[] {
  const normalized: DedaoGuiNote[] = [];
  const seenExternalIds = new Set<string>();
  const seenContentKeys = new Set<string>();

  for (const input of inputs) {
    const note = normalizeDedaoGuiNote(input);
    if (!note) continue;

    const contentKey = buildDedaoGuiNoteContentKey(note);
    if (!contentKey) continue;

    if (note.externalId) {
      if (seenExternalIds.has(note.externalId)) continue;
      seenExternalIds.add(note.externalId);
    } else {
      const fallbackIdentity = note.markerVisitKey ? `${note.markerVisitKey}::${contentKey}` : contentKey;
      if (seenContentKeys.has(fallbackIdentity)) continue;
      seenContentKeys.add(fallbackIdentity);
      normalized.push(note);
      continue;
    }

    seenContentKeys.add(contentKey);
    normalized.push(note);
  }

  return normalized;
}
