export function isDedaoArticleUrl(raw: string): boolean {
  try {
    const parsed = new URL(String(raw || ''));
    const host = String(parsed.hostname || '').toLowerCase();
    const isDedaoHost = host === 'www.dedao.cn' || host === 'dedao.cn' || host === 'm.dedao.cn';
    return isDedaoHost && parsed.pathname === '/course/article';
  } catch (_error) {
    return false;
  }
}
