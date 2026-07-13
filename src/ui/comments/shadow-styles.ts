import inpageCommentsPanelCssRaw from '@ui/styles/inpage-comments-panel.css?raw';
import buttonsCssRaw from '@ui/styles/buttons.css?raw';
import tokensCssRaw from '@ui/styles/tokens.css?raw';

function toHostTokensCss(css: string) {
  // Keep all custom properties (including radius tokens) unchanged for shadow host.
  return css.replaceAll(':root', ':host');
}

const COMMENT_SHADOW_STYLE_SOURCES = [
  toHostTokensCss(String(tokensCssRaw || '')),
  String(buttonsCssRaw || ''),
  String(inpageCommentsPanelCssRaw || ''),
];

const THREADED_COMMENTS_PANEL_SHADOW_CSS = COMMENT_SHADOW_STYLE_SOURCES.filter(Boolean).join('\n');

export function buildThreadedCommentsPanelShadowCss(): string {
  return THREADED_COMMENTS_PANEL_SHADOW_CSS;
}
