export type DiscussionMenuTarget = 'panel' | number | null;

export type DiscussionFocusIntent =
  | { kind: 'root'; epoch: number }
  | { kind: 'reply'; rootId: number; epoch: number }
  | { kind: 'menu'; target: Exclude<DiscussionMenuTarget, null>; epoch: number }
  | null;

export type DiscussionSubmitState = {
  kind: 'root' | 'reply' | null;
  rootId: number | null;
  status: 'idle' | 'submitting' | 'success' | 'error';
  error: string | null;
};

export type DiscussionState = {
  contextKey: string;
  activeRootId: number | null;
  rootDraft: string;
  replyDrafts: Record<number, string>;
  openMenu: DiscussionMenuTarget;
  confirmDelete: number | null;
  focusIntent: DiscussionFocusIntent;
  actionEpoch: number;
  submit: DiscussionSubmitState;
};

export type DiscussionAction =
  | { type: 'context'; contextKey: string }
  | { type: 'reset' }
  | { type: 'activate-root'; rootId: number | null }
  | { type: 'set-root-draft'; value: string }
  | { type: 'set-reply-draft'; rootId: number; value: string }
  | { type: 'clear-reply-draft'; rootId: number }
  | { type: 'open-menu'; target: DiscussionMenuTarget }
  | { type: 'confirm-delete'; id: number | null }
  | { type: 'focus-root' }
  | { type: 'focus-reply'; rootId: number }
  | { type: 'focus-menu'; target: Exclude<DiscussionMenuTarget, null> }
  | { type: 'consume-focus'; epoch: number }
  | { type: 'submit-start'; kind: 'root' | 'reply'; rootId?: number | null }
  | { type: 'submit-success'; kind: 'root' | 'reply'; rootId?: number | null }
  | { type: 'submit-error'; kind: 'root' | 'reply'; rootId?: number | null; error: string };

const idleSubmit = (): DiscussionSubmitState => ({
  kind: null,
  rootId: null,
  status: 'idle',
  error: null,
});

export function createDiscussionState(contextKey = ''): DiscussionState {
  return {
    contextKey,
    activeRootId: null,
    rootDraft: '',
    replyDrafts: {},
    openMenu: null,
    confirmDelete: null,
    focusIntent: null,
    actionEpoch: 0,
    submit: idleSubmit(),
  };
}

function validRootId(value: number | null | undefined): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function withFocus(
  state: DiscussionState,
  build: (epoch: number) => Exclude<DiscussionFocusIntent, null>,
): DiscussionState {
  const epoch = state.actionEpoch + 1;
  return { ...state, actionEpoch: epoch, focusIntent: build(epoch) };
}

export function discussionReducer(state: DiscussionState, action: DiscussionAction): DiscussionState {
  switch (action.type) {
    case 'context': {
      const contextKey = String(action.contextKey || '');
      return contextKey === state.contextKey ? state : createDiscussionState(contextKey);
    }
    case 'reset':
      return createDiscussionState(state.contextKey);
    case 'activate-root': {
      const activeRootId = validRootId(action.rootId);
      return {
        ...state,
        activeRootId,
        openMenu: null,
        confirmDelete: null,
      };
    }
    case 'set-root-draft':
      return { ...state, rootDraft: String(action.value ?? '') };
    case 'set-reply-draft': {
      const rootId = validRootId(action.rootId);
      if (rootId == null) return state;
      const value = String(action.value ?? '');
      if (state.replyDrafts[rootId] === value) return state;
      return { ...state, replyDrafts: { ...state.replyDrafts, [rootId]: value } };
    }
    case 'clear-reply-draft': {
      const rootId = validRootId(action.rootId);
      if (rootId == null || !(rootId in state.replyDrafts)) return state;
      const replyDrafts = { ...state.replyDrafts };
      delete replyDrafts[rootId];
      return { ...state, replyDrafts };
    }
    case 'open-menu':
      return { ...state, openMenu: action.target, confirmDelete: null };
    case 'confirm-delete':
      return { ...state, confirmDelete: validRootId(action.id) };
    case 'focus-root':
      return withFocus(state, (epoch) => ({ kind: 'root', epoch }));
    case 'focus-reply': {
      const rootId = validRootId(action.rootId);
      return rootId == null ? state : withFocus(state, (epoch) => ({ kind: 'reply', rootId, epoch }));
    }
    case 'focus-menu':
      return withFocus(state, (epoch) => ({ kind: 'menu', target: action.target, epoch }));
    case 'consume-focus':
      return state.focusIntent?.epoch === action.epoch ? { ...state, focusIntent: null } : state;
    case 'submit-start': {
      const rootId = action.kind === 'reply' ? validRootId(action.rootId) : null;
      if (action.kind === 'reply' && rootId == null) return state;
      return {
        ...state,
        submit: { kind: action.kind, rootId, status: 'submitting', error: null },
      };
    }
    case 'submit-success': {
      const rootId = action.kind === 'reply' ? validRootId(action.rootId) : null;
      let next: DiscussionState = {
        ...state,
        submit: { kind: action.kind, rootId, status: 'success', error: null },
      };
      if (action.kind === 'root') next = { ...next, rootDraft: '' };
      if (action.kind === 'reply' && rootId != null) {
        const replyDrafts = { ...next.replyDrafts };
        delete replyDrafts[rootId];
        next = { ...next, replyDrafts };
      }
      return next;
    }
    case 'submit-error': {
      const rootId = action.kind === 'reply' ? validRootId(action.rootId) : null;
      return {
        ...state,
        submit: {
          kind: action.kind,
          rootId,
          status: 'error',
          error: String(action.error || ''),
        },
      };
    }
    default:
      return state;
  }
}
