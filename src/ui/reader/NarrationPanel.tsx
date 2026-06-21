import type { ReactNode } from 'react';
import { SelectMenu } from '@ui/shared/SelectMenu';
import { buttonTintClassName } from '@ui/shared/button-styles';
import { textInputClassName } from '@ui/settings/ui';
import {
  READER_PREFS_LIMITS,
  READER_TTS_AUDIO_FORMATS,
  READER_TTS_ENGINES,
  type ReaderPrefs,
  type ReaderTtsAudioFormat,
  type ReaderTtsEngineId,
  type ReaderTtsPrefs,
} from '@services/protocols/reader-prefs';

// Presentational, fully controlled. The owning surface (P6 ReaderToolbar) supplies
// `prefs` and an `update` that persists patches via the reader-prefs view-model.
// Narration prefs live under `reader_prefs_v1.tts`; we always pass the full merged
// `tts` object so the patch is type-safe against Partial<ReaderPrefs>.
export type NarrationPanelProps = {
  prefs: ReaderPrefs;
  update: (patch: Partial<ReaderPrefs>) => void | Promise<void>;
  /** Last narration error surfaced from the engine (e.g. AI endpoint failure). */
  error?: string | null;
  /** Whether Web Speech can be used; gates the engine picker + fallback button. */
  webSpeechAvailable?: boolean;
  className?: string;
};

// TODO(P6-T2): replace literal labels with i18n keys (kept literal now so this
// task does not depend on the locale changes scheduled for P6).
const ENGINE_LABELS: Record<ReaderTtsEngineId, string> = {
  web: 'Web Speech',
  ai: 'AI endpoint',
};
const FORMAT_LABELS: Record<ReaderTtsAudioFormat, string> = {
  opus: 'Opus',
  mp3: 'MP3',
  wav: 'WAV',
  aac: 'AAC',
  flac: 'FLAC',
};

const STEP = { rate: 0.05 } as const;

const rangeClassName = [
  'tw-w-full tw-cursor-pointer tw-accent-[var(--accent)]',
  'focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--focus-ring)]',
].join(' ');

const fieldInputClassName = [textInputClassName, 'tw-w-full'].join(' ');

// Web Speech voices are environment-provided; read defensively (may be empty
// before the async voiceschanged event fires; refined in P5-T3 / P6).
function listWebVoices(): Array<{ voiceURI: string; name: string }> {
  const scope = globalThis as {
    speechSynthesis?: { getVoices?: () => Array<{ voiceURI: string; name: string }> };
  };
  try {
    return scope.speechSynthesis?.getVoices?.() ?? [];
  } catch {
    return [];
  }
}

function Row({ label, value, children }: { label: string; value?: string; children: ReactNode }) {
  return (
    <div className="tw-flex tw-flex-col tw-gap-1">
      <div className="tw-flex tw-items-center tw-justify-between tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">
        <span>{label}</span>
        {value ? <span className="tw-tabular-nums tw-text-[var(--text-primary)]">{value}</span> : null}
      </div>
      {children}
    </div>
  );
}

/**
 * NarrationPanel — configures the reader text-to-speech settings stored in
 * `reader_prefs_v1.tts`: engine (Web Speech / AI endpoint), speech rate, the Web
 * voice, and the OpenAI-compatible endpoint fields (endpoint/key/model/voice/format).
 * Fully controlled; all writes go through `update({ tts })` which the view-model
 * re-normalizes (rate clamped, enums validated) before persisting.
 */
export function NarrationPanel({
  prefs,
  update,
  error,
  webSpeechAvailable = true,
  className,
}: NarrationPanelProps) {
  const tts = prefs.tts;
  const updateTts = (patch: Partial<ReaderTtsPrefs>) => void update({ tts: { ...tts, ...patch } });
  const webVoices = tts.engine === 'web' ? listWebVoices() : [];

  return (
    <div className={['tw-flex tw-flex-col tw-gap-3', className].filter(Boolean).join(' ')}>
      {error ? (
        <div
          role="alert"
          className="tw-flex tw-flex-col tw-gap-2 tw-rounded-[var(--radius-control)] tw-border tw-border-[var(--border)] tw-bg-[var(--bg-sunken)] tw-p-2 tw-text-xs tw-text-[var(--text-primary)]"
        >
          <span>{error}</span>
          {tts.engine === 'ai' ? (
            <button
              type="button"
              className={buttonTintClassName()}
              disabled={!webSpeechAvailable}
              onClick={() => updateTts({ engine: 'web' })}
            >
              Fall back to Web Speech
            </button>
          ) : null}
        </div>
      ) : null}

      <Row label="Engine">
        <SelectMenu<ReaderTtsEngineId>
          ariaLabel="Narration engine"
          value={tts.engine}
          onChange={(next) => updateTts({ engine: next })}
          options={READER_TTS_ENGINES.map((id) => ({
            value: id,
            label: ENGINE_LABELS[id],
            disabled: id === 'web' && !webSpeechAvailable,
          }))}
        />
      </Row>

      <Row label="Speed" value={`${tts.rate.toFixed(2)}x`}>
        <input
          type="range"
          className={rangeClassName}
          aria-label="Narration speed"
          min={READER_PREFS_LIMITS.tts.rate.min}
          max={READER_PREFS_LIMITS.tts.rate.max}
          step={STEP.rate}
          value={tts.rate}
          onChange={(event) => updateTts({ rate: Number(event.target.value) })}
        />
      </Row>

      {tts.engine === 'web' ? (
        <Row label="Voice">
          <SelectMenu<string>
            ariaLabel="Web speech voice"
            value={tts.webVoiceURI}
            onChange={(next) => updateTts({ webVoiceURI: next })}
            options={[
              { value: '', label: 'System default' },
              ...webVoices.map((voice) => ({ value: voice.voiceURI, label: voice.name || voice.voiceURI })),
            ]}
          />
        </Row>
      ) : null}

      {tts.engine === 'ai' ? (
        <>
          <Row label="Endpoint">
            <input
              type="url"
              className={fieldInputClassName}
              aria-label="AI speech endpoint"
              placeholder="http://localhost:8880/v1"
              value={tts.aiEndpoint}
              onChange={(event) => updateTts({ aiEndpoint: event.target.value })}
            />
          </Row>

          <Row label="API key">
            <input
              type="password"
              className={fieldInputClassName}
              aria-label="AI speech API key"
              placeholder="sk-..."
              autoComplete="off"
              value={tts.aiApiKey}
              onChange={(event) => updateTts({ aiApiKey: event.target.value })}
            />
          </Row>

          <Row label="Model">
            <input
              type="text"
              className={fieldInputClassName}
              aria-label="AI speech model"
              placeholder="kokoro"
              value={tts.aiModel}
              onChange={(event) => updateTts({ aiModel: event.target.value })}
            />
          </Row>

          <Row label="Voice">
            <input
              type="text"
              className={fieldInputClassName}
              aria-label="AI speech voice"
              placeholder="af_sky"
              value={tts.aiVoice}
              onChange={(event) => updateTts({ aiVoice: event.target.value })}
            />
          </Row>

          <Row label="Format">
            <SelectMenu<ReaderTtsAudioFormat>
              ariaLabel="AI speech audio format"
              value={tts.aiFormat}
              onChange={(next) => updateTts({ aiFormat: next })}
              options={READER_TTS_AUDIO_FORMATS.map((id) => ({ value: id, label: FORMAT_LABELS[id] }))}
            />
          </Row>
        </>
      ) : null}
    </div>
  );
}
