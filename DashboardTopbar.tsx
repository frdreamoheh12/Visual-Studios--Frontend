"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Coins,
  User as UserIcon,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { useDashboardData } from "@/lib/dashboard-context";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Avatar } from "@/components/ui/Avatar";

const PROFILE_MENU_ITEMS = [
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("vs:open-command-palette"));
}

export function DashboardTopbar({ title, onOpenMobileMenu }: { title: string; onOpenMobileMenu: () => void }) {
  const { user, logout } = useAuth();
  const { push } = useToast();
  const { data } = useDashboardData();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setProfileOpen(false));

  const unreadNotifications = data?.unreadNotifications ?? 0;

  async function handleLogout() {
    setProfileOpen(false);
    try {
      await logout();
      push({ title: "Signed out", description: "Come back soon.", variant: "info" });
    } finally {
      router.push("/login");
    }
  }

  if (!user) return null;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/5 bg-base-950/70 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
        className="vs-focus rounded-lg p-1 text-white/60 hover:text-white lg:hidden"
      >
        <Menu size={20} />
      </button>

      <h1 className="truncate font-display text-sm font-semibold text-white sm:text-base">{title}</h1>

      <button
        onClick={openCommandPalette}
        className="vs-focus ml-2 hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs text-white/35 transition-colors hover:border-white/20 hover:text-white/60 md:flex"
      >
        <Search size={14} />
        <span>Search Visual Studio...</span>
        <kbd className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          onClick={openCommandPalette}
          aria-label="Search"
          className="vs-focus flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white md:hidden"
        >
          <Search size={16} />
        </button>

        <button
          aria-label={unreadNotifications > 0 ? `${unreadNotifications} unread notifications` : "Notifications"}
          className="vs-focus relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/20 hover:text-white"
        >
          <Bell size={16} />
          {unreadNotifications > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-violet"
            />
          )}
        </button>

        <div className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-amber-300 sm:flex">
          <Coins size={13} />
          {user.credits.toLocaleString()} Credits
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="vs-focus flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-2 transition-colors hover:border-white/20"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            <Avatar username={user.username} src={user.avatarUrl} size={28} />
            <span className="hidden max-w-[100px] truncate text-sm text-white/80 sm:block">{user.username}</span>
            <ChevronDown
              size={14}
              className={`text-white/40 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                role="menu"
                className="vs-panel absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl2 p-1.5 shadow-card"
              >
                {PROFILE_MENU_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="vs-focus flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <item.icon size={15} />
                    {item.label}
                  </Link>
                ))}
                <div className="my-1.5 h-px bg-white/10" />
                <button
                  onClick={handleLogout}
                  role="menuitem"
                  className="vs-focus flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-rose-400 transition-colors hover:bg-rose-500/10"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
