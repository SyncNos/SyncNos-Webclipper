function joinParagraphs(lines: string[]) {
  return lines.map((line) => `<p>${line}</p>`).join('');
}

export function buildDedaoNoteInnerHtml() {
  const articleBody = joinParagraphs([
    '正文段落一：这是用于抽取回归测试的示例内容。',
    '正文段落二：抽取器应该保留这段核心文本。',
    '正文段落三：这里模拟长文页面中的后续正文。',
  ]);

  const sourceCard = `
    <section class="source-card">
      <h3>来源卡片</h3>
      <p>得到每天听本书</p>
      <hr />
      <p>这是一段需要保留的来源摘要。</p>
    </section>
  `;

  const commentDiscussion = `
    <section class="comment-discussion">
      <h3>精选留言</h3>
      <p>评论区示例：这条讨论内容应该被保留下来。</p>
      <p>评论区示例：第二条讨论用于覆盖评论正文保留逻辑。</p>
    </section>
  `;

  const removableNoise = `
    <div class="attention">关注他们，获取更多优质内容</div>
    <div class="write-comment">添加评论</div>
    <div class="forward-list">转发 3</div>
    <div class="like-list">赞 12</div>
    <div class="operation-area">操作栏</div>
    <div class="list-header">
      <button class="tab active-tab">最热</button>
      <button class="tab">最新</button>
    </div>
    <div class="active-tab-pointer"></div>
  `;

  return `
    <div id="leftContent">
      <div class="left-content">
        <header class="audio-info">
          <div class="cover">
            <img src="https://static.example.com/uploader/image/avatar/cover.png" alt="" />
          </div>
          <div class="img-v">
            <img src="https://static.example.com/uploader/image/avatar/author.png" alt="" />
          </div>
          <div class="meta">
            <span class="name">作者示例</span>
            <span class="date">03-23</span>
          </div>
          <div class="autor-right">作者右侧操作</div>
        </header>
        <article class="note-body">
          ${articleBody}
        </article>
        ${sourceCard}
        ${commentDiscussion}
        ${removableNoise}
      </div>
    </div>
  `;
}

export function buildDedaoNoteDocument(options?: { includeRightRail?: boolean }) {
  const rightRail = options?.includeRightRail
    ? `
      <aside id="rightContent">
        <div class="right-content">
          <p>联系我们：</p>
          <p>客服电话：400-0526-000</p>
          <p>相关链接：</p>
          <p>得到官网</p>
          <p>下载「得到App」</p>
        </div>
      </aside>
    `
    : '';

  return `
    <!doctype html>
    <html>
      <head>
        <title>得到APP - 知识就是力量，知识就在得到</title>
      </head>
      <body>
        <div id="app">
          <div class="iget-ui-row" id="mainWrap">
            ${buildDedaoNoteInnerHtml()}
            ${rightRail}
          </div>
        </div>
      </body>
    </html>
  `;
}
