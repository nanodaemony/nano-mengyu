"use client";

import { ReactNode, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileTabBar from "@/components/layout/MobileTabBar";
import SideDrawer from "@/components/layout/SideDrawer";

const SIDEBAR_DEFAULT_WIDTH = 224;
const SIDEBAR_MIN_WIDTH = 64;
const SIDEBAR_MAX_WIDTH = 480;
const SIDEBAR_STORAGE_KEY = "nano-portal-sidebar-width";

function loadSidebarWidth(): number {
  if (typeof window === "undefined") return SIDEBAR_DEFAULT_WIDTH;
  const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
  return saved
    ? Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, Number(saved)))
    : SIDEBAR_DEFAULT_WIDTH;
}

export default function RootClient({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(loadSidebarWidth);

  const handleSidebarResize = (width: number) => {
    setSidebarWidth(width);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(width));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setDrawerOpen(true)} />
      <div className="flex flex-1">
        <Sidebar width={sidebarWidth} onWidthChange={handleSidebarResize} />
        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6 overflow-auto">{children}</main>
      </div>
      <MobileTabBar />
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
