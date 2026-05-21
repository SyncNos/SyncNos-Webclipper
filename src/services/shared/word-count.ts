function normalizeText(text: unknown): string {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

export function countWords(text: string): number {
  const value = normalizeText(text);
  if (!value) return 0;

  try {
    const Segmenter = (Intl as any)?.Segmenter;
    if (typeof Segmenter === 'function') {
      const segmenter = new Segmenter(undefined, { granularity: 'word' });
      let count = 0;
      for (const token of segmenter.segment(value)) {
        if (token && token.isWordLike) count += 1;
      }
      if (count > 0) return count;
    }
  } catch (_e) {
    // ignore and fallback
  }

  return value.split(/\s+/).filter(Boolean).length;
}

export function countWordsFromMessages(
  messages: Array<{ contentText?: string | null; contentMarkdown?: string | null }>,
): number {
  const parts: string[] = [];
  for (const m of messages || []) {
    const text = normalizeText(m?.contentText);
    if (text) {
      parts.push(text);
      continue;
    }
    const markdown = normalizeText(m?.contentMarkdown);
    if (markdown) parts.push(markdown);
  }
  if (!parts.length) return 0;
  return countWords(parts.join('\n'));
}

