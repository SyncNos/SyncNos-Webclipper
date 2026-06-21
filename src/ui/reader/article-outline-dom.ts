import {
  type ReaderOutlineCandidateRect,
  type ReaderOutlineEntry,
  type ReaderOutlineLevel,
} from '@services/protocols/reader-outline';

export type ReaderOutlineDomEntry = ReaderOutlineEntry & {
  element: HTMLElement;
  rect: ReaderOutlineCandidateRect;
};

const HEADING_SELECTOR = 'h1, h2, h3';
const GENERATED_ID_PREFIX = 'reader-outline';

function normalizeHeadingText(text: string): string {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function readHeadingLevel(tagName: string): ReaderOutlineLevel | null {
  const match = /^H([1-3])$/.exec(String(tagName || '').trim().toUpperCase());
  if (!match) return null;
  return Number(match[1]) as ReaderOutlineLevel;
}

function readRect(element: HTMLElement): ReaderOutlineCandidateRect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    bottom: rect.bottom,
  };
}

function ensureGeneratedId(element: HTMLElement, headingIndex: number): string {
  const existing = String(element.id || '').trim();
  if (existing) return existing;
  const generated = `${GENERATED_ID_PREFIX}-${headingIndex + 1}`;
  element.id = generated;
  return generated;
}

export function buildReaderOutlineDomEntries(root: HTMLElement | null | undefined): ReaderOutlineDomEntry[] {
  if (!root) return [];

  const headings = Array.from(root.querySelectorAll(HEADING_SELECTOR)) as HTMLElement[];
  const entries: ReaderOutlineDomEntry[] = [];

  headings.forEach((heading, headingIndex) => {
    const level = readHeadingLevel(heading.tagName);
    if (!level) return;

    const title = normalizeHeadingText(heading.textContent ?? '');
    if (!title) return;

    entries.push({
      index: entries.length,
      level,
      id: ensureGeneratedId(heading, headingIndex),
      title,
      element: heading,
      rect: readRect(heading),
    });
  });

  return entries;
}
