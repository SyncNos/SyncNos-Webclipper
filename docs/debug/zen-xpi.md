# 调试：Zen 安装 unsigned XPI

## 目标

在本仓库本地构建一个可用于 Zen（Firefox 内核）安装的 `.xpi`，并规避常见的 “appears to be corrupt” 报错。

## 构建

```bash
npm run build:zen
```

产物输出到：

- `.output/webclipper-<manifest.version>-zen.xpi`

> `<manifest.version>` 来自 `.output/firefox-mv3/manifest.json` 的 `version` 字段。

## 关键约束（Zen 安装相关）

### 1) 必须有 `browser_specific_settings.gecko.id`

Zen/Firefox 系生态对扩展 id 的要求更严格；缺少 `browser_specific_settings.gecko.id` 时，可能会触发 “appears to be corrupt” 一类错误。

`npm run build:zen` 会在打包阶段把下面字段注入到 `manifest.json`：

```json
{
  "browser_specific_settings": {
    "gecko": {
      "id": "syncnos-webclipper@syncnos.app"
    }
  }
}
```

如需自定义 id，可设置环境变量：

- `FIREFOX_EXTENSION_ID=your-id@example.com`

### 2) XPI 必须是 zip 容器（Deflate 压缩）

`.xpi` 本质是 zip；本仓库打包会强制使用 Deflate，并确保 zip 根目录直接是扩展文件（不额外包一层父文件夹）。

## 安装（unsigned 支持）

Zen 支持安装 unsigned 扩展，但需要关闭签名强制：

1. 打开 `about:config`
2. 设置 `xpinstall.signatures.required = false`
3. 通过 Zen 的扩展管理界面安装 `.output/*.xpi`

