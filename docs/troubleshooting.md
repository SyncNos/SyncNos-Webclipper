# 排障

先运行：

```bash
npm ci
npm run gate:ci
```

构建产物或 manifest 相关问题再运行：

```bash
npm run gate
npm run check
```

## Zen unsigned XPI

构建：

```bash
npm run build:zen
```

产物位于 `.output/webclipper-<manifest.version>-zen.xpi`。打包脚本会：

- 在 manifest 注入 `browser_specific_settings.gecko.id`；
- 使用 Deflate zip；
- 保证扩展文件位于 XPI 根目录。

可用 `FIREFOX_EXTENSION_ID` 覆盖 gecko id，用 `WXT_ZEN_BINARY` 指定 Zen 可执行文件。安装 unsigned XPI 前，需要在本地测试 profile 中设置 `xpinstall.signatures.required = false`；不要把该设置当作发行方案。

## 评论精确定位

在 app DevTools Console 开启调试：

```js
localStorage.setItem('__SYNCNOS_DEBUG_COMMENTS_SELECTION__', '1');
location.reload();
```

复现后收集：

- `[CommentsSelection][app]`
- `[CommentsLocate]`

按 `createdAt` 倒序检查 20 条根评论 locator：

```js
(async () => {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('webclipper');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
  const request = db.transaction('article_comments', 'readonly').objectStore('article_comments').getAll();
  const rows = await new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
  db.close();
  return rows
    .filter((row) => row.parentId == null)
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    .slice(0, 20)
    .map(({ id, canonicalUrl, quoteText, locator }) => ({
      id,
      canonicalUrl,
      quote: String(quoteText || '').slice(0, 80),
      version: locator?.v || null,
      exact: String(locator?.quote?.exact || '').slice(0, 80),
      position: locator?.position || null,
    }));
})().then(console.table, console.error);
```

判断顺序：

1. surface root 是否仍是当前 detail/article root；
2. locator exact/context 是否被展示层截断；
3. context 或 root generation 是否在解析期间变化；
4. 是否属于 iframe、closed shadow root 或跨 root 歧义；
5. resolver reason 是 missing、ambiguous、budget 还是 aborted。

不要用模糊匹配或父元素滚动掩盖 exact resolver 的失败。

## 常见环境问题

| 现象 | 检查 |
| --- | --- |
| `npm ci` 失败 | Node/npm 版本、`package.json` 与 `package-lock.json` 是否一致 |
| 全量 Vitest 长时间不退出 | 先确认是否存在未释放 timer/listener/root；不要把工具超时记成 PASS |
| manifest/version 发布失败 | `wxt.config.ts` 的 version、tag 和 workflow 校验 |
| OAuth Connect 无响应 | client id、redirect URI、pending state、Worker endpoint 和浏览器日志 |
| article 只有文本没有图片 | 图片缓存开关、anti-hotlink rule、referer、下载 warning；文本成功仍应保留 |
| 视频提示没有字幕 | 先在页面打开字幕并等待字幕请求加载，再触发 capture |
