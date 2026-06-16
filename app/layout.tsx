import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import RootClient from "./RootClient";

export const metadata: Metadata = {
  title: "个人门户",
  description: "股票分析 · 待办事项 · 灵感卡片",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootClient>{children}</RootClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
