# Reader three-piece — acceptance criteria (P6)

This document is the acceptance checklist for the SyncNos "reader three-piece"
feature: a **Text & layout** panel, a **Theme** panel, and a **Read aloud**
(narration) panel, surfaced through a single `ReaderToolbar` that mounts only on
reader-style views (article / video script), never on AI chat.

> Status legend: ✅ verified offline · 🟡 deferred to a real Firefox build/profile
> on Chii's machine (no network / no `npm install` in the sandbox).

## 1. Scope & layering

- The toolbar and its three panels live under `src/ui/reader/` and depend only on
  `@ui/shared/*`, `@services/protocols/reader-prefs`, `@services/reader/tts/*`
  (types) and `@i18n`. No `@platform/*` imports from `src/ui/**`. ✅
- Reader preferences and the TTS engine are framework-agnostic
  (`@services/protocols/reader-prefs`, `@services/reader/tts/reader-tts-engine`);
  React glue is confined to `src/viewmodels/reader/`. ✅
- The engine receives its Web APIs by dependency injection (`ReaderTtsDeps`); no
  direct in-page injection. ✅

## 2. Gating (no chat regression)

- `ReaderToolbar` renders `null` when every `readerFeatures` flag is false. ✅
- `conversation-kinds.ts`: chat = `{textLayout:false, theme:false,
  narration:false}`; article & video = all `true`. ✅
- `ConversationDetailPane` forwards `readerFeatures` to the view; AI chat shows
  no toolbar and no panels. ✅

## 3. Text & layout panel

- Preset (Medium / Notion / Book) only overwrites text-layout fields, never
  theme or TTS prefs. ✅
- Font family (serif / sans / mono), alignment (left / justify), font size, line
  height, content width and letter spacing each persist to `reader_prefs_v1`
  and apply via `--reader-*` CSS vars on the reader column. ✅
- All min/max values are clamped by `READER_PREFS_LIMITS`. ✅

## 4. Theme panel

- Themes: System / Light / Sepia / Dark / Black. `system` applies no
  `data-reader-theme` attribute (follows OS). ✅
- Active-sentence highlight is theme-aware via `--reader-highlight`
  (light/sepia/dark/black overrides in `tokens.css`). ✅

## 5. Read aloud (narration) panel

- Engine picker: Web Speech vs AI endpoint. When Web Speech is unavailable the
  picker degrades and a "Fall back to Web Speech" affordance is shown only when
  it can help. ✅
- Web Speech: voice + speed. AI endpoint: endpoint, API key, model, voice,
  audio format (Opus / MP3 / WAV / AAC / FLAC) + speed. ✅
- Play / Pause / Stop drive `useReaderNarration`; the active sentence is
  highlighted read-only in the DOM (no text mutation). ✅
- Engine is disposed on unmount — no speech / audio leaks past the reader. ✅
- 🟡 Real audio playback (Web Speech voices + a live AI TTS endpoint) is
  verified on Chii's machine; the sandbox has no audio device or network.

## 6. Internationalisation

- 60 `reader*` keys exist in **both** `en.ts` and `zh.ts` (key sets verified
  identical). All visible labels and aria-labels in the toolbar and three panels
  resolve through `t()`. ✅
- Legacy `markdownReadingProfileLabel` is retained but marked `@deprecated`
  (superseded by the reader three-piece). ✅

## 7. Observability (privacy-safe)

- `useReaderNarration` publishes a snapshot to
  `globalThis.__syncnosReaderNarration` on state change, sentence change and
  error: `{ state, isPlaying, stateChanges, errorCount, lastError, activeIndex,
  updatedAt }`. ✅
- The snapshot contains **only** counters / state / a sentence *index* and the
  engine error message — never article text, reader prefs, or the AI endpoint
  API key. ✅
- Publishing is best-effort (wrapped in try/catch) so it can never break
  narration. ✅

## 8. Accessibility

- Every control exposes an aria-label (now via `t()`); focus-visible styling is
  preserved from the shared button styles. ✅
- Theme buttons form a `radiogroup`; popover triggers expose
  `aria-haspopup="menu"` / `aria-expanded`. ✅

## 9. Tests

- `tests/reader-tts-engine.test.ts`: 19/19 pass offline (protocol + DI + mocks,
  no real Web APIs). ✅
- 🟡 `gate:ci` / `build:firefox` and a full Firefox profile smoke test run on
  Chii's machine.

## 10. Styling guardrails

- Border radius uses `--radius-*` tokens only; no bare `border-radius:<px>` and
  no 999px pill buttons in the reader UI. ✅
- Reader typography is applied through `--reader-*` vars, not hard-coded values. ✅
