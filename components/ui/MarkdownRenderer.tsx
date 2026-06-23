"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";
import type { Components } from "react-markdown";

// Rehype plugin: inject data-offset attribute on block elements
function rehypeAddPositions() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type === "element" &&
        ["h1","h2","h3","h4","h5","h6","p","li","pre","blockquote","hr","td","th"].includes(node.tagName) &&
        node.position?.start?.offset != null
      ) {
        node.properties = node.properties || {};
        node.properties.dataOffset = String(node.position.start.offset);
      }
    });
  };
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const components: Components = {
  // ── Headings ──
  h1: ({ children, ...props }) => (
    <h1 className="mb-3 mt-5 text-xl font-bold text-[var(--color-text)] opacity-80 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-2 mt-4 text-lg font-semibold text-[var(--color-text)] opacity-80" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-2 mt-3 text-base font-bold text-[var(--color-text)] opacity-80" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mb-1 mt-2 text-base font-bold text-[var(--color-text)] opacity-80" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="mb-1 mt-2 text-base font-bold text-[var(--color-text)] opacity-80" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="mb-1 mt-2 text-base font-bold text-[var(--color-text)] opacity-80" {...props}>
      {children}
    </h6>
  ),

  // ── Paragraph ──
  p: ({ children, ...props }) => (
    <p className="mb-3 text-base text-[var(--color-text-secondary)] leading-relaxed last:mb-0" {...props}>
      {children}
    </p>
  ),

  // ── Code blocks ──
  pre: ({ children, ...props }) => (
    <pre className="mb-4 overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100 last:mb-0" {...props}>
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    // If className starts with "language-", it's inside a <pre> (code block)
    const isInline = !className?.startsWith("language-");
    if (isInline) {
      return (
        <code
          className="rounded-md bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-[var(--color-text)] dark:bg-gray-800"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // ── Blockquote ──
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mb-4 border-l-4 border-primary-500 pl-4 italic text-[var(--color-text-tertiary)] last:mb-0"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // ── Links ──
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-500 underline decoration-primary-500/30 hover:decoration-primary-500 transition-colors"
      {...props}
    >
      {children}
    </a>
  ),

  // ── Images ──
  img: ({ alt, src, ...props }) => (
    <img
      alt={alt ?? ""}
      src={src}
      className="my-4 max-w-full rounded-lg last:mb-0"
      {...props}
    />
  ),

  // ── Lists ──
  ul: ({ children, ...props }) => (
    <ul className="mb-4 list-disc pl-6 text-base text-[var(--color-text-secondary)] last:mb-0 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 list-decimal pl-6 text-base text-[var(--color-text-secondary)] last:mb-0 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-[var(--color-text-secondary)]" {...props}>
      {children}
    </li>
  ),

  // ── Tables ──
  table: ({ children, ...props }) => (
    <div className="mb-4 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse rounded-xl border border-[var(--color-border)] text-base" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-[var(--color-surface-alt)]" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-[var(--color-border)] px-3 py-2 text-left text-sm font-semibold text-[var(--color-text)]" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]" {...props}>
      {children}
    </td>
  ),
};

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeAddPositions]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
