# 配置

## 真源

| 配置类别 | 真源 |
| --- | --- |
| manifest version、permissions、host permissions | `wxt.config.ts` |
| npm 命令和依赖版本 | `package.json` / `package-lock.json` |
| UI 设置结构 | `src/ui/settings/SettingsScene.tsx` 与 `src/ui/settings/sections/` |
| 设置状态和持久化编排 | `src/viewmodels/settings/useSettingsSceneController.ts` |
| reader 偏好 | `src/services/protocols/reader-prefs.ts` |
| app theme | `src/services/protocols/app-theme.ts` |
| anti-hotlink | `src/services/integrations/anti-hotlink/anti-hotlink-settings.ts` |
| OAuth 默认值 | 各 provider 的 `auth/oauth.ts` |

不要在多个文档中复制当前版本号、权限数组或完整设置键清单。

## 关键本地设置

| 键 | 行为 | 归一化规则 |
| --- | --- | --- |
| `inpage_display_mode` | `supported / all / off` | 未设置时可从旧 `inpage_supported_only` 回读；新代码只写新键 |
| `markdown_reading_profile_v1` | `medium / notion / book` | 未知值回退 `medium` |
| `anti_hotlink_rules_v1` | domain → referer 规则 | 非法规则忽略；命中后缓存图片但不阻断正文 |
| `reader_prefs_v1` | 字体、字号、行高、宽度、对齐与 TTS 偏好 | `normalizeReaderPrefs()` 负责枚举回退和数值 clamp |
| `app_theme_mode_v1` | `system / light / sepia / dark / black` | 未知值回退协议默认值 |
| `ai_chat_cache_images_enabled` | AI chat 实时图片内联 | 失败只产生 warning |
| `web_article_cache_images_enabled` | article 图片缓存 | anti-hotlink 命中时可强制尝试缓存 |
| `*_auto_sync_enabled_v1` | Notion / Obsidian / Feishu 自动同步 | 各 provider 独立，默认关闭 |

旧键只允许用于迁移或兼容读取，不得形成长期双写路径。

## OAuth 与同步

- Notion 和 Feishu token 存在 `chrome.storage.local`，并由备份 denylist 排除。
- 官方 OAuth 模式通过 Cloudflare Worker 持有 client secret；用户自建 Feishu 应用可选择在扩展中保存 secret。
- Parent Page、文件夹路径、API endpoint 和 job 状态由各 provider 的 settings store 管理。
- Feishu 的完整部署流程见 [feishu-setup.md](feishu-setup.md)。

## 构建时配置

常用命令：

```bash
npm run dev
npm run dev:firefox
npm run build
npm run build:firefox
npm run build:zen
npm run build:safari
```

Feishu 官方默认值可由以下环境变量注入：

```text
SYNCNOS_FEISHU_OAUTH_CLIENT_ID
SYNCNOS_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL
```

Zen 可通过 `WXT_ZEN_BINARY` 指定浏览器路径；扩展 id 可通过 `FIREFOX_EXTENSION_ID` 覆盖。排障见 [troubleshooting.md](troubleshooting.md)。

## 修改配置时的验证

1. 确认协议层对未知值、空值和旧值有明确归一化。
2. 确认 UI/ViewModel 不直接 import `@platform/*`。
3. 补数据转换、状态变化和异常输入测试。
4. 运行 `npm run gate:ci`；manifest、权限或构建改动再运行 `npm run gate`。
