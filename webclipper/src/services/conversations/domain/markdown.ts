import type { Conversation, ConversationMessage } from '@services/conversations/domain/models';

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function formatIso(ts?: number) {
  const t = Number(ts) || 0;
  if (!t) return '';
  try {
    return new Date(t).toISOString();
  } catch (_e) {
    return String(ts || '');
  }
}

export function sanitizeFilenamePart(value: unknown, fallback: string, maxLen: number = 80) {
  const raw = String(value ?? '').trim();
  const cleaned = raw
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
  const limit = Number.isFinite(Number(maxLen)) ? Math.max(1, Math.floor(Number(maxLen))) : 80;
  return cleaned.slice(0, limit) || fallback;
}

function formatArticleMarkdown(conversation: Conversation, messages: ConversationMessage[]) {
  const c = conversation || ({} as any);
  const m0 = Array.isArray(messages) && messages.length ? messages[0] : null;
  const lines: string[] = [];
  lines.push(`# ${c.title || 'Untitled'}`);
  lines.push('');
  if (isNonEmptyString(c.author)) lines.push(`- Author: ${String(c.author)}`);
  if (isNonEmptyString(c.publishedAt)) lines.push(`- Published: ${String(c.publishedAt)}`);
  if (isNonEmptyString(c.url)) lines.push(`- URL: ${String(c.url)}`);
  lines.push('');
  lines.push('## Content');
  lines.push('');
  lines.push(String((m0 && ((m0 as any).contentMarkdown || (m0 as any).contentText)) || ''));
  lines.push('');
  return lines.join('\n');
}

function formatChatMarkdown(conversation: Conversation, messages: ConversationMessage[]) {
  const c = conversation || ({} as any);
  const lines: string[] = [];
  lines.push(`# ${c.title || '(untitled)'}`);
  lines.push('');
  lines.push(`- Source: ${String((c as any).sourceName || c.source || '')}`);
  if (isNonEmptyString(c.url)) lines.push(`- URL: ${String(c.url)}`);
  if (c.lastCapturedAt) lines.push(`- CapturedAt: ${formatIso(c.lastCapturedAt)}`);
  if (Array.isArray(c.warningFlags) && c.warningFlags.length) {
    lines.push(`- Warnings: ${c.warningFlags.map(String).join(', ')}`);
  }
  lines.push('');
  for (const m of messages || []) {
    const role = String((m as any).role || '')
      .trim()
      .toLowerCase();
    const normalizedRole = role || 'assistant';
    const content = String((m as any).contentMarkdown || (m as any).contentText || '');

    const authorName =
      normalizedRole === 'user' && isNonEmptyString((m as any).authorName) ? String((m as any).authorName) : '';
    lines.push(`## ${normalizedRole === 'user' ? authorName || 'You' : normalizedRole}`);
    lines.push('');
    lines.push(content);
    lines.push('');
  }
  return lines.join('\n');
}

function formatVideoMarkdown(conversation: Conversation, messages: ConversationMessage[]) {
  const c = conversation || ({} as any);
  const lines: string[] = [];
  lines.push(`# ${c.title || 'Video'}`);
  lines.push('');

  if (isNonEmptyString(c.author)) lines.push(`- Author: ${String(c.author)}`);
  if (isNonEmptyString((c as any).platform)) lines.push(`- Platform: ${String((c as any).platform)}`);
  if (typeof (c as any).durationSeconds === 'number' && Number.isFinite((c as any).durationSeconds)) {
    lines.push(`- DurationSeconds: ${String((c as any).durationSeconds)}`);
  }
  if (isNonEmptyString(c.url)) lines.push(`- URL: ${String(c.url)}`);
  if (c.lastCapturedAt) lines.push(`- CapturedAt: ${formatIso(c.lastCapturedAt)}`);
  if (Array.isArray(c.warningFlags) && c.warningFlags.length) {
    lines.push(`- Warnings: ${c.warningFlags.map(String).join(', ')}`);
  }
  lines.push('');

  const transcriptMessages = (messages || []).filter((m) => {
    const role = String((m as any).role || '')
      .trim()
      .toLowerCase();
    return role === 'transcript';
  });
  const picked = transcriptMessages.length ? transcriptMessages : messages || [];
  for (const m of picked) {
    const content = String((m as any).contentMarkdown || (m as any).contentText || '');
    if (!content.trim()) continue;
    lines.push(content);
    lines.push('');
  }

  return lines.join('\n');
}

export function formatConversationMarkdown(conversation: Conversation, messages: ConversationMessage[]) {
  const sourceType = conversation?.sourceType ? String(conversation.sourceType) : '';
  if (sourceType === 'article') return formatArticleMarkdown(conversation, messages);
  if (sourceType === 'video') return formatVideoMarkdown(conversation, messages);
  return formatChatMarkdown(conversation, messages);
}
