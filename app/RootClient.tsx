"use client";

import { ReactNode, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileTabBar from "@/components/layout/MobileTabBar";
import SideDrawer from "@/components/layout/SideDrawer";

export default function RootClient({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setDrawerOpen(true)} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6">{children}</main>
      </div>
      <MobileTabBar />
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
