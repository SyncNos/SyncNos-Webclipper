# 调试：评论内容定位（app.html）

## 1) 开启调试开关

在 `app.html` 的 DevTools Console 执行：

```js
localStorage.setItem('__SYNCNOS_DEBUG_COMMENTS_SELECTION__', '1');
// 或者一次性（当前页面有效）
globalThis.__SYNCNOS_DEBUG_COMMENTS_SELECTION__ = true;
```

刷新 `app.html` 后复现问题（创建根评论后点击评论/引用触发定位）。

## 2) 采集 Console 日志

请复制 Console 中以下前缀的日志（从复现开始到出现“无法定位”为止）：

- `[CommentsSelection][app]`
- `[CommentsLocate]`

## 3) 导出对应评论记录（含 locator）

在同一个 Console 执行下方脚本，它会列出最近 20 条根评论（`parentId == null`）及其 `locator` 摘要。
请把输出复制给我，并说明你点击定位的是哪条 `id`。

```js
(async () => {
  const openDb = () =>
    new Promise((resolve, reject) => {
      const req = indexedDB.open('webclipper');
      req.onerror = () => reject(req.error || new Error('indexedDB.open failed'));
      req.onsuccess = () => resolve(req.result);
    });

  const db = await openDb();
  const tx = db.transaction(['article_comments'], 'readonly');
  const store = tx.objectStore('article_comments');
  const rows = await new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onerror = () => reject(req.error || new Error('getAll failed'));
    req.onsuccess = () => resolve(req.result || []);
  });
  db.close();

  const list = (Array.isArray(rows) ? rows : [])
    .filter((r) => !r?.parentId)
    .sort((a, b) => (Number(b?.createdAt) || 0) - (Number(a?.createdAt) || 0))
    .slice(0, 20)
    .map((r) => ({
      id: Number(r?.id),
      createdAt: Number(r?.createdAt) || 0,
      canonicalUrl: String(r?.canonicalUrl || ''),
      quoteTextPreview: String(r?.quoteText || '').slice(0, 80),
      locator: r?.locator
        ? {
            v: Number(r?.locator?.v),
            env: String(r?.locator?.env || ''),
            exactPreview: String(r?.locator?.quote?.exact || '').slice(0, 80),
            position: r?.locator?.position || null,
          }
        : null,
    }));

  console.table(list);
  return list;
})().catch((e) => console.error(e));
```

## 4)（可选）确认 locatorRoot 是否为空

定位失败时，如果你愿意，也可以在 Console 里执行：

```js
(() => {
  const root = document.querySelector('.route-scroll');
  return {
    hasRouteScroll: Boolean(root),
    routeScrollTextLen: root ? String(root.textContent || '').length : 0,
  };
})()
```

