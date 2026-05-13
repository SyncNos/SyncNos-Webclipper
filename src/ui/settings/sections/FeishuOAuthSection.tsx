import { t } from '@i18n';
import type { KeyboardEvent } from 'react';
import { buttonClassName, cardClassName, checkboxClassName, textInputClassName } from '@ui/settings/ui';
import { SettingsFormRow } from '@ui/settings/sections/SettingsFormRow';

export function FeishuOAuthSection(props: {
  busy: boolean;
  syncEnabled: boolean;
  feishuStatusText: string;
  feishuConnected: boolean;
  pollingFeishu: boolean;
  feishuAdvancedOpen: boolean;
  feishuPendingState: string;
  feishuLastError: string;
  feishuClientId: string;
  feishuTokenExchangeProxyUrl: string;
  feishuChatFolder: string;
  feishuArticleFolder: string;
  feishuVideoFolder: string;
  onToggleSyncEnabled: (enabled: boolean) => void;
  onToggleAdvancedOpen: () => void;
  onConnectOrDisconnect: () => void;
  onChangeClientId: (value: string) => void;
  onChangeTokenExchangeProxyUrl: (value: string) => void;
  onChangeChatFolder: (value: string) => void;
  onChangeArticleFolder: (value: string) => void;
  onChangeVideoFolder: (value: string) => void;
  onSavePaths: () => void;
  onSaveAdvanced: () => void;
}) {
  const {
    busy,
    syncEnabled,
    feishuStatusText,
    feishuConnected,
    pollingFeishu,
    feishuAdvancedOpen,
    feishuPendingState,
    feishuLastError,
    feishuClientId,
    feishuTokenExchangeProxyUrl,
    feishuChatFolder,
    feishuArticleFolder,
    feishuVideoFolder,
    onToggleSyncEnabled,
    onToggleAdvancedOpen,
    onConnectOrDisconnect,
    onChangeClientId,
    onChangeTokenExchangeProxyUrl,
    onChangeChatFolder,
    onChangeArticleFolder,
    onChangeVideoFolder,
    onSavePaths,
    onSaveAdvanced,
  } = props;

  const onEnterToSavePaths = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    onSavePaths();
  };

  return (
    <>
      <section className={cardClassName} aria-label={t('feishuOAuth')}>
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-min-w-0 tw-flex-1 tw-text-[var(--text-primary)]">
            <span className="tw-text-base tw-font-extrabold">{t('feishuOAuth')}</span>
            <span className="tw-mx-2 tw-text-[var(--text-secondary)]" aria-hidden="true">
              |
            </span>
            <span className="tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">{feishuStatusText}</span>
          </div>
          <button onClick={onConnectOrDisconnect} disabled={busy} type="button" className={buttonClassName}>
            {feishuConnected ? t('disconnect') : pollingFeishu ? t('connectingDots') : t('connect')}
          </button>
        </div>

        {feishuLastError ? (
          <div className="tw-mt-2 tw-text-xs tw-font-semibold tw-text-[var(--error)]">
            {t('statusError')}: {feishuLastError}
          </div>
        ) : !feishuConnected && (pollingFeishu || feishuPendingState) ? (
          <div className="tw-mt-2 tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)] tw-opacity-90">
            {t('feishuWaitingHint')}
          </div>
        ) : null}

        <div className="tw-mt-3" aria-label={t('feishuSyncEnabledLabel')}>
          <SettingsFormRow label={t('feishuSyncEnabledLabel')}>
            <input
              id="feishuSyncEnabledToggle"
              type="checkbox"
              className={checkboxClassName}
              checked={syncEnabled}
              disabled={busy}
              aria-label={t('feishuSyncEnabledLabel')}
              onChange={(e) => onToggleSyncEnabled(e.target.checked)}
            />
          </SettingsFormRow>
          {!syncEnabled ? (
            <div className="tw-mt-2">
              <SettingsFormRow label="" align="start">
                <div className="tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">{t('feishuSyncEnabledHint')}</div>
              </SettingsFormRow>
            </div>
          ) : null}
        </div>

        <div className="tw-mt-3">
          <button
            type="button"
            className={buttonClassName}
            onClick={onToggleAdvancedOpen}
            disabled={busy}
            aria-expanded={feishuAdvancedOpen}
            aria-controls="feishu-advanced-settings"
          >
            {feishuAdvancedOpen ? t('advancedHide') : t('advancedShow')}
          </button>
        </div>

        {feishuAdvancedOpen ? (
          <div id="feishu-advanced-settings" className="tw-mt-3 tw-grid tw-gap-2">
            <SettingsFormRow label={t('feishuOAuthClientIdLabel')}>
              <input
                value={feishuClientId}
                onChange={(e) => onChangeClientId(e.target.value)}
                disabled={busy}
                spellCheck={false}
                placeholder="cli_xxx"
                aria-label={t('feishuOAuthClientIdLabel')}
                className={`${textInputClassName} tw-w-full`}
              />
            </SettingsFormRow>

            <SettingsFormRow label={t('feishuTokenExchangeProxyUrlLabel')}>
              <input
                value={feishuTokenExchangeProxyUrl}
                onChange={(e) => onChangeTokenExchangeProxyUrl(e.target.value)}
                disabled={busy}
                spellCheck={false}
                placeholder="https://.../feishu/oauth/exchange"
                aria-label={t('feishuTokenExchangeProxyUrlLabel')}
                className={`${textInputClassName} tw-w-full`}
              />
            </SettingsFormRow>

            <div className="tw-flex tw-justify-end">
              <button type="button" className={buttonClassName} onClick={onSaveAdvanced} disabled={busy}>
                {t('save')}
              </button>
            </div>

            <SettingsFormRow label={t('note')} align="start">
              <div className="tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">{t('feishuAdvancedHint')}</div>
            </SettingsFormRow>
          </div>
        ) : null}
      </section>

      <section className={cardClassName} aria-label={t('feishuPaths')}>
        <h2 className="tw-m-0 tw-text-base tw-font-extrabold tw-text-[var(--text-primary)]">{t('feishuPaths')}</h2>

        <div className="tw-mt-3 tw-grid tw-gap-2">
          <SettingsFormRow label={t('aiChatsFolder')}>
            <input
              value={feishuChatFolder}
              onChange={(e) => onChangeChatFolder(e.target.value)}
              onBlur={onSavePaths}
              onKeyDown={onEnterToSavePaths}
              disabled={busy}
              spellCheck={false}
              placeholder="SyncNos-AIChats"
              aria-label={t('aiChatsFolder')}
              className={`${textInputClassName} tw-w-full`}
            />
          </SettingsFormRow>

          <SettingsFormRow label={t('webClipperFolder')}>
            <input
              value={feishuArticleFolder}
              onChange={(e) => onChangeArticleFolder(e.target.value)}
              onBlur={onSavePaths}
              onKeyDown={onEnterToSavePaths}
              disabled={busy}
              spellCheck={false}
              placeholder="SyncNos-WebArticles"
              aria-label={t('webClipperFolder')}
              className={`${textInputClassName} tw-w-full`}
            />
          </SettingsFormRow>

          <SettingsFormRow label={t('videoScriptsFolder')}>
            <input
              value={feishuVideoFolder}
              onChange={(e) => onChangeVideoFolder(e.target.value)}
              onBlur={onSavePaths}
              onKeyDown={onEnterToSavePaths}
              disabled={busy}
              spellCheck={false}
              placeholder="SyncNos-Videos"
              aria-label={t('videoScriptsFolder')}
              className={`${textInputClassName} tw-w-full`}
            />
          </SettingsFormRow>

          <SettingsFormRow label={t('note')} align="start">
            <div className="tw-text-xs tw-font-semibold tw-text-[var(--text-secondary)]">{t('feishuPathsNote')}</div>
          </SettingsFormRow>
        </div>
      </section>
    </>
  );
}
