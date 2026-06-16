export type ArticleFetchTextPrefer = 'innerText' | 'textContent';
export type ArticleFetchImageSanitizer = 'none' | 'stripAtSuffix' | 'stripBangSuffix' | 'stripQuerySuffix';

export type ArticleFetchSiteSpec = {
  id: string;
  urlPattern?: RegExp;
  rootSelector: string;

  titleSelector?: string;
  titleFallbackOrder?: Array<'meta' | 'document'>;
  authorSelector?: string;
  publishedAtSelector?: string;
  textSelector?: string;
  textPrefer?: ArticleFetchTextPrefer;
  removeSelectors?: string[];
  useSanitizedRootHtml?: boolean;

  imageSelector?: string;
  /**
   * Optional ordered selectors for images. When provided, extractor will use the
   * first selector that yields at least one image under `rootSelector`.
   *
   * Useful for sites that render carousels with loop/clone nodes (e.g. Swiper),
   * where a broad selector can accidentally include duplicated slides and break ordering.
   */
  imageSelectorCandidates?: string[];
  imageSrcAttributes?: string[];
  imageSanitizer?: ArticleFetchImageSanitizer;
};
