import type { ArticleFetchSiteSpec } from '@collectors/web/article-fetch-sites/site-spec';

export const DEDAO_NOTE_DETAIL_SITE_SPEC: ArticleFetchSiteSpec = {
  id: 'dedao_note_detail',
  urlPattern: /^https?:\/\/(?:www\.)?dedao\.cn\/knowledge\/note\/detail\b/i,
  rootSelector: '#feedWrap .feed-wrap-content',
  titleFallbackOrder: ['document', 'meta'],
  authorSelector: '.audio-info .name',
  publishedAtSelector: '.audio-info .date',
  textPrefer: 'innerText',
  useSanitizedRootHtml: true,
  removeSelectors: [
    '.autor-right',
    '.iget-prompt',
    '.feed-btn-recommendation',
    '.pointer',
    '.note-expo',
    '.operation-area',
    '.loading-more',
    '.write-comment',
    '.forward-comment-like',
    '.iget-drop-down-card',
  ],
};
