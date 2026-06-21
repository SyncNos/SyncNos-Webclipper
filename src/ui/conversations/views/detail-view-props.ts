export type DetailViewSharedProps = {
  selected: any;
  activeId: unknown;
  detail: any;
  listError?: string | null;
  loadingDetail?: boolean;
  detailError?: string | null;
  setMessagesRootRef: (node: HTMLDivElement | null) => void;
};
