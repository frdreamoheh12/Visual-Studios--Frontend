"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Box, ChevronsLeft, ChevronsRight, X, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import { DASHBOARD_NAV, ADMIN_NAV_ITEM } from "@/lib/dashboard-nav";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  isAdmin: boolean;
  pathname: string;
}

function NavLink({
  href,
  label,
  icon: Icon,
  collapsed,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "vs-focus group/link relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200",
        active ? "bg-white/[0.06] text-white" : "text-white/50 hover:bg-white/[0.04] hover:text-white",
        collapsed && "justify-center px-0"
      )}
    >
      {active && (
        <motion.span
          layoutId="vs-sidebar-active-indicator"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-vs-gradient"
        />
      )}
      <Icon
        size={18}
        className={clsx(
          "shrink-0 transition-transform duration-200 group-hover/link:scale-110",
          active && "text-accent-violet"
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg border border-white/10 bg-base-850 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-card transition-opacity duration-150 group-hover/link:opacity-100">
          {label}
        </span>
      )}
    </Link>
  );
}

function SidebarNav({
  collapsed,
  isAdmin,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  isAdmin: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="no-scrollbar mt-8 flex flex-1 flex-col gap-6 overflow-y-auto px-2 pb-4">
      {DASHBOARD_NAV.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-white/25">
              {section.label}
            </p>
          )}
          <div className="flex flex-col gap-1">
            {section.items.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                collapsed={collapsed}
                active={pathname === item.href}
                onClick={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}

      {isAdmin && (
        <div>
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-white/25">Admin</p>
          )}
          <div className="flex flex-col gap-1">
            <NavLink
              href={ADMIN_NAV_ITEM.href}
              label={ADMIN_NAV_ITEM.label}
              icon={ADMIN_NAV_ITEM.icon}
              collapsed={collapsed}
              active={pathname === ADMIN_NAV_ITEM.href}
              onClick={onNavigate}
            />
          </div>
        </div>
      )}
    </nav>
  );
}

function BrandMark({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={clsx("flex items-center gap-2 px-3", collapsed && "justify-center")}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-vs-gradient">
        <Box size={16} className="text-white" />
      </div>
      {!collapsed && <span className="font-display text-base font-semibold text-white">Visual Studio</span>}
    </div>
  );
}

export function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  isAdmin,
  pathname,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 260 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-white/5 bg-base-950/60 py-5 backdrop-blur-xl lg:flex"
      >
        <BrandMark collapsed={collapsed} />
        <SidebarNav collapsed={collapsed} isAdmin={isAdmin} pathname={pathname} />
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="vs-focus mx-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-white/40 transition-colors hover:border-white/20 hover:text-white"
        >
          {collapsed ? (
            <ChevronsRight size={16} />
          ) : (
            <>
              <ChevronsLeft size={16} />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-base-950 py-5 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between px-3">
                <BrandMark collapsed={false} />
                <button
                  onClick={onCloseMobile}
                  aria-label="Close menu"
                  className="vs-focus rounded-lg p-1 text-white/50 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarNav collapsed={false} isAdmin={isAdmin} pathname={pathname} onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
