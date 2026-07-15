import { t } from '@i18n';
import { useId, type Ref } from 'react';
import { useAutosizeTextarea } from './use-autosize-textarea';
import { isDiscussionSubmitShortcut } from './use-discussion-keyboard';

type ReplyComposerProps = {
  rootId: number;
  value: string;
  disabled: boolean;
  textareaRef?: Ref<HTMLTextAreaElement>;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void | Promise<void>;
  onCancel: () => void;
};

function assignRef(ref: Ref<HTMLTextAreaElement> | undefined, node: HTMLTextAreaElement | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

export function ReplyComposer({
  rootId,
  value,
  disabled,
  textareaRef,
  onChange,
  onSubmit,
  onCancel,
}: ReplyComposerProps) {
  const autosize = useAutosizeTextarea(value);
  const hintId = useId();
  const setRef = (node: HTMLTextAreaElement | null) => {
    autosize.setRef(node);
    assignRef(textareaRef, node);
  };
  return (
    <div
      className="webclipper-inpage-comments-panel__reply-composer"
      data-reply-composer-root-id={String(rootId)}
      data-disabled={disabled ? '1' : undefined}
      role="group"
      aria-label="Reply composer"
      aria-busy={disabled ? 'true' : undefined}
    >
      <div className="webclipper-inpage-comments-panel__composer-field">
        <textarea
          ref={setRef}
          className="webclipper-inpage-comments-panel__reply-textarea"
          placeholder="Reply…"
          aria-label="Write a reply"
          aria-describedby={hintId}
          rows={1}
          value={value}
          onInput={(event) => {
            onChange(event.currentTarget.value);
            autosize.resize();
          }}
          onChange={(event) => {
            onChange(event.currentTarget.value);
            autosize.resize();
          }}
          onKeyDown={(event) => {
            if (isDiscussionSubmitShortcut({ ...event, isComposing: event.nativeEvent.isComposing })) {
              event.preventDefault();
              event.stopPropagation();
              void onSubmit(event.currentTarget.value);
              return;
            }
          }}
          disabled={disabled}
        />
        <div className="webclipper-inpage-comments-panel__composer-toolbar">
          <button
            type="button"
            className="webclipper-inpage-comments-panel__composer-cancel webclipper-btn webclipper-btn--tone-muted"
            disabled={disabled}
            onClick={onCancel}
          >
            Cancel
          </button>
          <span id={hintId} className="webclipper-inpage-comments-panel__composer-hint">
            Ctrl/⌘ + Enter to submit
          </span>
          <button
            type="button"
            className="webclipper-inpage-comments-panel__send webclipper-btn webclipper-btn--icon"
            aria-label={t('tooltipReplySendDetailed')}
            disabled={disabled || !String(value || '').trim()}
            onClick={() => void onSubmit(value)}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M8.75 4.25L12.5 8L8.75 11.75"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
