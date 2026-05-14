# WebClipper UI 规范（Scope: `src/ui/**`）

本文件是 WebClipper UI 的工作约定与设计系统真源导航，用于避免“局部改样式 → 全局不一致”的回归。

> 目标：让贡献者不需要通读整个 UI，也能在新增/修改组件时保持一致的视觉语言与交互行为。

## 1. 真源与边界

| 主题 | 真源文件 | 说明 |
| --- | --- | --- |
| 设计 tokens | `src/ui/styles/tokens.css` | 颜色、圆角、字体等 token 的单一事实源 |
| 组件层 | `src/ui/**` | 只放组件/样式/DOM 面板；不直接访问 `src/platform/**` |
| 依赖方向 | `ui → viewmodels → services → platform` | `src/ui/**` 禁止 import `@platform/*` |

## 2. 圆角规范（B2.2 · 同心圆角分级）

### 2.1 Token 列表

圆角 token 位于 `src/ui/styles/tokens.css`：

- `--radius-outer`
- `--radius-card`
- `--radius-control`
- `--radius-chip`
- `--radius-inline`
- `--radius-pill`

### 2.2 使用规则（同心层级）

| 场景 | 建议 token | 说明 |
| --- | --- | --- |
| 页面/大容器外框 | `--radius-outer` | 外层包裹或大面积容器 |
| Card/Panel | `--radius-card` | 设置卡片、notice 面板等 |
| 控件（Button/Input/Select） | `--radius-control` | 主交互控件统一圆角 |
| 小标签/Badge | `--radius-chip` | 小面积强调信息 |
| Inline 小块（code tag 等） | `--radius-inline` | 文本行内元素 |
| 非按钮的 pill 外观 | `--radius-pill` | 只用于 pill 语义的非按钮元素 |

### 2.3 禁止项

- 新增样式不要写裸 `border-radius: <px>`（允许 `border-radius: 0` 作为 reset）。
- 不要用 `999px` 给按钮做圆角（按钮应使用 `--radius-control`）。

## 3. CSS / Tailwind 风格约定

- 优先复用现有 class 组合与 shared style（例如 `src/ui/shared/button-styles.ts`）。
- 新增 UI 状态尽量用 token 或现有 utility，不要引入新的一套“局部常量”。
- 在可交互元素上保留可见的 `focus-visible` 样式（避免键盘可访问性回退）。

## 4. 自检命令（手动）

```bash
rtk rg -n "src/platform|/platform/" src/ui
rtk rg -n "border-radius:\\s*[0-9]|tw-rounded-\\[" src/ui src/entrypoints
rtk rg -n -- "--radius-" src/ui/styles/tokens.css
```
