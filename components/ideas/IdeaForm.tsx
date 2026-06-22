"use client";

import { useState, FormEvent, useRef } from "react";
import { Button, Input } from "@/components/ui";
import Card from "@/components/ui/Card";

interface IdeaFormProps {
  onCreated: () => void;
}

export default function IdeaForm({ onCreated }: IdeaFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        }),
      });
      if (!res.ok) {
        console.error("Failed to create idea:", res.status, res.statusText);
        return;
      }
    } catch (err) {
      console.error("Failed to create idea:", err);
      return;
    }
    setTitle("");
    setContent("");
    setTags("");
    onCreated();
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        setUploading(true);
        try {
          const formData = new FormData();
          formData.append("image", file);

          const res = await fetch("/api/ideas/images", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error("Image upload failed:", err.error || res.statusText);
            return;
          }

          const { url } = await res.json();
          const imageMarkdown = `\n![image](${url})\n`;

          // Insert at cursor position or at end
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent =
              content.slice(0, start) + imageMarkdown + content.slice(end);
            setContent(newContent);

            // Restore cursor position after the inserted markdown
            requestAnimationFrame(() => {
              const pos = start + imageMarkdown.length;
              textarea.setSelectionRange(pos, pos);
              textarea.focus();
            });
          } else {
            setContent((prev) => prev + imageMarkdown);
          }
        } catch (err) {
          console.error("Image upload failed:", err);
        } finally {
          setUploading(false);
        }
        return; // Handle only the first image
      }
    }
  }

  return (
    <Card elevation="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="灵感标题"
          label="标题"
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] tracking-wide uppercase">
            内容
          </label>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={handlePaste}
            placeholder="写下你的灵感...（支持粘贴图片）"
            rows={10}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-base text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-150 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 resize-y min-h-[120px]"
          />
          {uploading && (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              正在上传图片...
            </p>
          )}
        </div>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="标签1, 标签2, 标签3"
          label="标签（英文逗号分隔）"
        />
        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            保存
          </Button>
        </div>
      </form>
    </Card>
  );
}
