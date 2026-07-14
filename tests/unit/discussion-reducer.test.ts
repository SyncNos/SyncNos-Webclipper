import { describe, expect, it } from 'vitest';
import { createDiscussionState, discussionReducer } from '@viewmodels/comments/discussion-reducer';

describe('discussionReducer', () => {
  it('resets transient state when the identity context changes', () => {
    let state = createDiscussionState('a');
    state = discussionReducer(state, { type: 'set-root-draft', value: 'draft' });
    state = discussionReducer(state, { type: 'set-reply-draft', rootId: 7, value: 'reply' });
    state = discussionReducer(state, { type: 'activate-root', rootId: 7 });
    const next = discussionReducer(state, { type: 'context', contextKey: 'b' });
    expect(next).toEqual(createDiscussionState('b'));
  });

  it('keeps reply drafts per root while switching the active root', () => {
    let state = createDiscussionState('ctx');
    state = discussionReducer(state, { type: 'set-reply-draft', rootId: 1, value: 'one' });
    state = discussionReducer(state, { type: 'set-reply-draft', rootId: 2, value: 'two' });
    state = discussionReducer(state, { type: 'activate-root', rootId: 2 });
    expect(state.activeRootId).toBe(2);
    expect(state.replyDrafts).toEqual({ 1: 'one', 2: 'two' });
  });

  it('owns menu and delete confirmation without storing async work', () => {
    let state = createDiscussionState();
    state = discussionReducer(state, { type: 'open-menu', target: 8 });
    state = discussionReducer(state, { type: 'confirm-delete', id: 8 });
    expect(state.openMenu).toBe(8);
    expect(state.confirmDelete).toBe(8);
    state = discussionReducer(state, { type: 'open-menu', target: null });
    expect(state.confirmDelete).toBeNull();
  });

  it('issues monotonic focus intents and consumes only the matching epoch', () => {
    let state = discussionReducer(createDiscussionState(), { type: 'focus-root' });
    const firstEpoch = state.actionEpoch;
    state = discussionReducer(state, { type: 'focus-reply', rootId: 3 });
    expect(state.actionEpoch).toBe(firstEpoch + 1);
    expect(state.focusIntent).toMatchObject({ kind: 'reply', rootId: 3 });
    expect(discussionReducer(state, { type: 'consume-focus', epoch: firstEpoch })).toBe(state);
    state = discussionReducer(state, { type: 'consume-focus', epoch: state.actionEpoch });
    expect(state.focusIntent).toBeNull();
  });

  it('clears only the submitted draft on success and retains it on error', () => {
    let state = createDiscussionState();
    state = discussionReducer(state, { type: 'set-root-draft', value: 'root' });
    state = discussionReducer(state, { type: 'submit-error', kind: 'root', error: 'nope' });
    expect(state.rootDraft).toBe('root');
    expect(state.submit.status).toBe('error');
    state = discussionReducer(state, { type: 'submit-success', kind: 'root' });
    expect(state.rootDraft).toBe('');

    state = discussionReducer(state, { type: 'set-reply-draft', rootId: 4, value: 'reply' });
    state = discussionReducer(state, { type: 'submit-success', kind: 'reply', rootId: 4 });
    expect(state.replyDrafts[4]).toBeUndefined();
  });

  it('ignores invalid reply roots', () => {
    const state = createDiscussionState();
    expect(discussionReducer(state, { type: 'set-reply-draft', rootId: 0, value: 'x' })).toBe(state);
    expect(discussionReducer(state, { type: 'submit-start', kind: 'reply', rootId: -1 })).toBe(state);
  });

  it('clears a submit error when the user edits the affected draft', () => {
    let state = createDiscussionState();
    state = discussionReducer(state, { type: 'submit-error', kind: 'root', error: 'failed' });
    state = discussionReducer(state, { type: 'set-root-draft', value: 'retry root' });
    expect(state.submit.status).toBe('idle');

    state = discussionReducer(state, { type: 'submit-error', kind: 'reply', rootId: 4, error: 'failed' });
    state = discussionReducer(state, { type: 'set-reply-draft', rootId: 4, value: 'retry reply' });
    expect(state.submit.status).toBe('idle');
  });

  it('reconciles active and transient state against the latest thread graph', () => {
    let state = createDiscussionState();
    state = discussionReducer(state, { type: 'activate-root', rootId: 7 });
    state = discussionReducer(state, { type: 'set-reply-draft', rootId: 7, value: 'draft' });
    state = discussionReducer(state, { type: 'open-menu', target: 8 });
    state = discussionReducer(state, { type: 'confirm-delete', id: 8 });
    state = discussionReducer(state, { type: 'focus-reply', rootId: 7 });
    state = discussionReducer(state, { type: 'submit-start', kind: 'reply', rootId: 7 });

    const next = discussionReducer(state, { type: 'reconcile-threads', rootIds: [9], commentIds: [9, 10] });
    expect(next.activeRootId).toBeNull();
    expect(next.replyDrafts).toEqual({});
    expect(next.openMenu).toBeNull();
    expect(next.confirmDelete).toBeNull();
    expect(next.focusIntent).toBeNull();
    expect(next.submit.status).toBe('idle');
  });
});
