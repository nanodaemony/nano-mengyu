"use client";

import { useEffect, useRef } from "react";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    icon: "📝",
    title: "创建灵感卡片",
    items: [
      "输入标题和内容（支持 Markdown 语法）",
      "点击标签可选中，选中后高亮为蓝色",
      "支持直接粘贴图片到内容输入框",
      "点击「保存」创建新卡片",
    ],
  },
  {
    icon: "✏️",
    title: "编辑卡片内容",
    items: [
      "三击卡片任意位置 → 内容回填到左侧表单",
      "表单已有内容时会弹出确认覆盖提示",
      "修改后点击「更新」保存更改",
    ],
  },
  {
    icon: "🎯",
    title: "卡片快捷操作",
    items: [
      "右键卡片 → 弹出操作菜单（置顶 / 归档 / 展开全文）",
      "点击卡片右上角复制图标 → 复制 Markdown 原文",
      "三击内容区域 → 光标定位到点击位置",
    ],
  },
  {
    icon: "🏷️",
    title: "标签筛选",
    items: [
      "卡片顶部标签栏点击筛选对应标签的卡片",
      "点击「全部」重置筛选，查看所有卡片",
      "创建卡片时选中的标签会高亮显示",
    ],
  },
  {
    icon: "📦",
    title: "归档管理",
    items: [
      "左侧「查看已归档」进入归档视图",
      "在归档视图中右键卡片可选择「取消归档」",
      "归档的卡片不显示在正常列表中",
    ],
  },
  {
    icon: "🔍",
    title: "其他提示",
    items: [
      "双击模块名称（如「💡 灵感卡片」）返回主页",
      "置顶卡片显示为琥珀色背景，优先排序",
      "数据存储于本地浏览器，仅你可见",
    ],
  },
];

export default function HelpModal({ open, onClose }: HelpModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Trap focus inside modal
  useEffect(() => {
    if (!open || !panelRef.current) return;
    panelRef.current.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] pb-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative max-h-[78vh] w-[90vw] max-w-[520px] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-lg px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm dark:bg-blue-900/40">
              💡
            </span>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              使用说明
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors"
            aria-label="关闭"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sections */}
        <div className="px-6 py-5 space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mb-2.5">
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </h3>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)] leading-relaxed"
                  >
                    <span className="mt-[5px] block h-1 w-1 shrink-0 rounded-full bg-[var(--color-text-tertiary)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-border)] px-6 py-3">
          <p className="text-xs text-[var(--color-text-tertiary)] text-center">
            按 <kbd className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-1.5 py-0.5 font-mono text-xs">Esc</kbd> 关闭
          </p>
        </div>
      </div>
    </div>
  );
}
