"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getPageTitle } from "@/lib/dashboard-nav";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { CommandPalette } from "./CommandPalette";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useLocalStorage("vs:sidebar-collapsed", false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-base-950">
      <DashboardSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        isAdmin={isAdmin}
        pathname={pathname}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar title={getPageTitle(pathname)} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      <CommandPalette isAdmin={isAdmin} />
    </div>
  );
}
