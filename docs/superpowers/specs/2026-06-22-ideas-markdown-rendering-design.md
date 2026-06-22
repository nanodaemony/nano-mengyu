# Markdown 渲染功能 — 设计文档

## 概述

为灵感卡片功能增加 Markdown 渲染支持。用户在 IdeaForm 的文本框中直接输入 Markdown 语法，创建后在 IdeaCard 中渲染为格式化内容。

## 改动范围

### 新增文件

- `components/ui/MarkdownRenderer.tsx` — 通用 Markdown 渲染组件，封装 `react-markdown` + `remark-gfm` + `rehype-raw`，统一管理 Markdown 内容的视觉样式。

### 修改文件

- `components/ideas/IdeaCard.tsx`
  - 用 `MarkdownRenderer` 替换当前纯文本展示（`<p className="whitespace-pre-wrap">`）
  - 增加展开/收起交互：默认最多显示约 10 行高度，超出时显示「展开全文」按钮

### 无需改动

| 文件 | 原因 |
|------|------|
| `components/ideas/IdeaForm.tsx` | 输入框保持原样，不增加实时预览 |
| `components/ideas/IdeaGrid.tsx` | 卡片列表逻辑不变 |
| `app/api/ideas/route.ts` | 数据存储格式不变 |
| `lib/ideas/types.ts` | 数据模型不变 |
| `app/ideas/page.tsx` | 页面结构不变 |

## 新增依赖

| 包名 | 用途 |
|------|------|
| `react-markdown` | 核心：Markdown → React 组件 |
| `remark-gfm` | GitHub Flavored Markdown 扩展（表格、任务列表、删除线、自动链接） |
| `rehype-raw` | 支持内嵌 HTML |

## 架构设计

### MarkdownRenderer 组件

```tsx
// components/ui/MarkdownRenderer.tsx
interface MarkdownRendererProps {
  content: string;
}
```

功能：
- 接收纯文本 Markdown 字符串
- 使用 `react-markdown` 渲染为 React 元素
- 通过 `components` prop 自定义各元素的 Tailwind 样式

### 自定义样式

| 元素 | 样式规则 |
|------|----------|
| h1–h4 | 随层级缩小字号，与门户排版系统一致；h1 用 `text-xl font-bold` |
| h2 / h3 / h4 | 逐级缩小：`text-lg` / `text-base` / `text-sm` |
| 段落 `p` | 保持 `text-base`，段落间距 `mb-3` |
| 代码块 `pre > code` | 深色背景 (`bg-gray-900`)、`text-sm` 等宽字体、圆角、水平滚动 |
| 行内代码 `` `code` `` | 浅色背景 (`bg-gray-100`)、等宽字体、圆角 |
| 表格 | 全宽边框、`thead` 加粗背景、斑马纹行交替 |
| 引用块 `blockquote` | 左侧 `border-l-4` + `border-primary-500`，灰色斜体文字 |
| 链接 `a` | `text-primary-500 hover:underline` |
| 图片 `img` | 最大宽度 100%、圆角 `rounded-lg` |
| 列表 `ul/ol` | 标准列表缩进，任务列表用 checkbox 样式 |
| 删除线 | 使用 GFM 默认渲染 |

### IdeaCard 展开/收起交互

- 使用 `useState<boolean>` 控制展开状态
- 收起状态：内容容器设 `max-height`（约 10 行 ≈ 300px）+ `overflow: hidden`
- 当内容超出最大高度时，底部显示「展开全文」按钮
- 点击按钮切换到展开状态，移除高度限制
- 展开后可点击「收起」恢复

## 数据流

```
用户输入 Markdown 文本 → POST /api/ideas → JSON 文件存储（原始 Markdown）
                                                 ↓
IdeaCard 读取 content → MarkdownRenderer → 渲染为格式化内容
```

内容始终以原始 Markdown 字符串存储，不做预处理或转换。

## 样式一致性

所有 Markdown 渲染样式继承门户现有的设计 Token（`--color-primary-500` 等），暗色模式通过 Tailwind 的 `dark:` 前缀适配。

## 未来可扩展

- 代码语法高亮（引入 `react-syntax-highlighter`）
- 编辑时实时预览（在 IdeaForm 增加 Preview 切换）
- 图片粘贴/拖拽上传
