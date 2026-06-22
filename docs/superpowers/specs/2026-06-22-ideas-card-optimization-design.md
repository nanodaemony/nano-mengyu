# 灵感卡片优化设计

## 概述

对灵感卡片（Ideas）模块进行 UI/UX 优化，改进布局、交互和数据模型。

---

## 数据模型

```typescript
export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  pinned: boolean;    // 新增：是否置顶
  archived: boolean;  // 新增：是否归档
}
```

## API 变更

- `GET /api/ideas` — 保持不变，返回全部 ideas
- `POST /api/ideas` — 新增字段 `pinned: false, archived: false` 默认值
- `DELETE /api/ideas` — 保持不变（保留但 UI 不再暴露删除按钮）
- `PATCH /api/ideas` — **新增**，接收 `{ id, action: "archive" | "unarchive" | "pin" | "unpin" }`

## 页面布局

两列布局，左侧 : 右侧 = 1:2。

- **左侧列**：灵感创建表单 + 底部【归档】按钮
- **右侧列**：顶部标签筛选行 + 卡片列表（一行一张卡片）

### 左侧列

1. **IdeaForm** — 标题输入、内容输入、标签输入、保存按钮
   - 去掉"记录一闪而过的想法"副标题文案
   - 卡片不使用黄色顶部条（accent），背景为普通 surface
2. **【归档】按钮** — 点击后右侧切换显示已归档的卡片；再次点击切回活跃卡片

### 右侧列

1. **标签筛选行** — 从所有活跃卡片中提取去重标签，水平排列展示。点击标签筛选，再次点击取消筛选
   - 仅展示未归档卡片的标签
2. **卡片列表** — 一行一张卡片，按以下规则排序：
   - 置顶卡片优先展示（`pinned: true`）
   - 同优先级按 `createdAt` 降序

## 卡片组件 (IdeaCard)

- **去掉**右上角删除按钮
- **去掉**黄色顶部边框（不再使用 Card `accent`）
- **背景色**：
  - 普通卡片：`bg-[var(--color-surface-alt)]`（淡灰色）
  - 置顶卡片：`bg-amber-50` / `dark:bg-amber-900/20`（淡黄色）
- **右上角 ⋮ 按钮** → 点击弹出下拉菜单，包含：
  - 📌 置顶 / 取消置顶（toggle）
  - 📦 归档

## 交互逻辑

- 创建新卡片 → 自动出现在右侧列表顶部（非置顶区底部）
- 置顶 → 卡片移到列表顶部，背景变淡黄
- 取消置顶 → 回到正常排序位置，背景变淡灰
- 归档 → 卡片从当前视图消失；点击左侧【归档】按钮可在右侧查看归档内容
- 在归档视图中，卡片同样展示 ⋮ 菜单，包含「取消归档」选项

## 文件变更清单

| 文件 | 变更 |
|------|------|
| `lib/ideas/types.ts` | 添加 `pinned`、`archived` 字段 |
| `app/api/ideas/route.ts` | 新增 PATCH 方法，POST 新增默认字段 |
| `components/ideas/IdeaCard.tsx` | 重构：去掉删除按钮、⋮ 菜单、背景色逻辑 |
| `components/ideas/IdeaForm.tsx` | 去掉 accent，简化样式 |
| `components/ideas/IdeaGrid.tsx` | 重构：两列布局、标签筛选、归档切换 |
| `app/ideas/page.tsx` | 去掉副标题文案 |
