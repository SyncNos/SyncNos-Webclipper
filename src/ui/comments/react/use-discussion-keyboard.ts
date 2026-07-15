export function isDiscussionSubmitShortcut(event: {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  isComposing?: boolean;
}): boolean {
  return (
    !event.isComposing && event.key === 'Enter' && (event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey
  );
}
